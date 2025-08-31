import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { 
  createSocialPost, 
  getSocialPosts, 
  updateSocialPost, 
  deleteSocialPost,
  getScheduledPosts 
} from '@/lib/database/services/social-posts'

// Mock Supabase client
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
    lte: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }))
}

describe('Social Posts Database Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockReturnValue(mockSupabase)
  })

  describe('createSocialPost', () => {
    it('creates a new social post', async () => {
      const postData = {
        platform: 'linkedin' as const,
        content: 'Test post content',
        scheduled_at: new Date('2024-01-01T12:00:00Z'),
        status: 'scheduled' as const
      }

      mockSupabase.from().insert.mockResolvedValueOnce({
        data: [{ id: '123', ...postData }],
        error: null
      })

      const result = await createSocialPost(postData)

      expect(mockSupabase.from).toHaveBeenCalledWith('social_posts')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([postData])
      expect(result).toEqual({ id: '123', ...postData })
    })

    it('handles database errors', async () => {
      const postData = {
        platform: 'linkedin' as const,
        content: 'Test post content',
        scheduled_at: new Date(),
        status: 'scheduled' as const
      }

      mockSupabase.from().insert.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })

      await expect(createSocialPost(postData)).rejects.toThrow('Database error')
    })
  })

  describe('getSocialPosts', () => {
    it('retrieves social posts with pagination', async () => {
      const mockPosts = [
        { id: '1', platform: 'linkedin', content: 'Post 1' },
        { id: '2', platform: 'twitter', content: 'Post 2' }
      ]

      mockSupabase.from().select.mockResolvedValueOnce({
        data: mockPosts,
        error: null
      })

      const result = await getSocialPosts({ page: 1, limit: 10 })

      expect(mockSupabase.from).toHaveBeenCalledWith('social_posts')
      expect(result).toEqual(mockPosts)
    })

    it('filters posts by platform', async () => {
      const mockPosts = [
        { id: '1', platform: 'linkedin', content: 'LinkedIn post' }
      ]

      mockSupabase.from().select.mockResolvedValueOnce({
        data: mockPosts,
        error: null
      })

      const result = await getSocialPosts({ platform: 'linkedin' })

      expect(result).toEqual(mockPosts)
    })
  })

  describe('updateSocialPost', () => {
    it('updates a social post', async () => {
      const updateData = { content: 'Updated content', status: 'published' as const }
      
      mockSupabase.from().eq().update.mockResolvedValueOnce({
        data: [{ id: '123', ...updateData }],
        error: null
      })

      const result = await updateSocialPost('123', updateData)

      expect(mockSupabase.from).toHaveBeenCalledWith('social_posts')
      expect(mockSupabase.from().eq().update).toHaveBeenCalledWith(updateData)
      expect(result).toEqual({ id: '123', ...updateData })
    })
  })

  describe('deleteSocialPost', () => {
    it('deletes a social post', async () => {
      mockSupabase.from().eq().delete.mockResolvedValueOnce({
        data: [],
        error: null
      })

      await deleteSocialPost('123')

      expect(mockSupabase.from).toHaveBeenCalledWith('social_posts')
      expect(mockSupabase.from().eq().delete).toHaveBeenCalled()
    })
  })

  describe('getScheduledPosts', () => {
    it('retrieves posts scheduled for execution', async () => {
      const mockScheduledPosts = [
        { id: '1', platform: 'linkedin', scheduled_at: '2024-01-01T12:00:00Z' }
      ]

      mockSupabase.from().lte().eq().select.mockResolvedValueOnce({
        data: mockScheduledPosts,
        error: null
      })

      const result = await getScheduledPosts()

      expect(result).toEqual(mockScheduledPosts)
    })
  })
})