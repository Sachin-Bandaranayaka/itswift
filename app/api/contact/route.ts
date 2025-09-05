import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, message } = body

    // Validate required fields
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'First name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Insert contact submission into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        first_name: firstName,
        last_name: lastName || null,
        email,
        phone: phone || null,
        company: company || null,
        message,
        status: 'new',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save contact submission' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: data.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}