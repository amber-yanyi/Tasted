import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Tasting } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Tastings() {
  const { data: tastings, error } = await supabase
    .from('tastings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-red-600 dark:text-red-400">Error loading tastings: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100">
          Tastings
        </h1>
        <Link
          href="/add"
          className="px-6 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium text-sm"
        >
          Add Tasting
        </Link>
      </div>

      {!tastings || tastings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600 dark:text-stone-400 mb-6">No tastings yet.</p>
          <Link
            href="/add"
            className="inline-block px-6 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
          >
            Add your first tasting
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tastings.map((tasting: Tasting) => (
            <Link
              key={tasting.id}
              href={`/tastings/${tasting.id}`}
              className="block p-6 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    {tasting.wine_name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600 dark:text-stone-400 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      {tasting.wine_type}
                    </span>
                    {tasting.vintage && (
                      <span className="text-xs font-medium">{tasting.vintage}</span>
                    )}
                    {tasting.producer && (
                      <span className="text-xs">{tasting.producer}</span>
                    )}
                    <span>{new Date(tasting.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  {tasting.notes && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                      {tasting.notes}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
