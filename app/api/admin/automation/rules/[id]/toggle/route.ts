// API route for toggling automation rule active status

import { NextRequest, NextResponse } from 'next/server'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await AutomationRulesService.toggleActive(params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to toggle automation rule status', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      data, 
      success: true,
      message: `Rule ${data?.is_active ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    console.error('Error in POST /api/admin/automation/rules/[id]/toggle:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}