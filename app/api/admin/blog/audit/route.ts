import { NextRequest, NextResponse } from 'next/server'
import { AuditLogger } from '@/lib/services/audit-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, postIds, originalPostId, newPostId, newStatus, publishedAt, timestamp } = body

    // Use the audit logger service
    await AuditLogger.logEntry({
      timestamp: timestamp || new Date().toISOString(),
      action,
      ...(postIds && { postIds }),
      ...(originalPostId && { originalPostId }),
      ...(newPostId && { newPostId }),
      ...(newStatus && { newStatus }),
      ...(publishedAt && { publishedAt })
    }, request.headers)

    return NextResponse.json({
      success: true,
      message: 'Audit entry logged'
    })
  } catch (error) {
    console.error('Error logging audit entry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to log audit entry'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const action = searchParams.get('action')

    // Use the audit logger service to get entries
    let entries = await AuditLogger.getAuditLogs(limit)

    // Filter by action if specified
    if (action) {
      entries = entries.filter(entry => entry.action === action)
    }

    return NextResponse.json({
      success: true,
      entries,
      total: entries.length,
      showing: entries.length
    })
  } catch (error) {
    console.error('Error reading audit log:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read audit log',
        entries: []
      },
      { status: 500 }
    )
  }
}