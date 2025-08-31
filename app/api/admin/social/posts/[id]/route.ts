import { NextRequest, NextResponse } from 'next/server'
import { SocialPostsService } from '@/lib/database/services/social-posts'
import { SocialPostUpdate } from '@/lib/database/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await SocialPostsService.getById(params.id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.data ? 500 : 404 }
      )
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error fetching social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate platform if provided
    if (body.platform && !['linkedin', 'twitter'].includes(body.platform)) {
      return NextResponse.json(
        { error: 'Platform must be either "linkedin" or "twitter"' },
        { status: 400 }
      )
    }

    // Validate status if provided
    if (body.status && !['draft', 'scheduled', 'published', 'failed'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updateData: SocialPostUpdate = {
      platform: body.platform,
      content: body.content,
      media_urls: body.media_urls,
      scheduled_at: body.scheduled_at,
      status: body.status,
      engagement_metrics: body.engagement_metrics
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof SocialPostUpdate] === undefined) {
        delete updateData[key as keyof SocialPostUpdate]
      }
    })

    const result = await SocialPostsService.update(params.id, updateData)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.data ? 500 : 404 }
      )
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error updating social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await SocialPostsService.delete(params.id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}