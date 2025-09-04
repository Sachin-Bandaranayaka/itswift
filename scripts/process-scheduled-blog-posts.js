#!/usr/bin/env node

/**
 * Cron job script to process scheduled blog posts
 * 
 * This script should be run periodically (e.g., every 5-15 minutes) to check for
 * scheduled blog posts that are ready to be published and publish them automatically.
 * 
 * Usage:
 * node scripts/process-scheduled-blog-posts.js
 * 
 * Or add to crontab:
 * (see setup script for cron configuration)
 * 
 * Environment Variables:
 * - NEXTAUTH_URL: Base URL of the application (default: http://localhost:3000)
 * - BLOG_SCHEDULER_TIMEOUT: Request timeout in milliseconds (default: 30000)
 * - BLOG_SCHEDULER_LOG_LEVEL: Log level (debug, info, warn, error) (default: info)
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  endpoint: '/api/admin/blog/process-scheduled',
  timeout: parseInt(process.env.BLOG_SCHEDULER_TIMEOUT) || 30000, // 30 seconds
  logLevel: process.env.BLOG_SCHEDULER_LOG_LEVEL || 'info',
  healthCheckEndpoint: '/api/health',
  maxRetries: 3,
  retryDelayMs: 5000 // 5 seconds between retries
}

// Logging levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const currentLogLevel = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info

/**
 * Logger with different levels
 */
const logger = {
  debug: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.debug) {
      console.log(`[${new Date().toISOString()}] [DEBUG] ${message}`, ...args)
    }
  },
  info: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.info) {
      console.log(`[${new Date().toISOString()}] [INFO] ${message}`, ...args)
    }
  },
  warn: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.warn) {
      console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, ...args)
    }
  },
  error: (message, ...args) => {
    if (currentLogLevel <= LOG_LEVELS.error) {
      console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, ...args)
    }
  }
}

/**
 * Make HTTP/HTTPS request with proper error handling
 */
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
        'User-Agent': 'Blog-Post-Scheduler/1.0',
        ...options.headers
      },
      timeout: config.timeout
    }

    logger.debug(`Making ${requestOptions.method} request to ${url}`)

    const req = client.request(requestOptions, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        logger.debug(`Response status: ${res.statusCode}, data length: ${data.length}`)
        
        try {
          const result = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: result,
            headers: res.headers
          })
        } catch (error) {
          logger.warn('Failed to parse JSON response, returning raw data')
          resolve({
            statusCode: res.statusCode,
            data: { error: 'Invalid JSON response', raw: data },
            headers: res.headers
          })
        }
      })
    })

    req.on('error', (error) => {
      logger.error('Request error:', error.message)
      reject(error)
    })

    req.on('timeout', () => {
      logger.error('Request timeout')
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (options.body) {
      const bodyData = JSON.stringify(options.body)
      logger.debug('Request body:', bodyData)
      req.write(bodyData)
    }

    req.end()
  })
}

/**
 * Perform health check before processing
 */
async function performHealthCheck() {
  logger.debug('Performing health check...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}${config.healthCheckEndpoint}`)
    
    if (response.statusCode === 200) {
      logger.debug('Health check passed')
      return { healthy: true, data: response.data }
    } else {
      logger.warn(`Health check failed with status ${response.statusCode}`)
      return { 
        healthy: false, 
        error: `Health check returned status ${response.statusCode}`,
        data: response.data
      }
    }
  } catch (error) {
    logger.error('Health check failed:', error.message)
    return { 
      healthy: false, 
      error: `Health check failed: ${error.message}` 
    }
  }
}

/**
 * Get scheduler statistics by checking the health endpoint
 */
async function getSchedulerStats() {
  logger.debug('Getting scheduler statistics...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/admin/blog/health`)
    
    if (response.statusCode === 200) {
      const health = response.data
      const stats = {
        totalScheduled: health.statistics?.totalScheduled || 0,
        readyToPublish: health.statistics?.readyToProcess || 0
      }
      logger.debug('Scheduler stats:', stats)
      return { success: true, stats }
    } else {
      logger.warn(`Failed to get scheduler stats: ${response.statusCode}`)
      return { 
        success: false, 
        error: `Stats request failed: ${response.statusCode}`,
        data: response.data
      }
    }
  } catch (error) {
    logger.error('Error getting scheduler stats:', error.message)
    return { 
      success: false, 
      error: `Stats request failed: ${error.message}` 
    }
  }
}

/**
 * Process scheduled blog posts with retry logic
 */
