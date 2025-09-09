import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platforms, scheduledAt, mediaUrls } = body

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    const ayrshare = new AyrshareAPI()
    
    const postData = {
      content,
      platforms,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      mediaUrls
    }

    const result = await ayrshare.createPost(postData)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Ayrshare post error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const ayrshare = new AyrshareAPI()
    const connectionTest = await ayrshare.testConnection()
    
    return NextResponse.json({
      success: connectionTest.success,
      connectedPlatforms: connectionTest.connectedPlatforms
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'API key not configured' 
      },
      { status: 500 }
    )
  }
}