import { NextRequest, NextResponse } from 'next/server'
import { testOpenAIConnection } from '@/lib/integrations/openai'

export async function GET() {
  try {
    const result = await testOpenAIConnection()
    
    return NextResponse.json({
      connected: result.connected,
      error: result.error,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing OpenAI connection:', error)
    
    return NextResponse.json(
      { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}