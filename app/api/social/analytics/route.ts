import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'

export const dynamic = 'force-dynamic'

// Initialize Ayrshare API
const ayrshare = new AyrshareAPI()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const action = searchParams.get('action')

    if (action === 'post' && postId) {
      // Get analytics for a specific post
      const analytics = await ayrshare.getAnalytics(postId)
      return NextResponse.json({
        success: true,
        data: analytics,
        message: 'Analytics retrieved successfully'
      })
    }

    if (action === 'summary') {
      // Get summary analytics from post history
      const limit = parseInt(searchParams.get('limit') || '50')
      const history = await ayrshare.getHistory(limit)
      
      // Process history to create summary analytics
      const summary = processSummaryAnalytics(history)
      
      return NextResponse.json({
        success: true,
        data: summary,
        message: 'Summary analytics retrieved successfully'
      })
    }

    if (action === 'platforms') {
      // Get platform-specific analytics
      const user = await ayrshare.getUser()
      const history = await ayrshare.getHistory(100)
      
      const platformAnalytics = processPlatformAnalytics(history, user)
      
      return NextResponse.json({
        success: true,
        data: platformAnalytics,
        message: 'Platform analytics retrieved successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter. Use: post, summary, or platforms' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to process summary analytics
function processSummaryAnalytics(history: any) {
  const posts = history.posts || []
  const totalPosts = posts.length
  
  let totalEngagement = 0
  let totalReach = 0
  let successfulPosts = 0
  let failedPosts = 0
  
  const platformStats: { [key: string]: { posts: number; engagement: number } } = {}
  
  posts.forEach((post: any) => {
    if (post.status === 'success') {
      successfulPosts++
      
      // Process platform-specific stats
      if (post.platforms) {
        post.platforms.forEach((platform: string) => {
          if (!platformStats[platform]) {
            platformStats[platform] = { posts: 0, engagement: 0 }
          }
          platformStats[platform].posts++
          
          // Add engagement if available
          if (post.analytics && post.analytics[platform]) {
            const analytics = post.analytics[platform]
            const engagement = (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0)
            platformStats[platform].engagement += engagement
            totalEngagement += engagement
            totalReach += analytics.reach || 0
          }
        })
      }
    } else {
      failedPosts++
    }
  })
  
  return {
    overview: {
      totalPosts,
      successfulPosts,
      failedPosts,
      successRate: totalPosts > 0 ? (successfulPosts / totalPosts * 100).toFixed(1) : '0',
      totalEngagement,
      totalReach,
      averageEngagement: successfulPosts > 0 ? (totalEngagement / successfulPosts).toFixed(1) : '0'
    },
    platformStats,
    recentActivity: posts.slice(0, 10).map((post: any) => ({
      id: post.id,
      content: post.post?.substring(0, 100) + (post.post?.length > 100 ? '...' : ''),
      platforms: post.platforms,
      status: post.status,
      createdAt: post.createdAt,
      engagement: post.analytics ? Object.values(post.analytics).reduce((sum: number, platform: any) => {
        return sum + (platform.likes || 0) + (platform.comments || 0) + (platform.shares || 0)
      }, 0) : 0
    }))
  }
}

// Helper function to process platform-specific analytics
function processPlatformAnalytics(history: any, user: any) {
  const posts = history.posts || []
  const connectedPlatforms = user.platforms || []
  
  const analytics: { [key: string]: any } = {}
  
  connectedPlatforms.forEach((platform: string) => {
    const platformPosts = posts.filter((post: any) => 
      post.platforms && post.platforms.includes(platform)
    )
    
    let totalEngagement = 0
    let totalReach = 0
    let totalImpressions = 0
    
    platformPosts.forEach((post: any) => {
      if (post.analytics && post.analytics[platform]) {
        const platformAnalytics = post.analytics[platform]
        totalEngagement += (platformAnalytics.likes || 0) + 
                          (platformAnalytics.comments || 0) + 
                          (platformAnalytics.shares || 0)
        totalReach += platformAnalytics.reach || 0
        totalImpressions += platformAnalytics.impressions || 0
      }
    })
    
    analytics[platform] = {
      totalPosts: platformPosts.length,
      totalEngagement,
      totalReach,
      totalImpressions,
      averageEngagement: platformPosts.length > 0 ? (totalEngagement / platformPosts.length).toFixed(1) : '0',
      engagementRate: totalImpressions > 0 ? (totalEngagement / totalImpressions * 100).toFixed(2) : '0',
      recentPosts: platformPosts.slice(0, 5).map((post: any) => ({
        id: post.id,
        content: post.post?.substring(0, 80) + (post.post?.length > 80 ? '...' : ''),
        createdAt: post.createdAt,
        engagement: post.analytics && post.analytics[platform] ? 
          (post.analytics[platform].likes || 0) + 
          (post.analytics[platform].comments || 0) + 
          (post.analytics[platform].shares || 0) : 0
      }))
    }
  })
  
  return {
    connectedPlatforms,
    platformAnalytics: analytics,
    summary: {
      totalPlatforms: connectedPlatforms.length,
      totalPosts: posts.length,
      mostActivePlatform: Object.entries(analytics).reduce((max, [platform, data]: [string, any]) => 
        data.totalPosts > (analytics[max]?.totalPosts || 0) ? platform : max, 
        connectedPlatforms[0] || 'none'
      )
    }
  }
}
