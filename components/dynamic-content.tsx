'use client'

import { useState, useEffect, ReactNode } from 'react'

interface DynamicContentProps {
  sectionKey: string
  pageSlug: string
  fallback?: string | ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

function DynamicContent({ 
  sectionKey, 
  pageSlug, 
  fallback = '', 
  as: Component = 'div',
  className 
}: DynamicContentProps) {
  const [content, setContent] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/admin/content/sections?pageSlug=${pageSlug}&sectionKey=${sectionKey}`)
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setContent(data.content)
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchContent()
  }, [sectionKey, pageSlug])

  // If content is loaded and available, use it
  if (isLoaded && content) {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // If fallback is a string, render it with dangerouslySetInnerHTML
  if (typeof fallback === 'string') {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: fallback }}
      />
    )
  }

  // If fallback is a ReactNode, render it directly
  return (
    <Component className={className}>
      {fallback}
    </Component>
  )
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
  const [sections, setSections] = useState<Array<{sectionKey: string, content: string}>>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const response = await fetch(`/api/admin/content/sections?pageSlug=${pageSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.sections) {
            setSections(data.sections)
          }
        }
      } catch (error) {
        console.error('Error fetching content sections:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchAllSections()
  }, [pageSlug])

  if (!isLoaded) {
    return <div className={className}>{fallback}</div>
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