import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/blog/scheduled
 * Get all scheduled blog posts and scheduler statistics
 */
async function handleGetScheduled(request: NextRequest) {
  try {
    const scheduler = BlogPostScheduler.getInstance()
    
    // Get all scheduled posts
    const { posts, error } = await scheduler.getAllScheduledPosts()
    
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch scheduled posts',
          message: error
        },
        { status: 500 }
      )
    }
    
    // Get scheduler statistics
    const stats = await scheduler.getBlogSchedulingStats()
    
    // Get queue status
    const queueStatus = scheduler.getQueueStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        scheduledPosts: posts,
        count: posts.length,
        statistics: {
          totalScheduled: stats.totalScheduled,
          readyToProcess: stats.readyToProcess,
          inQueue: stats.inQueue,
          processing: stats.processing,
          failed: stats.failed,
          lastRun: stats.lastRun,
          nextRun: stats.nextRun,
          errors: stats.errors
        },
        queue: {
          size: queueStatus.size,
          items: queueStatus.items
        }
      }
    })
  } catch (error) {
    console.error('Error fetching scheduled blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scheduled blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetScheduled)