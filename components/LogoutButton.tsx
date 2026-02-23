'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

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
      Log out
    </button>
  )
}
