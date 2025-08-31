import { getServerSession } from 'next-auth'
import { authOptions, AdminRole, AdminPermissions, rolePermissions } from './config'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  permissions: AdminPermissions
  loginTime: number
  lastActivity: number
}

/**
 * Get the current admin session on the server side
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return null
    }

    const user = session.user as any
    
    return {
      id: user.id || 'admin',
      name: user.name || 'Admin',
      email: user.email || 'admin@example.com',
      role: user.role || 'admin',
      permissions: user.permissions || rolePermissions.admin,
      loginTime: user.loginTime || Date.now(),
      lastActivity: user.lastActivity || Date.now(),
    }
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

/**
 * Check if the current user has a specific permission
 */
export async function hasPermission(permission: keyof AdminPermissions): Promise<boolean> {
  const user = await getAdminSession()
  
  if (!user) {
    return false
  }

  return user.permissions[permission]
}

/**
 * Check if the current user has a specific role or higher
 */
export async function hasRole(requiredRole: AdminRole): Promise<boolean> {
  const user = await getAdminSession()
  
  if (!user) {
    return false
  }

  const roleHierarchy: AdminRole[] = ['viewer', 'editor', 'admin', 'super_admin']
  const userRoleIndex = roleHierarchy.indexOf(user.role)
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

  return userRoleIndex >= requiredRoleIndex
}

/**
 * Require specific permission for API routes
 */
export function requirePermission(permission: keyof AdminPermissions) {
  return async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      throw new Error('Unauthorized: No valid session')
    }

    const permissions = token.permissions as AdminPermissions
    
    if (!permissions || !permissions[permission]) {
      throw new Error(`Unauthorized: Missing permission '${permission}'`)
    }

    return token
  }
}

/**
 * Require specific role for API routes
 */
export function requireRole(requiredRole: AdminRole) {
  return async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      throw new Error('Unauthorized: No valid session')
    }

    const userRole = token.role as AdminRole
    const roleHierarchy: AdminRole[] = ['viewer', 'editor', 'admin', 'super_admin']
    const userRoleIndex = roleHierarchy.indexOf(userRole)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

    if (userRoleIndex < requiredRoleIndex) {
      throw new Error(`Unauthorized: Requires '${requiredRole}' role or higher`)
    }

    return token
  }
}

/**
 * Get session timeout information
 */
export async function getSessionInfo(): Promise<{
  isValid: boolean
  timeUntilExpiry: number
  timeUntilIdle: number
} | null> {
  const user = await getAdminSession()
  
  if (!user) {
    return null
  }

  const now = Date.now()
  const SESSION_TIMEOUT = {
    idle: 30 * 60 * 1000, // 30 minutes
    absolute: 8 * 60 * 60 * 1000, // 8 hours
  }

  const timeUntilExpiry = SESSION_TIMEOUT.absolute - (now - user.loginTime)
  const timeUntilIdle = SESSION_TIMEOUT.idle - (now - user.lastActivity)

  return {
    isValid: timeUntilExpiry > 0 && timeUntilIdle > 0,
    timeUntilExpiry: Math.max(0, timeUntilExpiry),
    timeUntilIdle: Math.max(0, timeUntilIdle),
  }
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Verify admin credentials against environment variables
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials not configured in environment variables')
    return false
  }

  if (username !== adminUsername) {
    return false
  }

  return verifyPassword(password, adminPasswordHash)
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(action: string, details?: any): Promise<void> {
  const user = await getAdminSession()
  
  if (!user) {
    return
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action,
    details: details || {},
    ip: 'unknown', // Would need to be passed from request
  }

  // Log to console for now - in production, this would go to a proper logging service
  console.log('Admin Action:', JSON.stringify(logEntry, null, 2))
  
  // TODO: Store in database or external logging service
}