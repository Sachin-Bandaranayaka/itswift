import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AutomationEngine } from '@/lib/services/automation-engine'
import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'
import { BlogToSocialService } from '@/lib/services/blog-to-social'
import { AnalyticsTracker } from '@/lib/services/analytics-tracker'

// Mock external dependencies
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn(),
    patch: vi.fn(() => ({
      set: vi.fn(() => ({
        commit: vi.fn()
      }))
    }))
  }
}))

vi.mock('@/lib/database/services/automation-rules', () => ({
  AutomationRulesService: {
    getActiveRulesByTrigger: vi.fn().mockResolvedValue({ data: [], error: null }),
    updateExecution: vi.fn().mockResolvedValue({ error: null })
  }
}))

vi.mock('@/lib/services/blog-to-social', () => ({
  BlogToSocialService: {
    processNewBlogPost: vi.fn()
  }
}))

vi.mock('@/lib/services/analytics-tracker', () => ({
  AnalyticsTracker: {
    trackBlogPerformance: vi.fn()
  }
}))

describe('Blog Automation Integration', () => {
  let automationEngine: AutomationEngine
  let blogScheduler: BlogPostScheduler

  beforeEach(async () => {
    automationEngine = AutomationEngine.getInstance()
    blogScheduler = BlogPostScheduler.getInstance()
    vi.clearAllMocks()

    // Setup default mocks for automation rules service
    const { AutomationRulesService } = await import('@/lib/database/services/automation-rules')
    vi.mocked(AutomationRulesService.getActiveRulesByTrigger).mockResolvedValue({
      data: [],
      error: null
    })
    vi.mocked(AutomationRulesService.updateExecution).mockResolvedValue({
      success: true,
      error: null
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Blog Published Trigger', () => {
    it('should process blog published trigger with automation', async () => {
      // Mock blog post data
      const mockBlogPost = {
        _id: 'test-blog-post-1',
        title: 'Test Blog Post',
        slug: { current: 'test-blog-post' },
        content: [
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'This is a test blog post content.' }
            ]
          }
        ],
        excerpt: 'Test excerpt',
        author: { name: 'Test Author' },
        categories: [{ title: 'Technology' }, { title: 'AI' }],
        publishedAt: new Date().toISOString()
      }

      // Mock successful social media generation
      vi.mocked(BlogToSocialService.processNewBlogPost).mockResolvedValue({
        success: true,
        posts: [
          {
            id: 'social-post-1',
            platform: 'linkedin',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          },
          {
            id: 'social-post-2',
            platform: 'twitter',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        ]
      })

      // Mock successful analytics tracking
      vi.mocked(AnalyticsTracker.trackBlogPerformance).mockResolvedValue({
        success: true,
        error: null
      })

      // Process blog published automation
      const result = await automationEngine.processBlogPublishedWithAutomation(mockBlogPost)

      // Verify results
      expect(result.success).toBe(true)
      expect(result.socialPosts).toHaveLength(2)
      expect(result.analyticsTracked).toBe(true)
      expect(result.errors).toHaveLength(0)

      // Verify social media service was called correctly
      expect(BlogToSocialService.processNewBlogPost).toHaveBeenCalledWith(
        {
          title: mockBlogPost.title,
          content: 'This is a test blog post content.',
          excerpt: mockBlogPost.excerpt,
          categories: ['Technology', 'AI'],
          publishedAt: mockBlogPost.publishedAt
        },
        mockBlogPost._id,
        {
          platforms: ['linkedin', 'twitter'],
          autoSchedule: true,
          scheduleDelay: 30
        }
      )

      // Verify analytics tracking was called
      expect(AnalyticsTracker.trackBlogPerformance).toHaveBeenCalledWith(
        mockBlogPost._id,
        {
          views: 1,
          likes: 0,
          shares: 0,
          comments: 0
        }
      )
    })

    it('should handle social media generation failure gracefully', async () => {
      const mockBlogPost = {
        _id: 'test-blog-post-2',
        title: 'Test Blog Post 2',
        slug: { current: 'test-blog-post-2' },
        content: [],
        publishedAt: new Date().toISOString()
      }

      // Mock failed social media generation
      vi.mocked(BlogToSocialService.processNewBlogPost).mockResolvedValue({
        success: false,
        posts: [],
        error: 'API rate limit exceeded'
      })

      // Mock successful analytics tracking
      vi.mocked(AnalyticsTracker.trackBlogPerformance).mockResolvedValue({
        success: true,
        error: null
      })

      const result = await automationEngine.processBlogPublishedWithAutomation(mockBlogPost)

      // Should not fail completely due to social media failure
      expect(result.success).toBe(false) // Because there are errors
      expect(result.socialPosts).toHaveLength(0)
      expect(result.analyticsTracked).toBe(true)
      expect(result.errors).toContain('Social media generation failed: API rate limit exceeded')
    })

    it('should handle analytics tracking failure gracefully', async () => {
      const mockBlogPost = {
        _id: 'test-blog-post-3',
        title: 'Test Blog Post 3',
        slug: { current: 'test-blog-post-3' },
        content: [],
        publishedAt: new Date().toISOString()
      }

      // Mock successful social media generation
      vi.mocked(BlogToSocialService.processNewBlogPost).mockResolvedValue({
        success: true,
        posts: [
          {
            id: 'social-post-3',
            platform: 'linkedin',
            status: 'scheduled'
          }
        ]
      })

      // Mock failed analytics tracking
      vi.mocked(AnalyticsTracker.trackBlogPerformance).mockResolvedValue({
        success: false,
        error: 'Database connection failed'
      })

      const result = await automationEngine.processBlogPublishedWithAutomation(mockBlogPost)

      expect(result.success).toBe(false) // Because there are errors
      expect(result.socialPosts).toHaveLength(1)
      expect(result.analyticsTracked).toBe(false)
      expect(result.errors).toContain('Analytics tracking failed: Database connection failed')
    })
  })

  describe('Blog Scheduler Integration', () => {
    it('should trigger automation when blog post is published', async () => {
      const mockPostData = {
        _id: 'scheduled-post-1',
        title: 'Scheduled Blog Post',
        publishedAt: new Date().toISOString()
      }

      // Mock Sanity client patch operation
      const mockCommit = vi.fn().mockResolvedValue({
        _id: mockPostData._id,
        title: mockPostData.title,
        publishedAt: mockPostData.publishedAt,
        slug: { current: 'scheduled-blog-post' },
        content: [],
        categories: []
      })

      const mockSet = vi.fn().mockReturnValue({ commit: mockCommit })
      const mockPatch = vi.fn().mockReturnValue({ set: mockSet })

      // Mock the client
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.patch).mockImplementation(mockPatch)

      // Mock automation engine methods
      const processBlogPublishedWithAutomationSpy = vi.spyOn(
        automationEngine,
        'processBlogPublishedWithAutomation'
      ).mockResolvedValue({
        success: true,
        socialPosts: [],
        analyticsTracked: true,
        errors: []
      })

      // Publish the blog post
      const result = await blogScheduler.publishBlogPost(mockPostData)

      expect(result).toBe(true)
      expect(mockPatch).toHaveBeenCalledWith(mockPostData._id)
      expect(mockSet).toHaveBeenCalledWith({
        publishedAt: expect.any(String)
      })
      expect(mockCommit).toHaveBeenCalled()

      // Verify automation was triggered
      expect(processBlogPublishedWithAutomationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockPostData._id,
          title: mockPostData.title
        })
      )
    })

    it('should not fail blog publication if automation fails', async () => {
      const mockPostData = {
        _id: 'scheduled-post-2',
        title: 'Scheduled Blog Post 2',
        publishedAt: new Date().toISOString()
      }

      // Mock successful Sanity update
      const mockCommit = vi.fn().mockResolvedValue({
        _id: mockPostData._id,
        title: mockPostData.title,
        publishedAt: mockPostData.publishedAt
      })

      const mockSet = vi.fn().mockReturnValue({ commit: mockCommit })
      const mockPatch = vi.fn().mockReturnValue({ set: mockSet })

      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.patch).mockImplementation(mockPatch)

      // Mock automation failure
      const processBlogPublishedWithAutomationSpy = vi.spyOn(
        automationEngine,
        'processBlogPublishedWithAutomation'
      ).mockRejectedValue(new Error('Automation service unavailable'))

      // Publish the blog post
      const result = await blogScheduler.publishBlogPost(mockPostData)

      // Blog publication should still succeed
      expect(result).toBe(true)
      expect(mockCommit).toHaveBeenCalled()
      expect(processBlogPublishedWithAutomationSpy).toHaveBeenCalled()
    })
  })

  describe('Text Extraction', () => {
    it('should extract text from Sanity block content', async () => {
      const mockBlogPost = {
        _id: 'text-extraction-test',
        title: 'Text Extraction Test',
        slug: { current: 'text-extraction-test' },
        content: [
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'First paragraph content.' }
            ]
          },
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'Second paragraph with ' },
              { _type: 'span', text: 'bold text', marks: ['strong'] },
              { _type: 'span', text: ' and more content.' }
            ]
          },
          {
            _type: 'image',
            asset: { _ref: 'image-123' }
          },
          {
            _type: 'block',
            children: [
              { _type: 'span', text: 'Third paragraph after image.' }
            ]
          }
        ],
        publishedAt: new Date().toISOString()
      }

      // Mock services
      vi.mocked(BlogToSocialService.processNewBlogPost).mockResolvedValue({
        success: true,
        posts: []
      })

      vi.mocked(AnalyticsTracker.trackBlogPerformance).mockResolvedValue({
        success: true,
        error: null
      })

      const result = await automationEngine.processBlogPublishedWithAutomation(mockBlogPost)

      expect(result.success).toBe(true)

      // Verify that the text extraction worked correctly
      expect(BlogToSocialService.processNewBlogPost).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'First paragraph content.\n\nSecond paragraph with bold text and more content.\n\nThird paragraph after image.'
        }),
        mockBlogPost._id,
        expect.any(Object)
      )
    })

    it('should handle empty or invalid content gracefully', async () => {
      const mockBlogPost = {
        _id: 'empty-content-test',
        title: 'Empty Content Test',
        slug: { current: 'empty-content-test' },
        content: null,
        publishedAt: new Date().toISOString()
      }

      // Mock services
      vi.mocked(BlogToSocialService.processNewBlogPost).mockResolvedValue({
        success: true,
        posts: []
      })

      vi.mocked(AnalyticsTracker.trackBlogPerformance).mockResolvedValue({
        success: true,
        error: null
      })

      const result = await automationEngine.processBlogPublishedWithAutomation(mockBlogPost)

      expect(result.success).toBe(true)

      // Should handle null content gracefully
      expect(BlogToSocialService.processNewBlogPost).toHaveBeenCalledWith(
        expect.objectContaining({
          content: ''
        }),
        mockBlogPost._id,
        expect.any(Object)
      )
    })
  })
})