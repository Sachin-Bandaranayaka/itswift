#!/usr/bin/env node

/**
 * Initialize the background scheduler
 * 
 * This script can be used to initialize and start the background scheduler
 * when the application starts up.
 * 
 * Usage:
 * node scripts/init-scheduler.js
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  endpoint: '/api/admin/scheduler',
  timeout: 30000 // 30 seconds
}

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
        'User-Agent': 'Scheduler-Init/1.0',
        ...options.headers
      },
      timeout: config.timeout
    }

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
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error(`Request timeout after ${config.timeout}ms`))
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

async function checkHealth() {
  try {
    console.log('Checking scheduler health...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}?action=health`)
    
    if (response.statusCode !== 200) {
      throw new Error(`Health check failed: ${response.statusCode}`)
    }

    const { healthy, issues } = response.data.data
    
    if (!healthy) {
      console.warn('Scheduler health issues detected:', issues)
      return false
    }

    console.log('Scheduler health check passed')
    return true
  } catch (error) {
    console.error('Health check error:', error.message)
    return false
  }
}

async function getStatus() {
  try {
    console.log('Getting scheduler status...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}?action=status`)
    
    if (response.statusCode !== 200) {
      throw new Error(`Status request failed: ${response.statusCode}`)
    }

    return response.data.data
  } catch (error) {
    console.error('Error getting status:', error.message)
    throw error
  }
}

async function startScheduler() {
  try {
    console.log('Starting background scheduler...')
    const response = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST',
      body: { action: 'start' }
    })
    
    if (response.statusCode !== 200) {
      throw new Error(`Start request failed: ${response.statusCode}`)
    }

    console.log('Background scheduler started successfully')
    return response.data.data
  } catch (error) {
    console.error('Error starting scheduler:', error.message)
    throw error
  }
}

async function main() {
  const startTime = Date.now()
  
  try {
    console.log('=== Scheduler Initialization Started ===')

    // Wait for the application to be ready
    console.log('Waiting for application to be ready...')
    let retries = 0
    const maxRetries = 10
    
    while (retries < maxRetries) {
      try {
        await checkHealth()
        break
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw new Error('Application not ready after maximum retries')
        }
        console.log(`Application not ready, retrying in 5 seconds... (${retries}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    // Get current status
    const status = await getStatus()
    console.log('Current scheduler status:', {
      isRunning: status.isRunning,
      activeJobs: status.activeJobs,
      queueSize: status.queueSize
    })

    // Start scheduler if not running
    if (!status.isRunning) {
      await startScheduler()
      console.log('Scheduler started successfully')
    } else {
      console.log('Scheduler is already running')
    }

    const duration = Date.now() - startTime
    console.log(`=== Scheduler Initialization Completed in ${duration}ms ===`)
    
  } catch (error) {
    console.error('Fatal error in scheduler initialization:', error.message)
    process.exit(1)
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT, exiting...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, exiting...')
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Script execution failed:', error.message)
    process.exit(1)
  })
}

module.exports = { main, checkHealth, getStatus, startScheduler }