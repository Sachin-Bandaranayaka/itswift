// API route for managing pages in the content management system

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = getSupabaseAdmin()
    
    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const isActive = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined
    const slug = searchParams.get('slug')

    let query = supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive)
    }

    if (slug) {
      query = query.eq('slug', slug)
    }

    // Apply pagination
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch pages', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data, 
      success: true,
      pagination: {
        limit,
        offset,
        count: data?.length || 0
      }
    })
  } catch (error) {
    console.error('Error in GET /api/admin/content/pages:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    const { slug, title, description, meta_title, meta_description, meta_keywords, is_active = true } = body

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingPage } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingPage) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 409 }
      )
    }

    const pageData = {
      slug,
      title,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      is_active
    }

    const { data, error } = await supabase
      .from('pages')
      .insert(pageData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create page', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data, 
      success: true,
      message: 'Page created successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/content/pages:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}