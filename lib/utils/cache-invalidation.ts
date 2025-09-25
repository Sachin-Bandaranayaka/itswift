// Simple cache invalidation utility for FAQs
let faqCacheTimestamp = Date.now()

export function invalidateFAQCache(): void {
  faqCacheTimestamp = Date.now()
}

export function getFAQCacheTimestamp(): number {
  return faqCacheTimestamp
}

// Reset cache timestamp on server restart
if (typeof window === 'undefined') {
  faqCacheTimestamp = Date.now()
}