import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const pageSlug = searchParams.get('page_slug')
    const sectionKey = searchParams.get('section_key')
    
    let query = supabase
      .from('page_content_sections')
      .select(`
        *,
        pages!inner(slug, title)
      `)
    
    // Apply filters
    if (pageSlug) {
      query = query.eq('pages.slug', pageSlug)
    }
    
    if (sectionKey) {
      query = query.eq('section_key', sectionKey)
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    // Order by display_order and created_at
    query = query.order('display_order', { ascending: true })
    query = query.order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching content sections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content sections' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in content sections API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    
    const { page_id, section_key, section_type, content, content_html, display_order, is_active } = body
    
    if (!section_key || !content) {
      return NextResponse.json(
        { error: 'Section key and content are required' },
        { status: 400 }
      )
    }
    
    // Check if section_key already exists for this page
    if (page_id) {
      const { data: existingSection } = await supabase
        .from('page_content_sections')
        .select('id')
        .eq('page_id', page_id)
        .eq('section_key', section_key)
        .single()
      
      if (existingSection) {
        return NextResponse.json(
          { error: 'Section with this key already exists for this page' },
          { status: 409 }
        )
      }
    }
    
    const insertData: any = {
      section_key,
      content,
      section_type: section_type || 'text',
      is_active: is_active !== undefined ? is_active : true
    }
    
    if (page_id) insertData.page_id = page_id
    if (content_html) insertData.content_html = content_html
    if (display_order !== undefined) insertData.display_order = display_order
    
    const { data, error } = await supabase
      .from('page_content_sections')
      .insert(insertData)
      .select(`
        *,
        pages(slug, title)
      `)
      .single()
    
    if (error) {
      console.error('Error creating content section:', error)
      return NextResponse.json(
        { error: 'Failed to create content section' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error in content sections API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}