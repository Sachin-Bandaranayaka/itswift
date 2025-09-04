import { logger } from './logger'
import { NewsletterServiceError, BrevoServiceError, ValidationError } from './error-handler'

export interface NewsletterErrorContext {
  operation: string
  email?: string
  subscriberId?: string
  source?: string
  userAgent?: string
  ipAddress?: string
}

export interface NewsletterErrorMetrics {
  errorType: string
  operation: string
  source?: string
  timestamp: string
  resolved: boolean
}

/**
 * Newsletter-specific error handler with logging and monitoring
 */
export class NewsletterErrorHandler {
  private static errorMetrics: NewsletterErrorMetrics[] = []

  /**
   * Handle newsletter subscription errors with comprehensive logging
   */
  static handleSubscriptionError(
    error: unknown,
    context: NewsletterErrorContext
  ): NewsletterServiceError {
    const errorMessage = this.extractErrorMessage(error)
    const errorType = this.getErrorType(error)
    
    // Log the error with context
    logger.error(
      `Newsletter subscription error: ${errorMessage}`,
      'NEWSLETTER_SUBSCRIPTION',
      {
        operation: context.operation,
        email: context.email ? this.maskEmail(context.email) : undefined,
        subscriberId: context.subscriberId,
        source: context.source,
        errorType,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress ? this.maskIpAddress(context.ipAddress) : undefined
      },
      error instanceof Error ? error : undefined
    )

    // Track error metrics
    this.trackError(errorType, context.operation, context.source)

    // Return appropriate error
    if (error instanceof ValidationError) {
      return new NewsletterServiceError(
        `Validation failed: ${errorMessage}`,
        context.operation,
        { validationErrors: error.details },
        400 // Validation errors should return 400
      )
    }

    if (error instanceof BrevoServiceError) {
      return new NewsletterServiceError(
        `Email service error: ${errorMessage}`,
        context.operation,
        { service: 'brevo', originalError: errorMessage }
      )
    }

    return new NewsletterServiceError(
      errorMessage,
      context.operation,
      { originalError: error }
    )
  }

  /**
   * Handle newsletter unsubscription errors
   */
  static handleUnsubscriptionError(
    error: unknown,
    context: NewsletterErrorContext
  ): NewsletterServiceError {
    const errorMessage = this.extractErrorMessage(error)
    const errorType = this.getErrorType(error)
    
    // Log the error with context
    logger.error(
      `Newsletter unsubscription error: ${errorMessage}`,
      'NEWSLETTER_UNSUBSCRIPTION',
      {
        operation: context.operation,
        email: context.email ? this.maskEmail(context.email) : undefined,
        subscriberId: context.subscriberId,
        errorType,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress ? this.maskIpAddress(context.ipAddress) : undefined
      },
      error instanceof Error ? error : undefined
    )

    // Track error metrics
    this.trackError(errorType, context.operation)

    return new NewsletterServiceError(
      errorMessage,
      context.operation,
      { originalError: error }
    )
  }

  /**
   * Handle Brevo service errors with fallback mechanisms
   */
  static handleBrevoError(
    error: unknown,
    operation: string,
    fallbackEnabled: boolean = true
  ): BrevoServiceError {
    const errorMessage = this.extractErrorMessage(error)
    const errorType = this.getErrorType(error)
    
    // Determine if this is a retryable error
    const isRetryable = this.isRetryableError(error)
    const retryAfter = isRetryable ? this.getRetryDelay(error) : undefined

    // Log the error
    logger.error(
      `Brevo service error: ${errorMessage}`,
      'BREVO_SERVICE',
      {
        operation,
        errorType,
        isRetryable,
        retryAfter,
        fallbackEnabled
      },
      error instanceof Error ? error : undefined
    )

    // Track error metrics
    this.trackError(errorType, operation, 'brevo')

    // If fallback is enabled and this is a critical error, log fallback activation
    if (fallbackEnabled && this.isCriticalError(error)) {
      logger.warn(
        'Brevo service fallback activated due to critical error',
        'BREVO_FALLBACK',
        { operation, errorMessage }
      )
    }

    return new BrevoServiceError(errorMessage, { originalError: error }, retryAfter)
  }

  /**
   * Log successful newsletter operations for monitoring
   */
  static logSuccess(
    operation: string,
    context: Partial<NewsletterErrorContext>,
    metrics?: Record<string, any>
  ): void {
    logger.info(
      `Newsletter operation successful: ${operation}`,
      'NEWSLETTER_SUCCESS',
      {
        operation,
        email: context.email ? this.maskEmail(context.email) : undefined,
        subscriberId: context.subscriberId,
        source: context.source,
        ...metrics
      }
    )
  }

