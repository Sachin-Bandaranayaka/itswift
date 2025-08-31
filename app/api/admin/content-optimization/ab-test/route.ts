// API route for A/B testing management

import { NextRequest, NextResponse } from 'next/server'
import { ContentOptimizer } from '@/lib/services/content-optimizer'

// Mock database - in real implementation, this would use a proper database
let abTests: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const contentType = searchParams.get('content_type')

    let filteredTests = abTests

    if (status) {
      filteredTests = filteredTests.filter(test => test.status === status)
    }

    if (contentType) {
      filteredTests = filteredTests.filter(test => test.content_type === contentType)
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredTests,
      count: filteredTests.length
    })
  } catch (error) {
    console.error('Error fetching A/B tests:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      name,
      description,
      content_type,
      platform,
      test_type,
      original_content,
      variant_count = 2
    } = body

    // Validate required fields
    if (!name || !description || !content_type || !test_type || !original_content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, content_type, test_type, original_content' },
        { status: 400 }
      )
    }

    // Generate variants using AI
    const variants = await ContentOptimizer.createABTestVariants(
      original_content,
      test_type,
      variant_count
    )

    // Create new A/B test
    const newTest = {
      id: Date.now().toString(),
      name,
      description,
      content_type,
      platform: platform || undefined,
      status: 'draft',
      variants,
      results: [],
      confidence_level: 0,
      created_at: new Date().toISOString()
    }

    abTests.push(newTest)

    return NextResponse.json({ 
      success: true, 
      data: newTest,
      message: 'A/B test created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating A/B test:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}