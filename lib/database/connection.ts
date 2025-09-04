import { getSupabase, getSupabaseAdmin } from '../supabase'

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await getSupabase()
      .from('social_posts')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

/**
 * Initialize database tables (run this once to set up the database)
 */
export async function initializeDatabase(): Promise<{ success: boolean; error?: string }> {
  try {
    // This would typically be run via Supabase SQL editor or migration tool
    // For now, we'll just test the connection
    const isConnected = await testDatabaseConnection()
    
    if (!isConnected) {
      return { success: false, error: 'Failed to connect to database' }
    }

    return { success: true }
  } catch (error) {
    console.error('Database initialization failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Health check for all database tables
 */
export async function checkDatabaseHealth(): Promise<{
  success: boolean
  tables: Record<string, boolean>
  error?: string
}> {
  const requiredTables = [
    'social_posts',
    'newsletter_subscribers', 
    'newsletter_campaigns',
    'content_analytics',
    'ai_content_log'
  ]

  const optionalTables = [
    'automation_rules'
  ]

  const tableStatus: Record<string, boolean> = {}

  try {
    // Check required tables
    for (const table of requiredTables) {
      try {
        const { error } = await getSupabaseAdmin()
          .from(table)
          .select('count')
          .limit(1)

        tableStatus[table] = !error
      } catch {
        tableStatus[table] = false
      }
    }

    // Check optional tables (don't fail if they don't exist)
    for (const table of optionalTables) {
      try {
        const { error } = await getSupabaseAdmin()
          .from(table)
          .select('count')
          .limit(1)

        tableStatus[table] = !error
      } catch {
        tableStatus[table] = false
        // Don't log errors for optional tables during build
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Optional table '${table}' not found - this is expected if automation features are not yet set up`)
        }
      }
    }

    // Only required tables need to be healthy for success
    const requiredTablesHealthy = requiredTables.every(table => tableStatus[table])

    return {
      success: requiredTablesHealthy,
      tables: tableStatus
    }
  } catch (error) {
    return {
      success: false,
      tables: tableStatus,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  socialPosts: number
  subscribers: number
  campaigns: number
  analyticsRecords: number
  aiContentLogs: number
}> {
  try {
    const [socialPosts, subscribers, campaigns, analytics, aiLogs] = await Promise.all([
      getSupabaseAdmin().from('social_posts').select('count', { count: 'exact' }),
      getSupabaseAdmin().from('newsletter_subscribers').select('count', { count: 'exact' }),
      getSupabaseAdmin().from('newsletter_campaigns').select('count', { count: 'exact' }),
      getSupabaseAdmin().from('content_analytics').select('count', { count: 'exact' }),
      getSupabaseAdmin().from('ai_content_log').select('count', { count: 'exact' })
    ])

    return {
      socialPosts: socialPosts.count || 0,
      subscribers: subscribers.count || 0,
      campaigns: campaigns.count || 0,
      analyticsRecords: analytics.count || 0,
      aiContentLogs: aiLogs.count || 0
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return {
      socialPosts: 0,
      subscribers: 0,
      campaigns: 0,
      analyticsRecords: 0,
      aiContentLogs: 0
    }
  }
}