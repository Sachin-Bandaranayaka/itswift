import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { BlogPostScheduler } from '@/lib/services/blog-post-scheduler'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/blog/health
 * Health check endpoint for blog post scheduler
 */
async function handleHealthCheck(request: NextRequest) {
  try {
    const scheduler = BlogPostScheduler.getInstance()
    
    // Perform comprehensive health check
    const healthStatus = await scheduler.healthCheck()
    const schedulingStats = await scheduler.getBlogSchedulingStats()
    const queueStatus = scheduler.getQueueStatus()
    
    // Determine overall health status
    const isHealthy = healthStatus.healthy && 
                     healthStatus.services.sanity && 
                     schedulingStats.errors.length === 0
    
    const status = isHealthy ? 'healthy' : 'degraded'
    const httpStatus = isHealthy ? 200 : 503
    
    const response = {
      status,
      timestamp: new Date().toISOString(),
      service: 'blog-post-scheduler',
      version: '1.0.0',
      uptime: process.uptime(),
      health: {
        overall: isHealthy,
        scheduler: healthStatus.healthy,
        services: healthStatus.services
      },
      statistics: {
        totalScheduled: schedulingStats.totalScheduled,
        readyToProcess: schedulingStats.readyToProcess,
        inQueue: schedulingStats.inQueue,
        processing: schedulingStats.processing,
        failed: schedulingStats.failed
      },
      queue: {
        size: queueStatus.size,
        items: queueStatus.items.length,
        hasErrors: queueStatus.items.some(item => item.lastError)
      },
      timing: {
        lastRun: healthStatus.lastRun?.toISOString() || null,
        nextRun: healthStatus.nextRun?.toISOString() || null
      },
      errors: [
        ...healthStatus.errors,
        ...schedulingStats.errors
      ],
      details: {
        queueItems: queueStatus.items.map(item => ({
          id: item.id,
          type: item.type,
          retryCount: item.retryCount,
          maxRetries: item.maxRetries,
          nextRetry: item.nextRetry.toISOString(),
          hasError: !!item.lastError
        }))
      }
    }
    
    return NextResponse.json(response, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': status,
        'X-Service': 'blog-post-scheduler'
      }
    })
    
  } catch (error) {
    console.error('Blog scheduler health check failed:', error)
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'blog-post-scheduler',
      version: '1.0.0',
      uptime: process.uptime(),
      error: error instanceof Error ? error.message : 'Unknown error',
      health: {
        overall: false,
        scheduler: false,
        services: {
          sanity: false
        }
      }
    }
    
    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': 'unhealthy',
        'X-Service': 'blog-post-scheduler'
      }
    })
  }
}

export const GET = withAdminAuth(handleHealthCheck)