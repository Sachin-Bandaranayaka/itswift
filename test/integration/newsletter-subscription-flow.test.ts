import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { BrevoService } from '@/lib/integrations/brevo'
import { NewsletterErrorHandler } from '@/lib/utils/newsletter-error-handler'
import { NewsletterMonitoring } from '@/lib/utils/newsletter-monitoring'

// Mock dependencies
vi.mock('@/lib/database/services/newsletter-subscribers')
vi.mock('@/lib/integrations/brevo')
vi.mock('@/lib/utils/newsletter-error-handler')
vi.mock('@/lib/utils/newsletter-monitoring')

const mockNewsletterSubscribersService = vi.mocked(NewsletterSubscribersService)
const mockBrevoService = vi.mocked(BrevoService)
const mockNewsletterErrorHandler = vi.mocked(NewsletterErrorHandler)
const mockNewsletterMonitoring = vi.mocked(NewsletterMonitoring)

describe('Newsletter Subscription Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    mockNewsletterErrorHandler.logSuccess = vi.fn()
    mockNewsletterErrorHandler.handleSubscriptionError = vi.fn()
    mockNewsletterErrorHandler.handleUnsubscriptionError = vi.fn()
    mockNewsletterMonitoring.recordSubscription = vi.fn()
    mockNewsletterMonitoring.recordUnsubscription = vi.fn()
    mockNewsletterMonitoring.recordSubscriptionFailure = vi.fn()
    mockNewsletterMonitoring.recordUnsubscriptionFailure = vi.fn()
  })

  describe('POST /api/newsletter/subscribe', () => {
    it('should successfully create new subscription', async () => {
      // Mock successful flow
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'token123'
        },
        error: null
      })

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          source: 'homepage'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully subscribed to newsletter!')
      expect(data.subscriber.email).toBe('test@example.com')
      expect(data.subscriber.first_name).toBe('John')
      expect(data.subscriber.last_name).toBe('Doe')
      expect(data.subscriber.status).toBe('active')
      expect(data.subscriber.source).toBe('homepage')

      // Verify service calls
      expect(mockNewsletterSubscribersService.getByEmail).toHaveBeenCalledWith('test@example.com')
      expect(mockNewsletterSubscribersService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        source: 'homepage',
        status: 'active'
      })

      // Verify monitoring calls
      expect(mockNewsletterErrorHandler.logSuccess).toHaveBeenCalledWith(
        'subscription_created',
        expect.objectContaining({
          email: 'test@example.com',
          subscriberId: '123',
          source: 'homepage'
        }),
        expect.any(Object)
      )
      expect(mockNewsletterMonitoring.recordSubscription).toHaveBeenCalledWith('homepage')
    })

    it('should handle duplicate active subscription gracefully', async () => {
      // Mock existing active subscriber
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: {
          id: '123',
          email: 'existing@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'existing@example.com'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('already subscribed')
      expect(data.subscriber.email).toBe('existing@example.com')
      expect(data.subscriber.status).toBe('active')

      // Should not create new subscription
      expect(mockNewsletterSubscribersService.create).not.toHaveBeenCalled()
    })

    it('should reactivate unsubscribed subscriber', async () => {
      // Mock existing unsubscribed subscriber
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: {
          id: '123',
          email: 'unsubscribed@example.com',
          status: 'unsubscribed' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribed_at: '2024-01-02T00:00:00Z'
        },
        error: null
      })

      mockNewsletterSubscribersService.update.mockResolvedValue({
        data: {
          id: '123',
          email: 'unsubscribed@example.com',
          first_name: 'Jane',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'unsubscribed@example.com',
          first_name: 'Jane'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Welcome back! Your newsletter subscription has been reactivated.')
      expect(data.subscriber.email).toBe('unsubscribed@example.com')
      expect(data.subscriber.status).toBe('active')

      // Verify update call
      expect(mockNewsletterSubscribersService.update).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({
          status: 'active',
          unsubscribed_at: null,
          first_name: 'Jane'
        })
      )
    })

    it('should validate email format and return error', async () => {
      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
      expect(data.details).toContain('Invalid email format')
    })

    it('should handle empty request body', async () => {
      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: ''
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should handle database service errors', async () => {
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: null,
        error: 'Database connection failed'
      })

      mockNewsletterErrorHandler.handleSubscriptionError.mockReturnValue(
        new Error('Database service temporarily unavailable')
      )

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Database service temporarily unavailable')

      // Verify error handling was called
      expect(mockNewsletterErrorHandler.handleSubscriptionError).toHaveBeenCalled()
      expect(mockNewsletterMonitoring.recordSubscriptionFailure).toHaveBeenCalled()
    })

    it('should include CORS headers in all responses', async () => {
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      })

      const response = await POST(request as any)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
    })
  })

  describe('GET /api/newsletter/unsubscribe', () => {
    it('should redirect to unsubscribe page with valid token', async () => {
      mockNewsletterSubscribersService.getByUnsubscribeToken.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'valid-token'
        },
        error: null
      })

      const { GET } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe?token=valid-token', {
        method: 'GET'
      })

      const response = await GET(request as any)

      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toContain('/unsubscribe?token=valid-token')
    })

    it('should redirect with error for missing token', async () => {
      const { GET } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'GET'
      })

      const response = await GET(request as any)

      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toContain('/unsubscribe?error=missing_token')
    })

    it('should redirect with error for invalid token', async () => {
      mockNewsletterSubscribersService.getByUnsubscribeToken.mockResolvedValue({
        data: null,
        error: null
      })

      const { GET } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe?token=invalid-token', {
        method: 'GET'
      })

      const response = await GET(request as any)

      expect(response.status).toBe(302)
      expect(response.headers.get('location')).toContain('/unsubscribe?error=invalid_token')
    })
  })

  describe('POST /api/newsletter/unsubscribe', () => {
    it('should successfully unsubscribe with valid token', async () => {
      mockNewsletterSubscribersService.getByUnsubscribeToken.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'valid-token'
        },
        error: null
      })

      mockNewsletterSubscribersService.unsubscribeByToken.mockResolvedValue({
        success: true,
        message: 'Successfully unsubscribed'
      })

      const { POST } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: true
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully unsubscribed')

      // Verify service calls
      expect(mockNewsletterSubscribersService.unsubscribeByToken).toHaveBeenCalledWith('valid-token')
      expect(mockNewsletterMonitoring.recordUnsubscription).toHaveBeenCalled()
    })

    it('should require confirmation', async () => {
      const { POST } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: false
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('confirmation_required')
    })

    it('should handle invalid token', async () => {
      mockNewsletterSubscribersService.unsubscribeByToken.mockResolvedValue({
        success: false,
        error: 'Invalid or expired token'
      })

      const { POST } = await import('@/app/api/newsletter/unsubscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'invalid-token',
          confirmed: true
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid or expired token')
    })
  })

  describe('OPTIONS /api/newsletter/subscribe', () => {
    it('should handle CORS preflight request', async () => {
      const { OPTIONS } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'OPTIONS'
      })

      const response = await OPTIONS(request as any)

      expect(response.status).toBe(200)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
      expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
    })
  })
})