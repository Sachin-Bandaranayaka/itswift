/**
 * Utility functions for URL handling
 */

/**
 * Get the base URL for the application
 * In production, this should be set via NEXTAUTH_URL environment variable
 * In development, it defaults to localhost:3000
 */
export function getBaseUrl(): string {
  // In production, use NEXTAUTH_URL (which should be set to your domain)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // In production without NEXTAUTH_URL, we should avoid making HTTP calls
  // This will help identify configuration issues
  throw new Error('NEXTAUTH_URL environment variable is required in production')
}

/**
 * Check if we're in a serverless environment where internal HTTP calls should be avoided
 */
export function shouldAvoidInternalHttpCalls(): boolean {
  // In serverless environments, internal HTTP calls to localhost often fail
  // It's better to use direct function calls instead
  return process.env.NODE_ENV === 'production' || !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME
}

/**
 * Get the API base URL for internal calls
 * Returns null if internal HTTP calls should be avoided
 */
export function getInternalApiUrl(): string | null {
  if (shouldAvoidInternalHttpCalls()) {
    return null
  }
  
  return getBaseUrl()
}