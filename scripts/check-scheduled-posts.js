#!/usr/bin/env node

/**
 * Scheduled Posts Checker
 * 
 * This script checks for blog posts that are scheduled to be published
 * and publishes them when their scheduled time arrives.
 * 
 * Usage:
 * - Run manually: node scripts/check-scheduled-posts.js
 * - Set up as cron job: */5 * * * * node /path/to/scripts/check-scheduled-posts.js
 */

const https = require('https')
const http = require('http')

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const API_ENDPOINT = '/api/admin/blog/schedule'

function makeRequest(url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ScheduledPostsChecker/1.0'
      }
    }

    if (data) {
      const postData = JSON.stringify(data)
      options.headers['Content-Length'] = Buffer.byteLength(postData)
    }

    const req = client.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData)
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          })
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

async function checkScheduledPosts() {
  try {
    console.log(`[${new Date().toISOString()}] Checking for scheduled posts...`)
    
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
      action: 'check-scheduled'
    })

    if (response.statusCode === 200 && response.data.success) {
      const { publishedCount, publishedPosts } = response.data
      
      if (publishedCount > 0) {
        console.log(`✅ Published ${publishedCount} scheduled posts:`)
        publishedPosts.forEach(post => {
          console.log(`   - "${post.title}" (ID: ${post._id})`)
        })
      } else {
        console.log('ℹ️  No posts were ready for publication')
      }
    } else {
      console.error('❌ Failed to check scheduled posts:', response.data.error || 'Unknown error')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error checking scheduled posts:', error.message)
    process.exit(1)
  }
}

async function getScheduledPosts() {
  try {
    const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`)
    
    if (response.statusCode === 200 && response.data.success) {
      const { scheduledPosts, count } = response.data
      
      console.log(`📅 Found ${count} scheduled posts:`)
      if (count > 0) {
        scheduledPosts.forEach(post => {
          const publishDate = new Date(post.publishedAt)
          const now = new Date()
          const isReady = publishDate <= now
          
          console.log(`   ${isReady ? '🟢' : '🟡'} "${post.title}"`)
          console.log(`      Scheduled: ${publishDate.toLocaleString()}`)
          console.log(`      Status: ${isReady ? 'Ready to publish' : 'Waiting'}`)
          console.log()
        })
      }
    } else {
      console.error('❌ Failed to get scheduled posts:', response.data.error || 'Unknown error')
    }
  } catch (error) {
    console.error('❌ Error getting scheduled posts:', error.message)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'list':
      await getScheduledPosts()
      break
    case 'check':
    default:
      await checkScheduledPosts()
      break
  }
}

// Handle command line arguments
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  })
}

module.exports = { checkScheduledPosts, getScheduledPosts }