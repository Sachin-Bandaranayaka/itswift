// API route for individual content template operations

import { NextRequest, NextResponse } from 'next/server'
import { ContentTemplatesService } from '@/lib/database/services/content-templates'
import { ContentTemplateUpdate } from '@/lib/database/automation-types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await ContentTemplatesService.getById(params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch content template', details: error },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/templates/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updates: ContentTemplateUpdate = {}
    
    // Only include fields that are provided
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.template_type !== undefined) updates.template_type = body.template_type
    if (body.platform !== undefined) updates.platform = body.platform
    if (body.content_template !== undefined) {
      updates.content_template = body.content_template
      // Auto-extract variables if content template is updated
      updates.variables = ContentTemplatesService.extractVariablesFromTemplate(body.content_template)
    }
    if (body.variables !== undefined) updates.variables = body.variables
    if (body.metadata !== undefined) updates.metadata = body.metadata
    if (body.is_active !== undefined) updates.is_active = body.is_active

    const { data, error } = await ContentTemplatesService.update(params.id, updates)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update content template', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.error('Error in PUT /api/admin/automation/templates/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { success, error } = await ContentTemplatesService.delete(params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete content template', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/automation/templates/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}