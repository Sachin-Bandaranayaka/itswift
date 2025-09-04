import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getScheduled } from '@/app/api/admin/blog/scheduled/route'
import { POST as processScheduled } from '@/app/api/admin/blog/process-scheduled/route'

// Mock the auth middleware
vi.mock('@/lib/auth/middleware', () => ({
  withAdminAuth: (handler: any) => handler
}))

// Mock the blog post scheduler
const mockScheduler = {
  getAllScheduledPosts: vi.fn(),
  getBlogSchedulingStats: vi.fn(),
  getQueueStatus: vi.fn(),
  processScheduledBlogPosts: vi.fn()
}

vi.mock('@/lib/services/blog-post-scheduler', () => ({
  BlogPostScheduler: {
    getInstance: () => mockScheduler
  }
}))

describe('Blog Scheduler API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/admin/blog/scheduled', () => {
    it('should return scheduled posts with statistics', async () => {
      // Mock data
      const mockPosts = [
        {
          _id: 'post1',
          title: 'Test Post 1',
          slug: { current: 'test-post-1' },
          publishedAt: '2024-12-10T10:00:00Z',
          status: 'scheduled'
        },
        {
          _id: 'post2',
          title: 'Test Post 2',
          slug: { current: 'test-post-2' },
          publishedAt: '2024-12-11T14:00:00Z',
          status: 'scheduled'
        }
      ]

      const mockStats = {
        totalScheduled: 2,
        readyToProcess: 0,
        inQueue: 0,
        processing: false,
        failed: 0,
        lastRun: new Date('2024-12-09T12:00:00Z'),
        nextRun: new Date('2024-12-09T12:05:00Z'),
        errors: []
      }

      const mockQueueStatus = {
        size: 0,
        items: []
      }

      mockScheduler.getAllScheduledPosts.mockResolvedValue({
        posts: mockPosts,
        error: null
      })
      mockScheduler.getBlogSchedulingStats.mockResolvedValue(mockStats)
      mockScheduler.getQueueStatus.mockReturnValue(mockQueueStatus)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/scheduled')
      const response = await getScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.scheduledPosts).toEqual(mockPosts)
      expect(data.data.count).toBe(2)
      expect(data.data.statistics.totalScheduled).toBe(mockStats.totalScheduled)
      expect(data.data.statistics.readyToProcess).toBe(mockStats.readyToProcess)
      expect(data.data.statistics.processing).toBe(mockStats.processing)
      expect(data.data.statistics.lastRun).toBe(mockStats.lastRun.toISOString())
      expect(data.data.statistics.nextRun).toBe(mockStats.nextRun.toISOString())
      expect(data.data.queue).toEqual(mockQueueStatus)
    })

    it('should handle errors when fetching scheduled posts', async () => {
      mockScheduler.getAllScheduledPosts.mockResolvedValue({
        posts: [],
        error: 'Database connection failed'
      })

      const request = new NextRequest('http://localhost:3000/api/admin/blog/scheduled')
      const response = await getScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch scheduled posts')
      expect(data.message).toBe('Database connection failed')
    })

    it('should handle unexpected errors', async () => {
      mockScheduler.getAllScheduledPosts.mockRejectedValue(new Error('Unexpected error'))

      const request = new NextRequest('http://localhost:3000/api/admin/blog/scheduled')
      const response = await getScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch scheduled blog posts')
      expect(data.message).toBe('Unexpected error')
    })
  })

  describe('POST /api/admin/blog/process-scheduled', () => {
    it('should successfully process scheduled posts', async () => {
      const mockResult = {
        processed: 3,
        successful: 2,
        failed: 1,
        publishedPosts: ['post1', 'post2'],
        errors: ['Failed to publish post3: Network error']
      }

      mockScheduler.processScheduledBlogPosts.mockResolvedValue(mockResult)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/process-scheduled', {
        method: 'POST'
      })
      const response = await processScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Processed 3 blog posts')
      expect(data.data).toEqual(mockResult)
    })

    it('should handle processing errors', async () => {
      mockScheduler.processScheduledBlogPosts.mockRejectedValue(new Error('Processing failed'))

      const request = new NextRequest('http://localhost:3000/api/admin/blog/process-scheduled', {
        method: 'POST'
      })
      const response = await processScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to process scheduled blog posts')
      expect(data.message).toBe('Processing failed')
    })

    it('should handle empty processing results', async () => {
      const mockResult = {
        processed: 0,
        successful: 0,
        failed: 0,
        publishedPosts: [],
        errors: []
      }

      mockScheduler.processScheduledBlogPosts.mockResolvedValue(mockResult)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/process-scheduled', {
        method: 'POST'
      })
      const response = await processScheduled(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Processed 0 blog posts')
      expect(data.data.processed).toBe(0)
      expect(data.data.successful).toBe(0)
      expect(data.data.failed).toBe(0)
    })
  })
})