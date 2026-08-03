'use client'

import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * Shows only the language you would switch *to*.
 *
 * A 中 / EN pair put a slash right next to the header's own border-l divider,
 * which read as two competing vertical rules. Naming just the target also makes
 * the affordance obvious: you can see the current language in the interface
 * around it, so the button only needs to say where it goes.
 */
export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()
  const target = locale === 'zh' ? 'en' : 'zh'

  return (
    <button
      type="button"
      onClick={() => setLocale(target)}
      // The label is in the target language, so it reads correctly to someone
      // who only speaks that one.
      aria-label={target === 'en' ? 'Switch to English' : '切换为中文'}
      className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
    >
      {target === 'en' ? 'EN' : '中文'}
    </button>
  )
}
