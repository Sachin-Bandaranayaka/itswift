import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface PageWithContentCount {
  id: string
  slug: string
  title: string
  description: string | null
  is_active: boolean | null
  content_count: number
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Get all pages with their content section counts
    const { data: pages, error } = await supabase
      .from('pages')
      .select(`
        id,
        slug,
        title,
        description,
        is_active,
        page_content_sections(count)
      `)
      .eq('is_active', true)
      .order('title')
    
    if (error) {
      console.error('Error fetching pages:', error)
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }
    
    // Transform the data to include content count
    const pagesWithContentCount: PageWithContentCount[] = (pages || []).map((page: any) => {
      const { page_content_sections, ...rest } = page
      return {
        ...rest,
        content_count: page_content_sections?.[0]?.count || 0
      }
    })
    
    return NextResponse.json({ pages: pagesWithContentCount })
  } catch (error) {
    console.error('Error in pages API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
