import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { NewsletterErrorHandler, getUserFriendlyErrorMessage } from '@/lib/utils/newsletter-error-handler'
import { NewsletterMonitoring } from '@/lib/utils/newsletter-monitoring'
import { ValidationError } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'
import { withRateLimit } from '@/lib/security/rate-limiting'

/**
 * GET /api/newsletter/unsubscribe
 * Handle unsubscribe requests from email links
 * Redirects to unsubscribe confirmation page
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let token: string | undefined
  
  try {
    const { searchParams } = new URL(request.url)
    token = searchParams.get('token') || undefined
    
    // Extract client information for logging
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    // Enhanced token validation
    if (!token) {
      logger.warn('Unsubscribe attempt with missing token', 'NEWSLETTER_UNSUBSCRIBE', {
        userAgent,
        ipAddress: ipAddress ? ipAddress.split('.').slice(0, 2).join('.') + '.*.*' : undefined
      })
      
      return NextResponse.redirect(
        new URL('/unsubscribe?error=missing_token&message=' + 
               encodeURIComponent(getUserFriendlyErrorMessage('unsubscribe', 'invalid_token')), 
               request.url)
      )
    }

    if (typeof token !== 'string' || token.length < 10) {
      logger.warn('Unsubscribe attempt with invalid token format', 'NEWSLETTER_UNSUBSCRIBE', {
        tokenLength: token.length,
        userAgent,
        ipAddress: ipAddress ? ipAddress.split('.').slice(0, 2).join('.') + '.*.*' : undefined
      })
      
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token&message=' + 
               encodeURIComponent(getUserFriendlyErrorMessage('unsubscribe', 'invalid_token')), 
               request.url)
      )
    }

    // Validate token by checking if subscriber exists
    const subscriber = await NewsletterSubscribersService.getByUnsubscribeToken(token)
    
    if (!subscriber.data) {
      logger.warn('Unsubscribe attempt with non-existent token', 'NEWSLETTER_UNSUBSCRIBE', {
        tokenPrefix: token.substring(0, 8) + '...',
        userAgent,
        ipAddress: ipAddress ? ipAddress.split('.').slice(0, 2).join('.') + '.*.*' : undefined
      })
      
      return NextResponse.redirect(
        new URL('/unsubscribe?error=invalid_token&message=' + 
               encodeURIComponent(getUserFriendlyErrorMessage('unsubscribe', 'invalid_token')), 
               request.url)
      )
    }

    // Log successful token validation
    logger.info('Valid unsubscribe token accessed', 'NEWSLETTER_UNSUBSCRIBE', {
      subscriberId: subscriber.data.id,
      email: subscriber.data.email.split('@')[0].substring(0, 2) + '***@' + subscriber.data.email.split('@')[1],
      status: subscriber.data.status,
      duration: Date.now() - startTime
    })

    // Redirect to unsubscribe confirmation page with token
    return NextResponse.redirect(
      new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, request.url)
    )
  } catch (error) {
    // Enhanced error handling
    const errorContext = {
      operation: 'unsubscribe_token_validation',
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                undefined
    }

    NewsletterErrorHandler.handleUnsubscriptionError(error, errorContext)
    
    return NextResponse.redirect(
      new URL('/unsubscribe?error=server_error&message=' + 
             encodeURIComponent(getUserFriendlyErrorMessage('general', 'service_unavailable')), 
             request.url)
    )
  }
}

// Unsubscribe rate limit configuration
const unsubscribeRateLimit = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10, // Max 10 unsubscribe attempts per 5 minutes per IP
  message: 'Too many unsubscribe attempts. Please wait a few minutes before trying again.',
}

/**
 * POST /api/newsletter/unsubscribe
 * Process unsubscribe confirmations
 */
export const POST = withRateLimit(async (request: NextRequest) => {
  const startTime = Date.now()
  let token: string | undefined
  let subscriberEmail: string | undefined
  
  try {
    // Extract client information for logging
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    // Parse request body with enhanced error handling
    let body: { token?: string; confirmed?: boolean }
    try {
      const rawBody = await request.text()
      if (!rawBody.trim()) {
        throw new ValidationError('Request body is empty')
      }
      body = JSON.parse(rawBody)
    } catch (parseError) {
      if (parseError instanceof ValidationError) throw parseError
      throw new ValidationError('Invalid JSON in request body')
    }

    token = body.token
    const confirmed = body.confirmed

    // Enhanced validation
    if (!token) {
      throw new ValidationError('Missing unsubscribe token', { 
        field: 'token', 
        code: 'token_required' 
      })
    }

    if (typeof token !== 'string' || token.length < 10) {
      throw new ValidationError('Invalid unsubscribe token format', { 
        field: 'token', 
        code: 'token_invalid' 
      })
    }

    if (confirmed !== true) {
      throw new ValidationError('Unsubscribe not confirmed', { 
        field: 'confirmed', 
        code: 'confirmation_required' 
      })
    }

    // Get subscriber info before unsubscribing for logging
    const subscriber = await NewsletterSubscribersService.getByUnsubscribeToken(token)
    if (subscriber.data) {
      subscriberEmail = subscriber.data.email
    }

    // Process unsubscribe with enhanced error handling
    const result = await NewsletterSubscribersService.unsubscribeByToken(token)

    if (!result.success) {
      // Determine error type for user-friendly message
      let errorCode = 'unknown_error'
      if (result.error?.includes('Invalid') || result.error?.includes('expired')) {
        errorCode = 'invalid_token'
      } else if (result.error?.includes('already unsubscribed')) {
        errorCode = 'already_unsubscribed'
      } else if (result.error?.includes('not found')) {
        errorCode = 'not_found'
      }

      throw new ValidationError(
        getUserFriendlyErrorMessage('unsubscribe', errorCode, result.error),
        { code: errorCode, originalError: result.error }
      )
    }

    // Log successful unsubscription and record metrics
    NewsletterErrorHandler.logSuccess('unsubscription_completed', {
      email: subscriberEmail,
      subscriberId: subscriber.data?.id
    }, {
      duration: Date.now() - startTime,
      userAgent,
      ipAddress: ipAddress ? ipAddress.split('.').slice(0, 2).join('.') + '.*.*' : undefined
    })
    NewsletterMonitoring.recordUnsubscription()

    return NextResponse.json({
      success: true,
      message: result.message || 'Successfully unsubscribed from newsletter'
    })
    
  } catch (error) {
    // Enhanced error handling with context
    const errorContext = {
      operation: 'unsubscribe_confirmation',
      email: subscriberEmail,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                undefined
    }

    const handledError = NewsletterErrorHandler.handleUnsubscriptionError(error, errorContext)
    
    // Record failure metrics
    const errorType = error instanceof Error ? error.constructor.name : 'unknown'
    NewsletterMonitoring.recordUnsubscriptionFailure(errorType)
    
    // Return appropriate error response
    let statusCode = 500
    let errorMessage = handledError.message

    if (error instanceof ValidationError) {
      statusCode = 400
      if (error.details?.code) {
        errorMessage = getUserFriendlyErrorMessage('unsubscribe', error.details.code, errorMessage)
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        code: error instanceof ValidationError ? error.details?.code : 'internal_error'
      },
      { status: statusCode }
    )
  }
}, unsubscribeRateLimit)