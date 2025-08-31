import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/services/newsletter'

export async function GET(request: NextRequest) {
  try {
    const templates = NewsletterService.getDefaultTemplates()

    return NextResponse.json({
      templates
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}