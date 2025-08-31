// Logging system for content scheduler

import fs from 'fs'
import path from 'path'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
  component?: string
  itemId?: string
  itemType?: string
}

export interface LogStats {
  total: number
  byLevel: Record<LogLevel, number>
  byComponent: Record<string, number>
  recentErrors: LogEntry[]
  lastHour: number
  lastDay: number
}

export class SchedulerLogger {
  private static instance: SchedulerLogger
  private logs: LogEntry[] = []
  private maxLogs = 10000 // Keep last 10k log entries in memory
  private logLevel: LogLevel
  private logFile?: string
  private enableConsole: boolean

  private constructor(
    logLevel: LogLevel = 'info',
    logFile?: string,
    enableConsole: boolean = true
  ) {
    this.logLevel = logLevel
    this.logFile = logFile
    this.enableConsole = enableConsole

    // Create log directory if file logging is enabled
    if (this.logFile) {
      const logDir = path.dirname(this.logFile)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
    }
  }

  static getInstance(
    logLevel?: LogLevel,
    logFile?: string,
    enableConsole?: boolean
  ): SchedulerLogger {
    if (!SchedulerLogger.instance) {
      SchedulerLogger.instance = new SchedulerLogger(logLevel, logFile, enableConsole)
    }
    return SchedulerLogger.instance
  }

  /**
   * Log a message
   */
  log(
    level: LogLevel,
    message: string,
    data?: any,
    component?: string,
    itemId?: string,
    itemType?: string
  ): void {
    // Check if we should log this level
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }

