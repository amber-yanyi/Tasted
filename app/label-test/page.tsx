'use client'

import { useState } from 'react'
import type { ExtractedLabel, FieldSource } from '@/lib/labelExtraction'

// Throwaway harness for checking recognition accuracy against real bottles.
// Not linked from anywhere in the app; delete it once the flow moves into
// TastingForm.

type Usage = {
  promptTokenCount?: number
  candidatesTokenCount?: number
  totalTokenCount?: number
}

const FIELD_LABELS: Record<keyof ExtractedLabel, string> = {
  wine_name: 'Wine Name',
  producer: 'Producer',
  vintage: 'Vintage',
  country: 'Country',
  region: 'Region',
  grape_variety: 'Grape Variety',
  wine_type: 'Wine Type',
  alcohol: 'Alcohol',
}

// Gemini 3.1 Flash-Lite: $0.25 per 1M input tokens, $1.50 per 1M output.
// Update these if GEMINI_MODEL changes tier, or the displayed cost will lie.
const INPUT_COST_PER_TOKEN = 0.25 / 1_000_000
const OUTPUT_COST_PER_TOKEN = 1.5 / 1_000_000

export default function LabelTest() {
  const [preview, setPreview] = useState<string | null>(null)
  const [fields, setFields] = useState<ExtractedLabel | null>(null)
  const [sources, setSources] = useState<Partial<
    Record<keyof ExtractedLabel, FieldSource>
  > | null>(null)
  const [searched, setSearched] = useState(false)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setLoading(true)
    setError(null)
    setFields(null)
    setSources(null)
    setSearched(false)
    setUsage(null)
    setElapsed(null)
    setPreview(URL.createObjectURL(file))

    const started = performance.now()
    try {
      const body = new FormData()
      body.append('image', file)
      const res = await fetch('/api/extract-label', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`)
        return
      }

      setFields(data.fields)
      setSources(data.field_sources ?? null)
      setSearched(Boolean(data.searched))
      setUsage(data.usage ?? null)
      setModel(data.model ?? null)
      setElapsed(Math.round(performance.now() - started))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const cost =
    usage?.promptTokenCount != null && usage?.candidatesTokenCount != null
      ? usage.promptTokenCount * INPUT_COST_PER_TOKEN +
        usage.candidatesTokenCount * OUTPUT_COST_PER_TOKEN
      : null

  const filledCount = fields
    ? Object.values(fields).filter((v) => v !== null).length
    : 0

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Label Recognition Test
      </h1>
      <p className="text-sm text-stone-600 dark:text-stone-400 mb-8">
        Photograph a bottle to check what the model reads off the label. Nothing
        is saved.
      </p>

      <label className="block mb-8">
        <span className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Wine label photo
        </span>
        <input
          type="file"
          accept="image/*"
          // `capture` opens the rear camera directly on a phone.
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
          disabled={loading}
          className="block w-full text-sm text-stone-600 dark:text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-stone-900 dark:file:bg-stone-100 file:text-stone-50 dark:file:text-stone-900 hover:file:bg-stone-800 dark:hover:file:bg-stone-200 file:cursor-pointer disabled:opacity-50"
        />
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Label preview"
          className="w-full max-h-80 object-contain rounded-lg border border-stone-200 dark:border-stone-800 mb-8 bg-stone-50 dark:bg-stone-900"
        />
      )}

      {loading && (
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-8">
          Reading the label&hellip;
        </p>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {fields && (
        <>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Extracted
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-500">
              {filledCount} of {Object.keys(FIELD_LABELS).length} fields read
            </span>
          </div>

          <dl className="mb-8">
            {(Object.keys(FIELD_LABELS) as (keyof ExtractedLabel)[]).map((key) => (
              <div
                key={key}
                className="flex items-start py-3 border-b border-stone-200 dark:border-stone-800 last:border-0"
              >
                <dt className="w-36 shrink-0 text-sm font-medium text-stone-500 dark:text-stone-400">
                  {FIELD_LABELS[key]}
                </dt>
                <dd
                  className={`flex-1 text-sm ${
                    fields[key] === null
                      ? 'text-stone-400 dark:text-stone-600 italic'
                      : 'text-stone-900 dark:text-stone-100'
                  }`}
                >
                  {fields[key] === null
                    ? 'not read'
                    : key === 'alcohol'
                      ? `${fields[key]}%`
                      : String(fields[key])}
                </dd>
                {fields[key] !== null && sources?.[key] === 'inferred' && (
                  <span className="ml-3 shrink-0 self-center inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                    inferred
                  </span>
                )}
              </div>
            ))}
          </dl>

          <p className="text-xs text-stone-500 dark:text-stone-500 mb-4">
            Unmarked values were read off the label. &ldquo;Inferred&rdquo; means the
            label did not print it and the model supplied it — worth a glance
            before saving.
          </p>

          <div className="text-xs text-stone-500 dark:text-stone-500 space-y-1">
            {model && <p>Model: {model}</p>}
            <p>Web search: {searched ? 'used' : 'not needed'}</p>
            {elapsed !== null && <p>Round trip: {(elapsed / 1000).toFixed(1)}s</p>}
            {usage?.totalTokenCount != null && (
              <p>
                Tokens: {usage.promptTokenCount} in / {usage.candidatesTokenCount} out
              </p>
            )}
            {cost !== null && <p>Cost: ${cost.toFixed(5)}</p>}
          </div>
        </>
      )}
    </div>
  )
}
