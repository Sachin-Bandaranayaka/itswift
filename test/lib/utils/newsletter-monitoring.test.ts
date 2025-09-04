import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NewsletterMonitoring, withNewsletterMetrics } from '@/lib/utils/newsletter-monitoring'
import { logger } from '@/lib/utils/logger'

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}))

describe('NewsletterMonitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    NewsletterMonitoring.resetMetrics()
  })

  describe('recordSubscription', () => {
    it('should record successful subscription with source', () => {
      NewsletterMonitoring.recordSubscription('homepage')
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.total).toBe(1)
      expect(metrics.subscriptions.successful).toBe(1)
      expect(metrics.subscriptions.failed).toBe(0)
      expect(metrics.subscriptions.bySource.homepage).toBe(1)
      
      expect(logger.info).toHaveBeenCalledWith(
        'Newsletter subscription recorded',
        'NEWSLETTER_METRICS',
        expect.objectContaining({
          source: 'homepage',
          totalSubscriptions: 1,
          successfulSubscriptions: 1
        })
      )
    })

    it('should record subscription by hour', () => {
      const now = new Date()
      const currentHour = now.toISOString().substring(0, 13)
      
      NewsletterMonitoring.recordSubscription('homepage')
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.byHour[currentHour]).toBe(1)
    })

    it('should handle multiple subscriptions from different sources', () => {
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordSubscription('api')
      NewsletterMonitoring.recordSubscription('homepage')
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.total).toBe(3)
      expect(metrics.subscriptions.bySource.homepage).toBe(2)
      expect(metrics.subscriptions.bySource.api).toBe(1)
    })
  })

  describe('recordSubscriptionFailure', () => {
    it('should record failed subscription with error type', () => {
      NewsletterMonitoring.recordSubscriptionFailure('homepage', 'ValidationError')
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.total).toBe(1)
      expect(metrics.subscriptions.successful).toBe(0)
      expect(metrics.subscriptions.failed).toBe(1)
      expect(metrics.errors.total).toBe(1)
      expect(metrics.errors.byType.ValidationError).toBe(1)
      expect(metrics.errors.byOperation.subscription).toBe(1)
      
      expect(logger.warn).toHaveBeenCalledWith(
        'Newsletter subscription failure recorded',
        'NEWSLETTER_METRICS',
        expect.objectContaining({
          source: 'homepage',
          errorType: 'ValidationError',
          totalFailures: 1
        })
      )
    })
  })

  describe('recordUnsubscription', () => {
    it('should record successful unsubscription', () => {
      NewsletterMonitoring.recordUnsubscription()
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.unsubscriptions.total).toBe(1)
      expect(metrics.unsubscriptions.successful).toBe(1)
      expect(metrics.unsubscriptions.failed).toBe(0)
      
      expect(logger.info).toHaveBeenCalledWith(
        'Newsletter unsubscription recorded',
        'NEWSLETTER_METRICS',
        expect.objectContaining({
          totalUnsubscriptions: 1,
          successfulUnsubscriptions: 1
        })
      )
    })
  })

  describe('recordUnsubscriptionFailure', () => {
    it('should record failed unsubscription', () => {
      NewsletterMonitoring.recordUnsubscriptionFailure('TokenError')
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.unsubscriptions.total).toBe(1)
      expect(metrics.unsubscriptions.failed).toBe(1)
      expect(metrics.errors.byType.TokenError).toBe(1)
      expect(metrics.errors.byOperation.unsubscription).toBe(1)
    })
  })

  describe('recordBrevoSync', () => {
    it('should record successful Brevo sync', () => {
      NewsletterMonitoring.recordBrevoSync(true, 150, false)
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.brevoSync.total).toBe(1)
      expect(metrics.brevoSync.successful).toBe(1)
      expect(metrics.brevoSync.failed).toBe(0)
      expect(metrics.brevoSync.fallbackUsed).toBe(0)
      expect(metrics.brevoSync.averageResponseTime).toBe(150)
      
      expect(logger.info).toHaveBeenCalledWith(
        'Brevo sync operation recorded',
        'NEWSLETTER_METRICS',
        expect.objectContaining({
          success: true,
          responseTime: 150,
          fallbackUsed: false,
          averageResponseTime: 150
        })
      )
    })

    it('should record failed Brevo sync with fallback', () => {
      NewsletterMonitoring.recordBrevoSync(false, 300, true)
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.brevoSync.total).toBe(1)
      expect(metrics.brevoSync.successful).toBe(0)
      expect(metrics.brevoSync.failed).toBe(1)
      expect(metrics.brevoSync.fallbackUsed).toBe(1)
    })

    it('should calculate average response time correctly', () => {
      NewsletterMonitoring.recordBrevoSync(true, 100, false)
      NewsletterMonitoring.recordBrevoSync(true, 200, false)
      NewsletterMonitoring.recordBrevoSync(true, 300, false)
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.brevoSync.averageResponseTime).toBe(200) // (100 + 200 + 300) / 3
    })
  })

  describe('getErrorRate', () => {
    it('should calculate subscription error rate correctly', () => {
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordSubscriptionFailure('homepage', 'ValidationError')
      
      const errorRate = NewsletterMonitoring.getErrorRate('subscription')
      expect(errorRate).toBeCloseTo(33.33, 2) // 1 failure out of 3 total = 33.33%
    })

    it('should return 0 error rate when no operations recorded', () => {
      const errorRate = NewsletterMonitoring.getErrorRate('subscription')
      expect(errorRate).toBe(0)
    })
  })

  describe('getBrevoSuccessRate', () => {
    it('should calculate Brevo success rate correctly', () => {
      NewsletterMonitoring.recordBrevoSync(true, 100, false)
      NewsletterMonitoring.recordBrevoSync(true, 150, false)
      NewsletterMonitoring.recordBrevoSync(false, 200, false)
      
      const successRate = NewsletterMonitoring.getBrevoSuccessRate()
      expect(successRate).toBeCloseTo(66.67, 2) // 2 success out of 3 total = 66.67%
    })

    it('should return 100% when no operations recorded', () => {
      const successRate = NewsletterMonitoring.getBrevoSuccessRate()
      expect(successRate).toBe(100)
    })
  })

  describe('performHealthCheck', () => {
    it('should return healthy status when all checks pass', async () => {
      // Record some successful operations
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordBrevoSync(true, 100, false)
      
      const healthCheck = await NewsletterMonitoring.performHealthCheck()
      
      expect(healthCheck.status).toBe('healthy')
      expect(healthCheck.checks.database.status).toBe('pass')
      expect(healthCheck.checks.brevo.status).toBe('pass')
      expect(healthCheck.checks.subscriptionRate.status).toBe('pass')
      expect(healthCheck.checks.errorRate.status).toBe('pass')
      expect(healthCheck.timestamp).toBeDefined()
    })

    it('should return degraded status when error rate is high', async () => {
      // Record high error rate
      for (let i = 0; i < 10; i++) {
        NewsletterMonitoring.recordSubscriptionFailure('homepage', 'ValidationError')
      }
      NewsletterMonitoring.recordSubscription('homepage') // 1 success, 10 failures = 90.9% error rate
      
      const healthCheck = await NewsletterMonitoring.performHealthCheck()
      
      expect(healthCheck.status).toBe('unhealthy') // > 15% error rate
      expect(healthCheck.checks.errorRate.status).toBe('fail')
    })
  })

  describe('getMetricsSummary', () => {
    it('should return comprehensive metrics summary', () => {
      // Record various operations
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordSubscription('api')
      NewsletterMonitoring.recordSubscriptionFailure('homepage', 'ValidationError')
      NewsletterMonitoring.recordUnsubscription()
      NewsletterMonitoring.recordBrevoSync(true, 100, false)
      NewsletterMonitoring.recordBrevoSync(false, 200, true)
      
      const summary = NewsletterMonitoring.getMetricsSummary()
      
      expect(summary.subscriptionSuccessRate).toBeCloseTo(66.67, 2) // 2 success out of 3 total
      expect(summary.unsubscriptionSuccessRate).toBe(100) // 1 success out of 1 total
      expect(summary.brevoSuccessRate).toBe(50) // 1 success out of 2 total
      expect(summary.totalSubscriptions).toBe(3)
      expect(summary.totalUnsubscriptions).toBe(1)
      expect(summary.topErrorTypes).toEqual([{ type: 'ValidationError', count: 1 }])
      expect(summary.topSources).toEqual([
        { source: 'homepage', count: 1 },
        { source: 'api', count: 1 }
      ])
    })
  })

  describe('resetMetrics', () => {
    it('should reset all metrics to initial state', () => {
      // Record some operations
      NewsletterMonitoring.recordSubscription('homepage')
      NewsletterMonitoring.recordUnsubscription()
      NewsletterMonitoring.recordBrevoSync(true, 100, false)
      
      expect(NewsletterMonitoring.getMetrics().subscriptions.total).toBe(1)
      
      NewsletterMonitoring.resetMetrics()
      
      const metrics = NewsletterMonitoring.getMetrics()
      expect(metrics.subscriptions.total).toBe(0)
      expect(metrics.unsubscriptions.total).toBe(0)
      expect(metrics.brevoSync.total).toBe(0)
      expect(metrics.errors.total).toBe(0)
      
      expect(logger.info).toHaveBeenCalledWith(
        'Newsletter metrics reset',
        'NEWSLETTER_METRICS'
      )
    })
  })
})