    if (levels[level] < levels[this.logLevel]) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      component,
      itemId,
      itemType
    }

    // Add to in-memory logs
    this.logs.push(entry)
    this.cleanupLogs()

    // Console output
    if (this.enableConsole) {
      this.logToConsole(entry)
    }

    // File output
    if (this.logFile) {
      this.logToFile(entry)
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any, component?: string, itemId?: string, itemType?: string): void {
    this.log('debug', message, data, component, itemId, itemType)
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any, component?: string, itemId?: string, itemType?: string): void {
    this.log('info', message, data, component, itemId, itemType)
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any, component?: string, itemId?: string, itemType?: string): void {
    this.log('warn', message, data, component, itemId, itemType)
  }

  /**
   * Error level logging
   */
  error(message: string, data?: any, component?: string, itemId?: string, itemType?: string): void {
    this.log('error', message, data, component, itemId, itemType)
  }

  /**
   * Log processing start
   */
  logProcessingStart(itemId: string, itemType: string, attempt: number): void {
    this.info(
      `Starting processing attempt ${attempt}`,
      { attempt },
      'processor',
      itemId,
      itemType
    )
  }

  /**
   * Log processing success
   */
  logProcessingSuccess(itemId: string, itemType: string, duration: number): void {
    this.info(
      `Processing completed successfully`,
      { duration },
      'processor',
      itemId,
      itemType
    )
  }

  /**
   * Log processing failure
   */
  logProcessingFailure(
    itemId: string,
    itemType: string,
    error: string,
    attempt: number,
    willRetry: boolean
  ): void {
    this.error(
      `Processing failed on attempt ${attempt}${willRetry ? ', will retry' : ', giving up'}`,
      { error, attempt, willRetry },
      'processor',
      itemId,
      itemType
    )
  }

  /**
   * Log queue operations
   */
  logQueueAdd(itemId: string, itemType: string, priority: number): void {
    this.debug(
      'Added item to queue',
      { priority },
      'queue',
      itemId,
      itemType
    )
  }

  logQueueRemove(itemId: string, itemType: string, reason: string): void {
    this.debug(
      'Removed item from queue',
      { reason },
      'queue',
      itemId,
      itemType
    )
  }

  /**
   * Log scheduler operations
   */
  logSchedulerStart(): void {
    this.info('Scheduler processing started', undefined, 'scheduler')
  }

  logSchedulerComplete(processed: number, successful: number, failed: number, duration: number): void {
    this.info(
      'Scheduler processing completed',
      { processed, successful, failed, duration },
      'scheduler'
    )
  }

  logSchedulerError(error: string): void {
    this.error('Scheduler error', { error }, 'scheduler')
  }

  /**
   * Get log statistics
   */
  getStats(): LogStats {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    const oneDay = 24 * oneHour

    const stats: LogStats = {
      total: this.logs.length,
      byLevel: { debug: 0, info: 0, warn: 0, error: 0 },
      byComponent: {},
      recentErrors: [],
      lastHour: 0,
      lastDay: 0
    }

    for (const entry of this.logs) {
      const age = now - entry.timestamp.getTime()

      // Count by level
      stats.byLevel[entry.level]++

      // Count by component
      const component = entry.component || 'unknown'
      stats.byComponent[component] = (stats.byComponent[component] || 0) + 1

      // Count recent entries
      if (age <= oneHour) stats.lastHour++
      if (age <= oneDay) stats.lastDay++

      // Collect recent errors
      if (entry.level === 'error' && age <= oneDay) {
        stats.recentErrors.push(entry)
      }
    }

    // Sort recent errors by timestamp (newest first)
    stats.recentErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    stats.recentErrors = stats.recentErrors.slice(0, 50) // Keep last 50 errors

    return stats
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 100, level?: LogLevel): LogEntry[] {
    let logs = [...this.logs]

    if (level) {
      logs = logs.filter(entry => entry.level === level)
    }

    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get logs for specific item
   */
  getItemLogs(itemId: string, limit: number = 50): LogEntry[] {
    return this.logs
      .filter(entry => entry.itemId === itemId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Clear old logs
   */
  clearOldLogs(olderThanDays: number = 7): number {
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000)
    const initialCount = this.logs.length
    
    this.logs = this.logs.filter(entry => entry.timestamp.getTime() > cutoff)
    
    const removed = initialCount - this.logs.length
    if (removed > 0) {
      this.info(`Cleared ${removed} old log entries`, { removed, olderThanDays }, 'logger')
    }
    
    return removed
  }

  /**
   * Export logs to file
   */
  exportLogs(filePath: string, format: 'json' | 'csv' = 'json'): void {
    try {
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      if (format === 'json') {
        fs.writeFileSync(filePath, JSON.stringify(this.logs, null, 2))
      } else if (format === 'csv') {
        const headers = 'timestamp,level,component,itemId,itemType,message,data\n'
        const rows = this.logs.map(entry => {
          const data = entry.data ? JSON.stringify(entry.data).replace(/"/g, '""') : ''
          return [
            entry.timestamp.toISOString(),
            entry.level,
            entry.component || '',
            entry.itemId || '',
            entry.itemType || '',
            `"${entry.message.replace(/"/g, '""')}"`,
            `"${data}"`
          ].join(',')
        }).join('\n')
        
        fs.writeFileSync(filePath, headers + rows)
      }

      this.info(`Exported ${this.logs.length} log entries to ${filePath}`, { filePath, format }, 'logger')
    } catch (error) {
      this.error('Failed to export logs', { error: error instanceof Error ? error.message : 'Unknown error', filePath }, 'logger')
    }
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const level = entry.level.toUpperCase().padEnd(5)
    const component = entry.component ? `[${entry.component}]` : ''
    const itemInfo = entry.itemId ? `{${entry.itemType}:${entry.itemId}}` : ''
    const data = entry.data ? ` | ${JSON.stringify(entry.data)}` : ''

    const message = `${timestamp} ${level} ${component}${itemInfo} ${entry.message}${data}`

    switch (entry.level) {
      case 'error':
        console.error(message)
        break
      case 'warn':
        console.warn(message)
        break
      case 'debug':
        console.debug(message)
        break
      default:
        console.log(message)
    }
  }

  /**
   * Log to file
   */
  private logToFile(entry: LogEntry): void {
    if (!this.logFile) return

    try {
      const logLine = JSON.stringify(entry) + '\n'
      fs.appendFileSync(this.logFile, logLine)
    } catch (error) {
      // Fallback to console if file logging fails
      console.error('Failed to write to log file:', error)
    }
  }

  /**
   * Clean up old logs from memory
   */
  private cleanupLogs(): void {
    if (this.logs.length > this.maxLogs) {
      const excess = this.logs.length - this.maxLogs
      this.logs.splice(0, excess)
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: {
    logLevel?: LogLevel
    logFile?: string
    enableConsole?: boolean
  }): void {
    if (config.logLevel) this.logLevel = config.logLevel
    if (config.logFile !== undefined) this.logFile = config.logFile
    if (config.enableConsole !== undefined) this.enableConsole = config.enableConsole

    this.info('Logger configuration updated', config, 'logger')
  }
}