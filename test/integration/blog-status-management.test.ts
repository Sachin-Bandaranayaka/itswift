import { NextRequest } from 'next/server'
import { POST as statusPost, GET as statusGet } from '@/app/api/admin/blog/status/route'
import { POST as bulkPost } from '@/app/api/admin/blog/bulk/route'
import { client } from '@/lib/sanity.client'
import { vi } from 'vitest'

// Mock Sanity client
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn(),
    transaction: vi.fn(() => ({
      patch: vi.fn(() => ({
        set: vi.fn(() => ({}))
      })),
      delete: vi.fn(),
      commit: vi.fn()
    })),
    patch: vi.fn(() => ({
      set: vi.fn(() => ({
        commit: vi.fn()
      }))
    })),
    create: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock fetch for audit logging
global.fetch = vi.fn()

const mockPosts = [
  {
    _id: '1',
    title: 'Test Post 1',
    slug: { current: 'test-post-1' },
    publishedAt: '2024-01-01T10:00:00Z',
    _createdAt: '2024-01-01T09:00:00Z'
  },
  {
    _id: '2',
    title: 'Test Post 2',
    slug: { current: 'test-post-2' },
    publishedAt: null,
    _createdAt: '2024-01-02T09:00:00Z'
  }
]

describe('Blog Status Management API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })

  describe('POST /api/admin/blog/status', () => {
    it('updates post status to published', async () => {
      const mockTransaction = {
        patch: vi.fn(() => ({
          set: vi.fn(() => ({}))
        })),
        commit: vi.fn().mockResolvedValue([{ _id: '1' }])
      }
      ;(client.transaction as any).mockReturnValue(mockTransaction)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: ['1'],
          status: 'published',
          publishedAt: '2024-01-01T10:00:00Z'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.status).toBe('published')
      expect(mockTransaction.patch).toHaveBeenCalledWith('1')
      expect(mockTransaction.commit).toHaveBeenCalled()
    })

    it('updates post status to draft', async () => {
      const mockTransaction = {
        patch: vi.fn(() => ({
          set: vi.fn(() => ({}))
        })),
        commit: vi.fn().mockResolvedValue([{ _id: '1' }])
      }
      ;(client.transaction as any).mockReturnValue(mockTransaction)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: ['1'],
          status: 'draft'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.status).toBe('draft')
    })

    it('handles bulk status updates', async () => {
      const mockTransaction = {
        patch: vi.fn(() => ({
          set: vi.fn(() => ({}))
        })),
        commit: vi.fn().mockResolvedValue([{ _id: '1' }, { _id: '2' }])
      }
      ;(client.transaction as any).mockReturnValue(mockTransaction)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: ['1', '2'],
          status: 'published',
          publishedAt: '2024-01-01T10:00:00Z'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.updatedPosts).toBe(2)
      expect(mockTransaction.patch).toHaveBeenCalledTimes(2)
    })

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: [],
          status: 'published'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Post IDs are required')
    })

    it('validates status field', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: ['1'],
          status: 'invalid'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Valid status is required')
    })

    it('requires publishedAt for scheduled posts', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/blog/status', {
        method: 'POST',
        body: JSON.stringify({
          postIds: ['1'],
          status: 'scheduled'
        })
      })

      const response = await statusPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Published date is required for scheduled posts')
    })
  })

  describe('GET /api/admin/blog/status', () => {
    it('fetches posts with filters', async () => {
      ;(client.fetch as any)
        .mockResolvedValueOnce(mockPosts) // Posts query
        .mockResolvedValueOnce({ // Stats query
          total: 2,
          published: 1,
          scheduled: 0,
          draft: 1,
          archived: 0
        })
        .mockResolvedValueOnce({ // Filters query
          authors: ['John Doe'],
          categories: ['Technology']
        })

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status?status=all&sortBy=newest')

      const response = await statusGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.posts).toEqual(mockPosts)
      expect(data.stats.total).toBe(2)
      expect(data.filters.authors).toEqual(['John Doe'])
    })

    it('applies status filter', async () => {
      ;(client.fetch as any)
        .mockResolvedValueOnce([mockPosts[0]]) // Only published posts
        .mockResolvedValueOnce({ total: 1, published: 1, scheduled: 0, draft: 0, archived: 0 })
        .mockResolvedValueOnce({ authors: [], categories: [] })

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status?status=published')

      const response = await statusGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0]._id).toBe('1')
    })

    it('applies search filter', async () => {
      ;(client.fetch as any)
        .mockResolvedValueOnce([mockPosts[0]]) // Filtered posts
        .mockResolvedValueOnce({ total: 1, published: 1, scheduled: 0, draft: 0, archived: 0 })
        .mockResolvedValueOnce({ authors: [], categories: [] })

      const request = new NextRequest('http://localhost:3000/api/admin/blog/status?search=Test Post 1')

      const response = await statusGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.query.search).toBe('Test Post 1')
    })
  })

  describe('POST /api/admin/blog/bulk', () => {
    it('deletes multiple posts', async () => {
      const mockTransaction = {
        delete: vi.fn(),
        commit: vi.fn().mockResolvedValue([])
      }
      ;(client.transaction as any).mockReturnValue(mockTransaction)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'delete',
          postIds: ['1', '2']
        })
      })

      const response = await bulkPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.deletedCount).toBe(2)
      expect(mockTransaction.delete).toHaveBeenCalledTimes(2)
      expect(mockTransaction.delete).toHaveBeenCalledWith('1')
      expect(mockTransaction.delete).toHaveBeenCalledWith('2')
    })

    it('duplicates a post', async () => {
      const originalPost = {
        _id: '1',
        title: 'Original Post',
        slug: { current: 'original-post' },
        publishedAt: '2024-01-01T10:00:00Z',
        body: [{ _type: 'block', children: [{ text: 'Content' }] }]
      }

      ;(client.fetch as any).mockResolvedValue(originalPost)
      ;(client.create as any).mockResolvedValue({
        _id: '3',
        title: 'Original Post (Copy)',
        slug: { current: 'original-post-copy-123456789' }
      })

      const request = new NextRequest('http://localhost:3000/api/admin/blog/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'duplicate',
          duplicatePostId: '1'
        })
      })

      const response = await bulkPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.duplicatedPost.title).toBe('Original Post (Copy)')
      expect(client.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Original Post (Copy)',
          publishedAt: null, // Should reset to draft
          status: null
        })
      )
    })

    it('validates action parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/blog/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalid'
        })
      })

      const response = await bulkPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Valid action is required (delete or duplicate)')
    })

    it('validates postIds for delete action', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/blog/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'delete',
          postIds: []
        })
      })

      const response = await bulkPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Post IDs are required for delete action')
    })

    it('handles post not found for duplicate', async () => {
      ;(client.fetch as any).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/admin/blog/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: 'duplicate',
          duplicatePostId: 'nonexistent'
        })
      })

      const response = await bulkPost(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Original post not found')
    })
  })
})