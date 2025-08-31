import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/integrations/openai'
import { SocialPostsService } from '@/lib/database/services/social-posts'

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt } = await request.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate LinkedIn post
    const linkedinPrompt = `
      Create a professional LinkedIn post based on this blog post:
      
      Title: ${title}
      Excerpt: ${excerpt || ''}
      Content: ${content.substring(0, 500)}...
      
      Requirements:
      - Professional tone suitable for LinkedIn
      - Include relevant hashtags
      - Encourage engagement
      - Keep under 1300 characters
      - Include a call-to-action to read the full blog post
    `

    // Generate Twitter/X post
    const twitterPrompt = `
      Create an engaging Twitter/X post based on this blog post:
      
      Title: ${title}
      Excerpt: ${excerpt || ''}
      Content: ${content.substring(0, 300)}...
      
      Requirements:
      - Engaging and concise tone
      - Include relevant hashtags
      - Keep under 280 characters
      - Include a call-to-action to read the full blog post
    `

    // Generate both posts concurrently
    const [linkedinResponse, twitterResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates engaging professional content."
          },
          {
            role: "user",
            content: linkedinPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a social media expert who creates engaging, concise content."
          },
          {
            role: "user",
            content: twitterPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      })
    ])

    const linkedinContent = linkedinResponse.choices[0]?.message?.content?.trim()
    const twitterContent = twitterResponse.choices[0]?.message?.content?.trim()

    if (!linkedinContent || !twitterContent) {
      throw new Error('Failed to generate social media content')
    }

    // Save generated posts to database as drafts
    const socialPosts = []

    // Save LinkedIn post
    const linkedinResult = await SocialPostsService.create({
      platform: 'linkedin',
      content: linkedinContent,
      status: 'draft'
    })

    if (linkedinResult.data) {
      socialPosts.push({
        platform: 'linkedin',
        content: linkedinContent,
        id: linkedinResult.data.id
      })
    }

    // Save Twitter post
    const twitterResult = await SocialPostsService.create({
      platform: 'twitter',
      content: twitterContent,
      status: 'draft'
    })

    if (twitterResult.data) {
      socialPosts.push({
        platform: 'twitter',
        content: twitterContent,
        id: twitterResult.data.id
      })
    }

    return NextResponse.json({
      success: true,
      socialPosts,
      message: 'Social media posts generated and saved as drafts'
    })
  } catch (error) {
    console.error('Error generating social posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate social media posts'
      },
      { status: 500 }
    )
  }
}