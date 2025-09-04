import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let result

    const filters: any = {}
    if (status && status !== 'all') filters.status = status
    if (source && source !== 'all') filters.source = source

    if (search) {
      result = await NewsletterSubscribersService.search(search, { limit, offset }, filters)
    } else {
      result = await NewsletterSubscribersService.getAll({ limit, offset }, filters)
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      subscribers: result.data,
      count: result.count || result.data.length
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, first_name, last_name, tags } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await NewsletterSubscribersService.create({
      email,
      first_name,
      last_name,
      tags,
      status: 'active',
      source: body.source || 'admin'
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Sync new subscriber to Brevo (non-blocking)
    if (result.data) {
      try {
        const { getBrevoService } = await import('@/lib/integrations/brevo')
        const brevoService = getBrevoService()
        const syncResult = await brevoService.syncSubscriber(result.data, true) // Enable fallback
        
        if (syncResult.success && syncResult.brevo_contact_id) {
          // Update subscriber with Brevo contact ID
          await NewsletterSubscribersService.update(result.data.id, {
            brevo_contact_id: syncResult.brevo_contact_id,
            last_synced_at: new Date().toISOString()
          })
        }
      } catch (syncError) {
        // Don't fail the creation if Brevo sync fails
        console.warn('Failed to sync new admin subscriber to Brevo:', syncError)
      }
    }

    return NextResponse.json({
      subscriber: result.data,
      message: 'Subscriber added successfully'
    })
  } catch (error) {
    console.error('Error creating subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}