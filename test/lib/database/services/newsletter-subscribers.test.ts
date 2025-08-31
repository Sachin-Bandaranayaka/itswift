import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { 
  addSubscriber, 
  getSubscribers, 
  updateSubscriber, 
  removeSubscriber,
  getSubscriberByEmail 
} from '@/lib/database/services/newsletter-subscribers'

vi.mock('@supabase/supabase-js')

const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    insert: vi.fn(() => Promise.resolve({ data: [{ id: '123' }], error: null })),
    update: vi.fn(() => Promise.resolve({ data: [{ id: '123' }], error: null })),
    delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
    eq: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
  }))
}

describe('Newsletter Subscribers Database Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockReturnValue(mockSupabase)
  })

  describe('addSubscriber', () => {
    it('adds a new subscriber', async () => {
      const subscriberData = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active' as const
      }

      mockSupabase.from().insert.mockResolvedValueOnce({
        data: [{ id: '123', ...subscriberData }],
        error: null
      })

      const result = await addSubscriber(subscriberData)

      expect(mockSupabase.from).toHaveBeenCalledWith('newsletter_subscribers')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([subscriberData])
      expect(result).toEqual({ id: '123', ...subscriberData })
    })

    it('handles duplicate email errors', async () => {
      const subscriberData = {
        email: 'duplicate@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'active' as const
      }

      mockSupabase.from().insert.mockResolvedValueOnce({
        data: null,
        error: { message: 'duplicate key value violates unique constraint' }
      })

      await expect(addSubscriber(subscriberData)).rejects.toThrow('duplicate key')
    })
  })

  describe('getSubscribers', () => {
    it('retrieves all active subscribers', async () => {
      const mockSubscribers = [
        { id: '1', email: 'user1@example.com', status: 'active' },
        { id: '2', email: 'user2@example.com', status: 'active' }
      ]

      mockSupabase.from().select.mockResolvedValueOnce({
        data: mockSubscribers,
        error: null
      })

      const result = await getSubscribers()

      expect(mockSupabase.from).toHaveBeenCalledWith('newsletter_subscribers')
      expect(result).toEqual(mockSubscribers)
    })

    it('filters subscribers by status', async () => {
      const mockSubscribers = [
        { id: '1', email: 'user1@example.com', status: 'unsubscribed' }
      ]

      mockSupabase.from().select.mockResolvedValueOnce({
        data: mockSubscribers,
        error: null
      })

      const result = await getSubscribers({ status: 'unsubscribed' })

      expect(result).toEqual(mockSubscribers)
    })
  })

  describe('getSubscriberByEmail', () => {
    it('finds subscriber by email', async () => {
      const mockSubscriber = { 
        id: '123', 
        email: 'test@example.com', 
        status: 'active' 
      }

      mockSupabase.from().eq().single.mockResolvedValueOnce({
        data: mockSubscriber,
        error: null
      })

      const result = await getSubscriberByEmail('test@example.com')

      expect(mockSupabase.from().eq().single).toHaveBeenCalled()
      expect(result).toEqual(mockSubscriber)
    })

    it('returns null when subscriber not found', async () => {
      mockSupabase.from().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows returned' }
      })

      const result = await getSubscriberByEmail('notfound@example.com')

      expect(result).toBeNull()
    })
  })

  describe('updateSubscriber', () => {
    it('updates subscriber information', async () => {
      const updateData = { first_name: 'Jane', status: 'unsubscribed' as const }
      
      mockSupabase.from().eq().update.mockResolvedValueOnce({
        data: [{ id: '123', ...updateData }],
        error: null
      })

      const result = await updateSubscriber('123', updateData)

      expect(mockSupabase.from().eq().update).toHaveBeenCalledWith(updateData)
      expect(result).toEqual({ id: '123', ...updateData })
    })
  })

  describe('removeSubscriber', () => {
    it('removes subscriber from database', async () => {
      mockSupabase.from().eq().delete.mockResolvedValueOnce({
        data: [],
        error: null
      })

      await removeSubscriber('123')

      expect(mockSupabase.from().eq().delete).toHaveBeenCalled()
    })
  })
})