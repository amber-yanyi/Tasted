'use client'

import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * 中 / EN toggle.
 *
 * Deliberately plain text rather than a dropdown: with two languages a select is
 * more clicks for the same outcome, and the labels are self-describing in the
 * language they switch to.
 */
export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        type="button"
        onClick={() => setLocale('zh')}
        aria-current={locale === 'zh' ? 'true' : undefined}
        className={
          locale === 'zh'
            ? 'font-medium text-stone-900 dark:text-stone-100'
            : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors'
        }
      >
        中
      </button>
      <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-current={locale === 'en' ? 'true' : undefined}
        className={
          locale === 'en'
            ? 'font-medium text-stone-900 dark:text-stone-100'
            : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors'
        }
      >
        EN
      </button>
    </div>
  )
}
