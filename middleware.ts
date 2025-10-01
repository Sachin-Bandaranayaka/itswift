import { NextRequest, NextResponse } from 'next/server'
import { adminAuthMiddleware } from '@/lib/auth/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Handle domain redirects - redirect itswift.com to www.itswift.com
  if (hostname === 'itswift.com') {
    url.hostname = 'www.itswift.com'
    return NextResponse.redirect(url, 301)
  }
  
  // Handle www subdomain variations and ensure consistent canonical domain
  if (hostname.startsWith('www.') && hostname !== 'www.itswift.com') {
    url.hostname = 'www.itswift.com'
    return NextResponse.redirect(url, 301)
  }
  
  // Ensure HTTPS redirect for production
  if (process.env.NODE_ENV === 'production' && url.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }
  
  // Apply admin authentication middleware to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request)
  }
  
  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes that don't need domain redirects
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    '/admin/:path*'
  ]
}