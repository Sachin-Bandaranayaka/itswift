import { logger } from './logger'
import { NewsletterErrorHandler } from './newsletter-error-handler'

export interface NewsletterMetrics {
  subscriptions: {
    total: number
    successful: number
    failed: number
    bySource: Record<string, number>
    byHour: Record<string, number>
  }
  unsubscriptions: {
    total: number
    successful: number
    failed: number
    byHour: Record<string, number>
  }
  brevoSync: {
    total: number
    successful: number
    failed: number
    fallbackUsed: number
    averageResponseTime: number
  }
  errors: {
    total: number
    byType: Record<string, number>
    byOperation: Record<string, number>
  }
}

export interface NewsletterHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    database: { status: 'pass' | 'fail'; responseTime?: number; error?: string }
    brevo: { status: 'pass' | 'fail'; responseTime?: number; error?: string }
    subscriptionRate: { status: 'pass' | 'warn' | 'fail'; rate: number; threshold: number }
    errorRate: { status: 'pass' | 'warn' | 'fail'; rate: number; threshold: number }
  }
  timestamp: string
}

/**
 * Newsletter monitoring and metrics collection service
 */
export class NewsletterMonitoring {
  private static metrics: NewsletterMetrics = {
    subscriptions: {
      total: 0,
      successful: 0,
      failed: 0,
      bySource: {},
      byHour: {}
    },
    unsubscriptions: {
      total: 0,
      successful: 0,
      failed: 0,
      byHour: {}
    },
    brevoSync: {
      total: 0,
      successful: 0,
      failed: 0,
      fallbackUsed: 0,
      averageResponseTime: 0
    },
    errors: {
      total: 0,
      byType: {},
      byOperation: {}
    }
  }

  private static brevoResponseTimes: number[] = []

  /**
   * Record a successful subscription
   */
  static recordSubscription(source: string = 'unknown'): void {
    const hour = new Date().toISOString().substring(0, 13) // YYYY-MM-DDTHH
    
    this.metrics.subscriptions.total++
    this.metrics.subscriptions.successful++
    this.metrics.subscriptions.bySource[source] = (this.metrics.subscriptions.bySource[source] || 0) + 1
    this.metrics.subscriptions.byHour[hour] = (this.metrics.subscriptions.byHour[hour] || 0) + 1

    logger.info('Newsletter subscription recorded', 'NEWSLETTER_METRICS', {
      source,
      totalSubscriptions: this.metrics.subscriptions.total,
      successfulSubscriptions: this.metrics.subscriptions.successful
    })
  }

  /**
   * Record a failed subscription
   */
  static recordSubscriptionFailure(source: string = 'unknown', errorType: string = 'unknown'): void {
    this.metrics.subscriptions.total++
    this.metrics.subscriptions.failed++
    this.metrics.errors.total++
    this.metrics.errors.byType[errorType] = (this.metrics.errors.byType[errorType] || 0) + 1
    this.metrics.errors.byOperation['subscription'] = (this.metrics.errors.byOperation['subscription'] || 0) + 1

    logger.warn('Newsletter subscription failure recorded', 'NEWSLETTER_METRICS', {
      source,
      errorType,
      totalFailures: this.metrics.subscriptions.failed,
      errorRate: this.getErrorRate('subscription')
    })
  }

  /**
   * Record a successful unsubscription
   */
  static recordUnsubscription(): void {
    const hour = new Date().toISOString().substring(0, 13) // YYYY-MM-DDTHH
    
    this.metrics.unsubscriptions.total++
    this.metrics.unsubscriptions.successful++
    this.metrics.unsubscriptions.byHour[hour] = (this.metrics.unsubscriptions.byHour[hour] || 0) + 1

    logger.info('Newsletter unsubscription recorded', 'NEWSLETTER_METRICS', {
      totalUnsubscriptions: this.metrics.unsubscriptions.total,
      successfulUnsubscriptions: this.metrics.unsubscriptions.successful
    })
  }

  /**
   * Record a failed unsubscription
   */
  static recordUnsubscriptionFailure(errorType: string = 'unknown'): void {
    this.metrics.unsubscriptions.total++
    this.metrics.unsubscriptions.failed++
    this.metrics.errors.total++
    this.metrics.errors.byType[errorType] = (this.metrics.errors.byType[errorType] || 0) + 1
    this.metrics.errors.byOperation['unsubscription'] = (this.metrics.errors.byOperation['unsubscription'] || 0) + 1

    logger.warn('Newsletter unsubscription failure recorded', 'NEWSLETTER_METRICS', {
      errorType,
      totalFailures: this.metrics.unsubscriptions.failed,
      errorRate: this.getErrorRate('unsubscription')
    })
  }

