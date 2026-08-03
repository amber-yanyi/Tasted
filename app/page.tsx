import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getT } from '@/lib/i18n/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const t = await getT()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      <div className="text-center space-y-8">
        <h1 className="font-serif text-6xl md:text-7xl font-semibold text-stone-900 dark:text-stone-100">
          Tasted
        </h1>
        <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-balance">
          {t('landingLede')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {user ? (
            <>
              <Link
                href="/add"
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
              >
                {t('addTasting')}
              </Link>
              <Link
                href="/tastings"
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors font-medium"
              >
                {t('viewTastings')}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
              >
                {t('getStarted')}
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors font-medium"
              >
                {t('logIn')}
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hidden sm:grid mt-24 grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            {t('featureLabelTitle')}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('featureLabelBody')}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            {t('featureNotesTitle')}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('featureNotesBody')}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            {t('featurePhoneTitle')}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('featurePhoneBody')}
          </p>
        </div>
      </div>
    </div>
  )
}
