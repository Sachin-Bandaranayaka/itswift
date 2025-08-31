import crypto from 'crypto'
import { hashPassword } from './password'

interface PasswordResetToken {
  token: string
  email: string
  expires: number
  used: boolean
}

// In-memory storage for demo - in production, use database
const resetTokens = new Map<string, PasswordResetToken>()

/**
 * Generate a password reset token
 */
export function generateResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  resetTokens.set(token, {
    token,
    email,
    expires,
    used: false,
  })

  // Clean up expired tokens
  cleanupExpiredTokens()

  return token
}

/**
 * Validate a password reset token
 */
export function validateResetToken(token: string): { valid: boolean; email?: string } {
  const resetToken = resetTokens.get(token)
  
  if (!resetToken) {
    return { valid: false }
  }

  if (resetToken.used) {
    return { valid: false }
  }

  if (Date.now() > resetToken.expires) {
    resetTokens.delete(token)
    return { valid: false }
  }

  return { valid: true, email: resetToken.email }
}

/**
 * Use a password reset token (mark as used)
 */
export function useResetToken(token: string): boolean {
  const resetToken = resetTokens.get(token)
  
  if (!resetToken || resetToken.used || Date.now() > resetToken.expires) {
    return false
  }

  resetToken.used = true
  resetTokens.set(token, resetToken)
  
  return true
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  
  for (const [token, resetToken] of resetTokens.entries()) {
    if (now > resetToken.expires) {
      resetTokens.delete(token)
    }
  }
}

/**
 * Send password reset email (mock implementation)
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  try {
    // In production, integrate with email service (Brevo, SendGrid, etc.)
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`
    
    console.log('Password Reset Email (Mock):')
    console.log(`To: ${email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('This email would be sent via your email service in production.')
    
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const validation = validateResetToken(token)
  
  if (!validation.valid) {
    return false
  }

  // Use the token
  if (!useResetToken(token)) {
    return false
  }

  try {
    // In production, update the password in your user database
    const hashedPassword = await hashPassword(newPassword)
    
    console.log('Password Reset Success:')
    console.log(`Email: ${validation.email}`)
    console.log(`New Password Hash: ${hashedPassword}`)
    console.log('Update your ADMIN_PASSWORD_HASH environment variable with this hash.')
    
    return true
  } catch (error) {
    console.error('Error resetting password:', error)
    return false
  }
}

/**
 * Check if password meets security requirements
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}