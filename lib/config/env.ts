/**
 * Environment variable validation and configuration
 */

export interface EnvironmentConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
  }
  openai: {
    apiKey: string
  }
  brevo: {
    apiKey: string
  }
  linkedin: {
    clientId: string
    clientSecret: string
  }
  twitter: {
    apiKey: string
    apiSecret: string
    accessToken: string
    accessTokenSecret: string
  }
  admin: {
    username: string
    passwordHash: string
  }
  nextAuth: {
    secret: string
    url: string
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): {
  isValid: boolean
  missing: string[]
  config?: EnvironmentConfig
} {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'BREVO_API_KEY',
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET',
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_TOKEN_SECRET',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]

  const missing: string[] = []

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    return { isValid: false, missing }
  }

  const config: EnvironmentConfig = {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY!
    },
    brevo: {
      apiKey: process.env.BREVO_API_KEY!
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY!,
      apiSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
    },
    admin: {
      username: process.env.ADMIN_USERNAME!,
      passwordHash: process.env.ADMIN_PASSWORD_HASH!
    },
    nextAuth: {
      secret: process.env.NEXTAUTH_SECRET!,
      url: process.env.NEXTAUTH_URL!
    }
  }

  return { isValid: true, missing: [], config }
}

/**
 * Get environment configuration (throws if invalid)
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const validation = validateEnvironment()
  
  if (!validation.isValid) {
    throw new Error(`Missing required environment variables: ${validation.missing.join(', ')}`)
  }

  return validation.config!
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}