import { NextRequest, NextResponse } from 'next/server'
import { getSocialMediaPublisher } from '@/lib/services/social-media-publisher'
import { SocialPostsService } from '@/lib/database/services/social-posts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, platform } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Get the post from database
    const postResult = await SocialPostsService.getById(postId)
    if (postResult.error || !postResult.data) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const post = postResult.data

    // Validate platform if specified
    if (platform && post.platform !== platform) {
      return NextResponse.json(
        { error: 'Platform mismatch' },
        { status: 400 }
      )
    }

    // Check if post is in a publishable state
    if (post.status === 'published') {
      return NextResponse.json(
        { error: 'Post is already published' },
        { status: 400 }
      )
    }

    // Publish the post
    const publisher = getSocialMediaPublisher()
    const result = await publisher.publishPost(post)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          platformPostId: result.platformPostId,
          platformUrl: result.platformUrl
        }
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Publishing failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error publishing post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Batch publish endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { postIds } = body

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required' },
        { status: 400 }
      )
    }

    // Get all posts from database
    const posts = []
    for (const postId of postIds) {
      const postResult = await SocialPostsService.getById(postId)
      if (postResult.data && postResult.data.status !== 'published') {
        posts.push(postResult.data)
      }
    }

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'No publishable posts found' },
        { status: 400 }
      )
    }

    // Publish all posts
    const publisher = getSocialMediaPublisher()
    const batchResult = await publisher.publishBatch(posts)

    return NextResponse.json({
      success: true,
      data: {
        results: batchResult.results,
        summary: batchResult.summary
      }
    })
  } catch (error) {
    console.error('Error batch publishing posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}