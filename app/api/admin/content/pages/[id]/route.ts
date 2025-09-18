// API route for individual page operations

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

type PageUpdate = Database['public']['Tables']['pages']['Update']

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Page not found', details: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/content/pages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()
    
    // Extract only the fields that can be updated
    const { title, slug, description, meta_title, meta_description, meta_keywords, is_active } = body
    
    // Build update object with only provided fields
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (meta_title !== undefined) updateData.meta_title = meta_title
    if (meta_description !== undefined) updateData.meta_description = meta_description
    if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update page', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data, 
      success: true,
      message: 'Page updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/content/pages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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
    
    // Check if page exists
    const { data: existingPage, error: fetchError } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Delete the page (this will cascade delete related content sections)
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete page', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/content/pages/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}