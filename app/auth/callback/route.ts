import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const supabase = await createClient()

  // OAuth and PKCE recovery links arrive as a code to exchange.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Email links sent by Supabase's own mailer arrive as token_hash + type
  // instead. Recovery links use this shape, so both paths are handled or a
  // password reset dies here with an unexplained bounce to the login page.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // A recovery link that failed should land on the reset page, which explains
  // that the link expired and offers a new one — more useful than a silent
  // return to the login form.
  if (type === 'recovery' || next === '/reset-password') {
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  return NextResponse.redirect(`${origin}/login`)
}
