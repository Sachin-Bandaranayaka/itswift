import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/middleware'
import { blogSchedulerMonitoring } from '@/lib/utils/blog-scheduler-monitoring'

/**
 * GET /api/admin/blog/monitoring
 * Get comprehensive monitoring data for blog scheduler
 */
async function handleGetMonitoring(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const format = url.searchParams.get('format') || 'json'
    const includeAlerts = url.searchParams.get('alerts') !== 'false'
    const alertsLimit = parseInt(url.searchParams.get('alertsLimit') || '20')
    
    if (format === 'prometheus') {
      // Return Prometheus metrics format
      const metrics = await blogSchedulerMonitoring.exportMetrics()
      
      return new Response(metrics.prometheus, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
    }
    
    // Get comprehensive health summary
    const healthSummary = await blogSchedulerMonitoring.getHealthSummary()
    
    const response = {
      timestamp: new Date().toISOString(),
      service: 'blog-post-scheduler',
      version: '1.0.0',
      health: {
        status: healthSummary.status,
        score: healthSummary.score,
        issues: healthSummary.issues,
        recommendations: healthSummary.recommendations
      },
      metrics: healthSummary.metrics,
      alerts: includeAlerts ? healthSummary.alerts.slice(0, alertsLimit) : [],
      thresholds: blogSchedulerMonitoring.getThresholds()
    }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': healthSummary.status,
        'X-Health-Score': healthSummary.score.toString()
      }
    })
    
  } catch (error) {
    console.error('Error getting blog scheduler monitoring data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get monitoring data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/blog/monitoring
 * Update monitoring configuration
 */
async function handleUpdateMonitoring(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, thresholds, clearAlerts } = body
    
    if (action === 'updateThresholds' && thresholds) {
      blogSchedulerMonitoring.updateThresholds(thresholds)
      
      return NextResponse.json({
        success: true,
        message: 'Monitoring thresholds updated',
        thresholds: blogSchedulerMonitoring.getThresholds()
      })
    }
    
    if (action === 'clearAlerts' || clearAlerts) {
      const maxAge = body.maxAge ? parseInt(body.maxAge) : undefined
      
      if (maxAge) {
        blogSchedulerMonitoring.clearOldAlerts(maxAge)
      } else {
        blogSchedulerMonitoring.clearAlerts()
      }
      
      return NextResponse.json({
        success: true,
        message: 'Alerts cleared',
        remainingAlerts: blogSchedulerMonitoring.getAlerts(1).length
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        validActions: ['updateThresholds', 'clearAlerts']
      },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error updating blog scheduler monitoring:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update monitoring configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetMonitoring)
export const POST = withAdminAuth(handleUpdateMonitoring)