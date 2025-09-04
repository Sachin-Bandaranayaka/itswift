import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

// Mock the newsletter subscribers service for integration tests
vi.mock('@/lib/database/services/newsletter-subscribers')

const mockNewsletterSubscribersService = vi.mocked(NewsletterSubscribersService)

describe('Newsletter Subscribe API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle POST request to /api/newsletter/subscribe', async () => {
    // Mock successful subscription
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
        subscribed_at: '2024-01-01T00:00:00Z'
      },
      error: null
    })

    // Import the route handler
    const { POST } = await import('@/app/api/newsletter/subscribe/route')

    // Create a mock request
    const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe'
      })
    })

    // Call the handler
    const response = await POST(request as any)
    const data = await response.json()

    // Verify response
    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Successfully subscribed to newsletter!')
    expect(data.subscriber.email).toBe('test@example.com')
    expect(data.subscriber.first_name).toBe('John')
    expect(data.subscriber.last_name).toBe('Doe')
    expect(data.subscriber.status).toBe('active')
    expect(data.subscriber.source).toBe('homepage')

    // Verify CORS headers
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
  })

  it('should handle OPTIONS request for CORS preflight', async () => {
    // Import the route handler
    const { OPTIONS } = await import('@/app/api/newsletter/subscribe/route')

    // Create a mock OPTIONS request
    const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'OPTIONS'
    })

    // Call the handler
    const response = await OPTIONS(request as any)

    // Verify CORS response
    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization')
    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
  })

  it('should validate email format and return proper error', async () => {
    // Import the route handler
    const { POST } = await import('@/app/api/newsletter/subscribe/route')

    // Create a request with invalid email
    const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email-format'
      })
    })

    // Call the handler
    const response = await POST(request as any)
    const data = await response.json()

    // Verify error response
    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.code).toBe('VALIDATION_ERROR')
    expect(data.details).toContain('Invalid email format')

    // Verify CORS headers are present even in error responses
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('should handle duplicate email subscription gracefully', async () => {
    // Mock existing active subscriber
    mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
      data: {
        id: '123',
        email: 'existing@example.com',
        status: 'active' as const,
        subscribed_at: '2024-01-01T00:00:00Z'
      },
      error: null
    })

    // Import the route handler
    const { POST } = await import('@/app/api/newsletter/subscribe/route')

    // Create a request with existing email
    const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'existing@example.com'
      })
    })

    // Call the handler
    const response = await POST(request as any)
    const data = await response.json()

    // Verify friendly response for existing subscriber
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('You are already subscribed to our newsletter!')
    expect(data.subscriber.email).toBe('existing@example.com')
    expect(data.subscriber.status).toBe('active')
  })
})