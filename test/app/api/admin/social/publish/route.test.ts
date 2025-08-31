import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/admin/social/publish/route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/database/services/social-posts', () => ({
  createSocialPost: vi.fn(),
  updateSocialPost: vi.fn()
}))

vi.mock('@/lib/integrations/linkedin', () => ({
  publishToLinkedIn: vi.fn()
}))

vi.mock('@/lib/integrations/twitter', () => ({
  publishToTwitter: vi.fn()
}))

vi.mock('@/lib/security/input-validation', () => ({
  validateSocialPostContent: vi.fn(),
  sanitizeInput: vi.fn((input) => input)
}))

import { createSocialPost, updateSocialPost } from '@/lib/database/services/social-posts'
import { publishToLinkedIn } from '@/lib/integrations/linkedin'
import { publishToTwitter } from '@/lib/integrations/twitter'
import { validateSocialPostContent } from '@/lib/security/input-validation'

describe('/api/admin/social/publish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('publishes post immediately to LinkedIn', async () => {
    ;(validateSocialPostContent as any).mockReturnValueOnce({
      isValid: true,
      errors: []
    })

    ;(createSocialPost as any).mockResolvedValueOnce({
      id: 'post-123',
      platform: 'linkedin',
      content: 'Test LinkedIn post',
      status: 'draft'
    })

    ;(publishToLinkedIn as any).mockResolvedValueOnce({
      success: true,
      postId: 'linkedin-123',
      url: 'https://linkedin.com/post/123'
    })

    ;(updateSocialPost as any).mockResolvedValueOnce({
      id: 'post-123',
      status: 'published'
    })

    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'linkedin',
        content: 'Test LinkedIn post',
        publishNow: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      postId: 'post-123',
      platformPostId: 'linkedin-123',
      url: 'https://linkedin.com/post/123',
      status: 'published'
    })

    expect(publishToLinkedIn).toHaveBeenCalledWith({
      content: 'Test LinkedIn post',
      mediaUrls: [],
      accessToken: expect.any(String)
    })
  })

  it('schedules post for later publication', async () => {
    ;(validateSocialPostContent as any).mockReturnValueOnce({
      isValid: true,
      errors: []
    })

    ;(createSocialPost as any).mockResolvedValueOnce({
      id: 'post-123',
      platform: 'twitter',
      content: 'Scheduled Twitter post',
      status: 'scheduled',
      scheduled_at: '2024-01-01T12:00:00Z'
    })

    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'twitter',
        content: 'Scheduled Twitter post',
        scheduledAt: '2024-01-01T12:00:00Z'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      postId: 'post-123',
      status: 'scheduled',
      scheduledAt: '2024-01-01T12:00:00Z'
    })

    expect(createSocialPost).toHaveBeenCalledWith({
      platform: 'twitter',
      content: 'Scheduled Twitter post',
      media_urls: [],
      scheduled_at: new Date('2024-01-01T12:00:00Z'),
      status: 'scheduled'
    })

    // Should not publish immediately
    expect(publishToTwitter).not.toHaveBeenCalled()
  })

  it('validates post content before publishing', async () => {
    ;(validateSocialPostContent as any).mockReturnValueOnce({
      isValid: false,
      errors: ['Content exceeds character limit']
    })

    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'twitter',
        content: 'a'.repeat(300), // Too long for Twitter
        publishNow: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Content validation failed',
      details: ['Content exceeds character limit']
    })

    expect(createSocialPost).not.toHaveBeenCalled()
    expect(publishToTwitter).not.toHaveBeenCalled()
  })

  it('handles platform publishing errors', async () => {
    ;(validateSocialPostContent as any).mockReturnValueOnce({
      isValid: true,
      errors: []
    })

    ;(createSocialPost as any).mockResolvedValueOnce({
      id: 'post-123',
      platform: 'linkedin',
      content: 'Test post',
      status: 'draft'
    })

    ;(publishToLinkedIn as any).mockResolvedValueOnce({
      success: false,
      error: 'LinkedIn API error'
    })

    ;(updateSocialPost as any).mockResolvedValueOnce({
      id: 'post-123',
      status: 'failed'
    })

    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'linkedin',
        content: 'Test post',
        publishNow: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      success: false,
      error: 'Failed to publish to LinkedIn',
      details: 'LinkedIn API error'
    })

    expect(updateSocialPost).toHaveBeenCalledWith('post-123', {
      status: 'failed'
    })
  })

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'linkedin'
        // Missing content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Content is required'
    })
  })

  it('validates platform parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/social/publish', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'invalid-platform',
        content: 'Test content'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Invalid platform. Must be linkedin or twitter'
    })
  })
})