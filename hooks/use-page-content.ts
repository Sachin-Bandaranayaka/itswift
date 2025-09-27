import { useCallback, useEffect, useState } from 'react'

type ContentMap = Record<string, string>

type UsePageContentResult = {
  getContent: (key: string, fallback: string) => string
  isLoading: boolean
}

export function usePageContent(pageSlug: string): UsePageContentResult {
  const [content, setContent] = useState<ContentMap>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchPageContent = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      // Add timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/api/content?page=${pageSlug}&_t=${timestamp}`, {
        cache: 'no-store',
        signal,
      })

      if (!response.ok) {
        console.error(`Failed to fetch content for ${pageSlug}:`, response.statusText)
        return
      }

      const data = await response.json()
      setContent(data?.data?.content ?? {})
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error(`Error fetching page content for ${pageSlug}:`, error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [pageSlug])

  useEffect(() => {
    const controller = new AbortController()
    void fetchPageContent(controller.signal)
    return () => controller.abort()
  }, [fetchPageContent])

  // Listen for content updates and refresh automatically
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { pageSlug: updatedPageSlug } = event.detail
      if (updatedPageSlug === pageSlug) {
        // Refresh content immediately when this page is updated
        void fetchPageContent()
      }
    }

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener)
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener)
    }
  }, [pageSlug, fetchPageContent])

  const getContent = useCallback(
    (key: string, fallback: string) => content[key] ?? fallback,
    [content],
  )

  return { getContent, isLoading }
}
