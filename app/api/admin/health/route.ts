import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth/middleware'
import { checkDatabaseHealth } from '@/lib/database/connection'
import { testOpenAIConnection } from '@/lib/integrations/openai'
import { validateEnvironment } from '@/lib/config/env'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check environment configuration
    const envValidation = validateEnvironment()

    // Check database health
    const dbHealth = await checkDatabaseHealth()

    // Check OpenAI connection
    const openaiHealthy = await testOpenAIConnection()

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        valid: envValidation.isValid,
        missing: envValidation.missing
      },
      database: {
        connected: dbHealth.success,
        tables: dbHealth.tables,
        error: dbHealth.error
      },
      integrations: {
        openai: openaiHealthy,
        // Add other integrations as they're implemented
      }
    }

    // Determine overall health
    const isHealthy = envValidation.isValid &&
      dbHealth.success &&
      openaiHealthy.connected

    return NextResponse.json(
      {
        ...healthStatus,
        status: isHealthy ? 'healthy' : 'unhealthy'
      },
      { status: isHealthy ? 200 : 503 }
    )
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}