import { NextRequest, NextResponse } from 'next/server'
import { generateContent, generateBlogPost, generateSocialPost, generateNewsletter } from '@/lib/integrations/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, contentType, platform, tone, keywords, targetAudience, maxLength } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let result

    // Use specific generation functions based on content type
    switch (contentType) {
      case 'blog':
        result = await generateBlogPost({
          topic: prompt,
          keywords,
          tone,
          targetAudience,
          wordCount: maxLength ? Math.floor(maxLength / 6) : undefined
        })
        break

      case 'social':
        result = await generateSocialPost({
          topic: prompt,
          platform: platform || 'linkedin',
          tone,
          includeHashtags: true
        })
        break

      case 'newsletter':
        result = await generateNewsletter({
          topic: prompt,
          tone,
          targetAudience
        })
        break

      default:
        // Fallback to general content generation
        result = await generateContent({
          prompt,
          contentType,
          platform,
          tone,
          maxLength,
          keywords,
          targetAudience
        })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating content:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}