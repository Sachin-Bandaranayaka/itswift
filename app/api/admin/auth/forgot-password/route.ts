import { NextRequest, NextResponse } from 'next/server'
import { generateResetToken, sendPasswordResetEmail } from '@/lib/auth/password-reset'
import { logAuditEvent } from '@/lib/security/audit-logger'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'
import { sanitizeText, validateEmail } from '@/lib/security/input-validation'

async function handleForgotPassword(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeText(email)
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if this is the admin email (in production, check against user database)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    if (sanitizedEmail !== adminEmail) {
      // Don't reveal if email exists or not for security
      await logAuditEvent('password_reset_attempted', 'auth', { email: sanitizedEmail }, { 
        success: false, 
        request 
      })
      
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const token = generateResetToken(sanitizedEmail)

    // Send reset email
    const emailSent = await sendPasswordResetEmail(sanitizedEmail, token)

    if (!emailSent) {
      await logAuditEvent('password_reset_failed', 'auth', { email: sanitizedEmail }, { 
        success: false, 
        errorMessage: 'Failed to send reset email',
        request 
      })
      
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    // Log the action
    await logAuditEvent('password_reset_requested', 'auth', { email: sanitizedEmail }, { request })

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in forgot password:', error)
    await logAuditEvent('password_reset_error', 'auth', {}, { 
      success: false, 
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      request 
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(handleForgotPassword, rateLimitConfigs.auth)