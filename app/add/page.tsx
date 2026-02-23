'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TastingForm, { TastingFormData, toTastingPayload } from '@/components/TastingForm'

export default function AddTasting() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: TastingFormData) => {
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to add a tasting')
      return
    }

    const { error: supabaseError } = await supabase.from('tastings').insert({
      user_id: user.id,
      ...toTastingPayload(formData),
    })

    if (supabaseError) throw supabaseError

    router.push('/tastings')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
        Add Tasting
      </h1>

      <TastingForm
        onSubmit={handleSubmit}
        submitLabel="Save Tasting"
        loadingLabel="Saving..."
        error={error}
      />
    </div>
  )
}
