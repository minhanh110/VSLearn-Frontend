import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register')
  
  const isPublicPage = request.nextUrl.pathname === '/' ||
                      request.nextUrl.pathname === '/homepage' ||
                      request.nextUrl.pathname.startsWith('/oauth2')

  // If no token and trying to access protected route
  if (!token && !isAuthPage && !isPublicPage) {
    const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(new URL(`/login?returnUrl=${returnUrl}`, request.url))
  }

  // If has token and trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/homepage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/edit-profile/:path*',
    '/flashcard/:path*',
    '/test-start/:path*',
    '/test-topic/:path*',
    '/practice/:path*',
    '/change-password/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
} 