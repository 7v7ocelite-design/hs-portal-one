import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/onboarding', '/admin']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup']

// Admin-only routes
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get user session
  const { user, supabaseResponse, supabase } = await updateSession(request)

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // If not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access auth routes (login/signup)
  if (user && isAuthRoute) {
    // Check if they have completed onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_complete')
      .eq('user_id', user.id)
      .single()

    if (profile?.onboarding_complete && profile?.role) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
    } else {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // If authenticated and accessing admin routes, check if user is admin
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_admin) {
      // Not an admin, redirect to their dashboard
      const { data: roleProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      const role = roleProfile?.role || 'athlete'
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  }

  // If authenticated and on /onboarding, check if already completed
  if (user && pathname === '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_complete')
      .eq('user_id', user.id)
      .single()

    if (profile?.onboarding_complete && profile?.role) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
    }
  }

  // If authenticated and on a role-specific onboarding page
  if (user && pathname.startsWith('/onboarding/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_complete')
      .eq('user_id', user.id)
      .single()

    // If already onboarded, redirect to dashboard
    if (profile?.onboarding_complete && profile?.role) {
      return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (they handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
