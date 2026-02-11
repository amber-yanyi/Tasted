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
          A simple way to remember wines. Log your tastings with simplified WSET notes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
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
                className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
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
    </div>
  )
}
