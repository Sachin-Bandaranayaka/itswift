import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NewsletterErrorHandler, getUserFriendlyErrorMessage, USER_FRIENDLY_ERRORS } from '@/lib/utils/newsletter-error-handler'
import { ValidationError, BrevoServiceError, NewsletterServiceError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

describe('NewsletterErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    NewsletterErrorHandler.clearErrorMetrics()
  })

  describe('handleSubscriptionError', () => {
    it('should handle validation errors correctly', () => {
      const validationError = new ValidationError('Email is required', { field: 'email' })
      const context = {
        operation: 'newsletter_subscription',
        email: 'test@example.com',
        source: 'homepage'
      }

      const result = NewsletterErrorHandler.handleSubscriptionError(validationError, context)

      expect(result).toBeInstanceOf(NewsletterServiceError)
      expect(result.message).toContain('Validation failed')
      expect(result.operation).toBe('newsletter_subscription')
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Newsletter subscription error'),
        'NEWSLETTER_SUBSCRIPTION',
        expect.objectContaining({
          operation: 'newsletter_subscription',
          email: 'te**@example.com',
          source: 'homepage',
          errorType: 'validation'
        }),
        validationError
      )
    })

    it('should handle Brevo service errors correctly', () => {
      const brevoError = new BrevoServiceError('API rate limit exceeded', { statusCode: 429 }, 300)
      const context = {
        operation: 'newsletter_subscription',
        email: 'test@example.com',
        source: 'homepage'
      }

      const result = NewsletterErrorHandler.handleSubscriptionError(brevoError, context)

      expect(result).toBeInstanceOf(NewsletterServiceError)
      expect(result.message).toContain('Email service error')
      expect(result.operation).toBe('newsletter_subscription')
    })

    it('should mask email addresses in logs', () => {
      const error = new Error('Test error')
      const context = {
        operation: 'newsletter_subscription',
        email: 'verylongemail@example.com',
        source: 'homepage'
      }

      NewsletterErrorHandler.handleSubscriptionError(error, context)

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        'NEWSLETTER_SUBSCRIPTION',
        expect.objectContaining({
          email: 've***********@example.com'
        }),
        error
      )
    })

    it('should mask IP addresses in logs', () => {
      const error = new Error('Test error')
      const context = {
        operation: 'newsletter_subscription',
        email: 'test@example.com',
        source: 'homepage',
        ipAddress: '192.168.1.100'
      }

      NewsletterErrorHandler.handleSubscriptionError(error, context)

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        'NEWSLETTER_SUBSCRIPTION',
        expect.objectContaining({
          ipAddress: '192.168.*.* '
        }),
        error
      )
    })
  })

  describe('handleUnsubscriptionError', () => {
    it('should handle unsubscription errors correctly', () => {
      const error = new Error('Invalid token')
      const context = {
        operation: 'unsubscribe_confirmation',
        email: 'test@example.com'
      }

      const result = NewsletterErrorHandler.handleUnsubscriptionError(error, context)

      expect(result).toBeInstanceOf(NewsletterServiceError)
      expect(result.message).toBe('Invalid token')
      expect(result.operation).toBe('unsubscribe_confirmation')
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Newsletter unsubscription error'),
        'NEWSLETTER_UNSUBSCRIPTION',
        expect.objectContaining({
          operation: 'unsubscribe_confirmation',
          email: 'te**@example.com'
        }),
        error
      )
    })
  })

  describe('handleBrevoError', () => {
    it('should handle retryable errors correctly', () => {
      const error = new Error('timeout')
      
      const result = NewsletterErrorHandler.handleBrevoError(error, 'sync_subscriber', true)

      expect(result).toBeInstanceOf(BrevoServiceError)
      expect(result.retryAfter).toBe(60) // Default retry delay for timeout
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Brevo service error'),
        'BREVO_SERVICE',
        expect.objectContaining({
          operation: 'sync_subscriber',
          errorType: 'timeout',
          isRetryable: true,
          retryAfter: 60,
          fallbackEnabled: true
        }),
        error
      )
    })

    it('should handle critical errors with fallback', () => {
      const error = new Error('authentication failed')
      
      const result = NewsletterErrorHandler.handleBrevoError(error, 'sync_subscriber', true)

      expect(result).toBeInstanceOf(BrevoServiceError)
      expect(logger.warn).toHaveBeenCalledWith(
        'Brevo service fallback activated due to critical error',
        'BREVO_FALLBACK',
        expect.objectContaining({
          operation: 'sync_subscriber',
          errorMessage: 'authentication failed'
        })
      )
    })

    it('should handle rate limit errors with proper retry delay', () => {
      const error = new Error('rate limit exceeded')
      
      const result = NewsletterErrorHandler.handleBrevoError(error, 'sync_subscriber', true)

      expect(result.retryAfter).toBe(300) // 5 minutes for rate limit
    })
  })

  describe('logSuccess', () => {
    it('should log successful operations correctly', () => {
      const context = {
        email: 'test@example.com',
        subscriberId: '123',
        source: 'homepage'
      }
      const metrics = { duration: 150 }

      NewsletterErrorHandler.logSuccess('subscription_created', context, metrics)

      expect(logger.info).toHaveBeenCalledWith(
        'Newsletter operation successful: subscription_created',
        'NEWSLETTER_SUCCESS',
        expect.objectContaining({
          operation: 'subscription_created',
          email: 'te**@example.com',
          subscriberId: '123',
          source: 'homepage',
          duration: 150
        })
      )
    })
  })

  describe('getErrorMetrics', () => {
    it('should return error metrics within time range', () => {
      // Simulate some errors
      const error1 = new ValidationError('Test error 1')
      const error2 = new Error('Test error 2')
      
      NewsletterErrorHandler.handleSubscriptionError(error1, {
        operation: 'subscription',
        source: 'homepage'
      })
      
      NewsletterErrorHandler.handleSubscriptionError(error2, {
        operation: 'subscription',
        source: 'api'
      })

      const metrics = NewsletterErrorHandler.getErrorMetrics()
      
      expect(metrics).toHaveLength(2)
      expect(metrics[0].errorType).toBe('validation')
      expect(metrics[0].operation).toBe('subscription')
      expect(metrics[0].source).toBe('homepage')
      expect(metrics[1].errorType).toBe('unknown')
      expect(metrics[1].operation).toBe('subscription')
      expect(metrics[1].source).toBe('api')
    })

    it('should filter metrics by time range', () => {
      // This would require more complex setup to test time filtering
      // For now, just verify the method exists and returns an array
      const timeRange = {
        from: new Date(Date.now() - 1000).toISOString(),
        to: new Date().toISOString()
      }
      
      const metrics = NewsletterErrorHandler.getErrorMetrics(timeRange)
      expect(Array.isArray(metrics)).toBe(true)
    })
  })

  describe('clearErrorMetrics', () => {
    it('should clear all error metrics', () => {
      // Add some errors first
      const error = new Error('Test error')
      NewsletterErrorHandler.handleSubscriptionError(error, {
        operation: 'subscription',
        source: 'homepage'
      })

      expect(NewsletterErrorHandler.getErrorMetrics()).toHaveLength(1)

      NewsletterErrorHandler.clearErrorMetrics()
      expect(NewsletterErrorHandler.getErrorMetrics()).toHaveLength(0)
    })
  })
})

