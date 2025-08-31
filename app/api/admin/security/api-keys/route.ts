import { NextRequest, NextResponse } from 'next/server'
import { 
  validateApiKeyFormat, 
  maskApiKey, 
  checkApiKeyCompromise,
  rotateApiKey,
  getApiKeyUsage,
  SecureEnvManager 
} from '@/lib/security/api-key-manager'
import { requirePermission } from '@/lib/auth/admin-auth'
import { logAuditEvent } from '@/lib/security/audit-logger'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiting'

async function handleGetApiKeys(request: NextRequest) {
  try {
    // Check permissions
    await requirePermission('canManageSettings')(request)

    const envManager = SecureEnvManager.getInstance()
    const apiKeys = envManager.listSecureVars()

    // Add usage statistics for each key
    const keysWithUsage = apiKeys.map(key => ({
      ...key,
      usage: getApiKeyUsage(key.key),
    }))

    await logAuditEvent('api_key_viewed', 'api_keys', {}, { request })

    return NextResponse.json({ apiKeys: keysWithUsage })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    
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

async function handleUpdateApiKey(request: NextRequest) {
  try {
    // Check permissions
    await requirePermission('canManageSettings')(request)

    const { service, apiKey } = await request.json()

    if (!service || !apiKey) {
      return NextResponse.json(
        { error: 'Service and API key are required' },
        { status: 400 }
      )
    }

    // Validate API key format
    const validation = validateApiKeyFormat(apiKey, service)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid API key format', details: validation.errors },
        { status: 400 }
      )
    }

    // Check for compromise
    const compromiseCheck = checkApiKeyCompromise(apiKey)
    if (compromiseCheck.compromised) {
      return NextResponse.json(
        { error: 'API key appears to be compromised', details: compromiseCheck.reasons },
        { status: 400 }
      )
    }

    // Store the API key securely
    const envManager = SecureEnvManager.getInstance()
    const envVarName = `${service.toUpperCase()}_API_KEY`
    envManager.setSecureVar(envVarName, apiKey)

    await logAuditEvent('api_key_updated', 'api_keys', {
      service,
      keyMask: maskApiKey(apiKey),
    }, { request })

    return NextResponse.json({
      message: 'API key updated successfully',
      service,
      masked: maskApiKey(apiKey),
    })
  } catch (error) {
    console.error('Error updating API key:', error)
    
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

export const GET = withRateLimit(handleGetApiKeys, rateLimitConfigs.api)
export const POST = withRateLimit(handleUpdateApiKey, rateLimitConfigs.api)