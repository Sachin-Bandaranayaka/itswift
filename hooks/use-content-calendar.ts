import { useState, useEffect, useCallback } from 'react'
import { SocialPost, NewsletterCampaign } from '@/lib/database/types'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  _updatedAt: string
  status?: 'draft' | 'published'
}

interface CalendarFilters {
  contentType?: string
  platform?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

interface UseContentCalendarReturn {
  socialPosts: SocialPost[]
  newsletters: NewsletterCampaign[]
  blogPosts: BlogPost[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  rescheduleContent: (contentId: string, contentType: 'social' | 'newsletter' | 'blog', newDate: Date) => Promise<boolean>
}

export function useContentCalendar(filters: CalendarFilters = {}): UseContentCalendarReturn {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [newsletters, setNewsletters] = useState<NewsletterCampaign[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCalendarData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (filters.contentType) searchParams.set('contentType', filters.contentType)
      if (filters.platform) searchParams.set('platform', filters.platform)
      if (filters.status) searchParams.set('status', filters.status)
      if (filters.dateFrom) searchParams.set('dateFrom', filters.dateFrom)
      if (filters.dateTo) searchParams.set('dateTo', filters.dateTo)

      const response = await fetch(`/api/admin/calendar?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setSocialPosts(data.socialPosts || [])
      setNewsletters(data.newsletters || [])
      setBlogPosts(data.blogPosts || [])
    } catch (err) {
      console.error('Error fetching calendar data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const rescheduleContent = useCallback(async (
    contentId: string, 
    contentType: 'social' | 'newsletter' | 'blog', 
    newDate: Date
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/calendar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          contentType,
          scheduledAt: newDate.toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reschedule content')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Update local state based on content type
      if (contentType === 'social') {
        setSocialPosts(prev => 
          prev.map(post => 
            post.id === contentId 
              ? { ...post, scheduled_at: newDate.toISOString() }
              : post
          )
        )
      } else if (contentType === 'newsletter') {
        setNewsletters(prev => 
          prev.map(newsletter => 
            newsletter.id === contentId 
              ? { ...newsletter, scheduled_at: newDate.toISOString() }
              : newsletter
          )
        )
      }

      return true
    } catch (err) {
      console.error('Error rescheduling content:', err)
      setError(err instanceof Error ? err.message : 'Failed to reschedule content')
      return false
    }
  }, [])

  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

  return {
    socialPosts,
    newsletters,
    blogPosts,
    isLoading,
    error,
    refetch: fetchCalendarData,
    rescheduleContent
  }
}