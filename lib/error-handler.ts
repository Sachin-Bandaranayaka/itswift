import { toast } from 'sonner'

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode?: number
}

export interface ErrorContext {
  operation: string
  platform?: string
  postId?: string
  userId?: string
  timestamp: Date
}

export class SocialMediaError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly context?: ErrorContext
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    context?: ErrorContext,
    originalError?: Error
  ) {
    super(message)
    this.name = 'SocialMediaError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
    this.originalError = originalError
  }
}

// Error codes for different scenarios
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_PLATFORM_DISCONNECTED: 'AUTH_PLATFORM_DISCONNECTED',
  
  // Platform-specific errors
  PLATFORM_API_LIMIT: 'PLATFORM_API_LIMIT',
  PLATFORM_CONTENT_VIOLATION: 'PLATFORM_CONTENT_VIOLATION',
  PLATFORM_DUPLICATE_POST: 'PLATFORM_DUPLICATE_POST',
  PLATFORM_UNAVAILABLE: 'PLATFORM_UNAVAILABLE',
  
  // Content errors
  CONTENT_TOO_LONG: 'CONTENT_TOO_LONG',
  CONTENT_INVALID_MEDIA: 'CONTENT_INVALID_MEDIA',
  CONTENT_MISSING_REQUIRED: 'CONTENT_MISSING_REQUIRED',
  
  // Scheduling errors
  SCHEDULE_INVALID_TIME: 'SCHEDULE_INVALID_TIME',
  SCHEDULE_TOO_MANY_POSTS: 'SCHEDULE_TOO_MANY_POSTS',
  
  // Network errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_INVALID_TOKEN]: 'Your session has expired. Please reconnect your account.',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Your authentication token has expired. Please reconnect.',
  [ERROR_CODES.AUTH_PLATFORM_DISCONNECTED]: 'Your account is disconnected. Please reconnect to continue.',
  
  [ERROR_CODES.PLATFORM_API_LIMIT]: 'Platform API limit reached. Please try again later.',
  [ERROR_CODES.PLATFORM_CONTENT_VIOLATION]: 'Content violates platform guidelines. Please review and modify.',
  [ERROR_CODES.PLATFORM_DUPLICATE_POST]: 'This content has already been posted recently.',
  [ERROR_CODES.PLATFORM_UNAVAILABLE]: 'Platform is currently unavailable. Please try again later.',
  
  [ERROR_CODES.CONTENT_TOO_LONG]: 'Content exceeds platform character limit.',
  [ERROR_CODES.CONTENT_INVALID_MEDIA]: 'Media format is not supported by this platform.',
  [ERROR_CODES.CONTENT_MISSING_REQUIRED]: 'Required content fields are missing.',
  
  [ERROR_CODES.SCHEDULE_INVALID_TIME]: 'Invalid scheduling time. Please select a future date.',
  [ERROR_CODES.SCHEDULE_TOO_MANY_POSTS]: 'Too many posts scheduled for this time. Please choose a different time.',
  
  [ERROR_CODES.NETWORK_TIMEOUT]: 'Request timed out. Please check your connection and try again.',
  [ERROR_CODES.NETWORK_UNAVAILABLE]: 'Network unavailable. Please check your internet connection.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Get error severity based on error code
