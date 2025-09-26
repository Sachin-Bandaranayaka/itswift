import { useCallback, useEffect, useState } from 'react'

type ContentMap = Record<string, string>

type UsePageContentResult = {
  getContent: (key: string, fallback: string) => string
  isLoading: boolean
}

export function usePageContent(pageSlug: string): UsePageContentResult {
  const [content, setContent] = useState<ContentMap>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPageContent() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/content?page=${pageSlug}`, {
          cache: 'no-store',
          signal: controller.signal,
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
    }

    void fetchPageContent()

    return () => controller.abort()
  }, [pageSlug])

  const getContent = useCallback(
    (key: string, fallback: string) => content[key] ?? fallback,
    [content],
  )

  return { getContent, isLoading }
}