  /**
   * Extract user-friendly error message
   */
  private static extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message)
    }
    
    return 'An unexpected error occurred'
  }

  /**
   * Determine error type for categorization
   */
  private static getErrorType(error: unknown): string {
    if (error instanceof ValidationError) return 'validation'
    if (error instanceof BrevoServiceError) return 'brevo_service'
    if (error instanceof NewsletterServiceError) return 'newsletter_service'
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      if (message.includes('network') || message.includes('fetch')) return 'network'
      if (message.includes('timeout')) return 'timeout'
      if (message.includes('rate limit')) return 'rate_limit'
      if (message.includes('database') || message.includes('sql')) return 'database'
      if (message.includes('duplicate') || message.includes('already exists')) return 'duplicate'
    }
    return 'unknown'
  }

  /**
   * Check if error is retryable
   */
  private static isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('timeout') ||
             message.includes('network') ||
             message.includes('rate limit') ||
             message.includes('503') ||
             message.includes('502') ||
             message.includes('temporary')
    }
    return false
  }

  /**
   * Check if error is critical (requires fallback)
   */
  private static isCriticalError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('authentication') ||
             message.includes('unauthorized') ||
             message.includes('api key') ||
             message.includes('service unavailable')
    }
    return false
  }

  /**
   * Get retry delay based on error type
   */
  private static getRetryDelay(error: unknown): number {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      if (message.includes('rate limit')) return 300 // 5 minutes
      if (message.includes('timeout')) return 60 // 1 minute
      if (message.includes('503')) return 120 // 2 minutes
    }
    return 60 // Default 1 minute
  }

  /**
   * Track error metrics for monitoring
   */
  private static trackError(
    errorType: string,
    operation: string,
    source?: string
  ): void {
    this.errorMetrics.push({
      errorType,
      operation,
      source,
      timestamp: new Date().toISOString(),
      resolved: false
    })

    // Keep only last 1000 error metrics to prevent memory issues
    if (this.errorMetrics.length > 1000) {
      this.errorMetrics = this.errorMetrics.slice(-1000)
    }
  }

  /**
   * Get error metrics for monitoring dashboard
   */
  static getErrorMetrics(timeRange?: { from: string; to: string }): NewsletterErrorMetrics[] {
    let metrics = this.errorMetrics

    if (timeRange) {
      const fromDate = new Date(timeRange.from)
      const toDate = new Date(timeRange.to)
      
      metrics = metrics.filter(metric => {
        const metricDate = new Date(metric.timestamp)
        return metricDate >= fromDate && metricDate <= toDate
      })
    }

    return metrics
  }

  /**
   * Clear error metrics (for testing or maintenance)
   */
  static clearErrorMetrics(): void {
    this.errorMetrics = []
  }

  /**
   * Mask email for privacy in logs
   */
  private static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (!domain) return email
    
    const maskedLocal = localPart.length > 2 
      ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
      : localPart
    
    return `${maskedLocal}@${domain}`
  }

  /**
   * Mask IP address for privacy in logs
   */
  private static maskIpAddress(ip: string): string {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.* `
    }
    return ip.substring(0, Math.min(ip.length, 8)) + '*'.repeat(Math.max(0, ip.length - 8))
  }
}

/**
 * User-friendly error messages for different error types
 */
export const USER_FRIENDLY_ERRORS = {
  validation: {
    email_required: 'Please enter your email address.',
    email_invalid: 'Please enter a valid email address.',
    email_too_long: 'Email address is too long.',
    name_too_long: 'Name is too long. Please use 100 characters or less.',
    invalid_source: 'Invalid subscription source.',
  },
  duplicate: {
    already_subscribed: 'You are already subscribed to our newsletter!',
    email_exists: 'This email address is already subscribed.',
  },
  network: {
    connection_failed: 'Connection failed. Please check your internet connection and try again.',
    timeout: 'Request timed out. Please try again.',
    server_error: 'Server error. Please try again later.',
  },
  brevo_service: {
    service_unavailable: 'Email service is temporarily unavailable. Your subscription has been saved and will be processed shortly.',
    rate_limit: 'Too many requests. Please wait a moment and try again.',
    authentication_failed: 'Email service authentication failed. Please contact support.',
  },
  database: {
    connection_failed: 'Database connection failed. Please try again later.',
    query_failed: 'Database operation failed. Please try again.',
  },
  unsubscribe: {
    invalid_token: 'Invalid or expired unsubscribe link. Please contact support if you need help.',
    already_unsubscribed: 'You are already unsubscribed from our newsletter.',
    not_found: 'Subscription not found. You may already be unsubscribed.',
  },
  general: {
    unknown_error: 'An unexpected error occurred. Please try again later.',
    service_unavailable: 'Service is temporarily unavailable. Please try again later.',
  }
}

/**
 * Get user-friendly error message based on error type and code
 */
export function getUserFriendlyErrorMessage(
  errorType: string,
  errorCode?: string,
  fallbackMessage?: string
): string {
  const categoryMessages = USER_FRIENDLY_ERRORS[errorType as keyof typeof USER_FRIENDLY_ERRORS]
  
  if (categoryMessages && errorCode) {
    const specificMessage = categoryMessages[errorCode as keyof typeof categoryMessages]
    if (specificMessage) return specificMessage
  }
  
  if (fallbackMessage) return fallbackMessage
  
  return USER_FRIENDLY_ERRORS.general.unknown_error
}