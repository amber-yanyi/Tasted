import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import {
  LABEL_EXTRACTION_PROMPT,
  LABEL_RESPONSE_SCHEMA,
  EXTRACTED_LABEL_FIELDS,
  type ExtractedLabel,
  type FieldSource,
} from '@/lib/labelExtraction'

// The Gemini key lives only here, server-side. The browser posts an image and
// gets fields back; it never sees the credential.

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Label recognition is not configured. Set GEMINI_API_KEY in .env.local.' },
      { status: 503 }
    )
  }

  let image: File
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image supplied.' }, { status: 400 })
    }
    image = file
  } catch {
    return NextResponse.json({ error: 'Could not read the upload.' }, { status: 400 })
  }

  if (!ACCEPTED_TYPES.includes(image.type)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${image.type || 'unknown'}.` },
      { status: 415 }
    )
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: 'Image is too large. Please compress it before uploading.' },
      { status: 413 }
    )
  }

  const base64 = Buffer.from(await image.arrayBuffer()).toString('base64')
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'

  let text: string | undefined
  let usage: unknown
  let searched = false
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model,
      // Text before the image: the recommended ordering for a single-image prompt.
      contents: [
        {
          role: 'user',
          parts: [
            { text: LABEL_EXTRACTION_PROMPT },
            { inlineData: { mimeType: image.type, data: base64 } },
          ],
        },
      ],
      config: {
        // Search lets the model look up a specific producer or cuvée it does
        // not already know. It is not used for well-known appellations — those
        // it answers from its own knowledge, at no extra latency.
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: LABEL_RESPONSE_SCHEMA as object,
      },
    })
    text = response.text
    usage = response.usageMetadata
    searched =
      (response.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length ?? 0) > 0
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Label recognition failed: ${message}` },
      { status: 502 }
    )
  }

  if (!text) {
    return NextResponse.json(
      { error: 'The model returned an empty response.' },
      { status: 502 }
    )
  }

  let raw: Record<string, unknown>
  try {
    raw = JSON.parse(text)
  } catch {
    return NextResponse.json(
      { error: 'The model returned malformed JSON.' },
      { status: 502 }
    )
  }

  // Normalize before returning: the schema constrains shape, not sanity. A
  // vintage of 20155 or an alcohol of 135 should become null here rather than
  // reaching the form as a value the user has to spot and undo.
  const fields = {} as ExtractedLabel
  for (const key of EXTRACTED_LABEL_FIELDS) {
    const value = raw[key]
    if (value === null || value === undefined || value === '') {
      fields[key] = null as never
      continue
    }

    if (key === 'vintage') {
      const year = Number(value)
      fields.vintage = Number.isInteger(year) && year >= 1900 && year <= 2099 ? year : null
    } else if (key === 'alcohol') {
      const abv = Number(value)
      fields.alcohol = Number.isFinite(abv) && abv > 0 && abv <= 25 ? abv : null
    } else if (key === 'wine_type') {
      const allowed = ['Red', 'White', 'Rosé', 'Sparkling', 'Fortified']
      fields.wine_type = allowed.includes(String(value))
        ? (String(value) as ExtractedLabel['wine_type'])
        : null
    } else {
      const trimmed = String(value).trim()
      fields[key] = (trimmed === '' ? null : trimmed) as never
    }
  }

  // Provenance, so the UI can distinguish "read off the glass" from "we filled
  // this in for you". Derived in code by matching each value against the
  // model's verbatim transcription rather than asking the model to classify its
  // own fields — Flash-Lite is reliable at transcribing and at inferring, but
  // not at that kind of self-attribution, and it tended to mark plainly
  // printed values as inferred.
  const labelText = typeof raw.label_text === 'string' ? raw.label_text : ''
  const sources: Partial<Record<keyof ExtractedLabel, FieldSource>> = {}
  for (const key of EXTRACTED_LABEL_FIELDS) {
    const value = fields[key]
    if (value === null) continue
    // vintage and alcohol are never inferred (see the prompt), so whatever
    // survived validation came off the label.
    sources[key] =
      key === 'vintage' || key === 'alcohol'
        ? 'label'
        : appearsOnLabel(String(value), labelText)
          ? 'label'
          : 'inferred'
  }

  return NextResponse.json({
    fields,
    field_sources: sources,
    label_text: labelText || null,
    model,
    usage,
    searched,
  })
}

/** Strip accents, punctuation, and case so "Château" matches "CHATEAU". */
function normalizeForMatch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Whether a field value is visible on the label.
 *
 * A comma-separated value counts as printed only if every part is — a blend
 * where the label named one grape and the model added the rest is inferred, and
 * flagging it for review is the useful answer.
 */
function appearsOnLabel(value: string, labelText: string): boolean {
  if (!labelText) return false
  const haystack = normalizeForMatch(labelText)
  const parts = value
    .split(',')
    .map((p) => normalizeForMatch(p))
    .filter(Boolean)
  if (parts.length === 0) return false
  return parts.every((part) => haystack.includes(part))
}
