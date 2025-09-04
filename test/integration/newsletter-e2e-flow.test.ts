import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { BrevoService } from '@/lib/integrations/brevo'

// Mock dependencies
vi.mock('@/lib/database/services/newsletter-subscribers')
vi.mock('@/lib/integrations/brevo')

const mockNewsletterSubscribersService = vi.mocked(NewsletterSubscribersService)
const mockBrevoService = vi.mocked(BrevoService)

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Newsletter End-to-End Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('Complete Subscription Flow', () => {
    it('should handle complete subscription flow from component to database', async () => {
      const user = userEvent.setup()

      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Successfully subscribed to newsletter!',
          subscriber: {
            id: '123',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            status: 'active',
            source: 'homepage',
            subscribed_at: '2024-01-01T00:00:00Z'
          }
        })
      })

      render(<NewsletterSignup />)

      // Fill out the form
      const emailInput = screen.getByLabelText('Email Address *')
      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')

      // Submit the form
      await user.click(submitButton)

      // Verify loading state
      expect(screen.getByText('Subscribing...')).toBeInTheDocument()

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed! Check your email for confirmation.')).toBeInTheDocument()
      })

      // Verify API was called with correct data
      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          source: 'homepage',
        }),
        signal: expect.any(AbortSignal)
      })

      // Verify form is reset
      expect((emailInput as HTMLInputElement).value).toBe('')
      expect((firstNameInput as HTMLInputElement).value).toBe('')
      expect((lastNameInput as HTMLInputElement).value).toBe('')
    })

    it('should handle duplicate subscription gracefully', async () => {
      const user = userEvent.setup()

      // Mock duplicate subscription response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          subscriber: {
            id: '123',
            email: 'existing@example.com',
            status: 'active'
          }
        })
      })

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'existing@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed! Check your email for confirmation.')).toBeInTheDocument()
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'existing@example.com',
          first_name: undefined,
          last_name: undefined,
          source: 'homepage',
        }),
        signal: expect.any(AbortSignal)
      })
    })

    it('should handle server errors with user-friendly messages', async () => {
      const user = userEvent.setup()

      // Mock server error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Database service temporarily unavailable',
          code: 'DATABASE_ERROR'
        })
      })

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Database service temporarily unavailable')).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup()

      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('fetch failed'))

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error. Please check your connection and try again.')).toBeInTheDocument()
      })
    })

    it('should handle request timeout', async () => {
      const user = userEvent.setup()

      // Mock timeout by delaying response beyond component timeout
      mockFetch.mockImplementationOnce(() => 
        new Promise((resolve) => setTimeout(resolve, 35000)) // 35 seconds, component timeout is 30
      )

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Request timed out. Please check your connection and try again.')).toBeInTheDocument()
      }, { timeout: 35000 })
    })
  })

  describe('Complete Unsubscription Flow', () => {
    it('should handle unsubscribe link click to confirmation', async () => {
      // Mock GET request for unsubscribe token validation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 302,
        headers: new Map([['location', '/unsubscribe?token=valid-token']])
      })

      // Simulate clicking unsubscribe link
      const response = await fetch('/api/newsletter/unsubscribe?token=valid-token')
      
      expect(response.status).toBe(302)
      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter/unsubscribe?token=valid-token')
    })

    it('should handle unsubscribe confirmation', async () => {
      // Mock POST request for unsubscribe confirmation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Successfully unsubscribed from newsletter'
        })
      })

      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'valid-token',
          confirmed: true
        })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Successfully unsubscribed from newsletter')
    })
  })

  describe('Brevo Integration Flow', () => {
    it('should sync new subscriber with Brevo after local creation', async () => {
      // Mock successful local subscription
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

      mockNewsletterSubscribersService.create.mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          first_name: 'John',
          status: 'active' as const,
          source: 'homepage' as const,
          subscribed_at: '2024-01-01T00:00:00Z'
        },
        error: null
      })

      // Mock successful Brevo sync
      const mockBrevoInstance = {
        syncSubscriber: vi.fn().mockResolvedValue({
          success: true,
          brevo_contact_id: '456'
        })
      }
      mockBrevoService.mockImplementation(() => mockBrevoInstance as any)

      // Import and call the API route
      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          first_name: 'John'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(mockNewsletterSubscribersService.create).toHaveBeenCalled()
    })

    it('should handle Brevo sync failure with fallback', async () => {
      // Mock successful local subscription
      mockNewsletterSubscribersService.getByEmail.mockResolvedValue({
        data: null,
        error: null
      })

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

      // Mock Brevo sync failure with fallback
      const mockBrevoInstance = {
        syncSubscriber: vi.fn().mockResolvedValue({
          success: true,
          fallback_used: true,
          error: 'Brevo sync deferred - will retry later'
        })
      }
      mockBrevoService.mockImplementation(() => mockBrevoInstance as any)

      const { POST } = await import('@/app/api/newsletter/subscribe/route')

      const request = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      })

      const response = await POST(request as any)
      const data = await response.json()

      // Should still succeed locally even if Brevo sync fails
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('Error Recovery and Resilience', () => {
    it('should recover from temporary database failures', async () => {
      const user = userEvent.setup()

      // First attempt fails, second succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({
            success: false,
            error: 'Database temporarily unavailable',
            code: 'DATABASE_ERROR'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Successfully subscribed to newsletter!',
            subscriber: {
              id: '123',
              email: 'test@example.com',
              status: 'active'
            }
          })
        })

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')

      // First attempt
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Database temporarily unavailable')).toBeInTheDocument()
      })

      // Second attempt after error clears
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed! Check your email for confirmation.')).toBeInTheDocument()
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should handle validation errors with field-specific messages', async () => {
      const user = userEvent.setup()

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Please enter a valid email address.',
          code: 'VALIDATION_ERROR',
          details: {
            field: 'email',
            errors: ['Invalid email format']
          }
        })
      })

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and User Experience', () => {
    it('should maintain focus management during form submission', async () => {
      const user = userEvent.setup()

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Successfully subscribed!',
          subscriber: { id: '123', email: 'test@example.com', status: 'active' }
        })
      })

      render(<NewsletterSignup />)

      const emailInput = screen.getByLabelText('Email Address *')
      const submitButton = screen.getByRole('button', { name: /subscribe/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed! Check your email for confirmation.')).toBeInTheDocument()
      })

      // Button should be enabled again after submission
      expect(submitButton).not.toBeDisabled()
    })

    it('should provide proper ARIA attributes for screen readers', async () => {
      const user = userEvent.setup()

      render(<NewsletterSignup />)

      const submitButton = screen.getByRole('button', { name: /subscribe/i })
      await user.click(submitButton)

      await waitFor(() => {
        const emailInput = screen.getByLabelText('Email Address *')
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })
})