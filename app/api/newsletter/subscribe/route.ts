import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { validateNewsletterSubscriberInput, sanitizeNewsletterSubscriberInput } from '@/lib/database/newsletter-validation'
import { handleApiError, createSuccessResponse, ValidationError, RateLimitError } from '@/lib/utils/error-handler'
import { NewsletterErrorHandler, getUserFriendlyErrorMessage } from '@/lib/utils/newsletter-error-handler'
import { NewsletterMonitoring } from '@/lib/utils/newsletter-monitoring'
import { logger } from '@/lib/utils/logger'
import { HomepageSubscriptionData } from '@/lib/database/types'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// Newsletter subscription rate limit configuration
const newsletterRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3, // Max 3 subscription attempts per 15 minutes per IP
  message: 'Too many subscription attempts. Please wait 15 minutes before trying again.',
}

export const POST = withRateLimit(async (request: NextRequest) => {
  const startTime = Date.now()
  let email: string | undefined
  let source: string | undefined
  
  try {
    // Extract client information for logging
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    // Parse request body with enhanced error handling
    let body: HomepageSubscriptionData
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

    // Extract email and source for logging
    email = body.email
    source = body.source || 'homepage'

    // Enhanced validation
    if (!body.email) {
      throw new ValidationError('Email is required', { field: 'email', code: 'email_required' })
    }

    if (typeof body.email !== 'string') {
      throw new ValidationError('Email must be a string', { field: 'email', code: 'email_invalid' })
    }

    if (body.email.length > 254) {
      throw new ValidationError('Email address is too long', { field: 'email', code: 'email_too_long' })
    }

    if (body.first_name && body.first_name.length > 100) {
      throw new ValidationError('First name is too long', { field: 'first_name', code: 'name_too_long' })
    }

    if (body.last_name && body.last_name.length > 100) {
      throw new ValidationError('Last name is too long', { field: 'last_name', code: 'name_too_long' })
    }

    // Prepare subscription data with defaults
    const subscriptionData = {
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      source: source,
      status: 'active' as const
    }

    // Validate the subscription data
    const validation = validateNewsletterSubscriberInput(subscriptionData)
    if (!validation.isValid) {
      throw new ValidationError('Validation failed', { 
        errors: validation.errors,
        code: 'validation_failed'
      })
    }

    // Sanitize the input
    const sanitizedData = sanitizeNewsletterSubscriberInput(subscriptionData)

    // Check if email already exists with enhanced error context
    const existingSubscriber = await NewsletterSubscribersService.getByEmail(sanitizedData.email)
    
    if (existingSubscriber.data) {
      // If subscriber exists and is active, return friendly message
      if (existingSubscriber.data.status === 'active') {
        // Log successful duplicate handling and record metrics
        NewsletterErrorHandler.logSuccess('duplicate_subscription_handled', {
          email: sanitizedData.email,
          source: sanitizedData.source
        })
        NewsletterMonitoring.recordSubscription(sanitizedData.source)

        return NextResponse.json(
          {
            success: true,
            message: getUserFriendlyErrorMessage('duplicate', 'already_subscribed'),
            subscriber: {
              id: existingSubscriber.data.id,
              email: existingSubscriber.data.email,
              status: existingSubscriber.data.status
            }
          },
          { 
            status: 200,
            headers: corsHeaders
          }
        )
      }
      
      // If subscriber exists but is unsubscribed, reactivate them
      if (existingSubscriber.data.status === 'unsubscribed') {
        const reactivateResult = await NewsletterSubscribersService.update(
          existingSubscriber.data.id,
          {
            status: 'active',
            unsubscribed_at: null,
            first_name: sanitizedData.first_name || existingSubscriber.data.first_name,
            last_name: sanitizedData.last_name || existingSubscriber.data.last_name,
            source: sanitizedData.source
          }
        )

        if (reactivateResult.error) {
          throw new Error(`Failed to reactivate subscription: ${reactivateResult.error}`)
        }

        // Log successful reactivation and record metrics
        NewsletterErrorHandler.logSuccess('subscription_reactivated', {
          email: sanitizedData.email,
          subscriberId: existingSubscriber.data.id,
          source: sanitizedData.source
        }, {
          duration: Date.now() - startTime
        })
        NewsletterMonitoring.recordSubscription(sanitizedData.source)

        return NextResponse.json(
          {
            success: true,
            message: 'Welcome back! Your newsletter subscription has been reactivated.',
            subscriber: {
              id: reactivateResult.data!.id,
              email: reactivateResult.data!.email,
              first_name: reactivateResult.data!.first_name,
              last_name: reactivateResult.data!.last_name,
              status: reactivateResult.data!.status,
              source: reactivateResult.data!.source
            }
          },
          { 
            status: 200,
            headers: corsHeaders
          }
        )
      }
    }

    // Create new subscriber with enhanced error handling
    const result = await NewsletterSubscribersService.create(sanitizedData)

    if (result.error) {
      throw new Error(`Failed to create subscription: ${result.error}`)
    }

    if (!result.data) {
      throw new Error('Failed to create subscription: No data returned')
    }

    // Sync new subscriber to Brevo (non-blocking)
    try {
      const { getBrevoService } = await import('@/lib/integrations/brevo')
      const brevoService = getBrevoService()
      const syncResult = await brevoService.syncSubscriber(result.data, true) // Enable fallback
      
      if (syncResult.success && syncResult.brevo_contact_id) {
        // Update subscriber with Brevo contact ID
        await NewsletterSubscribersService.update(result.data.id, {
          brevo_contact_id: syncResult.brevo_contact_id,
          last_synced_at: new Date().toISOString()
        })
        
        logger.info('New subscriber synced to Brevo', 'BREVO_SYNC', {
          subscriberId: result.data.id,
          brevoContactId: syncResult.brevo_contact_id
        })
      } else if (syncResult.fallback_used) {
        logger.warn('Brevo sync deferred for new subscriber', 'BREVO_SYNC', {
          subscriberId: result.data.id,
          error: syncResult.error
        })
      }
    } catch (syncError) {
      // Don't fail the subscription if Brevo sync fails
      logger.error('Failed to sync new subscriber to Brevo', 'BREVO_SYNC', {
        subscriberId: result.data.id,
        error: syncError instanceof Error ? syncError.message : 'Unknown error'
      })
    }

    // Log successful subscription and record metrics
    NewsletterErrorHandler.logSuccess('subscription_created', {
      email: sanitizedData.email,
      subscriberId: result.data.id,
      source: sanitizedData.source
    }, {
      duration: Date.now() - startTime,
      hasName: !!(sanitizedData.first_name || sanitizedData.last_name)
    })
    NewsletterMonitoring.recordSubscription(sanitizedData.source)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        subscriber: {
          id: result.data.id,
          email: result.data.email,
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          status: result.data.status,
          source: result.data.source,
          subscribed_at: result.data.subscribed_at
        }
      },
      { 
        status: 201,
        headers: corsHeaders
      }
    )

  } catch (error) {
    // Enhanced error handling with context
    const errorContext = {
      operation: 'newsletter_subscription',
      email,
      source,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                undefined
    }

    const handledError = NewsletterErrorHandler.handleSubscriptionError(error, errorContext)
    
    // Record failure metrics
    const errorType = error instanceof Error ? error.constructor.name : 'unknown'
    NewsletterMonitoring.recordSubscriptionFailure(source || 'unknown', errorType)
    
    // Return error response with CORS headers and user-friendly message
    const errorResponse = handleApiError(handledError)
    
    // Add CORS headers to error response
    const responseHeaders = new Headers(errorResponse.headers)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value)
    })

    return new NextResponse(errorResponse.body, {
      status: errorResponse.status,
      headers: responseHeaders
    })
  }
}, newsletterRateLimit)