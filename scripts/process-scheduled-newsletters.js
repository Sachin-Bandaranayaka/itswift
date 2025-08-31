#!/usr/bin/env node

/**
 * Script to process scheduled newsletter campaigns
 * This should be run as a cron job to automatically send scheduled newsletters
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  host: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  endpoint: '/api/admin/newsletter/process-scheduled',
  timeout: 30000 // 30 seconds
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Newsletter-Scheduler/1.0'
      },
      timeout: config.timeout
    }

    const req = client.request(url, options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: response
          })
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`))
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

    req.end()
  })
}

async function processScheduledNewsletters() {
  const url = `${config.host}${config.endpoint}`
  
  console.log(`[${new Date().toISOString()}] Processing scheduled newsletters...`)
  console.log(`Endpoint: ${url}`)

  try {
    const response = await makeRequest(url)
    
    if (response.statusCode === 200) {
      const { processed, successful, failed, errors } = response.data
      
      console.log(`✅ Successfully processed ${processed} scheduled campaigns`)
      console.log(`   - Successful: ${successful}`)
      console.log(`   - Failed: ${failed}`)
      
      if (errors && errors.length > 0) {
        console.log('❌ Errors encountered:')
        errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`)
        })
      }
      
      if (failed > 0) {
        process.exit(1) // Exit with error code if any campaigns failed
      }
    } else {
      console.error(`❌ HTTP Error: ${response.statusCode}`)
      console.error('Response:', response.data)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error processing scheduled newsletters:', error.message)
    process.exit(1)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Process interrupted')
  process.exit(1)
})

process.on('SIGTERM', () => {
  console.log('\n⚠️  Process terminated')
  process.exit(1)
})

// Run the script
if (require.main === module) {
  processScheduledNewsletters()
    .then(() => {
      console.log(`[${new Date().toISOString()}] Newsletter processing completed`)
      process.exit(0)
    })
    .catch((error) => {
      console.error(`[${new Date().toISOString()}] Newsletter processing failed:`, error)
      process.exit(1)
    })
}

module.exports = { processScheduledNewsletters }