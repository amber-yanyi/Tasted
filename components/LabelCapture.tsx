'use client'

import { useEffect, useRef, useState } from 'react'
import { compressImage } from '@/lib/compressImage'
import type { ExtractedLabel } from '@/lib/labelExtraction'
import { useLocale } from '@/lib/i18n/LocaleProvider'

type LabelCaptureProps = {
  /** Fields read or inferred from the photo, for the form to prefill. */
  onExtracted: (fields: ExtractedLabel) => void
  /**
   * The compressed image, held by the form and uploaded on save — not before,
   * so abandoning a half-filled form leaves nothing behind in Storage.
   */
  onImageChange: (file: File | null) => void
  /** An already-saved label, when editing an existing tasting. */
  existingImageUrl?: string | null
}

export default function LabelCapture({
  onExtracted,
  onImageChange,
  existingImageUrl,
}: LabelCaptureProps) {
  const { t } = useLocale()
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null)
  const [status, setStatus] = useState<'idle' | 'reading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [filledCount, setFilledCount] = useState(0)
  const objectUrl = useRef<string | null>(null)

  // Revoke the blob URL on unmount so a long editing session doesn't leak it.
  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    }
  }, [])

  const showPreview = (file: File) => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = URL.createObjectURL(file)
    setPreview(objectUrl.current)
  }

  const handleFile = async (original: File) => {
    setStatus('reading')
    setError(null)
    setFilledCount(0)

    let file: File
    try {
      file = await compressImage(original)
    } catch {
      file = original
    }

    showPreview(file)
    // Keep the photo even if recognition fails — the label is worth saving on
    // its own, and the user can type the details in.
    onImageChange(file)

    try {
      const body = new FormData()
      body.append('image', file)
      const res = await fetch('/api/extract-label', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? `Could not read the label (${res.status}).`)
        setStatus('error')
        return
      }

      const fields = data.fields as ExtractedLabel
      const count = Object.values(fields).filter((v) => v !== null).length
      setFilledCount(count)

      if (count === 0) {
        setError(t('captureNothingRead'))
        setStatus('error')
        return
      }

      onExtracted(fields)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('captureUnreachable'))
      setStatus('error')
    }
  }

  const clear = () => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current)
      objectUrl.current = null
    }
    setPreview(null)
    setStatus('idle')
    setError(null)
    setFilledCount(0)
    onImageChange(null)
  }

  const reading = status === 'reading'

  return (
    <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-6">
      {preview ? (
        <div className="flex gap-4 items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Wine label"
            className="w-24 h-32 object-cover rounded-md border border-stone-200 dark:border-stone-800 shrink-0 bg-stone-100 dark:bg-stone-900"
          />
          <div className="flex-1 min-w-0">
            {reading && (
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t('captureReadingLabel')}
              </p>
            )}
            {status === 'done' && (
              <p className="text-sm text-stone-700 dark:text-stone-300">
                {filledCount === 1
                  ? t('captureFilledOne')
                  : t('captureFilledMany', { n: filledCount })}
              </p>
            )}
            {status === 'error' && error && (
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            )}
            {status === 'idle' && (
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t('captureSaved')}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300 underline cursor-pointer hover:text-stone-900 dark:hover:text-stone-100">
                {t('captureReplace')}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  disabled={reading}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                    e.target.value = ''
                  }}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={clear}
                disabled={reading}
                className="text-sm text-stone-500 dark:text-stone-500 underline hover:text-stone-700 dark:hover:text-stone-300 disabled:opacity-50"
              >
                {t('captureRemove')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-serif text-lg text-stone-700 dark:text-stone-300">
            {t('captureTitle')}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-500 mt-1 mb-4">
            {t('captureHint')}
            <br />
            {t('captureHintSkip')}
          </p>
          <label className="inline-block px-6 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium text-sm cursor-pointer">
            {reading ? t('captureReading') : t('captureButton')}
            <input
              type="file"
              accept="image/*"
              // Opens the rear camera directly on a phone.
              capture="environment"
              disabled={reading}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
                e.target.value = ''
              }}
              className="hidden"
            />
          </label>
          {status === 'error' && error && (
            <p className="text-sm text-red-700 dark:text-red-300 mt-3">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
