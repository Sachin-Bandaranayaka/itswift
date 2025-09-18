import { getSupabase, getSupabaseAdmin } from '@/lib/supabase'

export interface ContentSection {
  id: string
  section_key: string
  content: string
  section_type: string
  display_order: number
  is_active: boolean
  page_id: string
}

export async function getPageContent(pageSlug: string): Promise<Record<string, string>> {
  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('page_content_sections')
    .select(`
      section_key,
      content,
      pages!inner(slug)
    `)
    .eq('pages.slug', pageSlug)
    .eq('is_active', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching page content:', error)
    return {}
  }

  // Convert array to object with section_key as key
  const contentMap: Record<string, string> = {}
  data?.forEach((item: any) => {
    contentMap[item.section_key] = item.content
  })

  return contentMap
}

export async function updatePageContent(pageSlug: string, sectionKey: string, content: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  
  // First get the page ID
  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', pageSlug)
    .single()

  if (pageError || !pageData) {
    console.error('Error finding page:', pageError)
    return false
  }

  // Update the content section
  const updateData: any = { content }
  const { error } = await supabase
    .from('page_content_sections')
    .update(updateData)
    .eq('page_id', pageData.id)
    .eq('section_key', sectionKey)

  if (error) {
    console.error('Error updating content:', error)
    return false
  }

  return true
}