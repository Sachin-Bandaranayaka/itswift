import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogs, getAuditStats, exportAuditLogs } from '@/lib/security/audit-logger'
import { requirePermission } from '@/lib/auth/admin-auth'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'

async function handleGetAuditLogs(request: NextRequest) {
  try {
    // Check permissions
    await requirePermission('canManageSettings')(request)

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || undefined
    const action = searchParams.get('action') as any || undefined
    const resource = searchParams.get('resource') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const format = searchParams.get('format') as 'json' | 'csv' || 'json'
    const stats = searchParams.get('stats') === 'true'

    if (stats) {
      const timeframe = searchParams.get('timeframe') as 'day' | 'week' | 'month' || 'day'
      const auditStats = getAuditStats(timeframe)
      return NextResponse.json(auditStats)
    }

    if (format === 'csv') {
      const csvData = exportAuditLogs('csv')
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="audit-logs.csv"',
        },
      })
    }

    const result = getAuditLogs({
      userId,
      action,
      resource,
      startDate,
      endDate,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(handleGetAuditLogs, rateLimitConfigs.api)