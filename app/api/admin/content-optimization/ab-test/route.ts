// API route for A/B testing management

import { NextRequest, NextResponse } from 'next/server'
import { ABTestService } from '@/lib/services/ab-test-service'
import { ABTestFilters } from '@/types/ab-test'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate filters
    const filters: ABTestFilters = {}
    
    const status = searchParams.get('status')
    if (status && ['draft', 'running', 'paused', 'completed', 'archived'].includes(status)) {
      filters.status = status as ABTestFilters['status']
    }
    
    const contentType = searchParams.get('content_type')
    if (contentType && ['blog', 'social', 'newsletter'].includes(contentType)) {
      filters.content_type = contentType as ABTestFilters['content_type']
    }
    
    const platform = searchParams.get('platform')
    if (platform && ['facebook', 'twitter', 'linkedin', 'instagram', 'email'].includes(platform)) {
      filters.platform = platform as ABTestFilters['platform']
    }

    const tests = await ABTestService.getAll(filters)

    return NextResponse.json({ 
      success: true, 
      data: tests,
      count: tests.length
    })
  } catch (error) {
    console.error('Error fetching A/B tests:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = errorMessage.includes('not found') ? 404 : 500
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch A/B tests', 
        details: errorMessage 
      },
      { status: statusCode }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request body' 
        },
        { status: 400 }
      )
    }

    const testData = {
      name: body.name,
      description: body.description,
      content_type: body.content_type,
      platform: body.platform,
      test_type: body.test_type,
      original_content: body.original_content,
      variant_count: body.variant_count || 2
    }

    // Create A/B test using service layer (includes validation)
    const newTest = await ABTestService.create(testData)

    return NextResponse.json({ 
      success: true, 
      data: newTest,
      message: 'A/B test created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating A/B test:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Handle validation errors with 400 status
    const statusCode = errorMessage.includes('Missing required fields') || 
                      errorMessage.includes('must be between') ||
                      errorMessage.includes('must be at least') ? 400 : 500
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create A/B test', 
        details: errorMessage 
      },
      { status: statusCode }
    )
  }
}