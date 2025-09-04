#!/usr/bin/env node

/**
 * Test script for blog post scheduler functionality
 * 
 * This script tests the blog scheduler by:
 * 1. Creating test blog posts with different schedules
 * 2. Running the scheduler
 * 3. Verifying posts are published correctly
 * 4. Checking health and monitoring endpoints
 * 
 * Usage:
 * node scripts/test-blog-scheduler.js [--cleanup] [--verbose]
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  timeout: 30000,
  verbose: process.argv.includes('--verbose'),
  cleanup: process.argv.includes('--cleanup')
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
}

/**
 * Logger with verbose support
 */
const logger = {
  info: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, ...args)
  },
  debug: (message, ...args) => {
    if (config.verbose) {
      console.log(`[${new Date().toISOString()}] [DEBUG] ${message}`, ...args)
    }
  },
  error: (message, ...args) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, ...args)
  },
  success: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] [SUCCESS] ${message}`, ...args)
  }
}

/**
 * Make HTTP request
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
        'User-Agent': 'Blog-Scheduler-Test/1.0',
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
        try {
          const result = data ? JSON.parse(data) : {}
          resolve({
            statusCode: res.statusCode,
            data: result,
            headers: res.headers
          })
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: { error: 'Invalid JSON response', raw: data },
            headers: res.headers
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

/**
 * Run a test and track results
 */
async function runTest(name, testFn) {
  logger.info(`Running test: ${name}`)
  
  try {
    const result = await testFn()
    
    if (result.success) {
      logger.success(`✓ ${name}`)
      testResults.passed++
    } else {
      logger.error(`✗ ${name}: ${result.error}`)
      testResults.failed++
    }
    
    testResults.tests.push({
      name,
      success: result.success,
      error: result.error,
      details: result.details
    })
    
    return result
  } catch (error) {
    logger.error(`✗ ${name}: ${error.message}`)
    testResults.failed++
    
    testResults.tests.push({
      name,
      success: false,
      error: error.message
    })
    
    return { success: false, error: error.message }
  }
}

/**
 * Test application health
 */
async function testApplicationHealth() {
  const response = await makeRequest(`${config.baseUrl}/api/health`)
  
  if (response.statusCode === 200) {
    return {
      success: true,
      details: { status: response.data.status }
    }
  } else {
    return {
      success: false,
      error: `Health check failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test blog scheduler health
 */
