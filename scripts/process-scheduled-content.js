#!/usr/bin/env node

/**
 * Unified cron job script to process all scheduled content
 * 
 * This script processes scheduled social media posts, newsletter campaigns,
 * and any other scheduled content types. It includes retry logic, monitoring,
 * and comprehensive logging.
 * 
 * Usage:
 * node scripts/process-scheduled-content.js
 * 
 * Or add to crontab:
 * */5 * * * * /usr/bin/node /path/to/your/app/scripts/process-scheduled-content.js
 * 
 * Environment Variables:
 * - NEXTAUTH_URL: Base URL of the application
 * - SCHEDULER_TIMEOUT: Request timeout in milliseconds (default: 60000)
 * - SCHEDULER_LOG_LEVEL: Log level (debug, info, warn, error) (default: info)
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  endpoint: '/api/admin/scheduler',
  timeout: parseInt(process.env.SCHEDULER_TIMEOUT) || 60000, // 60 seconds
  logLevel: process.env.SCHEDULER_LOG_LEVEL || 'info',
  logFile: process.env.SCHEDULER_LOG_FILE || null
}

// Logging utility
class Logger {
  constructor(level = 'info', logFile = null) {
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 }
    this.level = this.levels[level] || 1
    this.logFile = logFile
  }

  log(level, message, data = null) {
    if (this.levels[level] < this.level) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(data && { data })
    }

    const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? ` | ${JSON.stringify(data)}` : ''}`
    
    console.log(logLine)

    if (this.logFile) {
      try {
        fs.appendFileSync(this.logFile, logLine + '\n')
      } catch (error) {
        console.error('Failed to write to log file:', error.message)
      }
    }
  }

  debug(message, data) { this.log('debug', message, data) }
  info(message, data) { this.log('info', message, data) }
  warn(message, data) { this.log('warn', message, data) }
  error(message, data) { this.log('error', message, data) }
}

const logger = new Logger(config.logLevel, config.logFile)

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Content-Scheduler/2.0',
        ...options.headers
      },
      timeout: config.timeout
    }

    logger.debug('Making request', { url, method: options.method || 'GET' })

    const req = client.request(requestOptions, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: result
          })
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: { error: 'Invalid JSON response', raw: data }
          })
        }
      })
    })

    req.on('error', (error) => {
      logger.error('Request error', { error: error.message })
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      const timeoutError = new Error(`Request timeout after ${config.timeout}ms`)
      logger.error('Request timeout', { timeout: config.timeout })
      reject(timeoutError)
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

async function checkSchedulerHealth() {
  try {
    logger.debug('Checking scheduler health...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}?action=health`)
    
    if (response.statusCode !== 200) {
      throw new Error(`Health check failed: ${response.statusCode}`)
    }

    const { healthy, errors } = response.data.data
    
    if (!healthy) {
      logger.warn('Scheduler health check failed', { errors })
      return false
    }

    logger.debug('Scheduler health check passed')
    return true
  } catch (error) {
    logger.error('Health check error', { error: error.message })
    return false
  }
}

async function getSchedulingStats() {
  try {
    logger.debug('Getting scheduling statistics...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}?action=stats`)
    
    if (response.statusCode !== 200) {
      throw new Error(`Stats request failed: ${response.statusCode}`)
    }

    return response.data.data
  } catch (error) {
    logger.error('Error getting scheduling stats', { error: error.message })
    throw error
  }
}

async function processScheduledContent() {
  try {
    logger.info('Starting scheduled content processing...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST',
      body: { action: 'process' }
    })
    
    if (response.statusCode !== 200) {
      throw new Error(`Process request failed: ${response.statusCode} - ${JSON.stringify(response.data)}`)
    }

    return response.data.data
  } catch (error) {
    logger.error('Error processing scheduled content', { error: error.message })
    throw error
  }
}

async function startScheduler() {
  try {
    logger.info('Starting background scheduler...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST',
      body: { action: 'start' }
    })
    
    if (response.statusCode !== 200) {
      throw new Error(`Start request failed: ${response.statusCode} - ${JSON.stringify(response.data)}`)
    }

    return response.data.data
  } catch (error) {
    logger.error('Error starting scheduler', { error: error.message })
    throw error
  }
}

async function getSchedulerStatus() {
  try {
    logger.debug('Getting scheduler status...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}?action=status`)
    
    if (response.statusCode !== 200) {
      throw new Error(`Status request failed: ${response.statusCode}`)
    }

    return response.data.data
  } catch (error) {
    logger.error('Error getting scheduler status', { error: error.message })
    throw error
  }
}

async function retryFailedContent(contentId, contentType) {
  try {
    logger.info(`Retrying failed content: ${contentType} ${contentId}`)
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST',
      body: { 
        action: 'retry',
        contentId,
        contentType
      }
    })
    
    if (response.statusCode !== 200) {
      throw new Error(`Retry request failed: ${response.statusCode}`)
    }

    return response.data.success
  } catch (error) {
    logger.error('Error retrying failed content', { 
      contentId, 
      contentType, 
      error: error.message 
    })
    return false
  }
}

async function main() {
  const startTime = Date.now()
  let exitCode = 0

  try {
    logger.info('=== Content Scheduler Started ===')

    // Health check
    const isHealthy = await checkSchedulerHealth()
    if (!isHealthy) {
      logger.error('Scheduler health check failed, aborting')
      process.exit(1)
    }

    // Get current scheduler status
    const status = await getSchedulerStatus()
    logger.info('Current scheduler status', {
      isRunning: status.isRunning,
      activeJobs: status.activeJobs,
      queueSize: status.queueSize,
      totalProcessed: status.stats.totalProcessed,
      successful: status.stats.successful,
      failed: status.stats.failed
    })

    // Start scheduler if not running
    if (!status.isRunning) {
      logger.info('Starting background scheduler...')
      await startScheduler()
    }

    // Force process queue to handle any immediate items
    const result = await processScheduledContent()
    
    logger.info('Processing completed', {
      totalProcessed: result.totalProcessed,
      successful: result.successful,
      failed: result.failed,
      retries: result.retries,
      duration: result.duration,
      byType: result.byType
    })

    // Log any errors
    if (result.errors && result.errors.length > 0) {
      logger.warn('Processing errors encountered', { errors: result.errors })
    }

    // Set exit code based on results
    if (result.failed > 0) {
      exitCode = 1
      logger.warn(`${result.failed} items failed to process`)
    }

  } catch (error) {
    logger.error('Fatal error in main process', { error: error.message })
    exitCode = 1
  } finally {
    const duration = Date.now() - startTime
    logger.info(`=== Content Scheduler Completed in ${duration}ms ===`)
    process.exit(exitCode)
  }
}

// Handle process signals
process.on('SIGINT', () => {
  logger.info('Received SIGINT, exiting gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, exiting gracefully...')
  process.exit(0)
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise })
  process.exit(1)
})

// Run the script
if (require.main === module) {
  main().catch((error) => {
    logger.error('Script execution failed', { error: error.message })
    process.exit(1)
  })
}

module.exports = { 
  main,
  checkSchedulerHealth,
  getSchedulingStats,
  processScheduledContent,
  retryFailedContent,
  Logger
}