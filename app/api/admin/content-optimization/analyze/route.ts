// API route for content optimization analysis

import { NextRequest, NextResponse } from 'next/server'
import { ContentOptimizer } from '@/lib/services/content-optimizer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      content, 
      title, 
      meta_description, 
      target_keywords = [],
      analysis_types = ['seo', 'readability', 'brand_voice']
    } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required for analysis' },
        { status: 400 }
      )
    }

    const results: any = {}

    // Run requested analyses
    if (analysis_types.includes('seo')) {
      try {
        results.seo = await ContentOptimizer.analyzeSEO(
          content,
          title,
          meta_description,
          target_keywords
        )
      } catch (error) {
        console.error('SEO analysis error:', error)
        results.seo = { error: 'Failed to analyze SEO' }
      }
    }

    if (analysis_types.includes('readability')) {
      try {
        results.readability = ContentOptimizer.analyzeReadability(content)
      } catch (error) {
        console.error('Readability analysis error:', error)
        results.readability = { error: 'Failed to analyze readability' }
      }
    }

    if (analysis_types.includes('brand_voice')) {
      try {
        results.brand_voice = await ContentOptimizer.analyzeBrandVoice(content)
      } catch (error) {
        console.error('Brand voice analysis error:', error)
        results.brand_voice = { error: 'Failed to analyze brand voice' }
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: results,
      analyzed_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in content optimization analysis:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}