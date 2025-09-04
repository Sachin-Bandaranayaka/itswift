import { describe, it, expect } from 'vitest'
import { generateUnsubscribeToken } from '../../../lib/utils/token-generator'

describe('Newsletter Subscribers Service - New Methods', () => {
  describe('Token Generation', () => {
    it('should generate unsubscribe tokens', () => {
      const subscriberId = 'test-subscriber-id'
      const email = 'test@example.com'
      
      const token1 = generateUnsubscribeToken(subscriberId, email)
      const token2 = generateUnsubscribeToken(subscriberId, email)
      
      // Tokens should be strings
      expect(typeof token1).toBe('string')
      expect(typeof token2).toBe('string')
      
      // Tokens should be different (due to timestamp and random data)
      expect(token1).not.toBe(token2)
      
      // Tokens should be hex strings of expected length
      expect(token1).toMatch(/^[a-f0-9]{64}$/i)
      expect(token2).toMatch(/^[a-f0-9]{64}$/i)
    })

    it('should generate different tokens for different subscribers', () => {
      const email = 'test@example.com'
      const token1 = generateUnsubscribeToken('subscriber1', email)
      const token2 = generateUnsubscribeToken('subscriber2', email)
      
      expect(token1).not.toBe(token2)
    })

    it('should generate different tokens for different emails', () => {
      const subscriberId = 'test-subscriber-id'
      const token1 = generateUnsubscribeToken(subscriberId, 'test1@example.com')
      const token2 = generateUnsubscribeToken(subscriberId, 'test2@example.com')
      
      expect(token1).not.toBe(token2)
    })
  })

  describe('Method Signatures', () => {
    it('should have the required static methods on NewsletterSubscribersService', async () => {
      // Import the service
      const { NewsletterSubscribersService } = await import('../../../lib/database/services/newsletter-subscribers')
      
      // Check that the new methods exist
      expect(typeof NewsletterSubscribersService.subscribeFromHomepage).toBe('function')
      expect(typeof NewsletterSubscribersService.generateUnsubscribeToken).toBe('function')
      expect(typeof NewsletterSubscribersService.reactivateSubscriber).toBe('function')
      expect(typeof NewsletterSubscribersService.unsubscribeByToken).toBe('function')
      expect(typeof NewsletterSubscribersService.getByUnsubscribeToken).toBe('function')
    })
  })
})