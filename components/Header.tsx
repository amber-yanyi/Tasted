import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
        >
          Tasted
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <>
              <Link
                href="/add"
                className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Add Tasting
              </Link>
              <Link
                href="/tastings"
                className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Tastings
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-stone-300 dark:border-stone-700">
                <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
                  {user.email}
                </span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
