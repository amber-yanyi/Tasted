import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center space-y-8">
        <h1 className="font-serif text-6xl md:text-7xl font-semibold text-stone-900 dark:text-stone-100">
          Tasted
        </h1>
        <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-balance">
          Remember every glass. A wine journal built on WSET tasting logic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {user ? (
            <>
              <Link
                href="/add"
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
              >
                Add a Tasting
              </Link>
              <Link
                href="/tastings"
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors font-medium"
              >
                View Tastings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors font-medium"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            Structured SAT Notes
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Guided tasting form based on the WSET Systematic Approach. No more blank-page anxiety.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            Track What You Love
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Build a personal library of every wine you taste. Searchable, sortable, always with you.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            Works Offline
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Install it on your phone. Log tastings at the cellar door, even without signal.
          </p>
        </div>
      </div>
    </div>
  )
}
