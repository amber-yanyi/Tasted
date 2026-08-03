'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TastingForm, { TastingFormData, toTastingPayload } from '@/components/TastingForm'
import { uploadLabelImage } from '@/lib/labelStorage'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function AddTasting() {
  const router = useRouter()
  const { t } = useLocale()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: TastingFormData, labelImage: File | null) => {
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError(t('mustBeLoggedIn'))
      return
    }

    // Upload the label first: if it fails we can still save the note without it,
    // whereas a row pointing at a file that was never stored would be broken.
    let labelPath: string | null = null
    if (labelImage) {
      try {
        labelPath = await uploadLabelImage(supabase, user.id, labelImage)
      } catch {
        setError(t('labelUploadFailed'))
      }
    }

    const { error: supabaseError } = await supabase.from('tastings').insert({
      user_id: user.id,
      ...toTastingPayload(formData),
      label_image_url: labelPath,
    })

    if (supabaseError) throw supabaseError

    router.push('/tastings')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
        {t('addTastingTitle')}
      </h1>

      <TastingForm
        onSubmit={handleSubmit}
        submitLabel={t('saveTasting')}
        loadingLabel={t('saving')}
        error={error}
      />
    </div>
  )
}
