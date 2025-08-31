import { NextRequest, NextResponse } from 'next/server'
import { NewsletterCampaignsService } from '@/lib/database/services/newsletter-campaigns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let result

    if (search) {
      result = await NewsletterCampaignsService.search(search, { limit, offset })
    } else {
      const filters = status && status !== 'all' ? { status } : {}
      result = await NewsletterCampaignsService.getAll({ limit, offset }, filters)
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      campaigns: result.data,
      count: result.count || result.data.length
    })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, content, template_id, scheduled_at, status } = body

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    const result = await NewsletterCampaignsService.create({
      subject,
      content,
      template_id,
      scheduled_at,
      status: status || 'draft',
      recipient_count: 0
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      campaign: result.data,
      message: 'Campaign created successfully'
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}