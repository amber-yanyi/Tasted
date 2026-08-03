'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TastingForm, { TastingFormData, toTastingPayload } from '@/components/TastingForm'
import { uploadLabelImage, getLabelImageUrl, deleteLabelImage } from '@/lib/labelStorage'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function EditTasting() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { t } = useLocale()
  const [initialData, setInitialData] = useState<TastingFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  // The stored path of the label already on this tasting, and a signed URL for
  // showing it. Kept apart from the form so a replacement can clean up the old
  // file after the new one is safely uploaded.
  const [existingPath, setExistingPath] = useState<string | null>(null)
  const [existingUrl, setExistingUrl] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasting() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: tasting, error: fetchError } = await supabase
        .from('tastings')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !tasting) {
        setNotFound(true)
        return
      }

      if (tasting.label_image_url) {
        setExistingPath(tasting.label_image_url)
        setExistingUrl(await getLabelImageUrl(supabase, tasting.label_image_url))
      }

      setInitialData({
        wine_name: tasting.wine_name ?? '',
        wine_type: tasting.wine_type ?? '',
        vintage: tasting.vintage ? String(tasting.vintage) : '',
        producer: tasting.producer ?? '',
        region: tasting.region ?? '',
        country: tasting.country ?? '',
        grape_variety: tasting.grape_variety ?? '',
        alcohol: tasting.alcohol != null ? String(tasting.alcohol) : '',
        clarity: tasting.clarity ?? '',
        appearance_intensity: tasting.appearance_intensity ?? '',
        color: tasting.color ?? '',
        sweetness: tasting.sweetness ?? '',
        acidity: tasting.acidity ?? '',
        tannin: tasting.tannin ?? '',
        body: tasting.body ?? '',
        mousse: tasting.mousse ?? '',
        finish: tasting.finish ?? '',
        aromas: tasting.aromas ?? [],
        quality_level: tasting.quality_level ?? '',
        notes: tasting.notes ?? '',
      })
    }

    fetchTasting()
  }, [params.id, router])

  const handleSubmit = async (
    formData: TastingFormData,
    labelImage: File | null,
    labelCleared: boolean
  ) => {
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError(t('mustBeLoggedIn'))
      return
    }

    // A new file means replace; no file and no existing preview means the user
    // removed the photo; otherwise keep what is already there.
    let labelPath = existingPath
    if (labelImage) {
      try {
        labelPath = await uploadLabelImage(supabase, user.id, labelImage)
      } catch {
        setError(t('labelUploadFailedKeep'))
        labelPath = existingPath
      }
    } else if (labelCleared) {
      labelPath = null
    }

    const { error: supabaseError } = await supabase
      .from('tastings')
      .update({ ...toTastingPayload(formData), label_image_url: labelPath })
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (supabaseError) throw supabaseError

    // Only now that the row points elsewhere is the old file safe to drop.
    if (existingPath && labelPath !== existingPath) {
      await deleteLabelImage(supabase, existingPath)
    }

    router.push(`/tastings/${params.id}`)
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-stone-600 dark:text-stone-400">{t('tastingNotFound')}</p>
        <Link href="/tastings" className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 mt-4 inline-block">
          {t('backToTastings')}
        </Link>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
          <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
          <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href={`/tastings/${params.id}`}
        className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors"
      >
        &larr; {t('backToTasting')}
      </Link>

      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
        {t('editTastingTitle')}
      </h1>

      <TastingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel={t('updateTasting')}
        loadingLabel={t('updating')}
        error={error}
        existingImageUrl={existingUrl}
      />
    </div>
  )
}
