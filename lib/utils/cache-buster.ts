import { useEffect } from 'react'

/**
 * Cache busting utilities for immediate content updates
 */

export class CacheBuster {
  /**
   * Clear browser caches related to content
   */
  static async clearContentCaches(): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return
    }

    try {
      const cacheNames = await caches.keys()
      const contentCaches = cacheNames.filter(name => 
        name.includes('content') || 
        name.includes('api') ||
        name.includes('page')
      )
      
      await Promise.all(
        contentCaches.map(cacheName => caches.delete(cacheName))
      )
      
      console.log('Content caches cleared:', contentCaches)
    } catch (error) {
      console.warn('Failed to clear content caches:', error)
    }
  }

  /**
   * Force reload of specific page content
   */
  static forceReloadPage(): void {
    if (typeof window === 'undefined') return
    
    // Force a hard reload to bypass all caches
    window.location.reload()
  }

  /**
   * Generate cache-busting URL parameter
   */
  static getCacheBustParam(): string {
    return `_cb=${Date.now()}`
  }

  /**
   * Add cache-busting parameter to URL
   */
  static addCacheBustToUrl(url: string): string {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${this.getCacheBustParam()}`
  }

  /**
   * Dispatch content update event
   */
  static notifyContentUpdate(pageSlug: string, sectionKey?: string): void {
    if (typeof window === 'undefined') return
    
    window.dispatchEvent(new CustomEvent('contentUpdated', {
      detail: { 
        pageSlug, 
        sectionKey,
        timestamp: Date.now() 
      }
    }))
  }
}

/**
 * Hook to listen for content updates
 */
export function useContentUpdateListener(
  pageSlug: string, 
  onUpdate: () => void
): void {
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const { pageSlug: updatedPageSlug } = event.detail
      if (updatedPageSlug === pageSlug) {
        onUpdate()
      }
    }

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener)
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate as EventListener)
    }
  }, [pageSlug, onUpdate])
}