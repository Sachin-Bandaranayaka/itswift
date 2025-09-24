'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import DOMPurify from 'isomorphic-dompurify'

interface DynamicContentProps {
  sectionKey: string
  pageSlug: string
  fallback?: string | ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

function sanitizeContent(value: string) {
  if (!value) return ''

  const hasHtmlTags = /<[^>]*>/g.test(value)
  const normalized = hasHtmlTags ? value : value.replace(/\n/g, '<br />')

  return DOMPurify.sanitize(normalized)
}

function renderFallback(
  Component: keyof JSX.IntrinsicElements,
  className: string | undefined,
  fallback: string | ReactNode
) {
  if (typeof fallback === 'string') {
    return (
      <Component className={className}>
        {fallback}
      </Component>
    )
  }

  return (
    <Component className={className}>
      {fallback}
    </Component>
  )
}

function DynamicContent({
  sectionKey,
  pageSlug,
  fallback = '',
  as: Component = 'div',
  className
}: DynamicContentProps) {
  const [rawContent, setRawContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchContent() {
      setIsLoading(true)
      setRawContent('')

      try {
        const params = new URLSearchParams({ page: pageSlug, section: sectionKey })
        const response = await fetch(`/api/content?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal
        })

        if (!response.ok) {
          console.error(`Failed to fetch content for ${pageSlug}:${sectionKey}`)
          return
        }

        const payload = await response.json()
        const contentMap = payload?.data?.content || {}
        const nextContent = typeof contentMap[sectionKey] === 'string' ? contentMap[sectionKey] : ''
        setRawContent(nextContent)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching content:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchContent()

    return () => controller.abort()
  }, [pageSlug, sectionKey])

  const sanitizedContent = useMemo(() => sanitizeContent(rawContent), [rawContent])

  if (!isLoading && sanitizedContent) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  return renderFallback(Component, className, fallback)
}

interface DynamicContentGroupProps {
  pageSlug: string
  fallback?: ReactNode
  className?: string
}

function DynamicContentGroup({
  pageSlug,
  fallback = null,
  className
}: DynamicContentGroupProps) {
  const [sections, setSections] = useState<Array<{ sectionKey: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAllSections() {
      setIsLoading(true)
      setSections([])

      try {
        const params = new URLSearchParams({ page: pageSlug })
        const response = await fetch(`/api/content?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal
        })

        if (!response.ok) {
          console.error(`Failed to fetch content sections for ${pageSlug}`)
          return
        }

        const payload = await response.json()
        const contentMap = payload?.data?.content || {}
        const normalizedSections = Object.entries(contentMap)
          .filter(([sectionKey, value]) => typeof value === 'string' && sectionKey)
          .map(([sectionKey, value]) => ({
            sectionKey,
            content: sanitizeContent(value as string)
          }))
        setSections(normalizedSections)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching content sections:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAllSections()

    return () => controller.abort()
  }, [pageSlug])

  if (isLoading) {
    return (
      <div className={className}>
        {fallback}
      </div>
    )
  }

  if (sections.length === 0) {
    return <div className={className}>No content sections found for this page.</div>
  }

  return (
    <div className={className}>
      {sections.map((section) => (
        <div key={section.sectionKey} className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            {section.sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  )
}

export default DynamicContent
export { DynamicContentGroup }
