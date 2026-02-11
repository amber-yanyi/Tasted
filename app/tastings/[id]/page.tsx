import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function TastingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: tasting, error } = await supabase
    .from('tastings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !tasting) {
    notFound()
  }

  const AttributeRow = ({ label, value }: { label: string; value: string | null }) => {
    if (!value) return null

    return (
      <div className="flex items-start py-3 border-b border-stone-200 dark:border-stone-800 last:border-0">
        <dt className="w-32 text-sm font-medium text-stone-500 dark:text-stone-400">{label}</dt>
        <dd className="flex-1 text-sm text-stone-900 dark:text-stone-100">{value}</dd>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/tastings"
        className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors"
      >
        &larr; Back to Tastings
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
            {tasting.wine_name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              {tasting.wine_type}
            </span>
            {tasting.vintage && (
              <span className="text-sm font-medium">{tasting.vintage}</span>
            )}
            <span className="text-sm">
              {new Date(tasting.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {(tasting.producer || tasting.region) && (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {[tasting.producer, tasting.region].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Appearance */}
        {(tasting.clarity || tasting.appearance_intensity || tasting.color) && (
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Appearance
            </h2>
            <dl className="space-y-0">
              <AttributeRow label="Clarity" value={tasting.clarity} />
              <AttributeRow label="Intensity" value={tasting.appearance_intensity} />
              <AttributeRow label="Color" value={tasting.color} />
            </dl>
          </div>
        )}

        {/* Nose & Palate */}
        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Nose & Palate
          </h2>
          <dl className="space-y-0">
            <AttributeRow label="Sweetness" value={tasting.sweetness} />
            <AttributeRow label="Acidity" value={tasting.acidity} />
            {tasting.wine_type === 'Red' && tasting.tannin && (
              <AttributeRow label="Tannin" value={tasting.tannin} />
            )}
            <AttributeRow label="Body" value={tasting.body} />
            {tasting.wine_type === 'Sparkling' && tasting.mousse && (
              <AttributeRow label="Mousse" value={tasting.mousse} />
            )}
            <AttributeRow label="Finish" value={tasting.finish} />
          </dl>
        </div>

        {/* Aromas & Flavors */}
        {tasting.aromas && tasting.aromas.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Aromas & Flavors
            </h2>
            <div className="flex flex-wrap gap-2">
              {tasting.aromas.map((aroma: string) => (
                <span
                  key={aroma}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  {aroma}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Conclusions */}
        {tasting.quality_level && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Conclusions
            </h2>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <span className="font-medium text-stone-500 dark:text-stone-400">Quality Level:</span>{' '}
              {tasting.quality_level}
            </p>
          </div>
        )}

        {/* Notes */}
        {tasting.notes && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              Notes
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
              {tasting.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
