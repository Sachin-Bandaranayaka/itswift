import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET, DELETE } from '@/app/api/social/posts/route'
import { AyrshareAPI } from '@/lib/ayrshare'

// Mock the AyrshareAPI
vi.mock('@/lib/ayrshare', () => ({
  AyrshareAPI: {
    getInstance: vi.fn(() => ({
      post: vi.fn(),
      schedulePost: vi.fn(),
      getPostHistory: vi.fn(),
      getUserProfile: vi.fn(),
      deletePost: vi.fn(),
      testConnection: vi.fn()
    }))
  }
}))

const mockAyrshareInstance = {
  post: vi.fn(),
  schedulePost: vi.fn(),
  getPostHistory: vi.fn(),
  getUserProfile: vi.fn(),
  deletePost: vi.fn(),
  testConnection: vi.fn()
}

;(AyrshareAPI.getInstance as any).mockReturnValue(mockAyrshareInstance)

describe('/api/social/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/social/posts', () => {
    it('should publish a post immediately', async () => {
      const mockResponse = {
        status: 'success',
        id: 'post-123',
        postIds: { linkedin: 'ln-123', twitter: 'tw-123' }
      }
      mockAyrshareInstance.post.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost:3000/api/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test post content',
          platforms: ['linkedin', 'twitter'],
          mediaUrls: ['https://example.com/image.jpg']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockResponse)
      expect(mockAyrshareInstance.post).toHaveBeenCalledWith({
        post: 'Test post content',
        platforms: ['linkedin', 'twitter'],
        mediaUrls: ['https://example.com/image.jpg']
      })
    })

    it('should schedule a post for later', async () => {
      const mockResponse = {
        status: 'success',
        id: 'scheduled-123',
        scheduleDate: '2024-12-31T10:00:00Z'
      }
      mockAyrshareInstance.schedulePost.mockResolvedValue(mockResponse)

      const scheduleDate = new Date('2024-12-31T10:00:00Z')
      const request = new NextRequest('http://localhost:3000/api/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Scheduled post content',
          platforms: ['linkedin'],
          scheduleDate: scheduleDate.toISOString()
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockResponse)
      expect(mockAyrshareInstance.schedulePost).toHaveBeenCalledWith({
        post: 'Scheduled post content',
        platforms: ['linkedin'],
        scheduleDate: scheduleDate
      })
    })

    it('should handle API errors', async () => {
      mockAyrshareInstance.post.mockRejectedValue(new Error('API Error'))

      const request = new NextRequest('http://localhost:3000/api/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test post',
          platforms: ['linkedin']
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to publish post')
    })

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          platforms: ['linkedin']
          // Missing content
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Content and platforms are required')
    })
  })

  describe('GET /api/social/posts', () => {
    it('should return post history', async () => {
      const mockHistory = {
        posts: [
          { id: '1', content: 'Post 1', status: 'published' },
          { id: '2', content: 'Post 2', status: 'scheduled' }
        ],
        total: 2
      }
      mockAyrshareInstance.getPostHistory.mockResolvedValue(mockHistory)

      const request = new NextRequest('http://localhost:3000/api/social/posts?limit=10&offset=0')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockHistory)
    })

    it('should return user profile when requested', async () => {
      const mockProfile = {
        user: 'test@example.com',
        platforms: ['linkedin', 'twitter'],
        quotas: { linkedin: 100, twitter: 200 }
      }
      mockAyrshareInstance.getUserProfile.mockResolvedValue(mockProfile)

      const request = new NextRequest('http://localhost:3000/api/social/posts?action=profile')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProfile)
    })

    it('should test connection when requested', async () => {
      const mockConnection = {
        status: 'connected',
        platforms: ['linkedin', 'twitter']
      }
      mockAyrshareInstance.testConnection.mockResolvedValue(mockConnection)

      const request = new NextRequest('http://localhost:3000/api/social/posts?action=test')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockConnection)
    })
  })

  describe('DELETE /api/social/posts', () => {
    it('should delete a post', async () => {
      const mockResponse = { status: 'success', deleted: true }
      mockAyrshareInstance.deletePost.mockResolvedValue(mockResponse)

      const request = new NextRequest('http://localhost:3000/api/social/posts?id=post-123', {
        method: 'DELETE'
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockResponse)
      expect(mockAyrshareInstance.deletePost).toHaveBeenCalledWith('post-123')
    })

    it('should handle missing post ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/social/posts', {
        method: 'DELETE'
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Post ID is required')
    })
  })
})