describe('withNewsletterMetrics', () => {
  beforeEach(() => {
    NewsletterMonitoring.resetMetrics()
  })

  it('should record successful subscription operation', async () => {
    const mockHandler = vi.fn().mockResolvedValue('success')
    const wrappedHandler = withNewsletterMetrics('subscription', mockHandler)
    
    const result = await wrappedHandler({ source: 'homepage' })
    
    expect(result).toBe('success')
    expect(mockHandler).toHaveBeenCalledWith({ source: 'homepage' })
    
    const metrics = NewsletterMonitoring.getMetrics()
    expect(metrics.subscriptions.successful).toBe(1)
    expect(metrics.subscriptions.bySource.homepage).toBe(1)
  })

  it('should record failed subscription operation', async () => {
    const mockError = new Error('Test error')
    const mockHandler = vi.fn().mockRejectedValue(mockError)
    const wrappedHandler = withNewsletterMetrics('subscription', mockHandler)
    
    await expect(wrappedHandler({ source: 'api' })).rejects.toThrow('Test error')
    
    const metrics = NewsletterMonitoring.getMetrics()
    expect(metrics.subscriptions.failed).toBe(1)
    expect(metrics.errors.byType.Error).toBe(1)
  })

  it('should record successful unsubscription operation', async () => {
    const mockHandler = vi.fn().mockResolvedValue('success')
    const wrappedHandler = withNewsletterMetrics('unsubscription', mockHandler)
    
    const result = await wrappedHandler('token123')
    
    expect(result).toBe('success')
    
    const metrics = NewsletterMonitoring.getMetrics()
    expect(metrics.unsubscriptions.successful).toBe(1)
  })

  it('should record failed unsubscription operation', async () => {
    const mockError = new Error('Invalid token')
    const mockHandler = vi.fn().mockRejectedValue(mockError)
    const wrappedHandler = withNewsletterMetrics('unsubscription', mockHandler)
    
    await expect(wrappedHandler('invalid-token')).rejects.toThrow('Invalid token')
    
    const metrics = NewsletterMonitoring.getMetrics()
    expect(metrics.unsubscriptions.failed).toBe(1)
    expect(metrics.errors.byOperation.unsubscription).toBe(1)
  })
})