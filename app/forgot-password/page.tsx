'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function ForgotPasswordPage() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // The link lands on the shared callback, which exchanges the code for a
      // session and forwards to the page where the new password is set.
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    // Shown whether or not the address has an account: confirming which emails
    // are registered would let anyone enumerate the user list.
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-stone-900 dark:text-stone-100 mb-4">
            {t('resetPasswordTitle')}
          </h1>

          {sent ? (
            <>
              <p className="text-sm text-stone-600 dark:text-stone-400 text-center mb-6">
                {t('resetLinkSent')}
              </p>
              <Link
                href="/login"
                className="block w-full min-h-[48px] flex items-center justify-center bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {t('backToLogin')}
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-stone-600 dark:text-stone-400 text-center mb-8">
                {t('resetPasswordHint')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                  >
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 text-base border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 dark:bg-stone-100 dark:hover:bg-stone-200 dark:disabled:bg-stone-600 text-stone-50 dark:text-stone-900 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? t('sendingResetLink') : t('sendResetLink')}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
                <Link
                  href="/login"
                  className="text-stone-900 dark:text-stone-100 hover:text-stone-700 dark:hover:text-stone-300 font-semibold"
                >
                  {t('backToLogin')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
