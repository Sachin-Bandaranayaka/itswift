import { NextRequest, NextResponse } from 'next/server'
import { fetchHeaderConfig, saveHeaderConfig } from '@/lib/services/site-layout'
import type { HeaderConfig, HeaderMenuItemConfig } from '@/types/site-layout'

export const dynamic = 'force-dynamic'

function isHeaderMenuItem(value: unknown): value is HeaderMenuItemConfig {
  if (!value || typeof value !== 'object') return false
  const item = value as HeaderMenuItemConfig
  if (typeof item.title !== 'string' || typeof item.href !== 'string') return false

  if (item.submenu) {
    if (!Array.isArray(item.submenu)) return false
    return item.submenu.every(isHeaderMenuItem)
  }

  return true
}

function isHeaderConfig(value: unknown): value is HeaderConfig {
  if (!value || typeof value !== 'object') return false
  const config = value as HeaderConfig

  if (!config.logo || typeof config.logo !== 'object') return false
  if (typeof config.logo.src !== 'string' || typeof config.logo.alt !== 'string') return false

  if (!Array.isArray(config.menuItems) || !config.menuItems.every(isHeaderMenuItem)) {
    return false
  }

  if (config.cta) {
    if (typeof config.cta !== 'object' || typeof config.cta.label !== 'string') {
      return false
    }
    if (config.cta.href && typeof config.cta.href !== 'string') return false
    if (config.cta.scrollTarget && typeof config.cta.scrollTarget !== 'string') return false
  }

  if (config.showThemeToggle !== undefined && typeof config.showThemeToggle !== 'boolean') {
    return false
  }

  return true
}

export async function GET() {
  try {
    const { config, isDefault } = await fetchHeaderConfig()

    return NextResponse.json({
      success: true,
      data: config,
      isDefault,
    })
  } catch (error) {
    console.error('Failed to fetch admin header configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch header configuration',
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()

    if (!isHeaderConfig(payload)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid header configuration payload',
        },
        { status: 400 },
      )
    }

    await saveHeaderConfig(payload)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Failed to update header configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update header configuration',
      },
      { status: 500 },
    )
  }
}
