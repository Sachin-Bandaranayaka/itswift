// API route for managing automation rules

import { NextRequest, NextResponse } from 'next/server'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'
import { AutomationRuleInput } from '@/lib/database/automation-types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || undefined
    
    const ruleType = searchParams.get('rule_type') || undefined
    const triggerType = searchParams.get('trigger_type') || undefined
    const isActive = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined

    const options = { limit, offset, orderBy, orderDirection }
    const filters = { rule_type: ruleType, trigger_type: triggerType, is_active: isActive }

    const { data, error } = await AutomationRulesService.getAll(options, filters)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch automation rules', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/rules:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.rule_type || !body.trigger_type || !body.actions) {
      return NextResponse.json(
        { error: 'Missing required fields: name, rule_type, trigger_type, actions' },
        { status: 400 }
      )
    }

    const ruleInput: AutomationRuleInput = {
      name: body.name,
      description: body.description,
      rule_type: body.rule_type,
      trigger_type: body.trigger_type,
      trigger_conditions: body.trigger_conditions || {},
      actions: body.actions,
      template_id: body.template_id,
      is_active: body.is_active !== undefined ? body.is_active : true,
      priority: body.priority || 0
    }

    const { data, error } = await AutomationRulesService.create(ruleInput)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create automation rule', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/automation/rules:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}