import { getSupabaseAdmin } from '@/lib/supabase'
import type { ActivityItem } from '@/lib/types/dashboard'

const DEFAULT_LIMIT = 10

const toDate = (value?: string | null): Date | null => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const resolveTimestamp = (...values: Array<string | null | undefined>): Date => {
  for (const value of values) {
    const parsed = toDate(value)
    if (parsed) {
      return parsed
    }
  }
  return new Date()
}

export async function getContentManagementActivity(limit = DEFAULT_LIMIT): Promise<ActivityItem[]> {
  try {
    const supabase = getSupabaseAdmin()
    const halfLimit = Math.max(2, Math.ceil(limit / 2))

    const pageResponse = await supabase
      .from('pages')
      .select('id, title, slug, is_active, created_at, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(halfLimit)

    const sectionResponse = await supabase
      .from('page_content_sections')
      .select('id, section_key, section_type, page_id, is_active, created_at, updated_at, page:pages(id, title, slug)')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(halfLimit)

    const activities: ActivityItem[] = []

    if (!pageResponse.error && pageResponse.data) {
      for (const page of pageResponse.data) {
        const createdAt = toDate(page.created_at)
        const updatedAt = toDate(page.updated_at)
        const timestamp = resolveTimestamp(page.updated_at, page.created_at)
        const isNew = !updatedAt || (createdAt && updatedAt.getTime() === createdAt.getTime())

        activities.push({
          id: `content-page-${page.id}`,
          type: 'content',
          title: `Page ${isNew ? 'created' : 'updated'}`,
          description: `"${page.title}" ${isNew ? 'was created' : 'was updated'}${page.slug ? ` (${page.slug})` : ''}`,
          timestamp: timestamp.toISOString(),
          status: isNew ? 'published' : 'updated',
          platform: 'content',
          metadata: {
            slug: page.slug,
            isActive: page.is_active,
            pageId: page.id,
          }
        })
      }
    } else if (pageResponse.error) {
      console.error('Error fetching page activity:', pageResponse.error)
    }

    if (!sectionResponse.error && sectionResponse.data) {
      for (const section of sectionResponse.data) {
        const createdAt = toDate(section.created_at)
        const updatedAt = toDate(section.updated_at)
        const timestamp = resolveTimestamp(section.updated_at, section.created_at)
        const isNew = !updatedAt || (createdAt && updatedAt.getTime() === createdAt.getTime())
        const pageTitle = section.page?.title || 'Page'

        activities.push({
          id: `content-section-${section.id}`,
          type: 'content',
          title: `Section ${isNew ? 'added' : 'updated'}`,
          description: `${section.section_key}${section.section_type ? ` (${section.section_type})` : ''} on ${pageTitle}`,
          timestamp: timestamp.toISOString(),
          status: isNew ? 'published' : 'updated',
          platform: 'content',
          metadata: {
            sectionKey: section.section_key,
            sectionType: section.section_type,
            pageId: section.page_id,
            pageSlug: section.page?.slug,
            isActive: section.is_active,
          }
        })
      }
    } else if (sectionResponse.error) {
      console.error('Error fetching section activity:', sectionResponse.error)
    }

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  } catch (error) {
    console.error('Error gathering content management activity:', error)
    return []
  }
}

const formatContactName = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
  const name = `${firstName || ''} ${lastName || ''}`.trim()
  if (name) {
    return name
  }
  return email || 'Unknown contact'
}

export async function getContactActivity(limit = DEFAULT_LIMIT): Promise<ActivityItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    const response = await supabase
      .from('contact_submissions')
      .select('id, first_name, last_name, email, company, status, message, submitted_at, created_at, updated_at')
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .limit(limit)

    if (response.error || !response.data) {
      if (response.error) {
        console.error('Error fetching contact activity:', response.error)
      }
      return []
    }

    return response.data.map((submission) => {
      const timestamp = resolveTimestamp(submission.submitted_at, submission.created_at, submission.updated_at)
      const status = submission.status === 'new' ? 'received' : 'updated'
      const name = formatContactName(submission.first_name, submission.last_name, submission.email)
      const summary = submission.message ? submission.message.slice(0, 80) : undefined

      return {
        id: `contact-${submission.id}`,
        type: 'contact',
        title: status === 'received' ? 'New contact submission' : 'Contact submission updated',
        description: `${name}${submission.company ? ` • ${submission.company}` : ''}` + (summary ? ` • "${summary}${submission.message && submission.message.length > 80 ? '…' : ''}"` : ''),
        timestamp: timestamp.toISOString(),
        status,
        platform: 'contact',
        metadata: {
          email: submission.email,
          company: submission.company,
          contactStatus: submission.status,
        }
      }
    })
  } catch (error) {
    console.error('Error gathering contact activity:', error)
    return []
  }
}

export async function getFAQActivity(limit = DEFAULT_LIMIT): Promise<ActivityItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    const response = await supabase
      .from('faqs')
      .select('id, question, page_slug, category, is_active, created_at, updated_at')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .limit(limit)

    if (response.error || !response.data) {
      if (response.error) {
        console.error('Error fetching FAQ activity:', response.error)
      }
      return []
    }

    return response.data.map((faq) => {
      const createdAt = toDate(faq.created_at)
      const updatedAt = toDate(faq.updated_at)
      const timestamp = resolveTimestamp(faq.updated_at, faq.created_at)
      const isNew = !updatedAt || (createdAt && updatedAt.getTime() === createdAt.getTime())
      const status = isNew ? 'published' : 'updated'

      return {
        id: `faq-${faq.id}`,
        type: 'faq',
        title: `${isNew ? 'FAQ created' : 'FAQ updated'}`,
        description: `"${faq.question}"${faq.page_slug ? ` on ${faq.page_slug}` : ''}${faq.category ? ` • ${faq.category}` : ''}`,
        timestamp: timestamp.toISOString(),
        status,
        platform: 'content',
        metadata: {
          pageSlug: faq.page_slug,
          category: faq.category,
          isActive: faq.is_active,
        }
      }
    })
  } catch (error) {
    console.error('Error gathering FAQ activity:', error)
    return []
  }
}