  /**
   * Record Brevo sync operation
   */
  static recordBrevoSync(success: boolean, responseTime: number, fallbackUsed: boolean = false): void {
    this.metrics.brevoSync.total++
    
    if (success) {
      this.metrics.brevoSync.successful++
    } else {
      this.metrics.brevoSync.failed++
    }

    if (fallbackUsed) {
      this.metrics.brevoSync.fallbackUsed++
    }

    // Track response times for average calculation
    this.brevoResponseTimes.push(responseTime)
    if (this.brevoResponseTimes.length > 100) {
      this.brevoResponseTimes = this.brevoResponseTimes.slice(-100) // Keep last 100 measurements
    }

    // Calculate average response time
    this.metrics.brevoSync.averageResponseTime = 
      this.brevoResponseTimes.reduce((sum, time) => sum + time, 0) / this.brevoResponseTimes.length

    logger.info('Brevo sync operation recorded', 'NEWSLETTER_METRICS', {
      success,
      responseTime,
      fallbackUsed,
      averageResponseTime: this.metrics.brevoSync.averageResponseTime,
      successRate: this.getBrevoSuccessRate()
    })
  }

  /**
   * Get current metrics
   */
  static getMetrics(): NewsletterMetrics {
    return { ...this.metrics }
  }

  /**
   * Get error rate for a specific operation
   */
  static getErrorRate(operation: 'subscription' | 'unsubscription'): number {
    const operationMetrics = this.metrics[`${operation}s` as keyof NewsletterMetrics] as any
    if (operationMetrics.total === 0) return 0
    return (operationMetrics.failed / operationMetrics.total) * 100
  }

  /**
   * Get Brevo success rate
   */
  static getBrevoSuccessRate(): number {
    if (this.metrics.brevoSync.total === 0) return 100
    return (this.metrics.brevoSync.successful / this.metrics.brevoSync.total) * 100
  }

  /**
   * Perform health check
   */
  static async performHealthCheck(): Promise<NewsletterHealthCheck> {
    const healthCheck: NewsletterHealthCheck = {
      status: 'healthy',
      checks: {
        database: { status: 'pass' },
        brevo: { status: 'pass' },
        subscriptionRate: { status: 'pass', rate: 0, threshold: 10 },
        errorRate: { status: 'pass', rate: 0, threshold: 5 }
      },
      timestamp: new Date().toISOString()
    }

    try {
      // Check database connectivity
      const dbStartTime = Date.now()
      try {
        // This would be replaced with actual database health check
        await new Promise(resolve => setTimeout(resolve, 10)) // Simulate DB check
        healthCheck.checks.database.responseTime = Date.now() - dbStartTime
      } catch (error) {
        healthCheck.checks.database.status = 'fail'
        healthCheck.checks.database.error = error instanceof Error ? error.message : 'Database check failed'
        healthCheck.status = 'unhealthy'
      }

      // Check Brevo connectivity
      const brevoStartTime = Date.now()
      try {
        // This would be replaced with actual Brevo health check
        await new Promise(resolve => setTimeout(resolve, 50)) // Simulate Brevo check
        healthCheck.checks.brevo.responseTime = Date.now() - brevoStartTime
        
        // Check Brevo success rate
        const brevoSuccessRate = this.getBrevoSuccessRate()
        if (brevoSuccessRate < 90) {
          healthCheck.checks.brevo.status = 'fail'
          healthCheck.status = 'degraded'
        }
      } catch (error) {
        healthCheck.checks.brevo.status = 'fail'
        healthCheck.checks.brevo.error = error instanceof Error ? error.message : 'Brevo check failed'
        healthCheck.status = 'degraded'
      }

      // Check subscription rate (subscriptions per hour)
      const currentHour = new Date().toISOString().substring(0, 13)
      const subscriptionRate = this.metrics.subscriptions.byHour[currentHour] || 0
      healthCheck.checks.subscriptionRate.rate = subscriptionRate
      
      if (subscriptionRate > healthCheck.checks.subscriptionRate.threshold) {
        healthCheck.checks.subscriptionRate.status = 'warn'
        if (healthCheck.status === 'healthy') {
          healthCheck.status = 'degraded'
        }
      }

      // Check error rate
      const subscriptionErrorRate = this.getErrorRate('subscription')
      const unsubscriptionErrorRate = this.getErrorRate('unsubscription')
      const overallErrorRate = Math.max(subscriptionErrorRate, unsubscriptionErrorRate)
      
      healthCheck.checks.errorRate.rate = overallErrorRate
      
      if (overallErrorRate > healthCheck.checks.errorRate.threshold) {
        healthCheck.checks.errorRate.status = overallErrorRate > 15 ? 'fail' : 'warn'
        healthCheck.status = overallErrorRate > 15 ? 'unhealthy' : 'degraded'
      }

    } catch (error) {
      logger.error('Health check failed', 'NEWSLETTER_HEALTH', {}, error instanceof Error ? error : undefined)
      healthCheck.status = 'unhealthy'
    }

    // Log health check results
    logger.info('Newsletter health check completed', 'NEWSLETTER_HEALTH', {
      status: healthCheck.status,
      databaseStatus: healthCheck.checks.database.status,
      brevoStatus: healthCheck.checks.brevo.status,
      subscriptionRate: healthCheck.checks.subscriptionRate.rate,
      errorRate: healthCheck.checks.errorRate.rate
    })

    return healthCheck
  }

