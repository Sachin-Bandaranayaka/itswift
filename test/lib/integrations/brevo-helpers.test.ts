// Tests for Brevo integration helpers

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  getSubscriberByEmailForBrevo, 
  updateSubscriberBrevoSync, 
  markSubscriberSyncFailed 
} from '../../../lib/integrations/brevo-helpers'

// Mock Supabase
const mockSupabaseAdmin = {
  from: vi.fn(() => mockSupabaseAdmin),
  select: vi.fn(() => mockSupabaseAdmin),
  eq: vi.fn(() => mockSupabaseAdmin),
  update: vi.fn(() => mockSupabaseAdmin),
  single: vi.fn()
}

vi.mock('../../../lib/supabase', () => ({
  getSupabaseAdmin: () => mockSupabaseAdmin
}))

describe('Brevo Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSubscriberByEmailForBrevo', () => {
    it('should return subscriber when found', async () => {
      const mockSubscriber = {
        id: '123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active',
        subscribed_at: '2024-01-01T00:00:00Z',
        unsubscribe_token: 'token123'
      }

      mockSupabaseAdmin.single.mockResolvedValue({
        data: mockSubscriber,
        error: null
      })

      const result = await getSubscriberByEmailForBrevo('test@example.com')

      expect(result).toEqual(mockSubscriber)
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('newsletter_subscribers')
      expect(mockSupabaseAdmin.select).toHaveBeenCalledWith('*')
      expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('email', 'test@example.com')
    })

    it('should return null when subscriber not found', async () => {
      mockSupabaseAdmin.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' }
      })

      const result = await getSubscriberByEmailForBrevo('nonexistent@example.com')

      expect(result).toBeNull()
    })

    it('should return null on database error', async () => {
      mockSupabaseAdmin.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST001', message: 'Database error' }
      })

      const result = await getSubscriberByEmailForBrevo('test@example.com')

      expect(result).toBeNull()
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseAdmin.single.mockRejectedValue(new Error('Connection failed'))

      const result = await getSubscriberByEmailForBrevo('test@example.com')

      expect(result).toBeNull()
    })

    it('should normalize email to lowercase', async () => {
      mockSupabaseAdmin.single.mockResolvedValue({
        data: { id: '123', email: 'test@example.com' },
        error: null
      })

      await getSubscriberByEmailForBrevo('TEST@EXAMPLE.COM')

      expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('email', 'test@example.com')
    })
  })

  describe('updateSubscriberBrevoSync', () => {
    it('should successfully update subscriber sync info', async () => {
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: null
      })

      const result = await updateSubscriberBrevoSync('123', '456')

      expect(result).toBe(true)
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('newsletter_subscribers')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        brevo_contact_id: '456',
        last_synced_at: expect.any(String)
      })
      expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('id', '123')
    })

    it('should return false on database error', async () => {
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      })

      const result = await updateSubscriberBrevoSync('123', '456')

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseAdmin.update.mockImplementation(() => {
        throw new Error('Connection failed')
      })

      const result = await updateSubscriberBrevoSync('123', '456')

      expect(result).toBe(false)
    })

    it('should use current timestamp for last_synced_at', async () => {
      const beforeTime = new Date().toISOString()
      
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: null
      })

      await updateSubscriberBrevoSync('123', '456')

      const afterTime = new Date().toISOString()
      const updateCall = mockSupabaseAdmin.update.mock.calls[0][0]
      
      expect(updateCall.last_synced_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(updateCall.last_synced_at >= beforeTime).toBe(true)
      expect(updateCall.last_synced_at <= afterTime).toBe(true)
    })
  })

  describe('markSubscriberSyncFailed', () => {
    it('should successfully mark sync as failed', async () => {
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: null
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await markSubscriberSyncFailed('123', 'API error')

      expect(result).toBe(true)
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('newsletter_subscribers')
      expect(mockSupabaseAdmin.update).toHaveBeenCalledWith({
        last_synced_at: expect.any(String)
      })
      expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('id', '123')
      expect(consoleSpy).toHaveBeenCalledWith('Subscriber 123 sync failed: API error')

      consoleSpy.mockRestore()
    })

    it('should return false on database error', async () => {
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' }
      })

      const result = await markSubscriberSyncFailed('123', 'API error')

      expect(result).toBe(false)
    })

    it('should handle exceptions gracefully', async () => {
      mockSupabaseAdmin.update.mockImplementation(() => {
        throw new Error('Connection failed')
      })

      const result = await markSubscriberSyncFailed('123', 'API error')

      expect(result).toBe(false)
    })

    it('should log the error message', async () => {
      mockSupabaseAdmin.update.mockReturnValue(mockSupabaseAdmin)
      mockSupabaseAdmin.eq.mockResolvedValue({
        data: null,
        error: null
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await markSubscriberSyncFailed('subscriber-123', 'Rate limit exceeded')

      expect(consoleSpy).toHaveBeenCalledWith('Subscriber subscriber-123 sync failed: Rate limit exceeded')

      consoleSpy.mockRestore()
    })
  })
})