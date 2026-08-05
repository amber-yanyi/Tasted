/**
 * Locale plumbing.
 *
 * The locale lives in a cookie rather than localStorage because half the app is
 * server-rendered — the tasting list and detail pages read it during render, and
 * localStorage does not exist there. A cookie is readable from both sides, so
 * the first paint is already in the right language with no flash of English.
 */

export type Locale = 'zh' | 'en'

export const LOCALE_COOKIE = 'tasted_locale'
/** English is the default; Chinese is one tap away in the header switcher. */
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return value === 'zh' || value === 'en'
}

export function parseLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}