  /**
   * Reset metrics (for testing or maintenance)
   */
  static resetMetrics(): void {
    this.metrics = {
      subscriptions: {
        total: 0,
        successful: 0,
        failed: 0,
        bySource: {},
        byHour: {}
      },
      unsubscriptions: {
        total: 0,
        successful: 0,
        failed: 0,
        byHour: {}
      },
      brevoSync: {
        total: 0,
        successful: 0,
        failed: 0,
        fallbackUsed: 0,
        averageResponseTime: 0
      },
      errors: {
        total: 0,
        byType: {},
        byOperation: {}
      }
    }
    this.brevoResponseTimes = []

    logger.info('Newsletter metrics reset', 'NEWSLETTER_METRICS')
  }

  /**
   * Get metrics summary for dashboard
   */
  static getMetricsSummary(): {
    subscriptionSuccessRate: number
    unsubscriptionSuccessRate: number
    brevoSuccessRate: number
    overallErrorRate: number
    totalSubscriptions: number
    totalUnsubscriptions: number
    topErrorTypes: Array<{ type: string; count: number }>
    topSources: Array<{ source: string; count: number }>
  } {
    const topErrorTypes = Object.entries(this.metrics.errors.byType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))

    const topSources = Object.entries(this.metrics.subscriptions.bySource)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))

    return {
      subscriptionSuccessRate: this.metrics.subscriptions.total > 0 
        ? (this.metrics.subscriptions.successful / this.metrics.subscriptions.total) * 100 
        : 100,
      unsubscriptionSuccessRate: this.metrics.unsubscriptions.total > 0 
        ? (this.metrics.unsubscriptions.successful / this.metrics.unsubscriptions.total) * 100 
        : 100,
      brevoSuccessRate: this.getBrevoSuccessRate(),
      overallErrorRate: Math.max(this.getErrorRate('subscription'), this.getErrorRate('unsubscription')),
      totalSubscriptions: this.metrics.subscriptions.total,
      totalUnsubscriptions: this.metrics.unsubscriptions.total,
      topErrorTypes,
      topSources
    }
  }
}

/**
 * Middleware to automatically record metrics for newsletter operations
 */
export function withNewsletterMetrics<T extends any[], R>(
  operation: 'subscription' | 'unsubscription',
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    
    try {
      const result = await handler(...args)
      
      // Record success based on operation type
      if (operation === 'subscription') {
        // Extract source from args if available
        const source = (args[0] as any)?.source || 'unknown'
        NewsletterMonitoring.recordSubscription(source)
      } else {
        NewsletterMonitoring.recordUnsubscription()
      }
      
      return result
    } catch (error) {
      // Record failure
      const errorType = error instanceof Error ? error.constructor.name : 'unknown'
      
      if (operation === 'subscription') {
        const source = (args[0] as any)?.source || 'unknown'
        NewsletterMonitoring.recordSubscriptionFailure(source, errorType)
      } else {
        NewsletterMonitoring.recordUnsubscriptionFailure(errorType)
      }
      
      throw error
    }
  }
}