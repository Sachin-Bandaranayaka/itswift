import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'
import { monitoring } from '@/lib/utils/monitoring'

export interface ApiMonitoringOptions {
  logRequests?: boolean
  logResponses?: boolean
  trackMetrics?: boolean
  enableCors?: boolean
}

export function withApiMonitoring(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: ApiMonitoringOptions = {}
) {
  const {
    logRequests = true,
    logResponses = true,
    trackMetrics = true,
    enableCors = false
  } = options

  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    const method = request.method
    const url = new URL(request.url)
    const path = url.pathname
    
    // Generate request ID for tracing
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Log incoming request
      if (logRequests) {
        logger.apiRequest(method, path, {
          requestId,
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          contentType: request.headers.get('content-type')
        })
      }
      
      // Execute the handler
      const response = await handler(request)
      
      // Calculate response time
      const duration = Date.now() - startTime
      const statusCode = response.status
      
      // Log response
      if (logResponses) {
        logger.apiResponse(method, path, statusCode, duration)
      }
      
      // Track metrics
      if (trackMetrics) {
        monitoring.trackApiResponseTime(path, method, duration, statusCode)
      }
      
      // Add monitoring headers
      const monitoredResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
      
      monitoredResponse.headers.set('X-Request-ID', requestId)
      monitoredResponse.headers.set('X-Response-Time', `${duration}ms`)
      
      // Add CORS headers if enabled
      if (enableCors) {
        monitoredResponse.headers.set('Access-Control-Allow-Origin', '*')
        monitoredResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        monitoredResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }
      
      return monitoredResponse
      
    } catch (error) {
      const duration = Date.now() - startTime
      
      // Log error
      logger.error(`API error in ${method} ${path}`, 'API', {
        requestId,
        duration,
        error: error instanceof Error ? error.message : String(error)
      }, error instanceof Error ? error : undefined)
      
      // Track error metrics
      if (trackMetrics) {
        monitoring.recordMetric(`api_error_${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`, 1)
      }
      
      // Re-throw to be handled by error handler
      throw error
    }
  }
}

// Middleware for rate limiting (simple implementation)
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: { maxRequests: number; windowMs: number } = { maxRequests: 100, windowMs: 60000 }
) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }
    
    // Check current request count
    const current = requests.get(ip)
    if (current && current.count >= options.maxRequests && current.resetTime > windowStart) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`, 'RATE_LIMIT', {
        ip,
        count: current.count,
        maxRequests: options.maxRequests
      })
      
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(options.windowMs / 1000).toString()
          }
        }
      )
    }
    
    // Update request count
    if (current) {
      current.count++
    } else {
      requests.set(ip, { count: 1, resetTime: now + options.windowMs })
    }
    
    return handler(request)
  }
}

// Middleware for request validation
export function withRequestValidation(
  handler: (request: NextRequest) => Promise<NextResponse>,
  validator: (request: NextRequest) => Promise<void> | void
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      await validator(request)
      return handler(request)
    } catch (error) {
      logger.warn('Request validation failed', 'VALIDATION', {
        method: request.method,
        url: request.url,
        error: error instanceof Error ? error.message : String(error)
      })
      
      throw error
    }
  }
}