import { NextRequest, NextResponse } from 'next/server'
import { generateSEOSuggestions } from '@/lib/integrations/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, contentType } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      )
    }

    const seoAnalysis = await generateSEOSuggestions(content)

    return NextResponse.json({
      keywords: seoAnalysis.keywords,
      metaDescription: seoAnalysis.metaDescription,
      suggestions: seoAnalysis.suggestions
    })
  } catch (error) {
    console.error('Error generating SEO suggestions:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate SEO suggestions'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}