'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteLabelImage } from '@/lib/labelStorage'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function DeleteTastingButton({ id }: { id: string }) {
  const router = useRouter()
  const { t } = useLocale()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!window.confirm(t('confirmDelete'))) {
      return
    }

    setDeleting(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError(t('mustBeLoggedIn'))
      setDeleting(false)
      return
    }

    // Read the label path before the row goes, or the file is orphaned.
    const { data: existing } = await supabase
      .from('tastings')
      .select('label_image_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    const { error: supabaseError } = await supabase
      .from('tastings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (supabaseError) {
      setError(supabaseError.message)
      setDeleting(false)
      return
    }

    if (existing?.label_image_url) {
      await deleteLabelImage(supabase, existing.label_image_url)
    }

    router.push('/tastings')
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
      >
        {deleting ? t('deleting') : t('delete')}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </>
  )
}
