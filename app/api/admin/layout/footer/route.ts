import { NextRequest, NextResponse } from 'next/server'
import { fetchFooterConfig, saveFooterConfig } from '@/lib/services/site-layout'
import type {
  FooterColumnConfig,
  FooterConfig,
  FooterLinkConfig,
  FooterSocialLinkConfig,
} from '@/types/site-layout'

export const dynamic = 'force-dynamic'

function isFooterLink(value: unknown): value is FooterLinkConfig {
  if (!value || typeof value !== 'object') return false
  const link = value as FooterLinkConfig
  if (typeof link.label !== 'string') return false

  if (link.href && typeof link.href !== 'string') return false
  if (link.type && link.type !== 'link' && link.type !== 'button' && link.type !== 'scroll' && link.type !== 'mailto') {
    return false
  }
  if (link.scrollTarget && typeof link.scrollTarget !== 'string') return false
  if (link.target && typeof link.target !== 'string') return false

  return true
}

function isFooterColumn(value: unknown): value is FooterColumnConfig {
  if (!value || typeof value !== 'object') return false
  const column = value as FooterColumnConfig
  if (typeof column.title !== 'string') return false
  if (!Array.isArray(column.links) || !column.links.every(isFooterLink)) return false
  return true
}

function isFooterSocialLink(value: unknown): value is FooterSocialLinkConfig {
  if (!value || typeof value !== 'object') return false
  const social = value as FooterSocialLinkConfig
  if (typeof social.platform !== 'string' || typeof social.href !== 'string') return false
  if (social.label && typeof social.label !== 'string') return false
  return true
}

function isFooterConfig(value: unknown): value is FooterConfig {
  if (!value || typeof value !== 'object') return false
  const config = value as FooterConfig

  if (!config.brand || typeof config.brand !== 'object') return false
  if (!config.brand.logo || typeof config.brand.logo !== 'object') return false
  if (typeof config.brand.logo.src !== 'string' || typeof config.brand.logo.alt !== 'string') return false
  if (config.brand.tagline && typeof config.brand.tagline !== 'string') return false

  if (!Array.isArray(config.socialLinks) || !config.socialLinks.every(isFooterSocialLink)) {
    return false
  }

  if (!config.contact || typeof config.contact !== 'object') return false
  if (config.contact.phone && typeof config.contact.phone !== 'string') return false
  if (config.contact.email && typeof config.contact.email !== 'string') return false

  if (!Array.isArray(config.columns) || !config.columns.every(isFooterColumn)) {
    return false
  }

  if (!config.address || typeof config.address !== 'object') return false
  if (typeof config.address.text !== 'string') return false

  if (!config.legal || typeof config.legal !== 'object') return false
  if (typeof config.legal.copyrightText !== 'string') return false
  if (config.legal.autoYear !== undefined && typeof config.legal.autoYear !== 'boolean') return false

  if (config.backgroundClass && typeof config.backgroundClass !== 'string') return false

  return true
}

export async function GET() {
  try {
    const { config, isDefault } = await fetchFooterConfig()

    return NextResponse.json({
      success: true,
      data: config,
      isDefault,
    })
  } catch (error) {
    console.error('Failed to fetch admin footer configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch footer configuration',
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()

    if (!isFooterConfig(payload)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid footer configuration payload',
        },
        { status: 400 },
      )
    }

    await saveFooterConfig(payload)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Failed to update footer configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update footer configuration',
      },
      { status: 500 },
    )
  }
}
