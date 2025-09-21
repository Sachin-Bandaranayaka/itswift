import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'
import { getSupabaseAdmin } from '@/lib/supabase'
import { SocialPostsService } from '@/lib/database/services/social-posts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platforms, scheduledAt, mediaUrls, status = 'draft' } = body

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    
    // Save to database first
    const postData = {
      content,
      platform: platforms[0], // Use first platform as primary
      media_urls: mediaUrls || [],
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      status
    }

    const { data: post, error: dbError } = await supabase
      .from('social_posts')
      .insert(postData)
      .select()
      .single() as { data: any; error: any }

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // If status is 'published', send immediately via Ayrshare
    if (status === 'published') {
      try {
        const ayrshare = new AyrshareAPI()
        const result = await ayrshare.createPost({
          content,
          platforms: platforms as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
          mediaUrls
        })

        // Update post with published status
        const { error: updateError } = await supabase
          .from('social_posts')
          .update({
            published_at: new Date().toISOString(),
            status: 'published'
          })
          .eq('id', (post as any).id)

        if (updateError) {
          console.error('Failed to update post status:', updateError)
        }

        return NextResponse.json({ 
          success: true, 
          post: post,
          ayrshare: result,
          message: 'Post published successfully' 
        })
      } catch (ayrshareError) {
        // Update post with error status
        const { error: updateError } = await supabase
          .from('social_posts')
          .update({
            status: 'failed'
          })
          .eq('id', (post as any).id)

        return NextResponse.json({ 
          success: false, 
          post: post,
          error: (ayrshareError as any).message 
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: status === 'scheduled' ? 'Post scheduled successfully' : 'Post saved as draft'
    })

  } catch (error) {
    console.error('Social post creation error:', error)
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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')

    // Use SocialPostsService for consistency
    const filters = status ? { status } : {}
    const options = { limit }
    
    const result = await SocialPostsService.getAll(options, filters)

    if (result.error) {
      throw new Error(result.error)
    }

    return NextResponse.json({
      success: true,
      data: result.data || []
    })

  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}