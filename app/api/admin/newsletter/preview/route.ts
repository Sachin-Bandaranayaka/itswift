import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/services/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, subject, content, variables } = body

    if (!templateId || !subject || !content) {
      return NextResponse.json(
        { error: 'Template ID, subject, and content are required' },
        { status: 400 }
      )
    }

    const preview = NewsletterService.previewNewsletter(
      templateId,
      subject,
      content,
      variables || {}
    )

    if (preview.error) {
      return NextResponse.json(
        { error: preview.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      htmlContent: preview.htmlContent,
      textContent: preview.textContent
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}