function getErrorSeverity(code: string): ErrorSeverity {
  const criticalErrors = [
    ERROR_CODES.AUTH_PLATFORM_DISCONNECTED,
    ERROR_CODES.PLATFORM_UNAVAILABLE
  ]
  
  const highErrors = [
    ERROR_CODES.AUTH_INVALID_TOKEN,
    ERROR_CODES.AUTH_TOKEN_EXPIRED,
    ERROR_CODES.PLATFORM_API_LIMIT
  ]
  
  const mediumErrors = [
    ERROR_CODES.PLATFORM_CONTENT_VIOLATION,
    ERROR_CODES.CONTENT_TOO_LONG,
    ERROR_CODES.SCHEDULE_INVALID_TIME
  ]
  
  if (criticalErrors.includes(code as any)) return ErrorSeverity.CRITICAL
  if (highErrors.includes(code as any)) return ErrorSeverity.HIGH
  if (mediumErrors.includes(code as any)) return ErrorSeverity.MEDIUM
  return ErrorSeverity.LOW
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: Array<{ error: SocialMediaError; timestamp: Date }> = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Handle and display errors to users
  handleError(error: Error | SocialMediaError, context?: ErrorContext): void {
    let socialError: SocialMediaError

    if (error instanceof SocialMediaError) {
      socialError = error
    } else {
      // Convert generic error to SocialMediaError
      socialError = this.convertToSocialMediaError(error, context)
    }

    // Log the error
    this.logError(socialError)

    // Display user-friendly message
    this.displayError(socialError)

    // Report critical errors
    if (getErrorSeverity(socialError.code) === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(socialError)
    }
  }

  // Convert generic errors to SocialMediaError
  private convertToSocialMediaError(error: Error, context?: ErrorContext): SocialMediaError {
    let code: string = ERROR_CODES.UNKNOWN_ERROR
    let statusCode = 500

    // Try to determine error type from message or other properties
    if (error.message.includes('timeout')) {
      code = ERROR_CODES.NETWORK_TIMEOUT
      statusCode = 408
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      code = ERROR_CODES.NETWORK_UNAVAILABLE
      statusCode = 503
    } else if (error.message.includes('validation')) {
      code = ERROR_CODES.VALIDATION_ERROR
      statusCode = 400
    }

    return new SocialMediaError(
      error.message,
      code,
      statusCode,
      context,
      error
    )
  }

  // Log errors for debugging
  private logError(error: SocialMediaError): void {
    this.errorLog.push({ error, timestamp: new Date() })
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100)
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Social Media Error:', {
        code: error.code,
        message: error.message,
        context: error.context,
        originalError: error.originalError
      })
    }
  }

  // Display user-friendly error messages
  private displayError(error: SocialMediaError): void {
    const userMessage = ERROR_MESSAGES[error.code] || error.message
    const severity = getErrorSeverity(error.code)

    switch (severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(userMessage, {
          duration: 10000,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        })
        break
      
      case ErrorSeverity.HIGH:
        toast.error(userMessage, {
          duration: 8000
        })
        break
      
      case ErrorSeverity.MEDIUM:
        toast.warning(userMessage, {
          duration: 6000
        })
        break
      
      case ErrorSeverity.LOW:
      default:
        toast.error(userMessage, {
          duration: 4000
        })
        break
    }
  }

  // Report critical errors (could send to monitoring service)
  private reportCriticalError(error: SocialMediaError): void {
    // In a real application, you would send this to a monitoring service
    // like Sentry, LogRocket, or your own error tracking system
    console.error('CRITICAL ERROR REPORTED:', error)
  }

  // Get recent errors for debugging
  getRecentErrors(limit: number = 10): Array<{ error: SocialMediaError; timestamp: Date }> {
    return this.errorLog.slice(-limit)
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = []
  }
}

// Utility functions for common error scenarios
export const createAuthError = (message: string, platform?: string): SocialMediaError => {
  return new SocialMediaError(
    message,
    ERROR_CODES.AUTH_INVALID_TOKEN,
    401,
    {
      operation: 'authentication',
      platform,
      timestamp: new Date()
    }
  )
}

export const createPlatformError = (message: string, platform: string, code: string): SocialMediaError => {
  return new SocialMediaError(
    message,
    code,
    400,
    {
      operation: 'platform_api',
      platform,
      timestamp: new Date()
    }
  )
}

export const createContentError = (message: string, code: string): SocialMediaError => {
  return new SocialMediaError(
    message,
    code,
    400,
    {
      operation: 'content_validation',
      timestamp: new Date()
    }
  )
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance()

// Success notification helper
export const showSuccess = (message: string, duration: number = 4000) => {
  toast.success(message, { duration })
}

// Info notification helper
export const showInfo = (message: string, duration: number = 4000) => {
  toast.info(message, { duration })
}

// Warning notification helper
export const showWarning = (message: string, duration: number = 6000) => {
  toast.warning(message, { duration })
}