async function processScheduledBlogPosts() {
  const startTime = Date.now()
  logger.info('Starting scheduled blog posts processing...')

  let lastError = null
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      logger.debug(`Processing attempt ${attempt}/${config.maxRetries}`)
      
      // Try to get stats first, but don't fail if it doesn't work
      logger.info('Checking for blog posts ready to publish...')
      const statsResult = await getSchedulerStats()
      
      if (statsResult.success) {
        const { totalScheduled = 0, readyToPublish = 0 } = statsResult.stats
        logger.info(`Found ${totalScheduled} scheduled blog posts, ${readyToPublish} ready to publish`)

        if (readyToPublish === 0) {
          logger.info('No blog posts ready for publishing')
          const duration = Date.now() - startTime
          logger.info(`Completed check in ${duration}ms - no posts to process`)
          return {
            success: true,
            processed: 0,
            message: 'No posts ready for publishing'
          }
        }
      } else {
        logger.warn('Could not get scheduler stats, proceeding with processing anyway')
        logger.debug('Stats error:', statsResult.error)
      }

      // Process the scheduled blog posts
      logger.info('Processing scheduled blog posts...')
      const processResponse = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
        method: 'POST'
      })

      if (processResponse.statusCode !== 200) {
        throw new Error(`Process request failed: ${processResponse.statusCode} - ${JSON.stringify(processResponse.data)}`)
      }

      const duration = Date.now() - startTime
      const result = processResponse.data.data || {}
      
      logger.info(`Successfully processed scheduled blog posts in ${duration}ms`)
      logger.info(`Results: ${result.successful || 0} successful, ${result.failed || 0} failed out of ${result.processed || 0} processed`)
      
      if (result.errors && result.errors.length > 0) {
        logger.warn('Processing errors:', result.errors)
      }
      
      if (result.publishedPosts && result.publishedPosts.length > 0) {
        logger.info('Published posts:', result.publishedPosts)
      }

      return {
        success: true,
        processed: result.processed || 0,
        successful: result.successful || 0,
        failed: result.failed || 0,
        publishedPosts: result.publishedPosts || [],
        errors: result.errors || [],
        duration,
        message: processResponse.data.message || 'Processing completed'
      }

    } catch (error) {
      lastError = error
      logger.error(`Attempt ${attempt} failed:`, error.message)
      
      if (attempt < config.maxRetries) {
        logger.info(`Waiting ${config.retryDelayMs}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, config.retryDelayMs))
      }
    }
  }

  // All attempts failed
  const duration = Date.now() - startTime
  logger.error(`All ${config.maxRetries} attempts failed after ${duration}ms`)
  throw lastError
}

/**
 * Write execution log to file
 */
async function writeExecutionLog(result) {
  try {
    const logDir = path.join(process.cwd(), 'logs')
    const logFile = path.join(logDir, 'blog-scheduler.log')
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      success: result.success,
      processed: result.processed || 0,
      successful: result.successful || 0,
      failed: result.failed || 0,
      duration: result.duration || 0,
      publishedPosts: result.publishedPosts || [],
      errors: result.errors || [],
      message: result.message || ''
    }
    
    const logLine = JSON.stringify(logEntry) + '\n'
    
    // Append to log file
    fs.appendFileSync(logFile, logLine)
    logger.debug(`Execution log written to ${logFile}`)
    
  } catch (error) {
    logger.warn('Failed to write execution log:', error.message)
  }
}

/**
 * Monitor system resources and log warnings
 */
function monitorSystemResources() {
  try {
    const memUsage = process.memoryUsage()
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    }
    
    logger.debug('Memory usage (MB):', memUsageMB)
    
    // Warn if memory usage is high
    if (memUsageMB.heapUsed > 100) {
      logger.warn(`High memory usage detected: ${memUsageMB.heapUsed}MB heap used`)
    }
    
    // Log CPU usage if available
    if (process.cpuUsage) {
      const cpuUsage = process.cpuUsage()
      logger.debug('CPU usage:', {
        user: Math.round(cpuUsage.user / 1000),
        system: Math.round(cpuUsage.system / 1000)
      })
    }
    
  } catch (error) {
    logger.debug('Failed to monitor system resources:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  const scriptStartTime = Date.now()
  
  try {
    logger.info('Blog post scheduler cron job started')
    logger.debug('Configuration:', {
      baseUrl: config.baseUrl,
      endpoint: config.endpoint,
      timeout: config.timeout,
      logLevel: config.logLevel,
      maxRetries: config.maxRetries
    })
    
    // Monitor system resources
    monitorSystemResources()
    
    // Perform health check first
    logger.info('Performing application health check...')
    const healthCheck = await performHealthCheck()
    
    if (!healthCheck.healthy) {
      logger.error('Application health check failed:', healthCheck.error)
      logger.warn('Proceeding with processing despite health check failure')
      // Don't exit - the health check might fail for non-critical reasons
    } else {
      logger.info('Application health check passed')
    }
    
    // Process scheduled blog posts
    const result = await processScheduledBlogPosts()
    
    // Write execution log
    await writeExecutionLog(result)
    
    const totalDuration = Date.now() - scriptStartTime
    logger.info(`Blog post scheduler completed successfully in ${totalDuration}ms`)
    
    // Final resource monitoring
    monitorSystemResources()
    
    process.exit(0)
    
  } catch (error) {
    const totalDuration = Date.now() - scriptStartTime
    logger.error(`Blog post scheduler failed after ${totalDuration}ms:`, error.message)
    
    // Write error log
    await writeExecutionLog({
      success: false,
      error: error.message,
      duration: totalDuration,
      message: 'Script execution failed'
    })
    
    // Final resource monitoring
    monitorSystemResources()
    
    process.exit(1)
  }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  logger.info('Received SIGINT, exiting gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, exiting gracefully...')
  process.exit(0)
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run the script if called directly
if (require.main === module) {
  main()
}

// Export for testing
module.exports = { 
  processScheduledBlogPosts,
  performHealthCheck,
  getSchedulerStats,
  makeRequest,
  logger,
  config
}