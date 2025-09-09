import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, postIds } = body

    if (!postId && (!postIds || postIds.length === 0)) {
      return NextResponse.json(
        { error: 'postId or postIds array is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    const ayrshare = new AyrshareAPI()
    const results = []

    // Handle single post
    if (postId) {
      const result = await publishSinglePost(supabase, ayrshare, postId)
      results.push(result)
    }

    // Handle multiple posts
    if (postIds && postIds.length > 0) {
      for (const id of postIds) {
        const result = await publishSinglePost(supabase, ayrshare, id)
        results.push(result)
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: failureCount === 0,
      data: results,
      message: `Published ${successCount} post(s)${failureCount > 0 ? `, ${failureCount} failed` : ''}`
    })

  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function publishSinglePost(supabase: any, ayrshare: AyrshareAPI, postId: string) {
  try {
    // Get post from database
    const { data: post, error: fetchError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (fetchError || !post) {
      throw new Error(`Post not found: ${postId}`)
    }

    if (post.status === 'published') {
      return {
        success: false,
        postId,
        error: 'Post is already published'
      }
    }

    // Publish via Ayrshare
    const ayrshareResult = await ayrshare.createPost({
      content: post.content,
      platforms: post.platforms || [post.platform],
      mediaUrls: post.media_urls || []
    })

    // Update post in database
    const { error: updateError } = await supabase
      .from('social_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        ayrshare_id: ayrshareResult.id,
        ayrshare_post_ids: ayrshareResult.postIds,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    if (updateError) {
      throw new Error(`Failed to update post: ${updateError.message}`)
    }

    return {
      success: true,
      postId,
      ayrshareResult,
      message: 'Post published successfully'
    }

  } catch (error) {
    // Update post status to failed
    await supabase
      .from('social_posts')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    return {
      success: false,
      postId,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}