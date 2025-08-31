import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth/middleware'
import { setupAutomationTables } from '@/lib/database/setup-automation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Setup automation tables
    const result = await setupAutomationTables()

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: 'Failed to setup automation tables'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Automation tables setup successfully'
    })
  } catch (error) {
    console.error('Error setting up automation tables:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to setup automation tables'
      },
      { status: 500 }
    )
  }
}