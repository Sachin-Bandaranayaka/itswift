import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'

/**
 * POST /api/admin/blog/process-scheduled
 * Manually trigger processing of scheduled blog posts
 */
async function handleProcessScheduled(request: NextRequest) {
  try {
    const scheduler = BlogPostScheduler.getInstance()
    
    // Process all scheduled blog posts
    const result = await scheduler.processScheduledBlogPosts()
    
    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} blog posts`,
      data: {
        processed: result.processed,
        successful: result.successful,
        failed: result.failed,
        publishedPosts: result.publishedPosts,
        errors: result.errors
      }
    })
  } catch (error) {
    console.error('Error processing scheduled blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process scheduled blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const POST = withAdminAuth(handleProcessScheduled)