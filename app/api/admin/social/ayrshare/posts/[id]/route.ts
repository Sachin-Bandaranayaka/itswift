import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'
import { getSupabaseAdmin } from '@/lib/supabase'
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
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })
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
    const { id } = params
    const body = await request.json()

    const updateData: SocialPostUpdate = {
      platform: body.platforms?.[0], // Use first platform as primary
      content: body.content,
      media_urls: body.mediaUrls,
      scheduled_at: body.scheduledAt,
      status: body.status
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof SocialPostUpdate] === undefined) {
        delete updateData[key as keyof SocialPostUpdate]
      }
    })

    const result = await SocialPostsService.update(id, updateData)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: result.data 
    })
  } catch (error) {
    console.error('Error updating post:', error)
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
    const { id } = params
    
    // Use the existing SocialPostsService which handles the deletion logic
    const result = await SocialPostsService.delete(id)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete post' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}