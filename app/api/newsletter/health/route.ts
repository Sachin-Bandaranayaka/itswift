import { NextRequest, NextResponse } from 'next/server'
import { NewsletterMonitoring } from '@/lib/utils/newsletter-monitoring'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/newsletter/health
 * Newsletter service health check endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const healthCheck = await NewsletterMonitoring.performHealthCheck()
    
    // Determine HTTP status based on health status
    let statusCode = 200
    if (healthCheck.status === 'degraded') {
      statusCode = 200 // Still operational but with issues
    } else if (healthCheck.status === 'unhealthy') {
      statusCode = 503 // Service unavailable
    }

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    logger.error('Health check endpoint error', 'NEWSLETTER_HEALTH', {}, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}

/**
 * GET /api/newsletter/health/metrics
 * Newsletter service metrics endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'summary'

    let response: any

    switch (type) {
      case 'summary':
        response = NewsletterMonitoring.getMetricsSummary()
        break
      case 'full':
        response = NewsletterMonitoring.getMetrics()
        break
      case 'errors':
        const timeRange = {
          from: searchParams.get('from') || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          to: searchParams.get('to') || new Date().toISOString()
        }
        response = {
          errors: NewsletterErrorHandler.getErrorMetrics(timeRange),
          timeRange
        }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid metrics type. Use: summary, full, or errors' },
          { status: 400 }
        )
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Metrics endpoint error', 'NEWSLETTER_METRICS', {}, error instanceof Error ? error : undefined)
    
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    )
  }
}