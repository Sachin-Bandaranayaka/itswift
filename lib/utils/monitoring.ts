import { logger } from './logger'

export interface HealthCheck {
  name: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  message?: string
  responseTime?: number
  lastChecked: string
  details?: Record<string, any>
}

export interface SystemStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  checks: HealthCheck[]
  version?: string
}

class MonitoringService {
  private healthChecks: Map<string, () => Promise<HealthCheck>> = new Map()
  private metrics: Map<string, number> = new Map()
  private startTime = Date.now()

  // Register a health check
  registerHealthCheck(name: string, checkFunction: () => Promise<HealthCheck>): void {
    this.healthChecks.set(name, checkFunction)
    logger.info(`Health check registered: ${name}`, 'MONITORING')
  }

  // Run all health checks
  async runHealthChecks(): Promise<SystemStatus> {
    const checks: HealthCheck[] = []
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'

    for (const [name, checkFunction] of this.healthChecks) {
      try {
        const startTime = Date.now()
        const check = await checkFunction()
        const responseTime = Date.now() - startTime
        
        const checkWithTiming: HealthCheck = {
          ...check,
          responseTime,
          lastChecked: new Date().toISOString()
        }
        
        checks.push(checkWithTiming)
        
        // Update overall status
        if (check.status === 'unhealthy') {
          overallStatus = 'unhealthy'
        } else if (check.status === 'degraded' && overallStatus === 'healthy') {
          overallStatus = 'degraded'
        }
        
        logger.debug(`Health check completed: ${name}`, 'MONITORING', {
          status: check.status,
          responseTime
        })
      } catch (error) {
        const failedCheck: HealthCheck = {
          name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString()
        }
        
        checks.push(failedCheck)
        overallStatus = 'unhealthy'
        
        logger.error(`Health check failed: ${name}`, 'MONITORING', {}, error as Error)
      }
    }

    const systemStatus: SystemStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks,
      version: process.env.npm_package_version
    }

    logger.info(`System health check completed`, 'MONITORING', {
      status: overallStatus,
      checksCount: checks.length
    })

    return systemStatus
  }

  // Record a metric
  recordMetric(name: string, value: number): void {
    this.metrics.set(name, value)
    logger.performanceMetric(name, value)
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear()
    logger.info('Metrics cleared', 'MONITORING')
  }

  // Track API response time
  trackApiResponseTime(endpoint: string, method: string, duration: number, statusCode: number): void {
    const metricName = `api_response_time_${method.toLowerCase()}_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`
    this.recordMetric(metricName, duration)
    
    logger.apiResponse(method, endpoint, statusCode, duration)
  }

  // Track database query time
  trackDatabaseQueryTime(query: string, duration: number): void {
    const metricName = 'database_query_time'
    this.recordMetric(metricName, duration)
    
    logger.databaseQuery(query, duration)
  }

  // Track external API call time
  trackExternalApiCall(service: string, endpoint: string, duration: number, statusCode?: number): void {
    const metricName = `external_api_${service.toLowerCase()}_response_time`
    this.recordMetric(metricName, duration)
    
    logger.externalApiCall(service, endpoint, statusCode, duration)
  }
}

// Create singleton instance
export const monitoring = new MonitoringService()

// Default health checks
monitoring.registerHealthCheck('system', async (): Promise<HealthCheck> => {
  const memoryUsage = process.memoryUsage()
  const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
  
  return {
    name: 'system',
    status: memoryUsageMB > 500 ? 'degraded' : 'healthy',
    message: `Memory usage: ${memoryUsageMB}MB`,
    lastChecked: new Date().toISOString(),
    details: {
      memoryUsage: memoryUsageMB,
      uptime: process.uptime()
    }
  }
})

monitoring.registerHealthCheck('database', async (): Promise<HealthCheck> => {
  try {
    // This would typically test database connectivity
    // For now, we'll just check if environment variables are set
    const hasSupabaseConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    return {
      name: 'database',
      status: hasSupabaseConfig ? 'healthy' : 'unhealthy',
      message: hasSupabaseConfig ? 'Database configuration present' : 'Database configuration missing',
      lastChecked: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database check failed',
      lastChecked: new Date().toISOString()
    }
  }
})

monitoring.registerHealthCheck('external_services', async (): Promise<HealthCheck> => {
  const services = {
    openai: !!process.env.OPENAI_API_KEY,
    brevo: !!process.env.BREVO_API_KEY,
    linkedin: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    twitter: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET)
  }
  
  const configuredServices = Object.values(services).filter(Boolean).length
  const totalServices = Object.keys(services).length
  
  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
  if (configuredServices === 0) {
    status = 'unhealthy'
  } else if (configuredServices < totalServices) {
    status = 'degraded'
  }
  
  return {
    name: 'external_services',
    status,
    message: `${configuredServices}/${totalServices} external services configured`,
    lastChecked: new Date().toISOString(),
    details: services
  }
})

// Performance monitoring utilities
export function measurePerformance<T>(
  operation: () => Promise<T>,
  metricName: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = Date.now()
    
    try {
      const result = await operation()
      const duration = Date.now() - startTime
      monitoring.recordMetric(metricName, duration)
      resolve(result)
    } catch (error) {
      const duration = Date.now() - startTime
      monitoring.recordMetric(`${metricName}_error`, duration)
      reject(error)
    }
  })
}

export function measureSync<T>(
  operation: () => T,
  metricName: string
): T {
  const startTime = Date.now()
  
  try {
    const result = operation()
    const duration = Date.now() - startTime
    monitoring.recordMetric(metricName, duration)
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    monitoring.recordMetric(`${metricName}_error`, duration)
    throw error
  }
}