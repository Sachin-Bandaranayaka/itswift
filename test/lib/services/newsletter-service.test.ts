import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NewsletterService } from '@/lib/services/newsletter'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { BrevoService } from '@/lib/integrations/brevo'
import { NewsletterErrorHandler } from '@/lib/utils/newsletter-error-handler'

// Mock dependencies
vi.mock('@/lib/database/services/newsletter-subscribers')
vi.mock('@/lib/integrations/brevo')
vi.mock('@/lib/utils/newsletter-error-handler')

const mockNewsletterSubscribersService = vi.mocked(NewsletterSubscribersService)
const mockBrevoService = vi.mocked(BrevoService)
const mockNewsletterErrorHandler = vi.mocked(NewsletterErrorHandler)

describe('NewsletterService', () => {
  let newsletterService: NewsletterService
  let mockBrevoInstance: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockBrevoInstance = {
      syncSubscriber: vi.fn(),
      syncUnsubscribe: vi.fn(),
      createUnsubscribeLink: vi.fn(),
      sendBulkEmailWithUnsubscribe: vi.fn()
    }
    
    mockBrevoService.mockImplementation(() => mockBrevoInstance)
    newsletterService = new NewsletterService()
  })

  describe('subscribeFromHomepage', () => {
    it('should create subscription and sync with Brevo', async () => {
      const subscriptionData = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        source: 'homepage' as const
      }

      // Mock successful database creation
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

      // Mock successful Brevo sync
      mockBrevoInstance.syncSubscriber.mockResolvedValue({
        success: true,
        brevo_contact_id: '456'
      })

      const result = await newsletterService.subscribeFromHomepage(subscriptionData)

      expect(result.success).toBe(true)
      expect(result.data?.email).toBe('test@example.com')
      expect(mockNewsletterSubscribersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          source: 'homepage'
        })
      )
      expect(mockBrevoInstance.syncSubscriber).toHaveBeenCalled()
    })

    it('should handle Brevo sync failure gracefully', async () => {
      const subscriptionData = {
        email: 'test@example.com',
        source: 'homepage' as const
      }

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

      // Mock Brevo sync failure
      mockBrevoInstance.syncSubscriber.mockResolvedValue({
        success: false,
        error: 'Brevo API unavailable'
      })

      const result = await newsletterService.subscribeFromHomepage(subscriptionData)

      // Should still succeed locally
      expect(result.success).toBe(true)
      expect(result.data?.email).toBe('test@example.com')
    })

    it('should handle database creation failure', async () => {
      const subscriptionData = {
        email: 'test@example.com',
        source: 'homepage' as const
      }

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: null,
        error: 'Database connection failed'
      })

      const result = await newsletterService.subscribeFromHomepage(subscriptionData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database connection failed')
      expect(mockBrevoInstance.syncSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribeByToken', () => {
    it('should unsubscribe and sync with Brevo', async () => {
      const token = 'valid-token'
      const email = 'test@example.com'

      // Mock successful unsubscribe
      mockNewsletterSubscribersService.unsubscribeByToken.mockResolvedValue({
        success: true,
        message: 'Successfully unsubscribed',
        email: email
      })

      // Mock successful Brevo sync
      mockBrevoInstance.syncUnsubscribe.mockResolvedValue({
        success: true
      })

      const result = await newsletterService.unsubscribeByToken(token)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Successfully unsubscribed')
      expect(mockNewsletterSubscribersService.unsubscribeByToken).toHaveBeenCalledWith(token)
      expect(mockBrevoInstance.syncUnsubscribe).toHaveBeenCalledWith(email)
    })

    it('should handle invalid token', async () => {
      const token = 'invalid-token'

      mockNewsletterSubscribersService.unsubscribeByToken.mockResolvedValue({
        success: false,
        error: 'Invalid or expired token'
      })

      const result = await newsletterService.unsubscribeByToken(token)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid or expired token')
      expect(mockBrevoInstance.syncUnsubscribe).not.toHaveBeenCalled()
    })

    it('should handle Brevo sync failure during unsubscribe', async () => {
      const token = 'valid-token'
      const email = 'test@example.com'

      mockNewsletterSubscribersService.unsubscribeByToken.mockResolvedValue({
        success: true,
        message: 'Successfully unsubscribed',
        email: email
      })

      // Mock Brevo sync failure
      mockBrevoInstance.syncUnsubscribe.mockResolvedValue({
        success: false,
        error: 'Brevo API unavailable'
      })

      const result = await newsletterService.unsubscribeByToken(token)

      // Should still succeed locally
      expect(result.success).toBe(true)
      expect(result.message).toBe('Successfully unsubscribed')
    })
  })

  describe('generateUnsubscribeToken', () => {
    it('should generate secure unsubscribe token', async () => {
      const subscriberId = '123'

      mockNewsletterSubscribersService.generateUnsubscribeToken.mockResolvedValue('secure-token-123')

      const token = await newsletterService.generateUnsubscribeToken(subscriberId)

      expect(token).toBe('secure-token-123')
      expect(mockNewsletterSubscribersService.generateUnsubscribeToken).toHaveBeenCalledWith(subscriberId)
    })

    it('should handle token generation failure', async () => {
      const subscriberId = '123'

      mockNewsletterSubscribersService.generateUnsubscribeToken.mockRejectedValue(
        new Error('Token generation failed')
      )

      await expect(newsletterService.generateUnsubscribeToken(subscriberId))
        .rejects.toThrow('Token generation failed')
    })
  })

  describe('reactivateSubscriber', () => {
    it('should reactivate unsubscribed subscriber', async () => {
      const email = 'test@example.com'

      mockNewsletterSubscribersService.reactivateSubscriber.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      mockBrevoInstance.syncSubscriber.mockResolvedValue({
        success: true,
        brevo_contact_id: '456'
      })

      const result = await newsletterService.reactivateSubscriber(email)

      expect(result.success).toBe(true)
      expect(result.data?.email).toBe('test@example.com')
      expect(result.data?.status).toBe('active')
      expect(mockNewsletterSubscribersService.reactivateSubscriber).toHaveBeenCalledWith(email)
      expect(mockBrevoInstance.syncSubscriber).toHaveBeenCalled()
    })

    it('should handle subscriber not found', async () => {
      const email = 'nonexistent@example.com'

      mockNewsletterSubscribersService.reactivateSubscriber.mockResolvedValue({
        data: null,
        error: 'Subscriber not found'
      })

      const result = await newsletterService.reactivateSubscriber(email)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Subscriber not found')
      expect(mockBrevoInstance.syncSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('sendNewsletterCampaign', () => {
    it('should send newsletter to all active subscribers', async () => {
      const campaignData = {
        subject: 'Test Newsletter',
        htmlContent: '<p>Test content</p>',
        textContent: 'Test content'
      }

      const mockSubscribers = [
        {
          id: '1',
          email: 'user1@example.com',
          first_name: 'User',
          last_name: 'One',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'token1'
        },
        {
          id: '2',
          email: 'user2@example.com',
          first_name: 'User',
          last_name: 'Two',
          status: 'active' as const,
          source: 'admin' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'token2'
        }
      ]

      mockNewsletterSubscribersService.getAllActive.mockResolvedValue({
        data: mockSubscribers,
        error: null
      })

      mockBrevoInstance.createUnsubscribeLink
        .mockResolvedValueOnce('https://test.com/unsubscribe?token=token1')
        .mockResolvedValueOnce('https://test.com/unsubscribe?token=token2')

      mockBrevoInstance.sendBulkEmailWithUnsubscribe.mockResolvedValue({
        success: true,
        messageIds: ['msg1', 'msg2'],
        errors: [],
        recipientsBySource: { homepage: 1, admin: 1 }
      })

      const result = await newsletterService.sendNewsletterCampaign(campaignData)

      expect(result.success).toBe(true)
      expect(result.messageIds).toHaveLength(2)
      expect(result.recipientsBySource).toEqual({ homepage: 1, admin: 1 })
      expect(mockBrevoInstance.sendBulkEmailWithUnsubscribe).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            email: 'user1@example.com',
            unsubscribeUrl: 'https://test.com/unsubscribe?token=token1'
          }),
          expect.objectContaining({
            email: 'user2@example.com',
            unsubscribeUrl: 'https://test.com/unsubscribe?token=token2'
          })
        ]),
        'Test Newsletter',
        '<p>Test content</p>',
        'Test content'
      )
    })

    it('should handle no active subscribers', async () => {
      const campaignData = {
        subject: 'Test Newsletter',
        htmlContent: '<p>Test content</p>'
      }

      mockNewsletterSubscribersService.getAllActive.mockResolvedValue({
        data: [],
        error: null
      })

      const result = await newsletterService.sendNewsletterCampaign(campaignData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('No active subscribers found')
      expect(mockBrevoInstance.sendBulkEmailWithUnsubscribe).not.toHaveBeenCalled()
    })

    it('should handle email sending failures', async () => {
      const campaignData = {
        subject: 'Test Newsletter',
        htmlContent: '<p>Test content</p>'
      }

      const mockSubscribers = [
        {
          id: '1',
          email: 'user1@example.com',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z',
          unsubscribe_token: 'token1'
        }
      ]

      mockNewsletterSubscribersService.getAllActive.mockResolvedValue({
        data: mockSubscribers,
        error: null
      })

      mockBrevoInstance.createUnsubscribeLink.mockResolvedValue('https://test.com/unsubscribe?token=token1')

      mockBrevoInstance.sendBulkEmailWithUnsubscribe.mockResolvedValue({
        success: false,
        messageIds: [],
        errors: ['Failed to send to user1@example.com'],
        recipientsBySource: { homepage: 1 }
      })

      const result = await newsletterService.sendNewsletterCampaign(campaignData)

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Failed to send to user1@example.com')
    })
  })

  describe('Error Handling', () => {
    it('should handle service initialization errors', () => {
      // Mock Brevo service creation failure
      mockBrevoService.mockImplementation(() => {
        throw new Error('Brevo API key not configured')
      })

      expect(() => new NewsletterService()).toThrow('Brevo API key not configured')
    })

    it('should log errors appropriately', async () => {
      const subscriptionData = {
        email: 'test@example.com',
        source: 'homepage' as const
      }

      mockNewsletterSubscribersService.create.mockRejectedValue(new Error('Database error'))
      mockNewsletterErrorHandler.handleSubscriptionError = vi.fn().mockReturnValue(
        new Error('Handled database error')
      )

      const result = await newsletterService.subscribeFromHomepage(subscriptionData)

      expect(result.success).toBe(false)
      expect(mockNewsletterErrorHandler.handleSubscriptionError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          operation: 'subscription_creation',
          email: 'test@example.com'
        })
      )
    })
  })
})