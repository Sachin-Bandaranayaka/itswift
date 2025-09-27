import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('page_content_sections')
      .select(`
        *,
        pages(slug, title)
      `)
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Content section not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching content section:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content section' },
        { status: 500 }
      )
    }
    
    // Trigger revalidation for immediate cache invalidation
    try {
      const pageSlug = (data as any)?.pages?.slug
      if (pageSlug) {
        // Call revalidation API to clear Next.js cache
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageSlug })
        })
      }
    } catch (revalidateError) {
      console.warn('Failed to trigger revalidation:', revalidateError)
    }

    const response = NextResponse.json({ data })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Content-Updated', new Date().toISOString())
    return response
  } catch (error) {
    console.error('Error in content section API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    
    const { page_id, section_key, section_type, content, content_html, display_order, is_active } = body
    
    // Build update object with only provided fields
    const updateData: any = {}
    if (page_id !== undefined) updateData.page_id = page_id
    if (section_key !== undefined) updateData.section_key = section_key
    if (section_type !== undefined) updateData.section_type = section_type
    if (content !== undefined) updateData.content = content
    if (content_html !== undefined) updateData.content_html = content_html
    if (display_order !== undefined) updateData.display_order = display_order
    if (is_active !== undefined) updateData.is_active = is_active
    
    // If updating section_key, check for conflicts
    if (section_key && page_id) {
      const { data: existingSection } = await supabase
        .from('page_content_sections')
        .select('id')
        .eq('page_id', page_id)
        .eq('section_key', section_key)
        .neq('id', params.id)
        .single()
      
      if (existingSection) {
        return NextResponse.json(
          { error: 'Section with this key already exists for this page' },
          { status: 409 }
        )
      }
    }
    
    const { data, error } = await supabase
      .from('page_content_sections')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        pages(slug, title)
      `)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Content section not found' },
          { status: 404 }
        )
      }
      console.error('Error updating content section:', error)
      return NextResponse.json(
        { error: 'Failed to update content section' },
        { status: 500 }
      )
    }
    
    // Trigger revalidation for immediate cache invalidation after update
    try {
      const pageSlug = (data as any)?.pages?.slug
      if (pageSlug) {
        // Call revalidation API to clear Next.js cache
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageSlug })
        })
      }
    } catch (revalidateError) {
      console.warn('Failed to trigger revalidation:', revalidateError)
    }
    
    const response = NextResponse.json({ data })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Content-Updated', new Date().toISOString())
    return response
  } catch (error) {
    console.error('Error in content section API:', error)
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
    const supabase = getSupabaseAdmin()
    
    const { error } = await supabase
      .from('page_content_sections')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting content section:', error)
      return NextResponse.json(
        { error: 'Failed to delete content section' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in content section API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}