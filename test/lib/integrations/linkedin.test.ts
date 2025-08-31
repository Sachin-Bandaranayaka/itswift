import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publishToLinkedIn, getLinkedInProfile } from '@/lib/integrations/linkedin'

// Mock fetch
global.fetch = vi.fn()

describe('LinkedIn Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('publishToLinkedIn', () => {
    it('publishes text post to LinkedIn', async () => {
      const mockResponse = {
        id: 'urn:li:share:123456789'
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await publishToLinkedIn({
        content: 'Test LinkedIn post content',
        accessToken: 'test-access-token'
      })

      expect(result).toEqual({
        success: true,
        postId: 'urn:li:share:123456789',
        url: 'https://www.linkedin.com/feed/update/urn:li:share:123456789'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-access-token',
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          },
          body: expect.stringContaining('Test LinkedIn post content')
        }
      )
    })

    it('publishes post with media to LinkedIn', async () => {
      const mockResponse = {
        id: 'urn:li:share:123456789'
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await publishToLinkedIn({
        content: 'Post with image',
        mediaUrls: ['https://example.com/image.jpg'],
        accessToken: 'test-access-token'
      })

      expect(result.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/v2/ugcPosts',
        expect.objectContaining({
          body: expect.stringContaining('https://example.com/image.jpg')
        })
      )
    })

    it('handles LinkedIn API errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Invalid request',
          serviceErrorCode: 100
        })
      })

      const result = await publishToLinkedIn({
        content: 'Test post',
        accessToken: 'invalid-token'
      })

      expect(result).toEqual({
        success: false,
        error: 'LinkedIn API error: Invalid request'
      })
    })

    it('handles network errors', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const result = await publishToLinkedIn({
        content: 'Test post',
        accessToken: 'test-token'
      })

      expect(result).toEqual({
        success: false,
        error: 'Network error'
      })
    })
  })

  describe('getLinkedInProfile', () => {
    it('retrieves LinkedIn profile information', async () => {
      const mockProfile = {
        id: 'test-user-id',
        firstName: { localized: { en_US: 'John' } },
        lastName: { localized: { en_US: 'Doe' } },
        profilePicture: {
          'displayImage~': {
            elements: [{ identifiers: [{ identifier: 'https://example.com/profile.jpg' }] }]
          }
        }
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile)
      })

      const result = await getLinkedInProfile('test-access-token')

      expect(result).toEqual({
        id: 'test-user-id',
        name: 'John Doe',
        profilePicture: 'https://example.com/profile.jpg'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
        {
          headers: {
            'Authorization': 'Bearer test-access-token',
            'Content-Type': 'application/json'
          }
        }
      )
    })

    it('handles profile fetch errors', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' })
      })

      await expect(getLinkedInProfile('invalid-token')).rejects.toThrow('Unauthorized')
    })
  })
})