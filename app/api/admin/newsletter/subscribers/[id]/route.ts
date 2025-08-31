import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    const result = await NewsletterSubscribersService.update(id, body)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      subscriber: result.data,
      message: 'Subscriber updated successfully'
    })
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await NewsletterSubscribersService.delete(id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Subscriber deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}