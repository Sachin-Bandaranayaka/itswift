// API route for managing content templates

import { NextRequest, NextResponse } from 'next/server'
import { ContentTemplatesService } from '@/lib/database/services/content-templates'
import { ContentTemplateInput } from '@/lib/database/automation-types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    const orderBy = searchParams.get('orderBy') || undefined
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || undefined
    
    const templateType = searchParams.get('template_type') || undefined
    const platform = searchParams.get('platform') || undefined
    const isActive = searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined

    const options = { limit, offset, orderBy, orderDirection }
    const filters = { template_type: templateType, platform, is_active: isActive }

    const { data, error } = await ContentTemplatesService.getAll(options, filters)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch content templates', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/templates:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.template_type || !body.content_template) {
      return NextResponse.json(
        { error: 'Missing required fields: name, template_type, content_template' },
        { status: 400 }
      )
    }

    // Extract variables from template content if not provided
    let variables = body.variables
    if (!variables) {
      variables = ContentTemplatesService.extractVariablesFromTemplate(body.content_template)
    }

    const templateInput: ContentTemplateInput = {
      name: body.name,
      description: body.description,
      template_type: body.template_type,
      platform: body.platform,
      content_template: body.content_template,
      variables,
      metadata: body.metadata || {},
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    const { data, error } = await ContentTemplatesService.create(templateInput)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create content template', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/automation/templates:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}