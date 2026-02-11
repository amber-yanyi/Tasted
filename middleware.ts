import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  // Protected routes that require authentication
  const protectedRoutes = ['/add', '/tastings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Auth routes that logged-in users shouldn't access
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to home if accessing auth routes while logged in
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
