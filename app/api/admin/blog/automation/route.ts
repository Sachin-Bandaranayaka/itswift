import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { AutomationEngine } from '@/lib/services/automation-engine'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'

/**
 * GET /api/admin/blog/automation
 * Get blog automation rules and status
 */
async function handleGetBlogAutomation(request: NextRequest) {
  try {
    const automationEngine = AutomationEngine.getInstance()
    const status = automationEngine.getStatus()
    
    // Get blog-related automation rules
    const { data: rules, error } = await AutomationRulesService.getActiveRulesByTrigger('blog_published')
    
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch automation rules',
          message: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        status,
        rules: rules || [],
        totalRules: rules?.length || 0,
        activeRules: rules?.filter(rule => rule.is_active).length || 0
      }
    })
  } catch (error) {
    console.error('Error fetching blog automation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog automation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blog/automation/trigger
 * Manually trigger blog automation for a specific post
 */
async function handleTriggerBlogAutomation(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogPostId, triggerType = 'manual' } = body

    if (!blogPostId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post ID is required'
        },
        { status: 400 }
      )
    }

    // Fetch blog post data from Supabase
    const { BlogService } = await import('@/lib/services/blog.service')
    const blogService = new BlogService()
    const blogPost = await blogService.getPostById(blogPostId)

    if (!blogPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    const automationEngine = AutomationEngine.getInstance()
    
    // Transform Supabase data to match expected structure
    const transformedBlogPost = {
      _id: blogPost.id,
      title: blogPost.title,
      slug: { current: blogPost.slug },
      content: blogPost.content ? [{ _type: 'block', children: [{ text: blogPost.content }] }] : [],
      excerpt: blogPost.excerpt,
      author: blogPost.author ? { name: blogPost.author.name } : undefined,
      categories: blogPost.category ? [{ title: blogPost.category.name }] : [],
      publishedAt: blogPost.published_at || new Date().toISOString()
    }
    
    // Process blog automation
    const result = await automationEngine.processBlogPublishedWithAutomation(transformedBlogPost)

    return NextResponse.json({
      success: true,
      message: `Blog automation triggered for "${transformedBlogPost.title}"`,
      data: {
        blogPostId,
        blogPostTitle: transformedBlogPost.title,
        socialPostsGenerated: result.socialPosts.length,
        analyticsTracked: result.analyticsTracked,
        automationSuccess: result.success,
        errors: result.errors,
        socialPosts: result.socialPosts.map(post => ({
          id: post.id,
          platform: post.platform,
          status: post.status,
          scheduledAt: post.scheduled_at
        }))
      }
    })
  } catch (error) {
    console.error('Error triggering blog automation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger blog automation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetBlogAutomation)
export const POST = withAdminAuth(handleTriggerBlogAutomation)