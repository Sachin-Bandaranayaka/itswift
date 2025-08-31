import { NextRequest, NextResponse } from 'next/server'
import { BackgroundScheduler } from '@/lib/services/background-scheduler'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    
    const scheduler = BackgroundScheduler.getInstance()

    switch (action) {
      case 'status':
        const status = scheduler.getStatus()
        return NextResponse.json({
          success: true,
          data: status
        })

      case 'health':
        const health = await scheduler.healthCheck()
        return NextResponse.json({
          success: true,
          data: health
        })

      case 'queue':
        const queueDetails = scheduler.getQueueDetails()
        return NextResponse.json({
          success: true,
          data: queueDetails
        })

      case 'logs':
        const limit = parseInt(searchParams.get('limit') || '100')
        const logs = scheduler.getLogs(limit)
        return NextResponse.json({
          success: true,
          data: logs
        })

      case 'stats':
        // Legacy compatibility
        const legacyStats = scheduler.getStatus()
        return NextResponse.json({
          success: true,
          data: {
            totalScheduled: legacyStats.queueStats.total,
            readyToProcess: legacyStats.queueStats.pending,
            byType: legacyStats.queueStats.byType
          }
        })

      default:
        // Default to status
        const defaultStatus = scheduler.getStatus()
        return NextResponse.json({
          success: true,
          data: defaultStatus
        })
    }
  } catch (error) {
    console.error('Error in scheduler GET endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config } = body
    
    const scheduler = BackgroundScheduler.getInstance()

    switch (action) {
      case 'start':
        scheduler.start()
        return NextResponse.json({
          success: true,
          message: 'Background scheduler started',
          data: scheduler.getStatus()
        })

      case 'stop':
        scheduler.stop()
        return NextResponse.json({
          success: true,
          message: 'Background scheduler stopped',
          data: scheduler.getStatus()
        })

      case 'process':
        // Force process queue
        const result = await scheduler.forceProcess()
        return NextResponse.json({
          success: true,
          message: `Processed ${result.totalProcessed} items: ${result.successful} successful, ${result.failed} failed`,
          data: result
        })

      case 'reset-stats':
        scheduler.resetStats()
        return NextResponse.json({
          success: true,
          message: 'Statistics reset',
          data: scheduler.getStatus()
        })

      case 'update-config':
        if (!config) {
          return NextResponse.json(
            { error: 'config is required for update-config action' },
            { status: 400 }
          )
        }
        
        scheduler.updateConfig(config)
        return NextResponse.json({
          success: true,
          message: 'Configuration updated',
          data: scheduler.getStatus()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: start, stop, process, reset-stats, update-config' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in scheduler POST endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { config } = body

    if (!config) {
      return NextResponse.json(
        { error: 'config is required' },
        { status: 400 }
      )
    }

    const scheduler = BackgroundScheduler.getInstance()
    scheduler.updateConfig(config)

    return NextResponse.json({
      success: true,
      message: 'Scheduler configuration updated',
      data: scheduler.getStatus()
    })
  } catch (error) {
    console.error('Error in scheduler PUT endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}