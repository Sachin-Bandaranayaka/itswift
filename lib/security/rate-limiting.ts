import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  skipSuccessfulRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore: RateLimitStore = {}

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  }
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Include user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}:${userAgent.substring(0, 50)}`
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const clientId = getClientId(request)
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance
      cleanupExpiredEntries()
    }

    // Get or create rate limit entry
    let entry = rateLimitStore[clientId]
    
    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
      rateLimitStore[clientId] = entry
    }

    // Increment request count
    entry.count++

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      
      return NextResponse.json(
        { 
          error: config.message || 'Too many requests',
          retryAfter: retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          }
        }
      )
    }

    // Add rate limit headers to response
    const remaining = config.maxRequests - entry.count
    
    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': entry.resetTime.toString(),
      }
    })
  }
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many API requests, please try again later',
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later',
  },
  
  // Content creation endpoints
  content: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many content creation requests, please slow down',
  },
  
  // AI generation endpoints
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many AI generation requests, please wait before trying again',
  },
  
  // Email sending endpoints
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
    message: 'Too many email requests, please try again later',
  },
  
  // Social media posting endpoints
  social: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,
    message: 'Too many social media posts, please wait before posting again',
  },
}

/**
 * Apply rate limiting to API route handler
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = rateLimit(config)(req)
    
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse
    }

    return handler(req)
  }
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(request: NextRequest, config: RateLimitConfig): {
  limit: number
  remaining: number
  resetTime: number
  blocked: boolean
} {
  const clientId = getClientId(request)
  const now = Date.now()
  const entry = rateLimitStore[clientId]

  if (!entry || entry.resetTime < now) {
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      blocked: false,
    }
  }

  const remaining = Math.max(0, config.maxRequests - entry.count)
  const blocked = entry.count > config.maxRequests

  return {
    limit: config.maxRequests,
    remaining,
    resetTime: entry.resetTime,
    blocked,
  }
}