import { NextRequest } from 'next/server'
import { monitoring } from '@/lib/utils/monitoring'
import { createSuccessResponse, handleApiError, AuthenticationError } from '@/lib/utils/error-handler'

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check for metrics endpoint
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Bearer token required for metrics access')
    }
    
    // In a real implementation, you'd validate the token
    // For now, we'll just check if it's present
    
    const metrics = monitoring.getMetrics()
    
    return createSuccessResponse({
      metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Bearer token required for metrics access')
    }
    
    monitoring.clearMetrics()
    
    return createSuccessResponse({
      message: 'Metrics cleared successfully'
    })
  } catch (error) {
    return handleApiError(error)
  }
}