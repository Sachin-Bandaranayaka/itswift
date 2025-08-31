import { NextRequest, NextResponse } from 'next/server'
import { optimizeContent } from '@/lib/integrations/openai'

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

    const result = await optimizeContent(content, contentType)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error optimizing content:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to optimize content'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}