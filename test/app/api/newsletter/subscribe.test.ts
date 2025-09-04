import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST, OPTIONS } from '@/app/api/newsletter/subscribe/route'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { NextRequest } from 'next/server'

// Mock the newsletter subscribers service
vi.mock('@/lib/database/services/newsletter-subscribers')

const mockNewsletterSubscribersService = vi.mocked(NewsletterSubscribersService)

describe('/api/newsletter/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('OPTIONS', () => {
    it('should return CORS headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'OPTIONS'
      })

      const response = await OPTIONS(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
    })
  })

  describe('POST', () => {
    it('should successfully subscribe a new user', async () => {
      const mockSubscriber = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active' as const,
        source: 'homepage' as const,
        subscribed_at: '2024-01-01T00:00:00Z'
      }

      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: mockSubscriber,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully subscribed to newsletter!')
      expect(data.subscriber.email).toBe('test@example.com')
      expect(data.subscriber.first_name).toBe('John')
      expect(data.subscriber.last_name).toBe('Doe')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    })

    it('should handle already subscribed active user', async () => {
      const existingSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active' as const,
        subscribed_at: '2024-01-01T00:00:00Z'
      }

      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: existingSubscriber,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('You are already subscribed to our newsletter!')
      expect(data.subscriber.email).toBe('test@example.com')
      expect(data.subscriber.status).toBe('active')
    })

    it('should reactivate unsubscribed user', async () => {
      const unsubscribedUser = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'unsubscribed' as const,
        subscribed_at: '2024-01-01T00:00:00Z',
        unsubscribed_at: '2024-01-15T00:00:00Z'
      }

      const reactivatedUser = {
        ...unsubscribedUser,
        status: 'active' as const,
        unsubscribed_at: null
      }

      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: unsubscribedUser,
        error: null
      })

      mockNewsletterSubscribersService.update.mockResolvedValue({
        data: reactivatedUser,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Welcome back! Your newsletter subscription has been reactivated.')
      expect(data.subscriber.status).toBe('active')
      expect(mockNewsletterSubscribersService.update).toHaveBeenCalledWith('123', {
        status: 'active',
        unsubscribed_at: null,
        first_name: 'John',
        last_name: 'Doe',
        source: 'homepage'
      })
    })

    it('should return validation error for missing email', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          first_name: 'John'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Email is required')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should return validation error for invalid email format', async () => {
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
      expect(data.details).toContain('Invalid email format')
    })

    it('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid JSON in request body')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should handle database errors gracefully', async () => {
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: null,
        error: 'Database connection failed'
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      // In production mode, error messages are sanitized
      expect(data.error).toMatch(/Failed to create subscription|Internal server error/)
    })

    it('should set default source to homepage', async () => {
      const mockSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active' as const,
        source: 'homepage' as const,
        subscribed_at: '2024-01-01T00:00:00Z'
      }

      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: mockSubscriber,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.subscriber.source).toBe('homepage')
    })

    it('should preserve custom source when provided', async () => {
      const mockSubscriber = {
        id: '123',
        email: 'test@example.com',
        status: 'active' as const,
        source: 'api' as const,
        subscribed_at: '2024-01-01T00:00:00Z'
      }

      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: mockSubscriber,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          source: 'api'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.subscriber.source).toBe('api')
    })
  })
})