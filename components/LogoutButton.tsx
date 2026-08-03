'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from '@/lib/i18n/LocaleProvider'

export default function LogoutButton() {
  const router = useRouter()
  const { t } = useLocale()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
    >
      {t('logOut')}
    </button>
  )
}
