import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'
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

describe('BlogPostScheduler', () => {
  let scheduler: BlogPostScheduler
  const mockClient = client as any

  beforeEach(() => {
    scheduler = BlogPostScheduler.getInstance()
    scheduler.clearErrors()
    scheduler.clearQueue()
    vi.clearAllMocks()
  })

  afterEach(() => {
    scheduler.clearErrors()
  })

  describe('getScheduledBlogPosts', () => {
    it('should fetch scheduled blog posts from Sanity', async () => {
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          publishedAt: new Date(Date.now() - 1000).toISOString(),
          status: 'scheduled'
        },
        {
          _id: 'post2',
          title: 'Test Post 2',
          publishedAt: new Date(Date.now() - 2000).toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockPosts)

      const result = await scheduler.getScheduledBlogPosts()

      expect(result.error).toBeNull()
      expect(result.items).toHaveLength(2)
      expect(result.items[0].id).toBe('post2') // Should be sorted by scheduled time (oldest first)
      expect(result.items[1].id).toBe('post1')
      expect(result.items[0].type).toBe('blog')
    })

    it('should handle Sanity fetch errors', async () => {
      const error = new Error('Sanity connection failed')
      mockClient.fetch.mockRejectedValue(error)

      const result = await scheduler.getScheduledBlogPosts()

      expect(result.error).toBe('Sanity connection failed')
      expect(result.items).toHaveLength(0)
    })
  })

  describe('publishBlogPost', () => {
    it('should successfully publish a blog post', async () => {
      const mockPostData = {
        _id: 'post1',
        title: 'Test Post',
        publishedAt: new Date().toISOString(),
        status: 'scheduled' as const
      }

      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: 'post1' })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.publishBlogPost(mockPostData)

      expect(result).toBe(true)
      expect(mockClient.patch).toHaveBeenCalledWith('post1')
      expect(mockPatchChain.set).toHaveBeenCalledWith({
        publishedAt: expect.any(String)
      })
    })

    it('should handle publish failures', async () => {
      const mockPostData = {
        _id: 'post1',
        title: 'Test Post',
        publishedAt: new Date().toISOString(),
        status: 'scheduled' as const
      }

      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue(null)
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.publishBlogPost(mockPostData)

      expect(result).toBe(false)
    })

    it('should handle Sanity errors during publish', async () => {
      const mockPostData = {
        _id: 'post1',
        title: 'Test Post',
        publishedAt: new Date().toISOString(),
        status: 'scheduled' as const
      }

      const error = new Error('Sanity update failed')
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockRejectedValue(error)
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.publishBlogPost(mockPostData)

      expect(result).toBe(false)
    })
  })

  describe('processScheduledBlogPosts', () => {
    it('should process scheduled blog posts successfully', async () => {
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
      expect(result.errors).toHaveLength(0)
    })

    it('should handle processing when already in progress', async () => {
      // Start processing
      const firstProcessPromise = scheduler.processScheduledBlogPosts()
      
      // Try to start another process while first is running
      const secondResult = await scheduler.processScheduledBlogPosts()

      expect(secondResult.processed).toBe(0)
      expect(secondResult.errors).toContain('Processing already in progress')

      // Wait for first process to complete
      await firstProcessPromise
    })

    it('should handle retry logic for failed posts', async () => {
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          publishedAt: new Date(Date.now() - 1000).toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockPosts)
      
      // First attempt fails
      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockRejectedValue(new Error('Network error'))
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.processScheduledBlogPosts()

      expect(result.processed).toBe(1)
      expect(result.successful).toBe(0)
      expect(result.failed).toBe(1)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('Failed to process blog post post1')
    })
  })

  describe('scheduleBlogPost', () => {
    it('should schedule a blog post successfully', async () => {
      const postId = 'post1'
      const publishAt = new Date(Date.now() + 60000) // 1 minute from now

      const mockPatchChain = {
        set: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: postId })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.scheduleBlogPost(postId, publishAt)

      expect(result).toBe(true)
      expect(mockClient.patch).toHaveBeenCalledWith(postId)
      expect(mockPatchChain.set).toHaveBeenCalledWith({
        publishedAt: publishAt.toISOString()
      })
    })
  })

  describe('unscheduleBlogPost', () => {
    it('should unschedule a blog post successfully', async () => {
      const postId = 'post1'

      const mockPatchChain = {
        unset: vi.fn(() => ({
          commit: vi.fn().mockResolvedValue({ _id: postId })
        }))
      }
      mockClient.patch.mockReturnValue(mockPatchChain)

      const result = await scheduler.unscheduleBlogPost(postId)

      expect(result).toBe(true)
      expect(mockClient.patch).toHaveBeenCalledWith(postId)
      expect(mockPatchChain.unset).toHaveBeenCalledWith(['publishedAt'])
    })
  })

  describe('getBlogSchedulingStats', () => {
    it('should return scheduling statistics', async () => {
      // Clear any existing queue items from previous tests
      scheduler.clearErrors()
      
      // Mock scheduled posts count
      mockClient.fetch
        .mockResolvedValueOnce(5) // totalScheduled
        .mockResolvedValueOnce(2) // readyToProcess

      const stats = await scheduler.getBlogSchedulingStats()

      expect(stats.totalScheduled).toBe(5)
      expect(stats.readyToProcess).toBe(2)
      expect(stats.processing).toBe(false)
      expect(stats.failed).toBe(0)
    })

    it('should handle Sanity errors in stats', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Sanity error'))

      const stats = await scheduler.getBlogSchedulingStats()

      expect(stats.totalScheduled).toBe(0)
      expect(stats.readyToProcess).toBe(0)
      expect(stats.errors).toHaveLength(1)
      expect(stats.errors[0]).toContain('Sanity error')
    })
  })

  describe('healthCheck', () => {
    it('should return healthy status when Sanity is working', async () => {
      mockClient.fetch.mockResolvedValue(10)

      const health = await scheduler.healthCheck()

      expect(health.healthy).toBe(true)
      expect(health.services.sanity).toBe(true)
      expect(health.errors).toHaveLength(0)
    })

    it('should return unhealthy status when Sanity fails', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Connection failed'))

      const health = await scheduler.healthCheck()

      expect(health.healthy).toBe(false)
      expect(health.services.sanity).toBe(false)
      expect(health.errors).toHaveLength(1)
      expect(health.errors[0]).toContain('Connection failed')
    })
  })

  describe('getAllScheduledPosts', () => {
    it('should fetch all scheduled posts with full details', async () => {
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          slug: { current: 'test-post-1' },
          author: { _id: 'author1', name: 'John Doe' },
          mainImage: { asset: { url: 'https://example.com/image.jpg' }, alt: 'Test image' },
          categories: [{ _id: 'cat1', title: 'Technology' }],
          publishedAt: new Date(Date.now() + 60000).toISOString(),
          body: [],
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          status: 'scheduled'
        }
      ]

      mockClient.fetch.mockResolvedValue(mockPosts)

      const result = await scheduler.getAllScheduledPosts()

      expect(result.error).toBeNull()
      expect(result.posts).toHaveLength(1)
      expect(result.posts[0]._id).toBe('post1')
      expect(result.posts[0].title).toBe('Test Post 1')
      expect(result.posts[0].author?.name).toBe('John Doe')
    })
  })
})