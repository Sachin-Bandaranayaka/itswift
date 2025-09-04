import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function runMigration(migrationFile: string): Promise<void> {
  try {
    const migrationPath = join(process.cwd(), 'lib/database/migrations', migrationFile)
    const migrationSQL = readFileSync(migrationPath, 'utf-8')
    
    console.log(`Running migration: ${migrationFile}`)
    
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('Migration failed:', error)
      throw error
    }
    
    console.log(`Migration completed successfully: ${migrationFile}`)
  } catch (error) {
    console.error('Error running migration:', error)
    throw error
  }
}

export async function runNewsletterEnhancementsMigration(): Promise<void> {
  await runMigration('001_newsletter_subscribers_enhancements.sql')
}

// Utility function to check if migration has been applied
export async function checkMigrationStatus(): Promise<{
  hasSourceColumn: boolean
  hasUnsubscribeTokenColumn: boolean
  hasBrevoContactIdColumn: boolean
  hasLastSyncedAtColumn: boolean
}> {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'newsletter_subscribers')
      .in('column_name', ['source', 'unsubscribe_token', 'brevo_contact_id', 'last_synced_at'])
    
    if (error) {
      console.error('Error checking migration status:', error)
      return {
        hasSourceColumn: false,
        hasUnsubscribeTokenColumn: false,
        hasBrevoContactIdColumn: false,
        hasLastSyncedAtColumn: false
      }
    }
    
    const columnNames = data?.map(row => row.column_name) || []
    
    return {
      hasSourceColumn: columnNames.includes('source'),
      hasUnsubscribeTokenColumn: columnNames.includes('unsubscribe_token'),
      hasBrevoContactIdColumn: columnNames.includes('brevo_contact_id'),
      hasLastSyncedAtColumn: columnNames.includes('last_synced_at')
    }
  } catch (error) {
    console.error('Error checking migration status:', error)
    return {
      hasSourceColumn: false,
      hasUnsubscribeTokenColumn: false,
      hasBrevoContactIdColumn: false,
      hasLastSyncedAtColumn: false
    }
  }
}