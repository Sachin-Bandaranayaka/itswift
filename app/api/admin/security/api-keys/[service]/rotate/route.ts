import { NextRequest, NextResponse } from 'next/server'
import { rotateApiKey, SecureEnvManager } from '@/lib/security/api-key-manager'
import { requirePermission } from '@/lib/auth/admin-auth'
import { logAuditEvent } from '@/lib/security/audit-logger'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'

async function handleRotateApiKey(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    // Check permissions
    await requirePermission('canManageSettings')(request)

    const { service } = params

    if (!service) {
      return NextResponse.json(
        { error: 'Service parameter is required' },
        { status: 400 }
      )
    }

    // Get current API key
    const envManager = SecureEnvManager.getInstance()
    const envVarName = `${service.toUpperCase()}_API_KEY`
    const currentKey = envManager.getSecureVar(envVarName)

    if (!currentKey) {
      return NextResponse.json(
        { error: 'No API key found for this service' },
        { status: 404 }
      )
    }

    // Rotate the key
    const rotation = rotateApiKey(currentKey)

    // Store the new key
    envManager.setSecureVar(envVarName, rotation.newKey)

    await logAuditEvent('api_key_rotated', 'api_keys', {
      service,
      rotationId: rotation.rotationId,
    }, { request })

    return NextResponse.json({
      message: 'API key rotated successfully',
      service,
      rotationId: rotation.rotationId,
      timestamp: rotation.timestamp,
    })
  } catch (error) {
    console.error('Error rotating API key:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(handleRotateApiKey, rateLimitConfigs.api)