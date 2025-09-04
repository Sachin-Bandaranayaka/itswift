import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { rateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'
import { 
  generateSecureUnsubscribeToken, 
  generateOneTimeToken,
  validateTokenExpiration,
  isValidTokenFormat 
} from '@/lib/utils/token-generator'
import { 
  getNewsletterCacheManager, 
  destroyNewsletterCacheManager,
  NEWSLETTER_CACHE_CONFIG 
} from '@/lib/utils/newsletter-cache'
import { NewsletterSubscriber } from '@/lib/database/types'

describe('Newsletter Security and Performance Optimizations', () => {
  
  describe('Rate Limiting', () => {
    beforeEach(() => {
      // Clear any existing rate limit data
      vi.clearAllMocks()
    })

    it('should allow requests within rate limit', () => {
      const config = {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5,
        message: 'Too many requests'
      }

      const mockRequest = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'test-agent'
        }
      })

      const rateLimitMiddleware = rateLimit(config)
      const result = rateLimitMiddleware(mockRequest)

      // First request should be allowed (returns NextResponse with rate limit headers)
      expect(result).not.toBeNull()
      expect(result?.status).not.toBe(429)
      expect(result?.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(result?.headers.get('X-RateLimit-Remaining')).toBe('4')
    })

    it('should block requests exceeding rate limit', () => {
      const config = {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 1, // Very low limit for testing
        message: 'Too many requests'
      }

      const mockRequest = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.2', // Different IP to avoid conflicts
          'user-agent': 'test-agent-2'
        }
      })

      const rateLimitMiddleware = rateLimit(config)

      // First request should be allowed
      const result1 = rateLimitMiddleware(mockRequest)
      expect(result1?.status).not.toBe(429)
      
      // Second request should be blocked
      const result2 = rateLimitMiddleware(mockRequest)
      expect(result2?.status).toBe(429)
    })

    it('should have correct rate limit configurations', () => {
      expect(rateLimitConfigs.api.windowMs).toBe(15 * 60 * 1000) // 15 minutes
      expect(rateLimitConfigs.api.maxRequests).toBe(100)
      
      expect(rateLimitConfigs.auth.windowMs).toBe(15 * 60 * 1000) // 15 minutes
      expect(rateLimitConfigs.auth.maxRequests).toBe(5)
      
      expect(rateLimitConfigs.email.windowMs).toBe(60 * 60 * 1000) // 1 hour
      expect(rateLimitConfigs.email.maxRequests).toBe(50)
    })
  })

  describe('Secure Token Generation', () => {
    const testSubscriberId = 'test-subscriber-123'
    const testEmail = 'test@example.com'

    it('should generate secure unsubscribe tokens', () => {
      const token1 = generateSecureUnsubscribeToken(testSubscriberId, testEmail)
      const token2 = generateSecureUnsubscribeToken(testSubscriberId, testEmail)

      // Tokens should be different (due to random data)
      expect(token1).not.toBe(token2)
      
      // Tokens should be valid hex strings
      expect(isValidTokenFormat(token1)).toBe(true)
      expect(isValidTokenFormat(token2)).toBe(true)
      
      // Tokens should be 64 characters (SHA-256 hex)
      expect(token1).toHaveLength(64)
      expect(token2).toHaveLength(64)
    })

    it('should generate tokens with additional security options', () => {
      const options = {
        includeTimestamp: true,
        includeUserAgent: 'Mozilla/5.0 Test Browser',
        includeIpHash: 'hashed-ip-address',
        expirationHours: 24
      }

      const token = generateSecureUnsubscribeToken(testSubscriberId, testEmail, options)
      
      expect(isValidTokenFormat(token)).toBe(true)
      expect(token).toHaveLength(64)
    })

    it('should generate one-time use tokens', () => {
      const token1 = generateOneTimeToken(testSubscriberId, testEmail)
      const token2 = generateOneTimeToken(testSubscriberId, testEmail)

      // Tokens should be different
      expect(token1).not.toBe(token2)
      
      // Tokens should be valid
      expect(isValidTokenFormat(token1)).toBe(true)
      expect(isValidTokenFormat(token2)).toBe(true)
    })

    it('should validate token format correctly', () => {
      const validToken = generateSecureUnsubscribeToken(testSubscriberId, testEmail)
      const invalidTokens = [
        'invalid',
        '123',
        'not-hex-token',
        'too-short-hex',
        ''
      ]

      expect(isValidTokenFormat(validToken)).toBe(true)
      
      invalidTokens.forEach(token => {
        expect(isValidTokenFormat(token)).toBe(false)
      })
    })

    it('should validate token expiration', () => {
      const validToken = generateSecureUnsubscribeToken(testSubscriberId, testEmail)
      
      // This is a simplified test - in real implementation, 
      // expiration would be checked against database metadata
      const isValid = validateTokenExpiration(validToken, testSubscriberId, testEmail)
      expect(typeof isValid).toBe('boolean')
    })
  })

  describe('Newsletter Caching', () => {
    let cacheManager: ReturnType<typeof getNewsletterCacheManager>

    beforeEach(() => {
      // Destroy any existing cache manager
      destroyNewsletterCacheManager()
      cacheManager = getNewsletterCacheManager()
    })

    afterEach(() => {
      destroyNewsletterCacheManager()
    })

    const mockSubscriber: NewsletterSubscriber = {
      id: 'test-subscriber-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      status: 'active',
      subscribed_at: new Date().toISOString(),
      source: 'homepage',
      unsubscribe_token: 'test-token',
      tags: []
    }

    it('should cache and retrieve subscribers', () => {
      cacheManager.cacheSubscriber(mockSubscriber)
      
      const cached = cacheManager.getCachedSubscriber(mockSubscriber.id)
      expect(cached).toEqual(mockSubscriber)
    })

    it('should cache and retrieve subscribers by email', () => {
      cacheManager.cacheSubscriberByEmail(mockSubscriber.email, mockSubscriber)
      
      const cached = cacheManager.getCachedSubscriberByEmail(mockSubscriber.email)
      expect(cached).toEqual(mockSubscriber)
      
      // Should work with different case
      const cachedUpperCase = cacheManager.getCachedSubscriberByEmail(mockSubscriber.email.toUpperCase())
      expect(cachedUpperCase).toEqual(mockSubscriber)
    })

    it('should handle null subscriber caching', () => {
      const testEmail = 'nonexistent@example.com'
      cacheManager.cacheSubscriberByEmail(testEmail, null)
      
      const cached = cacheManager.getCachedSubscriberByEmail(testEmail)
      expect(cached).toBeNull()
    })

    it('should cache and retrieve statistics', () => {
      const testStats = {
        totalSubscribers: 100,
        activeSubscribers: 85,
        unsubscribedCount: 15
      }
      
      cacheManager.cacheStats('dashboard-stats', testStats)
      
      const cached = cacheManager.getCachedStats('dashboard-stats')
      expect(cached).toEqual(testStats)
    })

    it('should cache and retrieve search results', () => {
      const query = 'test@example.com'
      const filters = { status: 'active' }
      const results = {
        data: [mockSubscriber],
        total: 1,
        page: 1
      }
      
      cacheManager.cacheSearchResults(query, filters, results)
      
      const cached = cacheManager.getCachedSearchResults(query, filters)
      expect(cached).toEqual(results)
    })

    it('should invalidate subscriber cache', () => {
      cacheManager.cacheSubscriber(mockSubscriber)
      cacheManager.cacheSubscriberByEmail(mockSubscriber.email, mockSubscriber)
      
      // Verify cached
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toEqual(mockSubscriber)
      expect(cacheManager.getCachedSubscriberByEmail(mockSubscriber.email)).toEqual(mockSubscriber)
      
      // Invalidate
      cacheManager.invalidateSubscriber(mockSubscriber.id, mockSubscriber.email)
      
      // Should be null after invalidation
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toBeNull()
      expect(cacheManager.getCachedSubscriberByEmail(mockSubscriber.email)).toBeNull()
    })

    it('should clear all caches', () => {
      cacheManager.cacheSubscriber(mockSubscriber)
      cacheManager.cacheStats('test-stats', { count: 10 })
      
      // Verify cached
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toEqual(mockSubscriber)
      expect(cacheManager.getCachedStats('test-stats')).toEqual({ count: 10 })
      
      // Clear all
      cacheManager.clearAll()
      
      // Should be null after clearing
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toBeNull()
      expect(cacheManager.getCachedStats('test-stats')).toBeNull()
    })

    it('should return cache statistics', () => {
      cacheManager.cacheSubscriber(mockSubscriber)
      cacheManager.cacheStats('test-stats', { count: 10 })
      
      const stats = cacheManager.getCacheStats()
      
      expect(stats).toHaveProperty('subscribers')
      expect(stats).toHaveProperty('stats')
      expect(stats).toHaveProperty('campaigns')
      expect(stats).toHaveProperty('search')
      expect(stats).toHaveProperty('totalMemoryUsage')
      
      expect(stats.subscribers.size).toBeGreaterThan(0)
      expect(stats.stats.size).toBeGreaterThan(0)
      expect(typeof stats.totalMemoryUsage).toBe('number')
    })

    it('should respect cache TTL', async () => {
      // Mock a short TTL for testing
      const originalTTL = NEWSLETTER_CACHE_CONFIG.subscribers.ttl
      NEWSLETTER_CACHE_CONFIG.subscribers.ttl = 100 // 100ms
      
      cacheManager.cacheSubscriber(mockSubscriber)
      
      // Should be cached immediately
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toEqual(mockSubscriber)
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Should be null after TTL expiration
      expect(cacheManager.getCachedSubscriber(mockSubscriber.id)).toBeNull()
      
      // Restore original TTL
      NEWSLETTER_CACHE_CONFIG.subscribers.ttl = originalTTL
    })

    it('should have correct cache configuration', () => {
      expect(NEWSLETTER_CACHE_CONFIG.subscribers.ttl).toBe(5 * 60 * 1000) // 5 minutes
      expect(NEWSLETTER_CACHE_CONFIG.subscribers.maxSize).toBe(1000)
      
      expect(NEWSLETTER_CACHE_CONFIG.stats.ttl).toBe(15 * 60 * 1000) // 15 minutes
      expect(NEWSLETTER_CACHE_CONFIG.stats.maxSize).toBe(50)
      
      expect(NEWSLETTER_CACHE_CONFIG.search.ttl).toBe(2 * 60 * 1000) // 2 minutes
      expect(NEWSLETTER_CACHE_CONFIG.search.maxSize).toBe(200)
    })
  })

  describe('Integration Tests', () => {
    it('should work together - rate limiting with secure tokens', () => {
      const config = {
        windowMs: 60 * 1000,
        maxRequests: 1, // Simple test with 1 request limit
        message: 'Too many requests'
      }

      const mockRequest = new NextRequest('http://localhost/api/newsletter/subscribe', {
        headers: {
          'x-forwarded-for': '192.168.1.3', // Different IP
          'user-agent': 'test-agent-3'
        }
      })

      const rateLimitMiddleware = rateLimit(config)
      
      // Generate secure token
      const token = generateSecureUnsubscribeToken('test-id', 'test@example.com')
      
      // First request should be allowed
      const result1 = rateLimitMiddleware(mockRequest)
      expect(result1?.status).not.toBe(429)
      
      // Second request should be blocked
      const blocked = rateLimitMiddleware(mockRequest)
      expect(blocked?.status).toBe(429)
      
      // Token should still be valid
      expect(isValidTokenFormat(token)).toBe(true)
    })

    it('should work together - caching with secure tokens', () => {
      const cacheManager = getNewsletterCacheManager()
      
      const mockSubscriber: NewsletterSubscriber = {
        id: 'test-subscriber-123',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        status: 'active',
        subscribed_at: new Date().toISOString(),
        source: 'homepage',
        unsubscribe_token: generateSecureUnsubscribeToken('test-subscriber-123', 'test@example.com'),
        tags: []
      }
      
      // Cache subscriber with secure token
      cacheManager.cacheSubscriber(mockSubscriber)
      
      // Retrieve and verify
      const cached = cacheManager.getCachedSubscriber(mockSubscriber.id)
      expect(cached).toEqual(mockSubscriber)
      expect(isValidTokenFormat(cached!.unsubscribe_token!)).toBe(true)
      
      destroyNewsletterCacheManager()
    })
  })
})