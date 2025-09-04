import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContentScheduler } from '@/lib/services/content-scheduler'
import { client } from '@/lib/sanity.client'

// Mock the Sanity client
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn(),
    patch: vi.fn(() => ({
      set: vi.fn(() => ({
        commit: vi.fn()
      })),
      unset: vi.fn(() => ({
        commit: vi.fn()
      }))
    }))
  }
}))

// Mock the database services
vi.mock('@/lib/database/services', () => ({
  SocialPostsService: {
    getScheduledPosts: vi.fn().mockResolvedValue({ data: [], error: null }),
    getAll: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: {}, error: null })
  },
  NewsletterCampaignsService: {
    getScheduledCampaigns: vi.fn().mockResolvedValue({ data: [], error: null }),
    getAll: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockResolvedValue({ data: {}, error: null })
  }
}))

// Mock the social media publisher
vi.mock('@/lib/services/social-media-publisher', () => ({
  getSocialMediaPublisher: vi.fn(() => ({
    publishPost: vi.fn().mockResolvedValue({ success: true }),
    getApiStatus: vi.fn().mockReturnValue({ linkedin: true, twitter: true })
  }))
}))

// Mock the newsletter service
vi.mock('@/lib/services/newsletter', () => ({
  NewsletterService: vi.fn().mockImplementation(() => ({
    sendCampaign: vi.fn().mockResolvedValue({ success: true })
  }))
}))

describe('ContentScheduler Blog Integration', () => {
  let scheduler: ContentScheduler
  const mockClient = client as any

  beforeEach(() => {
    scheduler = ContentScheduler.getInstance()
    vi.clearAllMocks()
  })

  describe('Blog Post Scheduler Integration', () => {
    it('should include blog posts in scheduling stats', async () => {
      // Mock blog posts
      mockClient.fetch
        .mockResolvedValueOnce(3) // totalScheduled blog posts
        .mockResolvedValueOnce(1) // readyToProcess blog posts

      const stats = await scheduler.getSchedulingStats()

      expect(stats.byType.blog).toBeDefined()
      expect(stats.byType.blog.total).toBe(3)
      expect(stats.byType.blog.ready).toBe(1)
      expect(stats.byType.blog.failed).toBe(0)
    })

    it('should include blog scheduler in health check', async () => {
      // Mock successful Sanity connection
      mockClient.fetch.mockResolvedValue(10)

      const health = await scheduler.healthCheck()

      expect(health.services.blog).toBe(true)
      expect(health.healthy).toBe(true)
    })

    it('should handle blog scheduler errors in health check', async () => {
      // Mock Sanity connection failure
      mockClient.fetch.mockRejectedValue(new Error('Sanity connection failed'))

      const health = await scheduler.healthCheck()

      expect(health.services.blog).toBe(false)
      expect(health.healthy).toBe(false)
      expect(health.errors.some(error => error.includes('Sanity connection'))).toBe(true)
    })

    it('should provide access to blog scheduler methods', async () => {
      const blogScheduler = scheduler.getBlogScheduler()
      expect(blogScheduler).toBeDefined()

      // Test scheduling a blog post
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: 'post1' })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.scheduleBlogPost('post1', new Date())
      expect(result).toBe(true)
    })

    it('should process scheduled blog posts through main scheduler', async () => {
      // Mock scheduled blog posts
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          publishedAt: new Date(Date.now() - 1000).toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockPosts)
      
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: 'post1' })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.processScheduledBlogPosts()

      expect(result.processed).toBe(1)
      expect(result.successful).toBe(1)
      expect(result.failed).toBe(0)
      expect(result.publishedPosts).toContain('post1')
    })

    it('should get all scheduled blog posts', async () => {
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          slug: { current: 'test-post-1' },
          author: { _id: 'author1', name: 'John Doe' },
          publishedAt: new Date(Date.now() + 60000).toISOString(),
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockPosts)

      const result = await scheduler.getAllScheduledBlogPosts()

      expect(result.error).toBeNull()
      expect(result.posts).toHaveLength(1)
      expect(result.posts[0]._id).toBe('post1')
    })
  })

  describe('Integrated Content Processing', () => {
    it('should process all content types including blog posts', async () => {
      // Mock scheduled blog posts
      const mockBlogPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          publishedAt: new Date(Date.now() - 1000).toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockBlogPosts)
      
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: 'post1' })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.processScheduledContent()

      expect(result.details.blog).toBeDefined()
      expect(result.details.blog.processed).toBe(1)
      expect(result.details.blog.successful).toBe(1)
      expect(result.details.blog.failed).toBe(0)
    })

    it('should handle mixed content types processing', async () => {
      // Mock empty social and newsletter content
      // Mock blog posts only
      const mockBlogPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          publishedAt: new Date(Date.now() - 1000).toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockBlogPosts)
      
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: 'post1' })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.processScheduledContent()

      expect(result.processed).toBe(1)
      expect(result.successful).toBe(1)
      expect(result.details.social.processed).toBe(0)
      expect(result.details.newsletter.processed).toBe(0)
      expect(result.details.blog.processed).toBe(1)
    })
  })
})