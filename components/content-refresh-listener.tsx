'use client'

import { useEffect } from 'react'

interface ContentRefreshListenerProps {
  pageSlug: string
  onContentUpdate?: () => void
}

/**
 * Component that listens for content updates and triggers page refresh
 * Add this to any page that displays dynamic content
 */
export function ContentRefreshListener({ 
  pageSlug, 
  onContentUpdate 
}: ContentRefreshListenerProps) {
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { pageSlug: updatedPageSlug } = event.detail
      
      if (updatedPageSlug === pageSlug) {
        if (onContentUpdate) {
          onContentUpdate()
        } else {
          // Default behavior: reload the page to show fresh content
          window.location.reload()
        }
      }
    }

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener)
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener)
    }
  }, [pageSlug, onContentUpdate])

  // This component doesn't render anything
  return null
}

export default ContentRefreshListener