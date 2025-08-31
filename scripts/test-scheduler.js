#!/usr/bin/env node

/**
 * Test script for the background scheduler
 * 
 * This script tests the background scheduler functionality including:
 * - Queue management
 * - Retry logic
 * - Logging
 * - API endpoints
 * 
 * Usage:
 * node scripts/test-scheduler.js
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  endpoint: '/api/admin/scheduler',
  timeout: 30000
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
        'User-Agent': 'Scheduler-Test/1.0',
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

    req.on('error', reject)
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

async function testEndpoint(name, url, options = {}) {
  console.log(`Testing ${name}...`)
  try {
    const response = await makeRequest(url, options)
    
    if (response.statusCode === 200 && response.data.success) {
      console.log(`✅ ${name} - SUCCESS`)
      return { success: true, data: response.data.data }
    } else {
      console.log(`❌ ${name} - FAILED: ${response.statusCode} - ${JSON.stringify(response.data)}`)
      return { success: false, error: response.data.error || 'Unknown error' }
    }
  } catch (error) {
    console.log(`❌ ${name} - ERROR: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('=== Background Scheduler Test Suite ===')
  console.log(`Testing against: ${config.baseUrl}`)
  console.log('')

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }

  // Test 1: Health Check
  const healthTest = await testEndpoint(
    'Health Check',
    `${config.baseUrl}${config.endpoint}?action=health`
  )
  results.tests.push({ name: 'Health Check', ...healthTest })
  if (healthTest.success) results.passed++; else results.failed++

  // Test 2: Status Check
  const statusTest = await testEndpoint(
    'Status Check',
    `${config.baseUrl}${config.endpoint}?action=status`
  )
  results.tests.push({ name: 'Status Check', ...statusTest })
  if (statusTest.success) results.passed++; else results.failed++

  // Test 3: Queue Details
  const queueTest = await testEndpoint(
    'Queue Details',
    `${config.baseUrl}${config.endpoint}?action=queue`
  )
  results.tests.push({ name: 'Queue Details', ...queueTest })
  if (queueTest.success) results.passed++; else results.failed++

  // Test 4: Logs
  const logsTest = await testEndpoint(
    'Logs',
    `${config.baseUrl}${config.endpoint}?action=logs&limit=10`
  )
  results.tests.push({ name: 'Logs', ...logsTest })
  if (logsTest.success) results.passed++; else results.failed++

  // Test 5: Start Scheduler
  const startTest = await testEndpoint(
    'Start Scheduler',
    `${config.baseUrl}${config.endpoint}`,
    { method: 'POST', body: { action: 'start' } }
  )
  results.tests.push({ name: 'Start Scheduler', ...startTest })
  if (startTest.success) results.passed++; else results.failed++

  // Wait a moment for scheduler to start
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 6: Force Process
  const processTest = await testEndpoint(
    'Force Process',
    `${config.baseUrl}${config.endpoint}`,
    { method: 'POST', body: { action: 'process' } }
  )
  results.tests.push({ name: 'Force Process', ...processTest })
  if (processTest.success) results.passed++; else results.failed++

  // Test 7: Reset Stats
  const resetTest = await testEndpoint(
    'Reset Stats',
    `${config.baseUrl}${config.endpoint}`,
    { method: 'POST', body: { action: 'reset-stats' } }
  )
  results.tests.push({ name: 'Reset Stats', ...resetTest })
  if (resetTest.success) results.passed++; else results.failed++

  // Test 8: Update Config
  const configTest = await testEndpoint(
    'Update Config',
    `${config.baseUrl}${config.endpoint}`,
    { 
      method: 'POST', 
      body: { 
        action: 'update-config',
        config: {
          maxConcurrentJobs: 2,
          processingIntervalMs: 60000
        }
      } 
    }
  )
  results.tests.push({ name: 'Update Config', ...configTest })
  if (configTest.success) results.passed++; else results.failed++

  // Test 9: PUT Config Update
  const putConfigTest = await testEndpoint(
    'PUT Config Update',
    `${config.baseUrl}${config.endpoint}`,
    { 
      method: 'PUT', 
      body: { 
        config: {
          logging: {
            level: 'debug'
          }
        }
      } 
    }
  )
  results.tests.push({ name: 'PUT Config Update', ...putConfigTest })
  if (putConfigTest.success) results.passed++; else results.failed++

  // Final status check
  const finalStatusTest = await testEndpoint(
    'Final Status Check',
    `${config.baseUrl}${config.endpoint}?action=status`
  )
  results.tests.push({ name: 'Final Status Check', ...finalStatusTest })
  if (finalStatusTest.success) results.passed++; else results.failed++

  // Print results
  console.log('')
  console.log('=== Test Results ===')
  console.log(`Total Tests: ${results.tests.length}`)
  console.log(`Passed: ${results.passed}`)
  console.log(`Failed: ${results.failed}`)
  console.log(`Success Rate: ${Math.round((results.passed / results.tests.length) * 100)}%`)
  console.log('')

  if (results.failed > 0) {
    console.log('Failed Tests:')
    results.tests
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`  ❌ ${test.name}: ${test.error}`)
      })
    console.log('')
  }

  // Print detailed status if available
  if (finalStatusTest.success && finalStatusTest.data) {
    const status = finalStatusTest.data
    console.log('=== Final Scheduler Status ===')
    console.log(`Running: ${status.isRunning}`)
    console.log(`Active Jobs: ${status.activeJobs}`)
    console.log(`Queue Size: ${status.queueSize}`)
    console.log(`Total Processed: ${status.stats.totalProcessed}`)
    console.log(`Successful: ${status.stats.successful}`)
    console.log(`Failed: ${status.stats.failed}`)
    console.log(`Retries: ${status.stats.retries}`)
    console.log('')
    
    if (status.logStats) {
      console.log('Log Stats:')
      console.log(`  Total Logs: ${status.logStats.total}`)
      console.log(`  Errors: ${status.logStats.byLevel.error}`)
      console.log(`  Warnings: ${status.logStats.byLevel.warn}`)
      console.log(`  Info: ${status.logStats.byLevel.info}`)
      console.log(`  Debug: ${status.logStats.byLevel.debug}`)
    }
  }

  return results.failed === 0
}

async function main() {
  try {
    const success = await runTests()
    process.exit(success ? 0 : 1)
  } catch (error) {
    console.error('Test suite failed:', error.message)
    process.exit(1)
  }
}

// Run tests
if (require.main === module) {
  main()
}

module.exports = { runTests, testEndpoint }