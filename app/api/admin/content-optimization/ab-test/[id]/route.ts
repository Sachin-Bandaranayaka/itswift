// API route for individual A/B test operations

import { NextRequest, NextResponse } from 'next/server'
import { ContentOptimizer } from '@/lib/services/content-optimizer'

// Mock database - in real implementation, this would use a proper database
let abTests: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const test = abTests.find(t => t.id === params.id)

    if (!test) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: test
    })
  } catch (error) {
    console.error('Error fetching A/B test:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const testIndex = abTests.findIndex(t => t.id === params.id)

    if (testIndex === -1) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      )
    }

    // Update test
    abTests[testIndex] = {
      ...abTests[testIndex],
      ...body,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      data: abTests[testIndex],
      message: 'A/B test updated successfully'
    })
  } catch (error) {
    console.error('Error updating A/B test:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testIndex = abTests.findIndex(t => t.id === params.id)

    if (testIndex === -1) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      )
    }

    abTests.splice(testIndex, 1)

    return NextResponse.json({ 
      success: true,
      message: 'A/B test deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting A/B test:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}