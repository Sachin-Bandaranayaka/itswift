import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/ayrshare'
import { getEnvironmentConfig } from '@/lib/config/env'

// Initialize Ayrshare API
const ayrshare = AyrshareAPI.getInstance()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platforms, scheduledAt, mediaUrls, action } = body

    // Validate required fields
    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    // Validate platforms
    const validPlatforms = ['linkedin', 'twitter', 'facebook', 'instagram']
    const invalidPlatforms = platforms.filter((p: string) => !validPlatforms.includes(p))
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { error: `Invalid platforms: ${invalidPlatforms.join(', ')}` },
        { status: 400 }
      )
    }

    let result

    if (action === 'schedule' && scheduledAt) {
      // Schedule post for later
      result = await ayrshare.schedulePost({
        post: content,
        platforms,
        scheduleDate: new Date(scheduledAt),
        mediaUrls
      })
    } else {
      // Post immediately
      result = await ayrshare.post({
        post: content,
        platforms,
        mediaUrls
      })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: action === 'schedule' ? 'Post scheduled successfully' : 'Post published successfully'
    })

  } catch (error) {
    console.error('Social media posting error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process social media post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'test-connection') {
      // Test Ayrshare API connection
      const connectionTest = await ayrshare.testConnection()
      return NextResponse.json({
        success: connectionTest.status === 'success',
        connectedPlatforms: connectionTest.platforms,
        message: connectionTest.status === 'success'
          ? 'Successfully connected to Ayrshare API' 
          : 'Failed to connect to Ayrshare API'
      })
    }

    if (action === 'history') {
      // Get post history
      const lastRecords = parseInt(searchParams.get('limit') || '50')
      const history = await ayrshare.getPostHistory(lastRecords)
      return NextResponse.json({
        success: true,
        data: history
      })
    }

    if (action === 'user') {
      // Get user profile and connected accounts
      const user = await ayrshare.getUserProfile()
      return NextResponse.json({
        success: true,
        data: user
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Social media API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const result = await ayrshare.deletePost(postId)
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Social media delete error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}