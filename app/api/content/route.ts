import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, type Database } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'

type PageRow = Database['public']['Tables']['pages']['Row']
type PageContentSectionRow = Database['public']['Tables']['page_content_sections']['Row']

// Create a cached function for fetching page content
const getCachedPageContent = (pageSlug: string, sectionKey?: string) => 
  unstable_cache(
    async () => {
      const supabase = getSupabaseAdmin()

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
        throw new Error(`Page not found: ${pageError?.message}`)
      }

      // Safely read page ID for subsequent queries
      const pageId: string = (pageData as any).id

      // Query content sections with proper typing
      let sectionsQuery = supabase
        .from('page_content_sections')
        .select('section_key, content, section_type')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .order('display_order', { ascending: true })

      // Add section filter if specified
      if (sectionKey) {
        sectionsQuery = sectionsQuery.eq('section_key', sectionKey)
      }

      const { data: sectionsData, error: sectionsError } = await sectionsQuery

      if (sectionsError) {
        console.error('Error fetching content sections:', sectionsError)
        throw new Error('Failed to fetch content')
      }

      // Transform data into a more convenient format
      const content: Record<string, string> = {}
      sectionsData?.forEach((section: any) => {
        if (section.section_key && section.content && content[section.section_key] === undefined) {
          content[section.section_key] = section.content
        }
      })

      return { pageSlug, content }
    },
    [`page-content-${pageSlug}${sectionKey ? `-${sectionKey}` : ''}`],
    {
      tags: [`content-${pageSlug}`, 'page-content'],
      revalidate: false, // Only revalidate when explicitly called
    }
  )()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get('page')
    const sectionKey = searchParams.get('section')

    if (!pageSlug) {
      return NextResponse.json(
        { error: 'Page slug is required' },
        { status: 400 }
      )
    }

    // Use the cached function
    const result = await getCachedPageContent(pageSlug, sectionKey || undefined)
    const { content } = result

    const response = NextResponse.json({
      success: true,
      data: {
        page: pageSlug,
        content
      }
    })
    
    // Add cache headers to ensure fresh content after updates
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Content-Timestamp', new Date().toISOString())
    
    return response

  } catch (error) {
    console.error('Error in content API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
