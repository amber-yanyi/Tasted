'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { LOCALE_COOKIE, type Locale } from './locale'
import { t as translate, type StringKey } from './strings'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: StringKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Holds the locale for client components.
 *
 * Seeded from the server-read cookie so the first render already matches what
 * was server-rendered — no flash of the wrong language.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    // A year, so the choice survives; SameSite=Lax is enough for a display
    // preference and avoids sending it on cross-site requests.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`
    // Server components rendered in the old locale need to re-render. A reload
    // is blunt but correct, and switching language is rare enough that the cost
    // never shows up in normal use.
    window.location.reload()
  }, [])

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) =>
      translate(key, locale, vars),
    [locale]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
