// Scheduler initialization for application startup

import { BackgroundScheduler } from './background-scheduler'

let schedulerInstance: BackgroundScheduler | null = null

/**
 * Initialize the background scheduler
 */
export function initializeScheduler(): void {
  if (schedulerInstance) {
    console.log('Scheduler already initialized')
    return
  }

  try {
    // Get configuration from environment variables
    const config = {
      maxConcurrentJobs: parseInt(process.env.SCHEDULER_MAX_CONCURRENT_JOBS || '3'),
      processingIntervalMs: parseInt(process.env.SCHEDULER_PROCESSING_INTERVAL_MS || '30000'),
      retryConfig: {
        maxRetries: parseInt(process.env.SCHEDULER_MAX_RETRIES || '3'),
        baseDelayMs: parseInt(process.env.SCHEDULER_BASE_DELAY_MS || '5000'),
        backoffMultiplier: parseFloat(process.env.SCHEDULER_BACKOFF_MULTIPLIER || '2')
      },
      logging: {
        level: (process.env.SCHEDULER_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
        logFile: process.env.SCHEDULER_LOG_FILE,
        enableConsole: process.env.SCHEDULER_ENABLE_CONSOLE !== 'false'
      }
    }

    schedulerInstance = BackgroundScheduler.getInstance(config)
    
    // Auto-start in production
    if (process.env.NODE_ENV === 'production' || process.env.SCHEDULER_AUTO_START === 'true') {
      schedulerInstance.start()
      console.log('Background scheduler started automatically')
    } else {
      console.log('Background scheduler initialized but not started (use SCHEDULER_AUTO_START=true to auto-start)')
    }

    // Graceful shutdown handling
    const gracefulShutdown = () => {
      console.log('Shutting down background scheduler...')
      if (schedulerInstance) {
        schedulerInstance.stop()
      }
      process.exit(0)
    }

    process.on('SIGINT', gracefulShutdown)
    process.on('SIGTERM', gracefulShutdown)

  } catch (error) {
    console.error('Failed to initialize scheduler:', error)
  }
}

/**
 * Get the scheduler instance
 */
export function getSchedulerInstance(): BackgroundScheduler | null {
  return schedulerInstance
}

/**
 * Health check for the scheduler
 */
export async function checkSchedulerHealth(): Promise<{
  initialized: boolean
  running: boolean
  healthy: boolean
  issues: string[]
}> {
  if (!schedulerInstance) {
    return {
      initialized: false,
      running: false,
      healthy: false,
      issues: ['Scheduler not initialized']
    }
  }

  try {
    const health = await schedulerInstance.healthCheck()
    const status = schedulerInstance.getStatus()

    return {
      initialized: true,
      running: status.isRunning,
      healthy: health.healthy,
      issues: health.issues
    }
  } catch (error) {
    return {
      initialized: true,
      running: false,
      healthy: false,
      issues: [`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    }
  }
}