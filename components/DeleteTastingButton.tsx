'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteTastingButton({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tasting? This cannot be undone.')) {
      return
    }

    setDeleting(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      setDeleting(false)
      return
    }

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

    router.push('/tastings')
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </>
  )
}
