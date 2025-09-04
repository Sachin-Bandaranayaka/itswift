import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { BrevoService, getBrevoService } from '@/lib/integrations/brevo'
import { NewsletterSubscriber } from '@/lib/database/types'
import { NewsletterErrorHandler } from '@/lib/utils/newsletter-error-handler'
import { BrevoServiceError } from '@/lib/utils/error-handler'

// Mock dependencies
vi.mock('@/lib/utils/newsletter-error-handler')
vi.mock('@/lib/integrations/brevo-helpers')

const mockNewsletterErrorHandler = vi.mocked(NewsletterErrorHandler)

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    BREVO_API_KEY: 'test-api-key',
    BREVO_DEFAULT_LIST_ID: '1',
    NEXT_PUBLIC_APP_URL: 'https://test.com',
    BREVO_RETRY_ATTEMPTS: '2',
    BREVO_RETRY_DELAY: '10'
  }
  vi.clearAllMocks()
})

afterEach(() => {
  process.env = originalEnv
  vi.resetModules()
})

describe('BrevoService', () => {
  let brevoService: BrevoService
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
    
    brevoService = new BrevoService({
      apiKey: 'test-api-key',
      retryAttempts: 2,
      retryDelay: 10
    })

    // Setup default error handler mocks
    mockNewsletterErrorHandler.handleBrevoError = vi.fn().mockReturnValue({
      message: 'Handled error',
      retryAfter: undefined
    })
  })

  describe('syncSubscriber', () => {
    const mockSubscriber: NewsletterSubscriber = {
      id: '123',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      status: 'active',
      subscribed_at: '2024-01-01T00:00:00Z',
      source: 'homepage',
      unsubscribe_token: 'token123'
    }

    it('should successfully sync new subscriber', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 456 })
      })

      const result = await brevoService.syncSubscriber(mockSubscriber)

      expect(result.success).toBe(true)
      expect(result.brevo_contact_id).toBe('456')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'api-key': 'test-api-key',
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('"email":"test@example.com"')
        })
      )
    })
  })
}) 
   it('should handle duplicate contact by updating', async () => {
      // First call returns duplicate error
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ code: 'duplicate_parameter' })
        })
        // Update call succeeds
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({})
        })
        // Get contact call returns contact info
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 789, email: 'test@example.com' })
        })

      const result = await brevoService.syncSubscriber(mockSubscriber)

      expect(result.success).toBe(true)
      expect(result.brevo_contact_id).toBe('789')
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('should handle rate limiting with retry after', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '300']]),
        json: async () => ({ message: 'Rate limit exceeded' })
      })

      mockNewsletterErrorHandler.handleBrevoError.mockReturnValue({
        message: 'Rate limit exceeded',
        retryAfter: 300
      })

      const result = await brevoService.syncSubscriber(mockSubscriber)

      expect(result.success).toBe(false)
      expect(result.retry_after).toBe(300)
      expect(result.error).toContain('Rate limit exceeded')
    })

    it('should use fallback mode when enabled', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      // Mock critical error detection
      const originalIsCriticalError = brevoService['isCriticalError']
      brevoService['isCriticalError'] = vi.fn().mockReturnValue(true)

      const result = await brevoService.syncSubscriber(mockSubscriber, true)

      expect(result.success).toBe(true)
      expect(result.fallback_used).toBe(true)
      expect(result.error).toContain('Brevo sync deferred')

      // Restore original method
      brevoService['isCriticalError'] = originalIsCriticalError
    })

    it('should retry on network failures', async () => {
      // First call fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 456 })
        })

      const result = await brevoService.syncSubscriber(mockSubscriber)

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid API key' })
      })

      mockNewsletterErrorHandler.handleBrevoError.mockReturnValue({
        message: 'Authentication failed',
        retryAfter: undefined
      })

      const result = await brevoService.syncSubscriber(mockSubscriber)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication failed')
    })
  })

  describe('syncUnsubscribe', () => {
    it('should successfully sync unsubscribe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })

      const result = await brevoService.syncUnsubscribe('test@example.com')

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts/test%40example.com',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"listIds":[]')
        })
      )
    })

    it('should handle contact not found as success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Contact not found' })
      })

      const result = await brevoService.syncUnsubscribe('test@example.com')

      expect(result.success).toBe(true)
    })

    it('should use fallback mode for unsubscribe failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await brevoService.syncUnsubscribe('test@example.com', true)

      expect(result.success).toBe(true)
      expect(result.fallback_used).toBe(true)
      expect(result.error).toContain('Brevo unsubscribe sync deferred')
    })
  })

  describe('createUnsubscribeLink', () => {
    it('should create unsubscribe link with token', async () => {
      // Mock getSubscriberByEmail to return subscriber with token
      const mockGetSubscriberByEmail = vi.fn().mockResolvedValue({
        unsubscribe_token: 'test-token'
      })
      brevoService['getSubscriberByEmail'] = mockGetSubscriberByEmail

      const link = await brevoService.createUnsubscribeLink('test@example.com')

      expect(link).toBe('https://test.com/unsubscribe?token=test-token')
    })

    it('should create unsubscribe link with campaign ID', async () => {
      const mockGetSubscriberByEmail = vi.fn().mockResolvedValue({
        unsubscribe_token: 'test-token'
      })
      brevoService['getSubscriberByEmail'] = mockGetSubscriberByEmail

      const link = await brevoService.createUnsubscribeLink('test@example.com', 'campaign123')

      expect(link).toBe('https://test.com/unsubscribe?token=test-token&campaign=campaign123')
    })

    it('should fallback to email-based link when subscriber not found', async () => {
      const mockGetSubscriberByEmail = vi.fn().mockResolvedValue(null)
      brevoService['getSubscriberByEmail'] = mockGetSubscriberByEmail

      const link = await brevoService.createUnsubscribeLink('test@example.com')

      expect(link).toBe('https://test.com/unsubscribe?email=test%40example.com')
    })
  })

  describe('sendEmail', () => {
    it('should send transactional email successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messageId: 'msg123' })
      })

      const result = await brevoService.sendEmail({
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test content</p>'
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('msg123')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"subject":"Test Subject"')
        })
      )
    })

    it('should handle email sending failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid recipient' })
      })

      const result = await brevoService.sendEmail({
        to: [{ email: 'invalid-email', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test content</p>'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid recipient')
    })
  })

  describe('sendBulkEmail', () => {
    it('should send bulk emails in batches', async () => {
      // Create 75 recipients to test batching (should create 2 batches of 50 and 25)
      const recipients = Array.from({ length: 75 }, (_, i) => ({
        email: `test${i}@example.com`,
        name: `Test User ${i}`
      }))

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ messageId: 'msg123' })
      })

      const result = await brevoService.sendBulkEmail(
        recipients,
        'Test Subject',
        '<p>Test content</p>'
      )

      expect(result.success).toBe(true)
      expect(result.messageIds).toHaveLength(2) // 2 batches
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should handle partial failures in bulk sending', async () => {
      const recipients = [
        { email: 'test1@example.com', name: 'Test User 1' },
        { email: 'test2@example.com', name: 'Test User 2' }
      ]

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ messageId: 'msg123' })
        })
        .mockRejectedValueOnce(new Error('Network error'))

      const result = await brevoService.sendBulkEmail(
        recipients,
        'Test Subject',
        '<p>Test content</p>'
      )

      expect(result.success).toBe(false)
      expect(result.messageIds).toHaveLength(1)
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('testConnection', () => {
    it('should test API connection successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ email: 'test@brevo.com' })
      })

      const result = await brevoService.testConnection()

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/account',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'api-key': 'test-api-key'
          })
        })
      )
    })

    it('should handle connection failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid API key' })
      })

      const result = await brevoService.testConnection()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid API key')
    })
  })
})

describe('getBrevoService', () => {
  it('should create singleton instance', () => {
    const service1 = getBrevoService()
    const service2 = getBrevoService()
    
    expect(service1).toBe(service2)
    expect(service1).toBeInstanceOf(BrevoService)
  })

  it('should throw error when API key is missing', () => {
    delete process.env.BREVO_API_KEY
    
    expect(() => getBrevoService()).toThrow('BREVO_API_KEY environment variable is required')
  })

  it('should use environment configuration', () => {
    process.env.BREVO_RETRY_ATTEMPTS = '5'
    process.env.BREVO_RETRY_DELAY = '2000'
    
    const service = getBrevoService()
    expect(service).toBeInstanceOf(BrevoService)
  })
})