import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'

export interface BlogSchedulerMetrics {
  timestamp: string
  totalScheduled: number
  readyToProcess: number
  inQueue: number
  processing: boolean
  failed: number
  lastRun?: string
  nextRun?: string
  errors: string[]
  queueSize: number
  memoryUsage: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
  }
  uptime: number
}

export interface BlogSchedulerAlert {
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  timestamp: string
  metric?: string
  value?: number
  threshold?: number
}

export class BlogSchedulerMonitoring {
  private static instance: BlogSchedulerMonitoring
  private scheduler: BlogPostScheduler
  private alerts: BlogSchedulerAlert[] = []
  private maxAlerts = 100
  
  // Thresholds for alerts
  private thresholds = {
    queueSize: 50,
    processingTime: 300000, // 5 minutes
    errorRate: 0.1, // 10%
    memoryUsage: 500 * 1024 * 1024, // 500MB
    failedPosts: 5
  }

  private constructor() {
    this.scheduler = BlogPostScheduler.getInstance()
  }

  static getInstance(): BlogSchedulerMonitoring {
    if (!BlogSchedulerMonitoring.instance) {
      BlogSchedulerMonitoring.instance = new BlogSchedulerMonitoring()
    }
    return BlogSchedulerMonitoring.instance
  }

  /**
   * Collect comprehensive metrics
   */
  async collectMetrics(): Promise<BlogSchedulerMetrics> {
    try {
      const stats = await this.scheduler.getBlogSchedulingStats()
      const queueStatus = this.scheduler.getQueueStatus()
      const memUsage = process.memoryUsage()
      
      const metrics: BlogSchedulerMetrics = {
        timestamp: new Date().toISOString(),
        totalScheduled: stats.totalScheduled,
        readyToProcess: stats.readyToProcess,
        inQueue: stats.inQueue,
        processing: stats.processing,
        failed: stats.failed,
        lastRun: stats.lastRun?.toISOString(),
        nextRun: stats.nextRun?.toISOString(),
        errors: stats.errors,
        queueSize: queueStatus.size,
        memoryUsage: {
          rss: memUsage.rss,
          heapTotal: memUsage.heapTotal,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external
        },
        uptime: process.uptime()
      }
      
      // Check for alerts
      await this.checkAlerts(metrics)
      
      return metrics
    } catch (error) {
      console.error('Error collecting blog scheduler metrics:', error)
      throw error
    }
  }

  /**
   * Check metrics against thresholds and generate alerts
   */
  private async checkAlerts(metrics: BlogSchedulerMetrics): Promise<void> {
    const now = new Date().toISOString()
    
    // Check queue size
    if (metrics.queueSize > this.thresholds.queueSize) {
      this.addAlert({
        level: 'warning',
        message: `Blog scheduler queue size is high: ${metrics.queueSize} items`,
        timestamp: now,
        metric: 'queueSize',
        value: metrics.queueSize,
        threshold: this.thresholds.queueSize
      })
    }
    
    // Check memory usage
    if (metrics.memoryUsage.heapUsed > this.thresholds.memoryUsage) {
      this.addAlert({
        level: 'warning',
        message: `High memory usage: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`,
        timestamp: now,
        metric: 'memoryUsage',
        value: metrics.memoryUsage.heapUsed,
        threshold: this.thresholds.memoryUsage
      })
    }
    
    // Check failed posts
    if (metrics.failed > this.thresholds.failedPosts) {
      this.addAlert({
        level: 'error',
        message: `High number of failed blog posts: ${metrics.failed}`,
        timestamp: now,
        metric: 'failedPosts',
        value: metrics.failed,
        threshold: this.thresholds.failedPosts
      })
    }
    
    // Check for errors
    if (metrics.errors.length > 0) {
      this.addAlert({
        level: 'error',
        message: `Blog scheduler has ${metrics.errors.length} errors: ${metrics.errors.join(', ')}`,
        timestamp: now,
        metric: 'errors',
        value: metrics.errors.length
      })
    }
    
    // Check if processing is stuck
    if (metrics.processing && metrics.lastRun) {
      const lastRunTime = new Date(metrics.lastRun).getTime()
      const timeSinceLastRun = Date.now() - lastRunTime
      
      if (timeSinceLastRun > this.thresholds.processingTime) {
        this.addAlert({
          level: 'critical',
          message: `Blog scheduler appears stuck - processing for ${Math.round(timeSinceLastRun / 1000)}s`,
          timestamp: now,
          metric: 'processingTime',
          value: timeSinceLastRun,
          threshold: this.thresholds.processingTime
        })
      }
    }
    
    // Check if scheduler hasn't run recently
    if (metrics.lastRun) {
      const lastRunTime = new Date(metrics.lastRun).getTime()
      const timeSinceLastRun = Date.now() - lastRunTime
      const maxTimeBetweenRuns = 20 * 60 * 1000 // 20 minutes
      
      if (timeSinceLastRun > maxTimeBetweenRuns && metrics.readyToProcess > 0) {
        this.addAlert({
          level: 'warning',
          message: `Blog scheduler hasn't run for ${Math.round(timeSinceLastRun / 1000 / 60)} minutes with ${metrics.readyToProcess} posts ready`,
          timestamp: now,
          metric: 'lastRun',
          value: timeSinceLastRun,
          threshold: maxTimeBetweenRuns
        })
      }
    }
  }

