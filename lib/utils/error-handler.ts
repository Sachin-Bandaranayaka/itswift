import { NextResponse } from 'next/server'

export interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

export class ValidationError extends Error {
  statusCode = 400
  code = 'VALIDATION_ERROR'
  
  constructor(message: string, public details?: any) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  statusCode = 401
  code = 'AUTHENTICATION_ERROR'
  
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  statusCode = 403
  code = 'AUTHORIZATION_ERROR'
  
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  code = 'NOT_FOUND_ERROR'
  
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ExternalServiceError extends Error {
  statusCode = 502
  code = 'EXTERNAL_SERVICE_ERROR'
  
  constructor(message: string, public service: string, public details?: any) {
    super(message)
    this.name = 'ExternalServiceError'
  }
}

export class RateLimitError extends Error {
  statusCode = 429
  code = 'RATE_LIMIT_ERROR'
  
  constructor(message: string = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)
  
  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof ExternalServiceError) {
    return NextResponse.json(
      {
        success: false,
        error: `${error.service} service error: ${error.message}`,
        code: error.code,
        details: error.details
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    )
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      {
        success: false,
        error: isDevelopment ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(isDevelopment && { stack: error.stack })
      },
      { status: 500 }
    )
  }
  
  // Handle unknown error types
  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  )
}

export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: code || 'ERROR',
      ...(details && { details })
    },
    { status: statusCode }
  )
}

export function createSuccessResponse(
  data: any,
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    ...(message && { message }),
    ...data
  })
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Client-side error handler
export function handleClientError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

// Retry mechanism for external API calls
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError!
}