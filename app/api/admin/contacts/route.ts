import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contacts: data || [] })

  } catch (error) {
    console.error('Contacts fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status !== undefined) {
      updateData.status = status
      if (status !== 'new') {
        updateData.responded_at = new Date().toISOString()
      } else {
        updateData.responded_at = null
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contact: data })

  } catch (error) {
    console.error('Contact update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}