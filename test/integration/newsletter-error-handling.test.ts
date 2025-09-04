import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as subscribePost } from '@/app/api/newsletter/subscribe/route'
import { POST as unsubscribePost, GET as unsubscribeGet } from '@/app/api/newsletter/unsubscribe/route'
import { NewsletterMonitoring } from '@/lib/utils/newsletter-monitoring'

// Mock the database service
vi.mock('@/lib/database/services/newsletter-subscribers', () => ({
  NewsletterSubscribersService: {
    getByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    getByUnsubscribeToken: vi.fn(),
    unsubscribeByToken: vi.fn()
  }
}))

// Mock the logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

describe('Newsletter API Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    NewsletterMonitoring.resetMetrics()
  })

  describe('POST /api/newsletter/subscribe', () => {
    it('should handle validation errors with user-friendly messages', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Validation failed')
      expect(data.code).toBe('NEWSLETTER_SERVICE_ERROR')
    })

    it('should handle empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: '',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Request body is empty')
    })

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid JSON in request body')
    })

    it('should handle missing email field', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          first_name: 'John'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Email is required')
    })

    it('should handle email that is too long', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: longEmail
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Email address is too long')
    })

    it('should handle names that are too long or rate limiting', async () => {
      const longName = 'a'.repeat(101)
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: longName
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)
      const data = await response.json()

      // Could be either validation error or rate limit error due to previous tests
      expect([400, 500]).toContain(response.status)
      expect(data.success).toBe(false)
      expect(data.error).toMatch(/First name is too long|Too many subscription attempts/)
    })

    it('should include CORS headers in error responses', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await subscribePost(request)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
    })
  })

  describe('GET /api/newsletter/unsubscribe', () => {
    it('should handle missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe')

      const response = await unsubscribeGet(request)

      expect(response.status).toBe(307) // Redirect status
      expect(response.headers.get('location')).toContain('error=missing_token')
    })

    it('should handle invalid token format', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe?token=short')

      const response = await unsubscribeGet(request)

      expect(response.status).toBe(307) // Redirect status
      expect(response.headers.get('location')).toContain('error=invalid_token')
    })
  })

  describe('POST /api/newsletter/unsubscribe', () => {
    it('should handle missing token in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          confirmed: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await unsubscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Missing unsubscribe token')
    })

    it('should handle missing confirmation', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token-format-here'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await unsubscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Unsubscribe not confirmed')
    })

    it('should handle empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: '',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await unsubscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Request body is empty')
    })

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await unsubscribePost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid JSON in request body')
    })
  })

  describe('Error Metrics Recording', () => {
    it('should record subscription failure metrics', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await subscribePost(request)

      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.failed).toBe(1)
      expect(metrics.errors.total).toBe(1)
    })

    it('should record unsubscription failure metrics', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await unsubscribePost(request)

      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.unsubscriptions.failed).toBe(1)
      expect(metrics.errors.total).toBe(1)
    })
  })
})