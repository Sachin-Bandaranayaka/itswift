import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Migration to add performance indexes for newsletter system
 */
export async function addPerformanceIndexes(pool: Pool): Promise<void> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Read and execute the performance indexes SQL
    const sqlPath = join(process.cwd(), 'lib/database/performance-indexes.sql')
    const sql = readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    for (const statement of statements) {
      try {
        await client.query(statement)
        console.log(`✓ Executed: ${statement.substring(0, 50)}...`)
      } catch (error) {
        console.warn(`⚠ Warning executing statement: ${error}`)
        // Continue with other statements even if one fails
      }
    }
    
    await client.query('COMMIT')
    console.log('✓ Performance indexes migration completed successfully')
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('✗ Performance indexes migration failed:', error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Rollback performance indexes (removes the indexes)
 */
export async function rollbackPerformanceIndexes(pool: Pool): Promise<void> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // List of indexes to drop
    const indexesToDrop = [
      'idx_newsletter_subscribers_status_source',
      'idx_newsletter_subscribers_subscribed_at_status',
      'idx_newsletter_subscribers_unsubscribed_at',
      'idx_newsletter_subscribers_active',
      'idx_newsletter_subscribers_brevo_sync',
      'idx_newsletter_subscribers_search',
      'idx_newsletter_campaigns_status_scheduled',
      'idx_newsletter_campaigns_sent_at_stats',
      'idx_newsletter_campaigns_brevo_message',
      'idx_social_posts_platform_status_scheduled',
      'idx_social_posts_published_engagement',
      'idx_content_analytics_type_platform_date',
      'idx_content_analytics_content_metrics',
      'idx_ai_content_log_type_date',
      'idx_ai_content_log_tokens_date',
      'idx_newsletter_dashboard_stats_refresh'
    ]
    
    for (const indexName of indexesToDrop) {
      try {
        await client.query(`DROP INDEX IF EXISTS ${indexName}`)
        console.log(`✓ Dropped index: ${indexName}`)
      } catch (error) {
        console.warn(`⚠ Warning dropping index ${indexName}: ${error}`)
      }
    }
    
    // Drop materialized view
    await client.query('DROP MATERIALIZED VIEW IF EXISTS newsletter_dashboard_stats')
    
    // Drop views
    await client.query('DROP VIEW IF EXISTS newsletter_subscriber_stats')
    await client.query('DROP VIEW IF EXISTS index_usage_stats')
    await client.query('DROP VIEW IF EXISTS table_size_stats')
    
    // Drop functions
    await client.query('DROP FUNCTION IF EXISTS refresh_newsletter_stats()')
    await client.query('DROP FUNCTION IF EXISTS cleanup_old_analytics(INTEGER)')
    
    await client.query('COMMIT')
    console.log('✓ Performance indexes rollback completed successfully')
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('✗ Performance indexes rollback failed:', error)
    throw error
  } finally {
    client.release()
  }
}