// API route for automation statistics

import { NextRequest, NextResponse } from 'next/server'
import { AutomationRulesService } from '@/lib/database/services/automation-rules'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await AutomationRulesService.getStats()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch automation statistics', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}