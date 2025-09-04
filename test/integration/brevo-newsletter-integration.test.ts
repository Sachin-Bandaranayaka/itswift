// Integration tests for Brevo service with newsletter subscribers

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { BrevoService, getBrevoService } from '../../lib/integrations/brevo'
import { NewsletterSubscriber } from '../../lib/database/types'

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    BREVO_API_KEY: 'test-api-key',
    BREVO_DEFAULT_LIST_ID: '1',
    NEXT_PUBLIC_APP_URL: 'https://test.com'
  }
})

afterEach(() => {
  process.env = originalEnv
  vi.clearAllMocks()
})

describe('Brevo Newsletter Integration', () => {
  describe('getBrevoService', () => {
    it('should create a singleton instance with environment configuration', () => {
      const service1 = getBrevoService()
      const service2 = getBrevoService()
      
      expect(service1).toBe(service2) // Should be the same instance
      expect(service1).toBeInstanceOf(BrevoService)
    })

    it('should throw error when BREVO_API_KEY is missing', () => {
      delete process.env.BREVO_API_KEY
      
      // Reset the module to clear the singleton
      vi.resetModules()
      
      expect(() => getBrevoService()).toThrow('BREVO_API_KEY environment variable is required')
    })

    it('should use environment variables for configuration', () => {
      process.env.BREVO_RETRY_ATTEMPTS = '5'
      process.env.BREVO_RETRY_DELAY = '2000'
      
      // Reset singleton to pick up new env vars
      vi.resetModules()
      
      const service = getBrevoService()
      expect(service).toBeInstanceOf(BrevoService)
    })
  })

  describe('Newsletter Subscriber Sync Workflow', () => {
    let brevoService: BrevoService
    let mockFetch: any

    beforeEach(() => {
      mockFetch = vi.fn()
      global.fetch = mockFetch
      
      brevoService = new BrevoService({
        apiKey: 'test-api-key',
        retryAttempts: 1,
        retryDelay: 10
      })
    })

    it('should handle complete subscriber sync workflow', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage',
        unsubscribe_token: 'token123'
      }

      // Mock successful sync
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 456 })
      })

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(true)
      expect(syncResult.brevo_contact_id).toBe('456')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"email":"test@example.com"')
        })
      )
    })

    it('should handle subscriber unsubscribe workflow', async () => {
      // Mock successful unsubscribe sync
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })

      const unsubscribeResult = await brevoService.syncUnsubscribe('test@example.com')

      expect(unsubscribeResult.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts/test%40example.com',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"listIds":[]')
        })
      )
    })

    it('should create unsubscribe links for email campaigns', async () => {
      const unsubscribeLink = await brevoService.createUnsubscribeLink('test@example.com')
      
      expect(unsubscribeLink).toMatch(/^https:\/\/test\.com\/unsubscribe\?/)
      expect(unsubscribeLink).toContain('test%40example.com')
    })

    it('should handle sync failures gracefully', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage'
      }

      // Mock API failure
      mockFetch.mockRejectedValue(new Error('API Error'))

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(false)
      expect(syncResult.error).toContain('API Error')
    })

    it('should handle rate limiting with retry suggestions', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage'
      }

      // Mock rate limit error
      mockFetch.mockRejectedValue(new Error('Rate limit exceeded'))

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(false)
      expect(syncResult.error).toContain('Rate limit exceeded')
      expect(syncResult.retry_after).toBe(300) // 5 minutes
    })
  })

  describe('Error Handling and Resilience', () => {
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
    })

    it('should retry on network failures', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage'
      }

      // First call fails, second succeeds
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 456 })
        })

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should handle duplicate contacts by updating', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage'
      }

      // Mock duplicate error, then successful update, then get contact
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ code: 'duplicate_parameter' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({})
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 789, email: 'test@example.com' })
        })

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(true)
      expect(syncResult.brevo_contact_id).toBe('789')
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('should provide meaningful error messages', async () => {
      const subscriber: NewsletterSubscriber = {
        id: '123',
        email: 'invalid-email',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        source: 'homepage'
      }

      // Mock all retry attempts to return the same error response
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid email format' })
      })

      const syncResult = await brevoService.syncSubscriber(subscriber)

      expect(syncResult.success).toBe(false)
      expect(syncResult.error).toContain('Invalid email format')
    })
  })
})