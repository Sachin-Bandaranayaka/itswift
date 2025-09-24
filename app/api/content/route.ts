import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, type Database } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type PageRow = Database['public']['Tables']['pages']['Row']
type PageContentSectionRow = Database['public']['Tables']['page_content_sections']['Row']

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get('page')
    const sectionKey = searchParams.get('section')
    
    // Use admin client for server-side API routes to bypass RLS
    const supabase = getSupabaseAdmin()

    if (!pageSlug) {
      return NextResponse.json(
        { error: 'Page slug is required' },
        { status: 400 }
      )
    }

    // First get the page ID
    console.log('Looking for page with slug:', pageSlug)
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pageSlug)
      .eq('is_active', true)
      .single()

    console.log('Page query result:', { pageData, pageError })

    if (pageError || !pageData) {
      console.log('Page not found error:', pageError)
      return NextResponse.json(
        { error: 'Page not found', details: pageError?.message },
        { status: 404 }
      )
    }

    // Query content sections with proper typing
    let sectionsQuery = supabase
      .from('page_content_sections')
      .select('section_key, content, section_type')
      .eq('page_id', pageData.id)
      .eq('is_active', true)
      .order('display_order')

    // Add section filter if specified
    if (sectionKey) {
      sectionsQuery = sectionsQuery.eq('section_key', sectionKey)
    }

    const { data: sectionsData, error: sectionsError } = await sectionsQuery

    if (sectionsError) {
      console.error('Error fetching content sections:', sectionsError)
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      )
    }

    // Transform data into a more convenient format
    const content: Record<string, string> = {}
    sectionsData?.forEach((section: any) => {
      if (section.section_key && section.content) {
        content[section.section_key] = section.content
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        page: pageSlug,
        content
      }
    })

  } catch (error) {
    console.error('Error in content API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
