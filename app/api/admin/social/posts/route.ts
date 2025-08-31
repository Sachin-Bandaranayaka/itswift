import { NextRequest, NextResponse } from 'next/server'
import { SocialPostsService } from '@/lib/database/services/social-posts'
import { SocialPostInput } from '@/lib/database/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || undefined
    
    // Parse filters
    const status = searchParams.get('status') || undefined
    const platform = searchParams.get('platform') || undefined
    const dateFrom = searchParams.get('date_from') || undefined
    const dateTo = searchParams.get('date_to') || undefined

    const options = {
      limit,
      offset,
      orderBy,
      orderDirection
    }

    const filters = {
      status,
      platform,
      date_from: dateFrom,
      date_to: dateTo
    }

    const result = await SocialPostsService.getAll(options, filters)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: result.data,
      count: result.count
    })
  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.platform || !body.content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      )
    }

    // Validate platform
    if (!['linkedin', 'twitter'].includes(body.platform)) {
      return NextResponse.json(
        { error: 'Platform must be either "linkedin" or "twitter"' },
        { status: 400 }
      )
    }

    const postInput: SocialPostInput = {
      platform: body.platform,
      content: body.content,
      media_urls: body.media_urls,
      scheduled_at: body.scheduled_at,
      status: body.status || 'draft'
    }

    const result = await SocialPostsService.create(postInput)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { data: result.data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}