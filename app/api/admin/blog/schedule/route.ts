import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET(request: NextRequest) {
  try {
    // Get all scheduled blog posts that are ready to be published
    const now = new Date().toISOString()
    
    const query = `
      *[_type == "post" && publishedAt != null && publishedAt <= $now && !defined(actualPublishedAt)] {
        _id,
        title,
        publishedAt,
        slug,
        excerpt,
        body
      }
    `

    const scheduledPosts = await client.fetch(query, { now })

    return NextResponse.json({
      success: true,
      scheduledPosts: scheduledPosts || [],
      count: scheduledPosts?.length || 0
    })
  } catch (error) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch scheduled posts',
        scheduledPosts: [],
        count: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, postId } = await request.json()

    if (action === 'publish' && postId) {
      // Mark a scheduled post as actually published
      const result = await client
        .patch(postId)
        .set({ 
          actualPublishedAt: new Date().toISOString(),
          publishStatus: 'published'
        })
        .commit()

      return NextResponse.json({
        success: true,
        post: result,
        message: 'Post published successfully'
      })
    }

    if (action === 'check-scheduled') {
      // This endpoint can be called by a cron job to check for posts to publish
      const now = new Date().toISOString()
      
      const query = `
        *[_type == "post" && publishedAt != null && publishedAt <= $now && !defined(actualPublishedAt)] {
          _id,
          title,
          publishedAt,
          slug,
          excerpt,
          body,
          categories[]->{title}
        }
      `

      const postsToPublish = await client.fetch(query, { now })
      const publishedPosts = []

      // Process each post that needs to be published
      for (const post of postsToPublish) {
        try {
          // Mark as published
          await client
            .patch(post._id)
            .set({ 
              actualPublishedAt: new Date().toISOString(),
              publishStatus: 'published'
            })
            .commit()

          publishedPosts.push(post)

          // TODO: Trigger any post-publication actions here
          // - Send notifications
          // - Update search indexes
          // - Generate social media posts if enabled
          
        } catch (publishError) {
          console.error(`Error publishing post ${post._id}:`, publishError)
        }
      }

      return NextResponse.json({
        success: true,
        publishedCount: publishedPosts.length,
        publishedPosts,
        message: `Published ${publishedPosts.length} scheduled posts`
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing scheduled posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process scheduled posts'
      },
      { status: 500 }
    )
  }
}