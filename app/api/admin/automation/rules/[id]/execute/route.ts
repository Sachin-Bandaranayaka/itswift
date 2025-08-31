// API route for executing automation rules manually

import { NextRequest, NextResponse } from 'next/server'
import { AutomationEngine } from '@/lib/services/automation-engine'
import { ManualTrigger } from '@/lib/database/automation-types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Create manual trigger data
    const triggerData: ManualTrigger = {
      user_id: body.user_id,
      trigger_reason: body.trigger_reason || 'Manual execution',
      context: body.context || {}
    }

    // Get automation engine instance and execute rule
    const automationEngine = AutomationEngine.getInstance()
    const result = await automationEngine.processManualTrigger(params.id, triggerData)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Rule execution failed', 
          details: result.errors.join(', '),
          execution_result: result
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Rule executed successfully',
      execution_result: result
    })
  } catch (error) {
    console.error('Error in POST /api/admin/automation/rules/[id]/execute:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}