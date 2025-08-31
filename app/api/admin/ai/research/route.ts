import { NextRequest, NextResponse } from 'next/server'
import { researchTopic } from '@/lib/integrations/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, contentType } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      )
    }

    const research = await researchTopic(topic)

    return NextResponse.json({
      insights: research.insights,
      keyPoints: research.keyPoints,
      relatedTopics: research.relatedTopics
    })
  } catch (error) {
    console.error('Error researching topic:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to research topic'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}