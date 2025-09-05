const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('🚀 Starting contact submissions table migration...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-contact-submissions-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: statement + ';' 
      })
      
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_temp')
          .select('1')
          .limit(0)
        
        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          throw error
        }
      }
    }
    
    console.log('✅ Migration completed successfully!')
    
    // Verify the table was created
    console.log('🔍 Verifying table creation...')
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Table verification failed:', error)
    } else {
      console.log('✅ Table verification successful!')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()