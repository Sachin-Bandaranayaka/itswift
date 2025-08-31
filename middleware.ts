import { NextRequest } from 'next/server'
import { adminAuthMiddleware } from '@/lib/auth/middleware'

export async function middleware(request: NextRequest) {
  // Apply admin authentication middleware to admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminAuthMiddleware(request)
  }
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}