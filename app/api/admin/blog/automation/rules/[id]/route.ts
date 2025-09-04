import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'
import { AutomationEngine } from '@/lib/services/automation-engine'

/**
 * GET /api/admin/blog/automation/rules/[id]
 * Get a specific blog automation rule
 */
async function handleGetBlogAutomationRule(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: rule, error } = await AutomationRulesService.getById(params.id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch automation rule',
          message: error
        },
        { status: 500 }
      )
    }

    if (!rule) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation rule not found'
        },
        { status: 404 }
      )
    }

    // Only return blog-related rules
    if (rule.trigger_type !== 'blog_published') {
      return NextResponse.json(
        {
          success: false,
          error: 'Rule is not a blog automation rule'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: rule
    })
  } catch (error) {
    console.error('Error fetching blog automation rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog automation rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/blog/automation/rules/[id]
 * Update a blog automation rule
 */
async function handleUpdateBlogAutomationRule(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      rule_type,
      trigger_conditions,
      actions,
      is_active,
      priority
    } = body

    // Validate actions if provided
    if (actions) {
      const validActionTypes = [
        'generate_social_post',
        'generate_newsletter',
        'send_notification',
        'update_analytics'
      ]

      const invalidActions = actions.filter((action: any) => 
        !validActionTypes.includes(action.type)
      )

      if (invalidActions.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid action types: ${invalidActions.map((a: any) => a.type).join(', ')}`
          },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (rule_type !== undefined) updateData.rule_type = rule_type
    if (trigger_conditions !== undefined) updateData.trigger_conditions = trigger_conditions
    if (actions !== undefined) updateData.actions = actions
    if (is_active !== undefined) updateData.is_active = is_active
    if (priority !== undefined) updateData.priority = priority

    const { data: rule, error } = await AutomationRulesService.update(params.id, updateData)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update automation rule',
          message: error
        },
        { status: 500 }
      )
    }

    if (!rule) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation rule not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog automation rule updated successfully',
      data: rule
    })
  } catch (error) {
    console.error('Error updating blog automation rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog automation rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/blog/automation/rules/[id]
 * Delete a blog automation rule
 */
async function handleDeleteBlogAutomationRule(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await AutomationRulesService.delete(params.id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete automation rule',
          message: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog automation rule deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog automation rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog automation rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blog/automation/rules/[id]/execute
 * Manually execute a blog automation rule
 */
async function handleExecuteBlogAutomationRule(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { blogPostId } = body

    if (!blogPostId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post ID is required'
        },
        { status: 400 }
      )
    }

    // Fetch blog post data
    const { client } = await import('@/lib/sanity.client')
    const blogPost = await client.fetch(`
      *[_type == "post" && _id == $blogPostId][0] {
        _id,
        title,
        slug,
        body,
        excerpt,
        author-> {
          name
        },
        categories[]-> {
          title
        },
        publishedAt
      }
    `, { blogPostId })

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
    
    // Execute the specific rule manually
    const result = await automationEngine.processManualTrigger(params.id, {
      user_id: 'admin', // Could be extracted from auth
      trigger_reason: 'Manual execution from admin interface',
      context: {
        blogPost,
        executedAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Automation rule executed successfully for "${blogPost.title}"`
        : 'Automation rule execution failed',
      data: {
        ruleId: params.id,
        blogPostId,
        blogPostTitle: blogPost.title,
        executionResult: result,
        createdContentIds: result.created_content_ids
      }
    })
  } catch (error) {
    console.error('Error executing blog automation rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute blog automation rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetBlogAutomationRule)
export const PUT = withAdminAuth(handleUpdateBlogAutomationRule)
export const DELETE = withAdminAuth(handleDeleteBlogAutomationRule)