import { describe, it, expect, vi, beforeEach } from 'vitest'
import OpenAI from 'openai'
import { 
  generateContent, 
  optimizeContent, 
  researchTopic, 
  generateSEOSuggestions 
} from '@/lib/integrations/openai'

vi.mock('openai')

const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn()
    }
  }
}

describe('OpenAI Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(OpenAI as any).mockImplementation(() => mockOpenAI)
  })

  describe('generateContent', () => {
    it('generates blog post content', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Generated blog post content' } }],
        usage: { total_tokens: 150 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await generateContent({
        prompt: 'Write about AI technology',
        contentType: 'blog',
        tone: 'professional',
        maxLength: 1000
      })

      expect(result).toEqual({
        content: 'Generated blog post content',
        tokensUsed: 150
      })

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('blog post')
          }),
          expect.objectContaining({
            role: 'user',
            content: 'Write about AI technology'
          })
        ]),
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    it('generates social media content for LinkedIn', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Professional LinkedIn post' } }],
        usage: { total_tokens: 75 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await generateContent({
        prompt: 'Share insights about remote work',
        contentType: 'social',
        platform: 'linkedin',
        tone: 'professional'
      })

      expect(result.content).toBe('Professional LinkedIn post')
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('LinkedIn')
            })
          ])
        })
      )
    })

    it('generates social media content for Twitter', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Engaging Twitter post #hashtag' } }],
        usage: { total_tokens: 50 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await generateContent({
        prompt: 'Tweet about productivity tips',
        contentType: 'social',
        platform: 'twitter',
        tone: 'casual'
      })

      expect(result.content).toBe('Engaging Twitter post #hashtag')
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('Twitter')
            })
          ])
        })
      )
    })

    it('handles API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValueOnce(
        new Error('OpenAI API error')
      )

      await expect(generateContent({
        prompt: 'Test prompt',
        contentType: 'blog'
      })).rejects.toThrow('OpenAI API error')
    })
  })

  describe('optimizeContent', () => {
    it('optimizes content for better engagement', async () => {
      const mockResponse = {
        choices: [{ 
          message: { 
            content: JSON.stringify({
              optimizedContent: 'Improved content with better flow',
              suggestions: ['Add more engaging headlines', 'Include call-to-action'],
              readabilityScore: 85
            })
          } 
        }],
        usage: { total_tokens: 200 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await optimizeContent(
        'Original content that needs improvement',
        'blog'
      )

      expect(result).toEqual({
        optimizedContent: 'Improved content with better flow',
        suggestions: ['Add more engaging headlines', 'Include call-to-action'],
        readabilityScore: 85,
        tokensUsed: 200
      })
    })
  })

  describe('researchTopic', () => {
    it('researches topic and provides insights', async () => {
      const mockResponse = {
        choices: [{ 
          message: { 
            content: JSON.stringify({
              keyPoints: ['Point 1', 'Point 2', 'Point 3'],
              statistics: ['Stat 1', 'Stat 2'],
              trends: ['Trend 1', 'Trend 2'],
              sources: ['Source 1', 'Source 2']
            })
          } 
        }],
        usage: { total_tokens: 300 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await researchTopic('Artificial Intelligence in Healthcare')

      expect(result).toEqual({
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        statistics: ['Stat 1', 'Stat 2'],
        trends: ['Trend 1', 'Trend 2'],
        sources: ['Source 1', 'Source 2'],
        tokensUsed: 300
      })
    })
  })

  describe('generateSEOSuggestions', () => {
    it('generates SEO optimization suggestions', async () => {
      const mockResponse = {
        choices: [{ 
          message: { 
            content: JSON.stringify({
              keywords: ['AI', 'machine learning', 'automation'],
              metaDescription: 'Comprehensive guide to AI technology and its applications',
              title: 'The Complete Guide to AI Technology in 2024',
              headings: ['Introduction to AI', 'AI Applications', 'Future of AI']
            })
          } 
        }],
        usage: { total_tokens: 180 }
      }

      mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse)

      const result = await generateSEOSuggestions(
        'Article about artificial intelligence',
        'AI technology guide'
      )

      expect(result).toEqual({
        keywords: ['AI', 'machine learning', 'automation'],
        metaDescription: 'Comprehensive guide to AI technology and its applications',
        title: 'The Complete Guide to AI Technology in 2024',
        headings: ['Introduction to AI', 'AI Applications', 'Future of AI'],
        tokensUsed: 180
      })
    })
  })
})