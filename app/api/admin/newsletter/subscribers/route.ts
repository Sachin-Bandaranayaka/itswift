import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let result

    if (search) {
      result = await NewsletterSubscribersService.search(search, { limit, offset })
    } else {
      const filters = status && status !== 'all' ? { status } : {}
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
      status: 'active'
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
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