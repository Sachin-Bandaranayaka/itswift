import { supabase, supabaseAdmin } from '../supabase'

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
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
  const tables = [
    'social_posts',
    'newsletter_subscribers', 
    'newsletter_campaigns',
    'content_analytics',
    'ai_content_log',
    'automation_rules'
  ]

  const tableStatus: Record<string, boolean> = {}

  try {
    for (const table of tables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('count')
          .limit(1)

        tableStatus[table] = !error
      } catch {
        tableStatus[table] = false
      }
    }

    const allTablesHealthy = Object.values(tableStatus).every(status => status)

    return {
      success: allTablesHealthy,
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
      supabaseAdmin.from('social_posts').select('count', { count: 'exact' }),
      supabaseAdmin.from('newsletter_subscribers').select('count', { count: 'exact' }),
      supabaseAdmin.from('newsletter_campaigns').select('count', { count: 'exact' }),
      supabaseAdmin.from('content_analytics').select('count', { count: 'exact' }),
      supabaseAdmin.from('ai_content_log').select('count', { count: 'exact' })
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