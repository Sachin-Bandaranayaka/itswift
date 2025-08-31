import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const filters = status && status !== 'all' ? { status } : {}
    const result = await NewsletterSubscribersService.getAll({}, filters)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    const subscribers = result.data

    // Create CSV content
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At', 'Tags']
    const csvRows = [
      headers.join(','),
      ...subscribers.map(subscriber => [
        `"${subscriber.email}"`,
        `"${subscriber.first_name || ''}"`,
        `"${subscriber.last_name || ''}"`,
        `"${subscriber.status}"`,
        `"${new Date(subscriber.subscribed_at).toISOString()}"`,
        `"${subscriber.tags?.join(';') || ''}"`
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}