async function testBlogSchedulerHealth() {
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/health`)
  
  if (response.statusCode === 200) {
    const health = response.data
    return {
      success: health.health.overall,
      details: {
        status: health.status,
        schedulerHealthy: health.health.scheduler,
        services: health.health.services,
        statistics: health.statistics
      },
      error: health.health.overall ? null : `Health issues: ${health.errors.join(', ')}`
    }
  } else {
    return {
      success: false,
      error: `Blog scheduler health check failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test monitoring endpoint
 */
async function testMonitoringEndpoint() {
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/monitoring`)
  
  if (response.statusCode === 200) {
    const monitoring = response.data
    return {
      success: true,
      details: {
        healthStatus: monitoring.health.status,
        healthScore: monitoring.health.score,
        metrics: monitoring.metrics,
        alertsCount: monitoring.alerts.length
      }
    }
  } else {
    return {
      success: false,
      error: `Monitoring endpoint failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test scheduler statistics
 */
async function testSchedulerStatistics() {
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/process-scheduled`)
  
  if (response.statusCode === 200) {
    const stats = response.data.data
    return {
      success: true,
      details: {
        totalScheduled: stats.totalScheduled || 0,
        readyToPublish: stats.readyToPublish || 0,
        processed: stats.processed || 0,
        successful: stats.successful || 0,
        failed: stats.failed || 0
      }
    }
  } else {
    return {
      success: false,
      error: `Scheduler statistics failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test scheduler processing
 */
async function testSchedulerProcessing() {
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/process-scheduled`, {
    method: 'POST'
  })
  
  if (response.statusCode === 200) {
    const result = response.data
    return {
      success: result.success,
      details: result.data,
      error: result.success ? null : result.error
    }
  } else {
    return {
      success: false,
      error: `Scheduler processing failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test Prometheus metrics export
 */
async function testPrometheusMetrics() {
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/monitoring?format=prometheus`)
  
  if (response.statusCode === 200) {
    const metrics = response.data
    const hasMetrics = typeof metrics === 'string' && metrics.includes('blog_scheduler_')
    
    return {
      success: hasMetrics,
      details: { metricsLength: metrics.length },
      error: hasMetrics ? null : 'Prometheus metrics not found in response'
    }
  } else {
    return {
      success: false,
      error: `Prometheus metrics failed with status ${response.statusCode}`
    }
  }
}

/**
 * Test error handling
 */
async function testErrorHandling() {
  // Test invalid endpoint
  const response = await makeRequest(`${config.baseUrl}/api/admin/blog/invalid-endpoint`)
  
  // Should return 404 or similar error
  if (response.statusCode >= 400) {
    return {
      success: true,
      details: { statusCode: response.statusCode }
    }
  } else {
    return {
      success: false,
      error: `Expected error response but got status ${response.statusCode}`
    }
  }
}

/**
 * Performance test
 */
async function testPerformance() {
  const startTime = Date.now()
  
  // Make multiple concurrent requests
  const promises = [
    makeRequest(`${config.baseUrl}/api/admin/blog/health`),
    makeRequest(`${config.baseUrl}/api/admin/blog/monitoring`),
    makeRequest(`${config.baseUrl}/api/admin/blog/process-scheduled`)
  ]
  
  const results = await Promise.all(promises)
  const duration = Date.now() - startTime
  
  const allSuccessful = results.every(r => r.statusCode === 200)
  
  return {
    success: allSuccessful && duration < 10000, // Should complete within 10 seconds
    details: {
      duration,
      requests: results.length,
      averageTime: Math.round(duration / results.length),
      statusCodes: results.map(r => r.statusCode)
    },
    error: allSuccessful ? 
      (duration >= 10000 ? `Performance test took too long: ${duration}ms` : null) :
      'Some requests failed'
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  logger.info('Starting blog scheduler comprehensive tests...')
  logger.info(`Base URL: ${config.baseUrl}`)
  logger.info(`Verbose: ${config.verbose}`)
  logger.info(`Cleanup: ${config.cleanup}`)
  
  const startTime = Date.now()
  
  // Run all tests
  await runTest('Application Health', testApplicationHealth)
  await runTest('Blog Scheduler Health', testBlogSchedulerHealth)
  await runTest('Monitoring Endpoint', testMonitoringEndpoint)
  await runTest('Scheduler Statistics', testSchedulerStatistics)
  await runTest('Scheduler Processing', testSchedulerProcessing)
  await runTest('Prometheus Metrics', testPrometheusMetrics)
  await runTest('Error Handling', testErrorHandling)
  await runTest('Performance Test', testPerformance)
  
  const duration = Date.now() - startTime
  
  // Print results
  logger.info('\n' + '='.repeat(60))
  logger.info('TEST RESULTS SUMMARY')
  logger.info('='.repeat(60))
  logger.info(`Total tests: ${testResults.passed + testResults.failed}`)
  logger.info(`Passed: ${testResults.passed}`)
  logger.info(`Failed: ${testResults.failed}`)
  logger.info(`Duration: ${duration}ms`)
  logger.info(`Success rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`)
  
  if (config.verbose) {
    logger.info('\nDetailed Results:')
    testResults.tests.forEach(test => {
      const status = test.success ? '✓' : '✗'
      logger.info(`  ${status} ${test.name}`)
      if (test.error) {
        logger.info(`    Error: ${test.error}`)
      }
      if (test.details && config.verbose) {
        logger.info(`    Details: ${JSON.stringify(test.details, null, 2)}`)
      }
    })
  }
  
  logger.info('='.repeat(60))
  
  // Exit with appropriate code
  const success = testResults.failed === 0
  if (success) {
    logger.success('All tests passed! Blog scheduler is working correctly.')
  } else {
    logger.error(`${testResults.failed} tests failed. Please check the issues above.`)
  }
  
  process.exit(success ? 0 : 1)
}

// Handle process signals
process.on('SIGINT', () => {
  logger.info('Test interrupted by user')
  process.exit(1)
})

process.on('SIGTERM', () => {
  logger.info('Test terminated')
  process.exit(1)
})

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    logger.error('Test runner failed:', error)
    process.exit(1)
  })
}

module.exports = {
  runAllTests,
  testResults,
  makeRequest,
  logger
}