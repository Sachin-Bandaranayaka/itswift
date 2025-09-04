import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/newsletter/subscriber-by-token/route'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { NextRequest } from 'next/server'

// Mock the service
vi.mock('@/lib/database/services/newsletter-subscribers')

describe('/api/newsletter/subscriber-by-token', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return subscriber info for valid token', async () => {
      const mockSubscriber = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'unsubscribed',
        unsubscribe_token: 'valid-token'
      }

      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockResolvedValue({
        data: mockSubscriber as any,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscriber-by-token?token=valid-token')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.subscriber).toEqual({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'unsubscribed'
      })
    })

    it('should return error for missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/subscriber-by-token')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing token parameter')
    })

    it('should return error for invalid token', async () => {
      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscriber-by-token?token=invalid-token')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid or expired token')
    })

    it('should handle service errors', async () => {
      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscriber-by-token?token=valid-token')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })

    it('should not expose sensitive data', async () => {
      const mockSubscriber = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active',
        unsubscribe_token: 'valid-token',
        brevo_contact_id: 'sensitive-id',
        subscribed_at: '2023-01-01T00:00:00Z'
      }

      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockResolvedValue({
        data: mockSubscriber as any,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/subscriber-by-token?token=valid-token')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.subscriber).not.toHaveProperty('id')
      expect(data.subscriber).not.toHaveProperty('unsubscribe_token')
      expect(data.subscriber).not.toHaveProperty('brevo_contact_id')
      expect(data.subscriber).not.toHaveProperty('subscribed_at')
      expect(data.subscriber).toEqual({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active'
      })
    })
  })
})