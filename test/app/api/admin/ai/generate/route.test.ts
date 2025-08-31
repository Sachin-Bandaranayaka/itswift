import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/admin/ai/generate/route'
import { NextRequest } from 'next/server'

// Mock the OpenAI integration
vi.mock('@/lib/integrations/openai', () => ({
  generateContent: vi.fn()
}))

// Mock the AI content log service
vi.mock('@/lib/database/services/ai-content-log', () => ({
  logAIContentGeneration: vi.fn()
}))

import { generateContent } from '@/lib/integrations/openai'
import { logAIContentGeneration } from '@/lib/database/services/ai-content-log'

describe('/api/admin/ai/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates content successfully', async () => {
    const mockGeneratedContent = {
      content: 'Generated AI content',
      tokensUsed: 150
    }

    ;(generateContent as any).mockResolvedValueOnce(mockGeneratedContent)
    ;(logAIContentGeneration as any).mockResolvedValueOnce({ id: '123' })

    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Write about AI technology',
        contentType: 'blog',
        tone: 'professional'
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
      content: 'Generated AI content',
      tokensUsed: 150
    })

    expect(generateContent).toHaveBeenCalledWith({
      prompt: 'Write about AI technology',
      contentType: 'blog',
      tone: 'professional'
    })

    expect(logAIContentGeneration).toHaveBeenCalledWith({
      prompt: 'Write about AI technology',
      generated_content: 'Generated AI content',
      content_type: 'blog',
      tokens_used: 150
    })
  })

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        contentType: 'blog'
        // Missing prompt
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
      error: 'Prompt is required'
    })

    expect(generateContent).not.toHaveBeenCalled()
  })

  it('validates content type', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Test prompt',
        contentType: 'invalid-type'
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
      error: 'Invalid content type'
    })
  })

  it('handles OpenAI API errors', async () => {
    ;(generateContent as any).mockRejectedValueOnce(new Error('OpenAI API error'))

    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Test prompt',
        contentType: 'blog'
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
      error: 'Failed to generate content'
    })
  })

  it('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Invalid JSON in request body'
    })
  })

  it('supports different content types and platforms', async () => {
    const mockGeneratedContent = {
      content: 'LinkedIn professional post',
      tokensUsed: 75
    }

    ;(generateContent as any).mockResolvedValueOnce(mockGeneratedContent)
    ;(logAIContentGeneration as any).mockResolvedValueOnce({ id: '123' })

    const request = new NextRequest('http://localhost:3000/api/admin/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Share professional insights',
        contentType: 'social',
        platform: 'linkedin',
        tone: 'professional',
        maxLength: 500
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(generateContent).toHaveBeenCalledWith({
      prompt: 'Share professional insights',
      contentType: 'social',
      platform: 'linkedin',
      tone: 'professional',
      maxLength: 500
    })
  })
})