import { NextRequest, NextResponse } from 'next/server'
import { resetPassword, validatePasswordStrength } from '@/lib/auth/password-reset'
import { logAdminAction } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Reset the password
    const success = await resetPassword(token, password)

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Log the action
    await logAdminAction('password_reset_completed', { token: token.substring(0, 8) + '...' })

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in reset password:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}