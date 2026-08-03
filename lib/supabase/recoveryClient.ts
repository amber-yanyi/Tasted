import { createClient } from '@supabase/supabase-js'

/**
 * A client used only to request password-reset emails.
 *
 * `@supabase/ssr`'s browser client runs the PKCE flow, which stashes a
 * code_verifier cookie in the browser that requested the reset and requires it
 * back when the link is redeemed. That is the right trade for OAuth, where the
 * round trip stays in one browser — but a reset link travels through email and
 * is usually opened somewhere else entirely: a mail app's webview, a phone when
 * the request came from a laptop, a different browser. The verifier is missing
 * there by design, the exchange fails, and the user is told the link is invalid
 * or expired seconds after it was issued.
 *
 * Explicitly asking for the implicit flow makes Supabase send a token_hash link
 * instead, which carries everything needed to verify it. Any browser can redeem
 * it, which is what a link sent by email has to support.
 *
 * This is scoped to the reset request alone. Sessions still come from the
 * cookie-based SSR client, so nothing about how the app authenticates changes.
 */
export function createRecoveryClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
        // Nothing here should touch the app's stored session.
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
