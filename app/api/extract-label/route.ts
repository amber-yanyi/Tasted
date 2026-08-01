import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import {
  LABEL_EXTRACTION_PROMPT,
  LABEL_RESPONSE_SCHEMA,
  EXTRACTED_LABEL_FIELDS,
  type ExtractedLabel,
} from '@/lib/labelExtraction'

// The Gemini key lives only here, server-side. The browser posts an image and
// gets fields back; it never sees the credential.

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Next reads env at boot, so a key added while the server is running looks
    // missing until a restart — and .env.local is gitignored, so a deployment
    // needs the key set in the host's own environment. The advice differs, so
    // the message does too rather than sending a deploy to edit a local file.
    const isLocal = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: isLocal
          ? 'Label recognition is not configured. Add GEMINI_API_KEY to .env.local, then restart the dev server — env vars are read at startup.'
          : 'Label recognition is not configured on this deployment. Add GEMINI_API_KEY to the hosting environment variables and redeploy.',
      },
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

  // Inferred values are returned like read ones, unmarked. They are appellation
  // facts rather than hedges, and every field lands in an editable input, so a
  // wrong inference is corrected exactly like a misread one.
  //
  // label_text stays in the response for debugging: when a field looks wrong,
  // the transcription shows whether the model misread the label or reasoned
  // from it incorrectly.
  const labelText = typeof raw.label_text === 'string' ? raw.label_text : null

  return NextResponse.json({ fields, label_text: labelText, model, usage, searched })
}
