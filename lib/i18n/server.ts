import { cookies } from 'next/headers'
import { LOCALE_COOKIE, parseLocale, type Locale } from './locale'
import { t as translate, type StringKey } from './strings'

/** The locale for the current request, for use in server components. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  return parseLocale(store.get(LOCALE_COOKIE)?.value)
}

/**
 * A translator bound to the request's locale.
 *
 * Server components call `const t = await getT()` and then `t('key')`, mirroring
 * the shape `useLocale()` gives client components.
 */
export async function getT() {
  const locale = await getLocale()
  return (key: StringKey, vars?: Record<string, string | number>) =>
    translate(key, locale, vars)
}
