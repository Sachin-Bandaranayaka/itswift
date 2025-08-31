// API route for individual automation rule operations

import { NextRequest, NextResponse } from 'next/server'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'
import { AutomationRuleUpdate } from '@/lib/database/automation-types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await AutomationRulesService.getById(params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch automation rule', details: error },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/rules/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updates: AutomationRuleUpdate = {}
    
    // Only include fields that are provided
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.rule_type !== undefined) updates.rule_type = body.rule_type
    if (body.trigger_type !== undefined) updates.trigger_type = body.trigger_type
    if (body.trigger_conditions !== undefined) updates.trigger_conditions = body.trigger_conditions
    if (body.actions !== undefined) updates.actions = body.actions
    if (body.template_id !== undefined) updates.template_id = body.template_id
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.priority !== undefined) updates.priority = body.priority

    const { data, error } = await AutomationRulesService.update(params.id, updates)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update automation rule', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in PUT /api/admin/automation/rules/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { success, error } = await AutomationRulesService.delete(params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete automation rule', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/automation/rules/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}