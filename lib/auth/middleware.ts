import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware to protect admin routes
 */
export async function adminAuthMiddleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // If accessing admin routes
  if (isAdminRoute) {
    // If not authenticated and not on login page, redirect to login
    if (!token && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If authenticated and on login page, redirect to admin dashboard
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Check if user has admin role
    if (token && token.role !== 'admin' && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

/**
 * Check if user is authenticated admin
 */
export async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    return token?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin authentication:', error)
    return false
  }
}

/**
 * API route protection helper
 */
export function withAdminAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const isAuthenticated = await isAdminAuthenticated(req)

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(req, context)
  }
}