  /**
   * Add alert to the alerts list
   */
  private addAlert(alert: BlogSchedulerAlert): void {
    this.alerts.unshift(alert)
    
    // Keep only the most recent alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts)
    }
    
    // Log the alert
    const logLevel = alert.level === 'critical' || alert.level === 'error' ? 'error' : 
                    alert.level === 'warning' ? 'warn' : 'info'
    
    console[logLevel](`[BlogSchedulerAlert] ${alert.level.toUpperCase()}: ${alert.message}`)
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit = 20): BlogSchedulerAlert[] {
    return this.alerts.slice(0, limit)
  }

  /**
   * Get alerts by level
   */
  getAlertsByLevel(level: BlogSchedulerAlert['level'], limit = 20): BlogSchedulerAlert[] {
    return this.alerts.filter(alert => alert.level === level).slice(0, limit)
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts = []
  }

  /**
   * Clear alerts older than specified time
   */
  clearOldAlerts(maxAgeMs = 24 * 60 * 60 * 1000): void { // 24 hours default
    const cutoffTime = Date.now() - maxAgeMs
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > cutoffTime
    )
  }

  /**
   * Get system health summary
   */
  async getHealthSummary(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    score: number
    issues: string[]
    recommendations: string[]
    metrics: BlogSchedulerMetrics
    alerts: BlogSchedulerAlert[]
  }> {
    try {
      const metrics = await this.collectMetrics()
      const recentAlerts = this.getAlerts(10)
      
      let score = 100
      const issues: string[] = []
      const recommendations: string[] = []
      
      // Evaluate health based on metrics and alerts
      const criticalAlerts = recentAlerts.filter(a => a.level === 'critical')
      const errorAlerts = recentAlerts.filter(a => a.level === 'error')
      const warningAlerts = recentAlerts.filter(a => a.level === 'warning')
      
      // Deduct points for alerts
      score -= criticalAlerts.length * 30
      score -= errorAlerts.length * 15
      score -= warningAlerts.length * 5
      
      // Add issues and recommendations
      if (criticalAlerts.length > 0) {
        issues.push(`${criticalAlerts.length} critical alerts`)
        recommendations.push('Investigate critical issues immediately')
      }
      
      if (errorAlerts.length > 0) {
        issues.push(`${errorAlerts.length} error alerts`)
        recommendations.push('Review and resolve error conditions')
      }
      
      if (metrics.queueSize > this.thresholds.queueSize) {
        issues.push('High queue size')
        recommendations.push('Consider increasing processing frequency or investigating bottlenecks')
      }
      
      if (metrics.failed > 0) {
        issues.push(`${metrics.failed} failed posts`)
        recommendations.push('Review failed posts and retry or fix issues')
      }
      
      if (metrics.errors.length > 0) {
        issues.push('System errors present')
        recommendations.push('Check logs and resolve system errors')
      }
      
      // Determine status
      let status: 'healthy' | 'degraded' | 'unhealthy'
      if (score >= 80) {
        status = 'healthy'
      } else if (score >= 50) {
        status = 'degraded'
      } else {
        status = 'unhealthy'
      }
      
      return {
        status,
        score: Math.max(0, score),
        issues,
        recommendations,
        metrics,
        alerts: recentAlerts
      }
    } catch (error) {
      console.error('Error getting health summary:', error)
      return {
        status: 'unhealthy',
        score: 0,
        issues: ['Failed to collect health metrics'],
        recommendations: ['Check system logs and restart if necessary'],
        metrics: {} as BlogSchedulerMetrics,
        alerts: []
      }
    }
  }

  /**
   * Update alert thresholds
   */
  updateThresholds(newThresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds }
    console.log('Updated blog scheduler monitoring thresholds:', this.thresholds)
  }

  /**
   * Get current thresholds
   */
  getThresholds(): typeof this.thresholds {
    return { ...this.thresholds }
  }

  /**
   * Export metrics for external monitoring systems
   */
  async exportMetrics(): Promise<{
    prometheus: string
    json: BlogSchedulerMetrics
  }> {
    const metrics = await this.collectMetrics()
    
    // Generate Prometheus format
    const prometheus = [
      `# HELP blog_scheduler_total_scheduled Total number of scheduled blog posts`,
      `# TYPE blog_scheduler_total_scheduled gauge`,
      `blog_scheduler_total_scheduled ${metrics.totalScheduled}`,
      ``,
      `# HELP blog_scheduler_ready_to_process Number of blog posts ready to process`,
      `# TYPE blog_scheduler_ready_to_process gauge`,
      `blog_scheduler_ready_to_process ${metrics.readyToProcess}`,
      ``,
      `# HELP blog_scheduler_queue_size Current queue size`,
      `# TYPE blog_scheduler_queue_size gauge`,
      `blog_scheduler_queue_size ${metrics.queueSize}`,
      ``,
      `# HELP blog_scheduler_failed_posts Number of failed blog posts`,
      `# TYPE blog_scheduler_failed_posts gauge`,
      `blog_scheduler_failed_posts ${metrics.failed}`,
      ``,
      `# HELP blog_scheduler_processing Whether scheduler is currently processing`,
      `# TYPE blog_scheduler_processing gauge`,
      `blog_scheduler_processing ${metrics.processing ? 1 : 0}`,
      ``,
      `# HELP blog_scheduler_memory_usage_bytes Memory usage in bytes`,
      `# TYPE blog_scheduler_memory_usage_bytes gauge`,
      `blog_scheduler_memory_usage_bytes{type="rss"} ${metrics.memoryUsage.rss}`,
      `blog_scheduler_memory_usage_bytes{type="heap_total"} ${metrics.memoryUsage.heapTotal}`,
      `blog_scheduler_memory_usage_bytes{type="heap_used"} ${metrics.memoryUsage.heapUsed}`,
      `blog_scheduler_memory_usage_bytes{type="external"} ${metrics.memoryUsage.external}`,
      ``,
      `# HELP blog_scheduler_uptime_seconds Process uptime in seconds`,
      `# TYPE blog_scheduler_uptime_seconds gauge`,
      `blog_scheduler_uptime_seconds ${metrics.uptime}`,
      ``
    ].join('\n')
    
    return {
      prometheus,
      json: metrics
    }
  }
}

// Export singleton instance
export const blogSchedulerMonitoring = BlogSchedulerMonitoring.getInstance()