import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { JWT } from 'next-auth/jwt'

// Define admin roles and permissions
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

export interface AdminPermissions {
  canManageUsers: boolean
  canManageContent: boolean
  canManageSettings: boolean
  canViewAnalytics: boolean
  canManageAutomation: boolean
}

export const rolePermissions: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    canManageUsers: true,
    canManageContent: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canManageAutomation: true,
  },
  admin: {
    canManageUsers: false,
    canManageContent: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canManageAutomation: true,
  },
  editor: {
    canManageUsers: false,
    canManageContent: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canManageAutomation: false,
  },
  viewer: {
    canManageUsers: false,
    canManageContent: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canManageAutomation: false,
  },
}

// Session timeout configurations
const SESSION_TIMEOUT = {
  idle: 30 * 60, // 30 minutes of inactivity
  absolute: 8 * 60 * 60, // 8 hours absolute timeout
}

// Extend JWT type to include our custom properties
interface ExtendedJWT extends JWT {
  role?: AdminRole
  permissions?: AdminPermissions
  loginTime?: number
  lastActivity?: number
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Explicitly load environment variables
        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '$2b$12$pC9clH2yf7sYCXDqjVZdJuEVXHZqeGeUlycSyuKdXYzVrYfqAwZCG'
        const adminRole = (process.env.ADMIN_ROLE as AdminRole) || 'admin'

        if (!adminUsername || !adminPasswordHash) {
          console.error('Admin credentials not configured')
          return null
        }

        // Check username
        if (credentials.username !== adminUsername) {
          return null
        }

        // Check password
        const isValidPassword = await bcrypt.compare(credentials.password, adminPasswordHash)

        if (!isValidPassword) {
          return null
        }

        // Log successful login
        console.log(`Admin login successful: ${credentials.username} at ${new Date().toISOString()}`)

        return {
          id: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          role: adminRole,
          permissions: rolePermissions[adminRole],
          loginTime: Date.now(),
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_TIMEOUT.absolute,
  },
  jwt: {
    maxAge: SESSION_TIMEOUT.absolute,
  },
  callbacks: {
    async jwt({ token, user }): Promise<ExtendedJWT> {
      const extendedToken = token as ExtendedJWT

      if (user) {
        extendedToken.role = (user as any).role
        extendedToken.permissions = (user as any).permissions
        extendedToken.loginTime = (user as any).loginTime
        extendedToken.lastActivity = Date.now()
      } else {
        // Update last activity on token refresh
        extendedToken.lastActivity = Date.now()
      }

      // Check for session timeout
      const now = Date.now()
      const loginTime = extendedToken.loginTime || 0
      const lastActivity = extendedToken.lastActivity || 0

      // Check absolute timeout
      if (loginTime && now - loginTime > SESSION_TIMEOUT.absolute * 1000) {
        console.log('Session expired: absolute timeout reached')
        throw new Error('Session expired')
      }

      // Check idle timeout
      if (lastActivity && now - lastActivity > SESSION_TIMEOUT.idle * 1000) {
        console.log('Session expired: idle timeout reached')
        throw new Error('Session expired')
      }

      return extendedToken
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Create a new user object with the token data
        const userWithAuth = {
          ...session.user,
          role: token.role,
          permissions: token.permissions,
          loginTime: token.loginTime,
          lastActivity: token.lastActivity
        }

        return {
          ...session,
          user: userWithAuth
        }
      }
      return session
    }
  },
  events: {
    async signIn({ user }) {
      console.log(`Admin sign in event: ${user.email} at ${new Date().toISOString()}`)
    },
    async signOut() {
      console.log(`Admin sign out event at ${new Date().toISOString()}`)
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}