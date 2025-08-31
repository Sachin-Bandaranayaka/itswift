import { NextRequest, NextResponse } from 'next/server'
import { processScheduledPosts } from '@/lib/services/social-media-publisher'

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job or scheduler
    // In production, add authentication/authorization here
    
    await processScheduledPosts()
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled posts processed successfully'
    })
  } catch (error) {
    console.error('Error processing scheduled posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get scheduled posts that are ready to be published
    const { SocialPostsService } = await import('@/lib/database/services/social-posts')
    
    const result = await SocialPostsService.getScheduledPosts()
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    const now = new Date()
    const readyPosts = result.data.filter(post => {
      if (!post.scheduled_at) return false
      return new Date(post.scheduled_at) <= now
    })

    return NextResponse.json({
      success: true,
      data: {
        totalScheduled: result.data.length,
        readyToPublish: readyPosts.length,
        posts: readyPosts
      }
    })
  } catch (error) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}