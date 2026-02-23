'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TastingForm, { TastingFormData, toTastingPayload } from '@/components/TastingForm'

export default function EditTasting() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [initialData, setInitialData] = useState<TastingFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

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

      setInitialData({
        wine_name: tasting.wine_name ?? '',
        wine_type: tasting.wine_type ?? '',
        vintage: tasting.vintage ? String(tasting.vintage) : '',
        producer: tasting.producer ?? '',
        region: tasting.region ?? '',
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

  const handleSubmit = async (formData: TastingFormData) => {
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const { error: supabaseError } = await supabase
      .from('tastings')
      .update(toTastingPayload(formData))
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (supabaseError) throw supabaseError

    router.push(`/tastings/${params.id}`)
  }

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-stone-600 dark:text-stone-400">Tasting not found.</p>
        <Link href="/tastings" className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 mt-4 inline-block">
          Back to Tastings
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
        &larr; Back to Tasting
      </Link>

      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
        Edit Tasting
      </h1>

      <TastingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Update Tasting"
        loadingLabel="Updating..."
        error={error}
      />
    </div>
  )
}
