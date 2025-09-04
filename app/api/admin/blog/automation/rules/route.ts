import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'
import { AutomationRuleInput } from '@/lib/database/automation-types'

/**
 * GET /api/admin/blog/automation/rules
 * Get all blog automation rules
 */
async function handleGetBlogAutomationRules(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    let rules
    if (active === 'true') {
      const result = await AutomationRulesService.getActiveRulesByTrigger('blog_published')
      rules = result.data
      if (result.error) throw new Error(result.error)
    } else {
      const result = await AutomationRulesService.getAll()
      rules = result.data?.filter(rule => rule.trigger_type === 'blog_published') || []
      if (result.error) throw new Error(result.error)
    }

    return NextResponse.json({
      success: true,
      data: rules,
      count: rules.length
    })
  } catch (error) {
    console.error('Error fetching blog automation rules:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog automation rules',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blog/automation/rules
 * Create a new blog automation rule
 */
async function handleCreateBlogAutomationRule(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      rule_type = 'content_generation',
      trigger_conditions = {},
      actions = [],
      is_active = true,
      priority = 1
    } = body

    if (!name || !actions.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and actions are required'
        },
        { status: 400 }
      )
    }

    // Validate actions for blog automation
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

    const ruleInput: AutomationRuleInput = {
      name,
      description,
      rule_type,
      trigger_type: 'blog_published',
      trigger_conditions: {
        blog_categories: trigger_conditions.blog_categories || ['all'],
        ...trigger_conditions
      },
      actions,
      is_active,
      priority
    }

    const { data: rule, error } = await AutomationRulesService.create(ruleInput)

    if (error || !rule) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create automation rule',
          message: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog automation rule created successfully',
      data: rule
    })
  } catch (error) {
    console.error('Error creating blog automation rule:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog automation rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetBlogAutomationRules)
export const POST = withAdminAuth(handleCreateBlogAutomationRule)