import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-stone-200 dark:border-stone-800">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-serif font-semibold text-stone-900 dark:text-stone-100 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
        >
          Tasted
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Home
          </Link>
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
        </div>
      </nav>
    </header>
  )
}
