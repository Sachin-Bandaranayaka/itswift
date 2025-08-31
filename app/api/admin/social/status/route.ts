import { NextRequest, NextResponse } from 'next/server'
import { getSocialMediaPublisher } from '@/lib/services/social-media-publisher'

export async function GET(request: NextRequest) {
  try {
    const publisher = getSocialMediaPublisher()
    
    // Get API configuration status
    const apiStatus = publisher.getApiStatus()
    
    // Validate tokens (this might take a moment)
    const tokenValidation = await publisher.validateTokens()
    
    return NextResponse.json({
      success: true,
      data: {
        apis: {
          linkedin: {
            configured: apiStatus.linkedin,
            tokenValid: tokenValidation.linkedin
          },
          twitter: {
            configured: apiStatus.twitter,
            tokenValid: tokenValidation.twitter
          }
        },
        overall: {
          configured: apiStatus.linkedin || apiStatus.twitter,
          ready: tokenValidation.linkedin || tokenValidation.twitter
        }
      }
    })
  } catch (error) {
    console.error('Error checking social media status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update metrics for all published posts
export async function POST(request: NextRequest) {
  try {
    const publisher = getSocialMediaPublisher()
    
    // This is an async operation that might take a while
    // In production, this should be handled by a background job
    publisher.updateAllMetrics().catch(error => {
      console.error('Background metrics update failed:', error)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Metrics update started in background'
    })
  } catch (error) {
    console.error('Error starting metrics update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}