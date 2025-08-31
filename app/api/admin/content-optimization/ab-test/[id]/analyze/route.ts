// API route for analyzing A/B test results

import { NextRequest, NextResponse } from 'next/server'
import { ContentOptimizer } from '@/lib/services/content-optimizer'

// Mock database - in real implementation, this would use a proper database
let abTests: any[] = []

export async function POST(
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

    if (!test.results || test.results.length === 0) {
      return NextResponse.json(
        { error: 'No test results available for analysis' },
        { status: 400 }
      )
    }

    // Analyze test results
    const analysis = ContentOptimizer.analyzeABTestResults(test)

    // Update test with analysis results
    const testIndex = abTests.findIndex(t => t.id === params.id)
    if (testIndex !== -1) {
      abTests[testIndex] = {
        ...abTests[testIndex],
        winner: analysis.winner,
        confidence_level: analysis.confidence,
        status: analysis.confidence >= 95 ? 'completed' : test.status,
        analyzed_at: new Date().toISOString()
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        test: abTests[testIndex],
        analysis: {
          winner: analysis.winner,
          confidence: analysis.confidence,
          insights: analysis.insights,
          recommendations: analysis.recommendations
        }
      },
      message: 'A/B test analysis completed'
    })
  } catch (error) {
    console.error('Error analyzing A/B test:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}