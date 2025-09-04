import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/newsletter/unsubscribe/route'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { NextRequest } from 'next/server'

// Mock the service
vi.mock('@/lib/database/services/newsletter-subscribers')

describe('/api/newsletter/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should redirect to unsubscribe page with valid token', async () => {
      const mockSubscriber = {
        id: '1',
        email: 'test@example.com',
        status: 'active',
        unsubscribe_token: 'valid-token'
      }

      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockResolvedValue({
        data: mockSubscriber as any,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe?token=valid-token')
      const response = await GET(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/unsubscribe?token=valid-token')
    })

    it('should redirect with error for missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe')
      const response = await GET(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/unsubscribe?error=missing_token')
    })

    it('should redirect with error for invalid token', async () => {
      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockResolvedValue({
        data: null,
        error: null
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe?token=invalid-token')
      const response = await GET(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/unsubscribe?error=invalid_token')
    })

    it('should handle service errors gracefully', async () => {
      vi.mocked(NewsletterSubscribersService.getByUnsubscribeToken).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe?token=valid-token')
      const response = await GET(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/unsubscribe?error=server_error')
    })
  })

  describe('POST', () => {
    it('should successfully unsubscribe with valid token and confirmation', async () => {
      vi.mocked(NewsletterSubscribersService.unsubscribeByToken).mockResolvedValue({
        success: true,
        data: true,
        message: 'Successfully unsubscribed'
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: true
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully unsubscribed')
    })

    it('should return error for missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          confirmed: true
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing unsubscribe token')
    })

    it('should return error when not confirmed', async () => {
      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: false
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unsubscribe not confirmed')
    })

    it('should handle service errors', async () => {
      vi.mocked(NewsletterSubscribersService.unsubscribeByToken).mockResolvedValue({
        success: false,
        error: 'Invalid token'
      })

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          token: 'invalid-token',
          confirmed: true
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid token')
    })

    it('should handle unexpected errors', async () => {
      vi.mocked(NewsletterSubscribersService.unsubscribeByToken).mockRejectedValue(
        new Error('Database error')
      )

      const request = new NextRequest('http://localhost:3000/api/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: true
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })
})