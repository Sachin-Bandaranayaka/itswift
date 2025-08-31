import { NextRequest } from 'next/server'
import { monitoring } from '@/lib/utils/monitoring'
import { createSuccessResponse, handleApiError } from '@/lib/utils/error-handler'

export async function GET(request: NextRequest) {
  try {
    const systemStatus = await monitoring.runHealthChecks()
    
    // Return appropriate HTTP status based on system health
    const httpStatus = systemStatus.status === 'healthy' ? 200 : 
                      systemStatus.status === 'degraded' ? 200 : 503
    
    return new Response(JSON.stringify(systemStatus), {
      status: httpStatus,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const systemStatus = await monitoring.runHealthChecks()
    
    const httpStatus = systemStatus.status === 'healthy' ? 200 : 
                      systemStatus.status === 'degraded' ? 200 : 503
    
    return new Response(null, {
      status: httpStatus,
      headers: {
        'X-Health-Status': systemStatus.status,
        'X-Uptime': systemStatus.uptime.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return new Response(null, { status: 503 })
  }
}