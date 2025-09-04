#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('Starting newsletter subscribers enhancement migration...')
    
    // Execute migration statements one by one
    const statements = [
      // Add new columns
      `ALTER TABLE newsletter_subscribers 
       ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'homepage',
       ADD COLUMN IF NOT EXISTS unsubscribe_token VARCHAR(255),
       ADD COLUMN IF NOT EXISTS brevo_contact_id VARCHAR(255),
       ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE`,
      
      // Create indexes
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsubscribe_token 
       ON newsletter_subscribers(unsubscribe_token) 
       WHERE unsubscribe_token IS NOT NULL`,
      
      `CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source 
       ON newsletter_subscribers(source)`,
      
      `CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_brevo_contact_id 
       ON newsletter_subscribers(brevo_contact_id) 
       WHERE brevo_contact_id IS NOT NULL`,
      
      `CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_last_synced_at 
       ON newsletter_subscribers(last_synced_at) 
       WHERE last_synced_at IS NOT NULL`,
      
      // Add check constraint
      `ALTER TABLE newsletter_subscribers 
       ADD CONSTRAINT IF NOT EXISTS chk_newsletter_subscribers_source 
       CHECK (source IN ('homepage', 'admin', 'import', 'api'))`,
      
      // Update existing records
      `UPDATE newsletter_subscribers 
       SET source = 'admin' 
       WHERE source IS NULL`,
      
      // Make source column NOT NULL
      `ALTER TABLE newsletter_subscribers 
       ALTER COLUMN source SET NOT NULL`
    ]
    
    console.log(`Executing ${statements.length} migration statements...`)
    
    // Execute each statement using raw SQL
    for (let i = 0; i < statements.length; i++) {
      console.log(`Executing statement ${i + 1}/${statements.length}`)
      
      try {
        // Use the raw SQL query method
        const { error } = await supabase.rpc('exec_sql', { sql: statements[i] })
        
        if (error) {
          // If exec_sql doesn't work, try alternative approach
          console.log('exec_sql not available, trying alternative approach...')
          
          // For Supabase, we need to run these manually in the SQL editor
          // Let's just log the statements for manual execution
          console.log('Please execute this SQL statement manually in Supabase SQL editor:')
          console.log(statements[i])
          console.log('---')
        }
      } catch (err) {
        console.log('Statement logged for manual execution:', statements[i])
      }
    }
    
    console.log('Migration statements prepared!')
    console.log('Note: If exec_sql is not available, please run the above SQL statements manually in your Supabase SQL editor.')
    
    // Try to verify the migration
    console.log('Attempting to verify migration...')
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('id, email, source, unsubscribe_token, brevo_contact_id, last_synced_at')
        .limit(1)
      
      if (error) {
        console.log('Migration verification pending - columns may not exist yet')
        console.log('Please run the SQL statements manually and then verify')
      } else {
        console.log('Migration verification successful!')
        if (data && data.length > 0) {
          console.log('Sample record structure:', Object.keys(data[0]))
        } else {
          console.log('No existing records to verify structure')
        }
      }
    } catch (verifyError) {
      console.log('Verification will be available after manual SQL execution')
    }
    
  } catch (error) {
    console.error('Migration preparation failed:', error)
    process.exit(1)
  }
}

runMigration()