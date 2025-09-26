import { getSupabaseAdmin, type Database } from '@/lib/supabase'
import {
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_HEADER_CONFIG,
  FOOTER_SECTION_KEY,
  HEADER_SECTION_KEY,
  LAYOUT_PAGE_SLUG,
  LAYOUT_PAGE_TITLE,
  LAYOUT_PAGE_DESCRIPTION,
} from '@/lib/config/site-layout'
import type {
  FooterConfig,
  HeaderConfig,
} from '@/types/site-layout'

type LayoutKind = 'header' | 'footer'

type LayoutRecord = {
  id: string
  content: string
}

async function getLayoutPageId(createIfMissing: boolean) {
  const supabase = getSupabaseAdmin()
  
  try {
    // First, try to get the existing page
    const { data: existingPage, error: selectError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', LAYOUT_PAGE_SLUG)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      throw new Error(`Failed to query layout page: ${selectError.message}`)
    }

    if (existingPage) {
      return existingPage.id
    }

    if (!createIfMissing) {
      throw new Error('Layout page not found and creation not requested')
    }

    // Try to create the page
    try {
      const pageData: Database['public']['Tables']['pages']['Insert'] = {
        slug: LAYOUT_PAGE_SLUG,
        title: LAYOUT_PAGE_TITLE,
        description: LAYOUT_PAGE_DESCRIPTION,
        is_active: true
      }

      const { data: newPage, error: insertError } = await supabase
        .from('pages')
        .insert(pageData)
        .select('id')
        .single()

      if (insertError) {
        throw insertError
      }

      return newPage.id
    } catch (insertError: any) {
      // Handle unique constraint violation (23505)
      if (insertError.code === '23505') {
        // The record was created by another process, fetch it
        const { data: existingPage, error: retryError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', LAYOUT_PAGE_SLUG)
          .single()

        if (retryError || !existingPage) {
          throw new Error(`Failed to retrieve layout page after constraint violation: ${retryError?.message}`)
        }

        return existingPage.id
      }
      
      throw insertError
    }
  } catch (error: any) {
    console.error('Error in getLayoutPageId:', error)
    throw new Error(`Unable to create site layout page: ${error.message}`)
  }
}

function parseConfig<T>(raw: string | null | undefined, fallback: T) {
  if (!raw) {
    return { config: fallback, isDefault: true }
  }

  try {
    const parsed = JSON.parse(raw) as T
    return { config: parsed, isDefault: false }
  } catch (error) {
    console.warn('Failed to parse layout config, returning fallback. Error:', error)
    return { config: fallback, isDefault: true }
  }
}

function getDefaults(kind: LayoutKind) {
  if (kind === 'header') {
    return {
      defaultConfig: DEFAULT_HEADER_CONFIG,
      sectionKey: HEADER_SECTION_KEY,
    }
  }

  return {
    defaultConfig: DEFAULT_FOOTER_CONFIG,
    sectionKey: FOOTER_SECTION_KEY,
  }
}

export async function fetchHeaderConfig() {
  return fetchLayoutConfig<HeaderConfig>('header')
}

export async function fetchFooterConfig() {
  return fetchLayoutConfig<FooterConfig>('footer')
}

async function fetchLayoutConfig<T extends HeaderConfig | FooterConfig>(kind: LayoutKind) {
  const { sectionKey, defaultConfig } = getDefaults(kind)
  const supabase = getSupabaseAdmin()
  
  let layoutPageId: string | null = null
  try {
    layoutPageId = await getLayoutPageId(false)
  } catch (error) {
    return {
      config: defaultConfig as T,
      isDefault: true,
      recordId: null,
    }
  }

  if (!layoutPageId) {
    return {
      config: defaultConfig as T,
      isDefault: true,
      recordId: null,
    }
  }

  console.log('DEBUG: layoutPageId:', layoutPageId)
   console.log('DEBUG: sectionKey:', sectionKey)
   console.log('DEBUG: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log('DEBUG: About to execute query...')
   
   const { data, error } = await supabase
     .from('page_content_sections')
     .select('id, content, updated_at')
     .eq('page_id', layoutPageId)
     .eq('section_key', sectionKey)
     .maybeSingle<LayoutRecord>()
   
   console.log('DEBUG: Query result:', { data, error })
   
   if (data) {
     console.log('DEBUG: Raw content from DB:', data.content)
     console.log('DEBUG: Content length:', data.content?.length)
     console.log('DEBUG: Updated at:', data.updated_at)
   }

  if (error && error.code !== 'PGRST116') {
    console.error(`Failed to fetch ${kind} layout config:`, error)
    return {
      config: defaultConfig as T,
      isDefault: true,
      recordId: null,
    }
  }

  const { config, isDefault } = parseConfig<T>(data?.content, defaultConfig as T)

  return {
    config,
    isDefault,
    recordId: data?.id ?? null,
  }
}

export async function saveHeaderConfig(config: HeaderConfig) {
  return saveLayoutConfig('header', config)
}

export async function saveFooterConfig(config: FooterConfig) {
  return saveLayoutConfig('footer', config)
}

async function saveLayoutConfig(kind: LayoutKind, config: HeaderConfig | FooterConfig) {
  const { sectionKey } = getDefaults(kind)
  const supabase = getSupabaseAdmin()
  const layoutPageId = await getLayoutPageId(true)

  if (!layoutPageId) {
    throw new Error('Unable to determine site layout page')
  }

  const contentString = JSON.stringify(config)

  // Check if record exists already
  const { data: existing, error: fetchError } = await supabase
    .from('page_content_sections')
    .select('id')
    .eq('section_key', sectionKey)
    .eq('page_id', layoutPageId)
    .maybeSingle<{ id: string }>()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error(`Failed to lookup existing ${kind} layout config:`, fetchError)
    throw new Error(`Unable to load existing ${kind} configuration`)
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('page_content_sections')
      .update({
        content: contentString,
        section_type: 'json',
        is_active: true,
        page_id: layoutPageId,
      })
      .eq('id', existing.id)

    if (updateError) {
      console.error(`Failed to update ${kind} layout config:`, updateError)
      throw new Error(`Unable to update ${kind} configuration`)
    }

    return { updated: true }
  }

  // Try to create the record
  try {
    const sectionData: Database['public']['Tables']['page_content_sections']['Insert'] = {
      page_id: layoutPageId,
      section_key: sectionKey,
      content: contentString,
      section_type: 'json',
      is_active: true,
    }

    const { error: insertError } = await supabase
      .from('page_content_sections')
      .insert(sectionData)

    if (insertError) {
      // If it's a unique constraint violation, try to update the existing record
      if (insertError.code === '23505') {
        const { data: existingRecord, error: retryError } = await supabase
          .from('page_content_sections')
          .select('id')
          .eq('section_key', sectionKey)
          .eq('page_id', layoutPageId)
          .single()

        if (retryError) {
          throw new Error(`Failed to fetch existing ${kind} configuration after constraint violation: ${retryError.message}`)
        }

        // Update the existing record
        const { error: updateError } = await supabase
          .from('page_content_sections')
          .update({
            content: contentString,
            section_type: 'json',
            is_active: true,
          })
          .eq('id', existingRecord.id)

        if (updateError) {
          console.error(`Failed to update ${kind} layout config after constraint violation:`, updateError)
          throw new Error(`Unable to update ${kind} configuration`)
        }

        return { updated: true }
      }
      
      throw insertError
    }

    return { created: true }
  } catch (error) {
    console.error(`Failed to save ${kind} layout config:`, error)
    throw new Error(`Unable to save ${kind} configuration`)
  }
}
