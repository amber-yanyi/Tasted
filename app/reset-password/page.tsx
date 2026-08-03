'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * Where a recovery link lands, after the callback has exchanged its code for a
 * session. Arriving here means Supabase has already authenticated the user —
 * the remaining job is to set a password so they can log in normally next time.
 */
export default function ResetPasswordPage() {
  const { t } = useLocale()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // Two ways a valid recovery can arrive here:
  //
  //  - The callback already verified a token_hash and set session cookies.
  //  - Supabase redirected with the tokens in the URL fragment. A fragment is
  //    never sent to the server, so only this component can act on it — without
  //    this branch such a link would look expired even though it is fine.
  useEffect(() => {
    const supabase = createClient()

    async function establishSession() {
      const hash = window.location.hash
      if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.slice(1))
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          // Clear the fragment so the tokens are not left in history or copied
          // out of the address bar.
          window.history.replaceState(null, '', window.location.pathname)
          if (!error) {
            setHasSession(true)
            setChecking(false)
            return
          }
        }
      }

      const { data } = await supabase.auth.getSession()
      setHasSession(Boolean(data.session))
      setChecking(false)
    }

    establishSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(t('passwordTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    // The recovery session is already a real session, so they land logged in.
    setDone(true)
    router.push('/tastings')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-stone-900 dark:text-stone-100 mb-8">
            {t('newPasswordTitle')}
          </h1>

          {checking ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-2/3 mx-auto" />
              <div className="h-12 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          ) : !hasSession ? (
            <>
              <p className="text-sm text-stone-600 dark:text-stone-400 text-center mb-6">
                {t('resetLinkInvalid')}
              </p>
              <Link
                href="/forgot-password"
                className="block w-full min-h-[48px] flex items-center justify-center bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {t('requestNewLink')}
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {done && (
                <div className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-3 rounded-lg text-sm">
                  {t('passwordUpdated')}
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                >
                  {t('newPassword')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 text-base border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
                >
                  {t('confirmPassword')}
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 text-base border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 dark:bg-stone-100 dark:hover:bg-stone-200 dark:disabled:bg-stone-600 text-stone-50 dark:text-stone-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? t('updatingPassword') : t('updatePassword')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
