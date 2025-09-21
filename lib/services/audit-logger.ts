import { writeFile, appendFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface AuditEntry {
  timestamp?: string
  action: string
  postIds?: string[]
  originalPostId?: string
  newPostId?: string
  newStatus?: string
  publishedAt?: string
  userAgent?: string
  ip?: string
  [key: string]: any
}

// Helpers to determine logging behavior in different environments
const isServerless = (): boolean => {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY ||
      process.env.GITHUB_ACTIONS
  )
}

const getLogsDir = (): string => {
  if (process.env.AUDIT_LOG_DIR) return process.env.AUDIT_LOG_DIR
  if (process.env.NODE_ENV === 'production' || isServerless()) {
    return process.env.TMPDIR || '/tmp'
  }
  return path.join(process.cwd(), 'logs')
}

const shouldWriteFiles = (): boolean => {
  if (typeof process.env.AUDIT_LOG_TO_FILE !== 'undefined') {
    return process.env.AUDIT_LOG_TO_FILE === 'true'
  }
  // Default: write to file only in non-production local environments
  return process.env.NODE_ENV !== 'production' && !isServerless()
}

export class AuditLogger {
  static async logEntry(entry: AuditEntry, headers?: Headers): Promise<void> {
    try {
      // Create audit log entry
      const auditEntry: AuditEntry = {
        timestamp: entry.timestamp || new Date().toISOString(),
        ...entry,
        userAgent: headers?.get('user-agent') || 'system',
        ip: headers?.get('x-forwarded-for') || headers?.get('x-real-ip') || 'unknown'
      }

      // Write to file only when allowed and safe
      if (shouldWriteFiles()) {
        const logsDir = getLogsDir()
        if (!existsSync(logsDir)) {
          await mkdir(logsDir, { recursive: true })
        }

        // Write to audit log file
        const logFile = path.join(logsDir, 'blog-audit.log')
        const logLine = JSON.stringify(auditEntry) + '\n'

        try {
          await appendFile(logFile, logLine)
        } catch (writeError) {
          console.error('Error writing to audit log:', writeError)
          // Don't fail the operation if logging fails
        }
      }

      // Also log to console for visibility in all environments
      console.log('Blog Audit:', auditEntry)
    } catch (error) {
      console.error('Error logging audit entry:', error)
      // Don't throw - audit logging should not break the main operation
    }
  }

  static async getAuditLogs(limit: number = 100): Promise<AuditEntry[]> {
    try {
      const primaryDir = getLogsDir()
      const fallbackDir = path.join(process.cwd(), 'logs')
      const primaryFile = path.join(primaryDir, 'blog-audit.log')
      const fallbackFile = path.join(fallbackDir, 'blog-audit.log')

      let logFile: string | null = null
      if (existsSync(primaryFile)) {
        logFile = primaryFile
      } else if (primaryFile !== fallbackFile && existsSync(fallbackFile)) {
        logFile = fallbackFile
      }

      if (!logFile) {
        return []
      }

      const { readFile } = await import('fs/promises')
      const content = await readFile(logFile, 'utf-8')
      const trimmed = content.trim()
      if (!trimmed) return []

      const lines = trimmed.split('\n').filter(line => line.trim())
      
      // Get the last N lines and parse them
      const recentLines = lines.slice(-limit)
      const entries: AuditEntry[] = []
      
      for (const line of recentLines) {
        try {
          const parsed = JSON.parse(line)
          entries.push(parsed)
        } catch (parseError) {
          console.error('Error parsing audit log line:', parseError)
        }
      }
      
      // Return in reverse chronological order (newest first)
      return entries.reverse()
    } catch (error) {
      console.error('Error reading audit logs:', error)
      return []
    }
  }
}