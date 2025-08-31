import { getAdminSession } from '@/lib/auth/admin-auth'
import { NextRequest } from 'next/server'

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userEmail: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  success: boolean
  errorMessage?: string
}

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'content_created'
  | 'content_updated'
  | 'content_deleted'
  | 'content_published'
  | 'content_scheduled'
  | 'social_post_created'
  | 'social_post_published'
  | 'newsletter_sent'
  | 'subscriber_added'
  | 'subscriber_removed'
  | 'automation_rule_created'
  | 'automation_rule_updated'
  | 'automation_rule_deleted'
  | 'settings_updated'
  | 'api_key_updated'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'permission_changed'
  | 'data_exported'
  | 'system_backup'
  | 'system_restore'

// In-memory storage for demo - in production, use database or external logging service
const auditLogs: AuditLogEntry[] = []

/**
 * Extract client information from request
 */
function getClientInfo(request?: NextRequest): {
  ipAddress: string
  userAgent: string
} {
  if (!request) {
    return {
      ipAddress: 'unknown',
      userAgent: 'unknown',
    }
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  return { ipAddress, userAgent }
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
  action: AuditAction,
  resource: string,
  details: Record<string, any> = {},
  options: {
    resourceId?: string
    success?: boolean
    errorMessage?: string
    request?: NextRequest
  } = {}
): Promise<void> {
  try {
    const user = await getAdminSession()
    const clientInfo = getClientInfo(options.request)
    
    const logEntry: AuditLogEntry = {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'unknown',
      userRole: user?.role || 'unknown',
      action,
      resource,
      resourceId: options.resourceId,
      details,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      success: options.success ?? true,
      errorMessage: options.errorMessage,
    }

    // Store in memory (in production, send to database or logging service)
    auditLogs.push(logEntry)

    // Keep only last 1000 entries in memory
    if (auditLogs.length > 1000) {
      auditLogs.splice(0, auditLogs.length - 1000)
    }

    // Log to console for development
    console.log('Audit Log:', JSON.stringify(logEntry, null, 2))

    // In production, you would send this to:
    // - Database (Supabase, PostgreSQL, etc.)
    // - External logging service (DataDog, LogRocket, etc.)
    // - SIEM system
    // - File system with log rotation

  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}

/**
 * Generate unique log ID
 */
function generateLogId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get audit logs with filtering and pagination
 */
export function getAuditLogs(options: {
  userId?: string
  action?: AuditAction
  resource?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
} = {}): {
  logs: AuditLogEntry[]
  total: number
} {
  let filteredLogs = [...auditLogs]

  // Apply filters
  if (options.userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === options.userId)
  }

  if (options.action) {
    filteredLogs = filteredLogs.filter(log => log.action === options.action)
  }

  if (options.resource) {
    filteredLogs = filteredLogs.filter(log => log.resource === options.resource)
  }

  if (options.startDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) >= options.startDate!
    )
  }

  if (options.endDate) {
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) <= options.endDate!
    )
  }

  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const total = filteredLogs.length

  // Apply pagination
  const offset = options.offset || 0
  const limit = options.limit || 50
  const paginatedLogs = filteredLogs.slice(offset, offset + limit)

  return {
    logs: paginatedLogs,
    total,
  }
}

/**
 * Get audit statistics
 */
export function getAuditStats(timeframe: 'day' | 'week' | 'month' = 'day'): {
  totalEvents: number
  successfulEvents: number
  failedEvents: number
  topActions: Array<{ action: string; count: number }>
  topUsers: Array<{ userId: string; userEmail: string; count: number }>
} {
  const now = new Date()
  const timeframeMs = {
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  }

  const cutoffTime = new Date(now.getTime() - timeframeMs[timeframe])
  const recentLogs = auditLogs.filter(log => 
    new Date(log.timestamp) >= cutoffTime
  )

  const totalEvents = recentLogs.length
  const successfulEvents = recentLogs.filter(log => log.success).length
  const failedEvents = totalEvents - successfulEvents

  // Count actions
  const actionCounts: Record<string, number> = {}
  recentLogs.forEach(log => {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
  })

  const topActions = Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Count users
  const userCounts: Record<string, { userEmail: string; count: number }> = {}
  recentLogs.forEach(log => {
    if (!userCounts[log.userId]) {
      userCounts[log.userId] = { userEmail: log.userEmail, count: 0 }
    }
    userCounts[log.userId].count++
  })

  const topUsers = Object.entries(userCounts)
    .map(([userId, data]) => ({ userId, userEmail: data.userEmail, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalEvents,
    successfulEvents,
    failedEvents,
    topActions,
    topUsers,
  }
}

/**
 * Export audit logs (for compliance/backup)
 */
export function exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
  if (format === 'csv') {
    const headers = [
      'ID', 'Timestamp', 'User ID', 'User Email', 'User Role', 'Action',
      'Resource', 'Resource ID', 'Success', 'IP Address', 'User Agent', 'Details'
    ]

    const csvRows = [
      headers.join(','),
      ...auditLogs.map(log => [
        log.id,
        log.timestamp,
        log.userId,
        log.userEmail,
        log.userRole,
        log.action,
        log.resource,
        log.resourceId || '',
        log.success.toString(),
        log.ipAddress,
        `"${log.userAgent.replace(/"/g, '""')}"`,
        `"${JSON.stringify(log.details).replace(/"/g, '""')}"`,
      ].join(','))
    ]

    return csvRows.join('\n')
  }

  return JSON.stringify(auditLogs, null, 2)
}

/**
 * Middleware to automatically log API requests
 */
export function withAuditLogging(
  handler: (req: NextRequest) => Promise<Response>,
  resource: string
) {
  return async (req: NextRequest): Promise<Response> => {
    const startTime = Date.now()
    let success = true
    let errorMessage: string | undefined

    try {
      const response = await handler(req)
      success = response.status < 400
      
      if (!success) {
        const responseText = await response.text()
        errorMessage = responseText || `HTTP ${response.status}`
      }

      return response
    } catch (error) {
      success = false
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw error
    } finally {
      const duration = Date.now() - startTime
      
      await logAuditEvent(
        'api_request' as AuditAction,
        resource,
        {
          method: req.method,
          url: req.url,
          duration,
        },
        {
          success,
          errorMessage,
          request: req,
        }
      )
    }
  }
}