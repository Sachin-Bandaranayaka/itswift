#!/usr/bin/env node

/**
 * Cron job script to process scheduled social media posts
 * 
 * This script should be run periodically (e.g., every 5-15 minutes) to check for
 * scheduled posts that are ready to be published and publish them automatically.
 * 
 * Usage:
 * node scripts/process-scheduled-posts.js
 * 
 * Or add to crontab:
 * */5 * * * * /usr/bin/node /path/to/your/app/scripts/process-scheduled-posts.js
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  endpoint: '/api/admin/social/process-scheduled',
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
        'User-Agent': 'Social-Media-Scheduler/1.0',
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
      reject(new Error('Request timeout'))
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

async function processScheduledPosts() {
  const startTime = Date.now()
  console.log(`[${new Date().toISOString()}] Starting scheduled posts processing...`)

  try {
    // First, check how many posts are ready to be published
    console.log('Checking for posts ready to publish...')
    const checkResponse = await makeRequest(`${config.baseUrl}${config.endpoint}`)
    
    if (checkResponse.statusCode !== 200) {
      throw new Error(`Check request failed: ${checkResponse.statusCode} - ${JSON.stringify(checkResponse.data)}`)
    }

    const { totalScheduled, readyToPublish } = checkResponse.data.data
    console.log(`Found ${totalScheduled} scheduled posts, ${readyToPublish} ready to publish`)

    if (readyToPublish === 0) {
      console.log('No posts ready for publishing')
      return
    }

    // Process the scheduled posts
    console.log('Processing scheduled posts...')
    const processResponse = await makeRequest(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST'
    })

    if (processResponse.statusCode !== 200) {
      throw new Error(`Process request failed: ${processResponse.statusCode} - ${JSON.stringify(processResponse.data)}`)
    }

    const duration = Date.now() - startTime
    console.log(`[${new Date().toISOString()}] Successfully processed scheduled posts in ${duration}ms`)
    console.log('Response:', processResponse.data.message)

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[${new Date().toISOString()}] Error processing scheduled posts after ${duration}ms:`, error.message)
    process.exit(1)
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, exiting gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, exiting gracefully...')
  process.exit(0)
})

// Run the script
if (require.main === module) {
  processScheduledPosts()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

module.exports = { processScheduledPosts }