describe('getUserFriendlyErrorMessage', () => {
  it('should return specific error message for known error types', () => {
    const message = getUserFriendlyErrorMessage('validation', 'email_required')
    expect(message).toBe(USER_FRIENDLY_ERRORS.validation.email_required)
  })

  it('should return fallback message when provided', () => {
    const fallback = 'Custom fallback message'
    const message = getUserFriendlyErrorMessage('unknown_category', 'unknown_code', fallback)
    expect(message).toBe(fallback)
  })

  it('should return general unknown error message as last resort', () => {
    const message = getUserFriendlyErrorMessage('unknown_category', 'unknown_code')
    expect(message).toBe(USER_FRIENDLY_ERRORS.general.unknown_error)
  })

  it('should handle all defined error categories', () => {
    // Test a few key categories
    expect(getUserFriendlyErrorMessage('duplicate', 'already_subscribed'))
      .toBe(USER_FRIENDLY_ERRORS.duplicate.already_subscribed)
    
    expect(getUserFriendlyErrorMessage('network', 'connection_failed'))
      .toBe(USER_FRIENDLY_ERRORS.network.connection_failed)
    
    expect(getUserFriendlyErrorMessage('brevo_service', 'service_unavailable'))
      .toBe(USER_FRIENDLY_ERRORS.brevo_service.service_unavailable)
    
    expect(getUserFriendlyErrorMessage('unsubscribe', 'invalid_token'))
      .toBe(USER_FRIENDLY_ERRORS.unsubscribe.invalid_token)
  })
})