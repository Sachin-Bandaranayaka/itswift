import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const PAGE_FIELDS = `
  id,
  slug,
  title,
  description,
  meta_title,
  meta_description,
  meta_keywords,
  is_active,
  created_at,
  updated_at
`

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('pages')
      .select(PAGE_FIELDS)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }
      console.error('Error fetching page metadata:', error)
      return NextResponse.json({ error: 'Failed to fetch page metadata' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in page metadata API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const updatableFields = [
      'title',
      'description',
      'meta_title',
      'meta_description',
      'meta_keywords',
      'slug',
      'is_active'
    ] as const

    const updateData: Record<string, any> = {}

    for (const field of updatableFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', params.id)
      .select(PAGE_FIELDS)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }
      console.error('Error updating page metadata:', error)
      return NextResponse.json({ error: 'Failed to update page metadata' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in page metadata API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
