import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itswift.com'

type PageSeoRecord = {
  slug: string
  title: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  primary_keywords: string | null
  secondary_keywords: string | null
}

const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: 'Top eLearning Company in Bangalore | itswift',
  description:
    'itswift delivers AI-powered, custom eLearning programs for enterprises in Bangalore and worldwide. Boost corporate training with tailored digital learning experiences.',
  keywords: 'eLearning company Bangalore, AI-powered corporate training, custom eLearning solutions, corporate training Bangalore, eLearning development',
  authors: [{ name: 'itswift' }],
  creator: 'itswift',
  publisher: 'itswift',
  alternates: {
    canonical: DEFAULT_SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: DEFAULT_SITE_URL,
    siteName: 'itswift',
    title: 'Top eLearning Company in Bangalore | itswift',
    description:
      'itswift delivers AI-powered, custom eLearning programs for enterprises in Bangalore and worldwide. Boost corporate training with tailored digital learning experiences.',
    images: [
      {
        url: '/IMAGES/Swift_logo_new.png',
        width: 1200,
        height: 630,
        alt: 'itswift company logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top eLearning Company in Bangalore | itswift',
    description:
      'itswift delivers AI-powered, custom eLearning programs for enterprises in Bangalore and worldwide. Boost corporate training with tailored digital learning experiences.',
    images: ['/IMAGES/Swift_logo_new.png'],
    creator: '@ITSwift',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    apple: '/IMAGES/Swift_logo_new.png',
  },
}

const IGNORED_PATH_PREFIXES = ['/admin', '/api', '/_next', '/auth']

function cloneMetadata(base: Metadata, fallback?: Partial<Metadata>): Metadata {
  return {
    ...base,
    ...fallback,
    openGraph: {
      ...base.openGraph,
      ...fallback?.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...fallback?.twitter,
    },
    alternates: {
      ...base.alternates,
      ...fallback?.alternates,
    },
    robots: {
      ...base.robots,
      ...fallback?.robots,
    },
    icons: {
      ...base.icons,
      ...fallback?.icons,
    },
  }
}

function normalizePath(path: string | null | undefined): string {
  if (!path) return '/'

  let working = path

  try {
    const maybeUrl = new URL(path)
    working = maybeUrl.pathname + maybeUrl.search
  } catch (_error) {
    // ignore parse errors - path is probably already a pathname
  }

  const [pathname] = working.split('?')
  if (!pathname) return '/'

  let normalized = pathname.trim()

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  // Collapse multiple slashes and strip trailing slash (except root)
  normalized = normalized.replace(/\/+/g, '/').replace(/\/$/, '')

  return normalized === '' ? '/' : normalized
}

function getSlugCandidates(pathname: string): string[] {
  if (!pathname || pathname === '/') return ['home', '/']

  const segments = pathname
    .split('/')
    .filter(Boolean)

  if (segments.length === 0) {
    return ['home']
  }

  const candidates: string[] = []
  for (let i = segments.length; i > 0; i -= 1) {
    candidates.push(segments.slice(0, i).join('/'))
  }

  candidates.push('/')

  return candidates
}

async function fetchSeoRecord(slugCandidates: string[]): Promise<PageSeoRecord | null> {
  if (slugCandidates.length === 0) return null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords')
      .in('slug', slugCandidates)
      .eq('is_active', true)

    if (error) {
      console.error('Failed to fetch SEO metadata:', error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    for (const candidate of slugCandidates) {
      const match = data.find((record) => record.slug === candidate)
      if (match) {
        return match
      }
    }

    return data[0] ?? null
  } catch (error) {
    console.error('Error loading SEO metadata:', error)
    return null
  }
}

function applyCanonical(metadata: Metadata, pathname: string): Metadata {
  const canonicalPath = pathname === '/' ? '/' : pathname
  const canonicalUrl = `${DEFAULT_SITE_URL.replace(/\/$/, '')}${canonicalPath === '/' ? '' : canonicalPath}`

  metadata.alternates = {
    ...metadata.alternates,
    canonical: canonicalUrl,
  }

  metadata.openGraph = {
    ...metadata.openGraph,
    url: canonicalUrl,
  }

  return metadata
}

function applySeoRecord(metadata: Metadata, record: PageSeoRecord | null): Metadata {
  if (!record) {
    return metadata
  }

  const title = record.meta_title || record.title || (typeof metadata.title === 'string' ? metadata.title : undefined)
  const description = record.meta_description || record.description || (typeof metadata.description === 'string' ? metadata.description : undefined)
  
  // Combine primary and secondary keywords, with fallback to meta_keywords
  let keywords = record.meta_keywords
  if (record.primary_keywords || record.secondary_keywords) {
    const primaryKw = record.primary_keywords || ''
    const secondaryKw = record.secondary_keywords || ''
    keywords = [primaryKw, secondaryKw].filter(Boolean).join(', ')
  }
  keywords = keywords || (typeof metadata.keywords === 'string' ? metadata.keywords : null)

  if (title) {
    metadata.title = title
    metadata.openGraph = {
      ...metadata.openGraph,
      title,
    }
    metadata.twitter = {
      ...metadata.twitter,
      title,
    }
  }

  if (description) {
    metadata.description = description
    metadata.openGraph = {
      ...metadata.openGraph,
      description,
    }
    metadata.twitter = {
      ...metadata.twitter,
      description,
    }
  }

  if (keywords) {
    metadata.keywords = keywords
  }

  return metadata
}

export function getDefaultMetadata(overrides?: Partial<Metadata>): Metadata {
  return cloneMetadata(DEFAULT_METADATA, overrides)
}

export async function resolveSeoMetadata(path?: string, overrides?: Partial<Metadata>): Promise<Metadata> {
  noStore()

  const pathname = normalizePath(path)
  const baseMetadata = applyCanonical(cloneMetadata(DEFAULT_METADATA, overrides), pathname)

  const shouldSkip = IGNORED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

  if (shouldSkip) {
    return baseMetadata
  }

  const slugCandidates = getSlugCandidates(pathname)
  const record = await fetchSeoRecord(slugCandidates)

  return applySeoRecord(baseMetadata, record)
}

export async function resolveSeoMetadataFromHeaders(overrides?: Partial<Metadata>): Promise<Metadata> {
  const headerList = headers()
  const inferredPath =
    headerList.get('x-invoke-path') ||
    headerList.get('x-pathname') ||
    headerList.get('next-url') ||
    headerList.get('x-url') ||
    headerList.get('x-original-url') ||
    '/'

  return resolveSeoMetadata(inferredPath, overrides)
}
