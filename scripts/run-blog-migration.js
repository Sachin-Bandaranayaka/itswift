#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runBlogMigration() {
  try {
    console.log('🚀 Running blog migration to add category_id column...')

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'lib', 'database', 'migrations', '003_add_category_id_to_blog_posts.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8')

    // Split into individual statements
    const statements = migrationSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
      console.log(`SQL: ${statement.substring(0, 100)}...`)
      
      try {
        // For Supabase, we need to run these manually in the SQL editor
        // Let's output the statements for manual execution
        console.log('Please execute this SQL statement manually in Supabase SQL editor:')
        console.log('---')
        console.log(statement + ';')
        console.log('---')
      } catch (err) {
        console.log('Statement logged for manual execution:', statement)
      }
    }

    console.log('✅ Migration statements prepared!')
    console.log('')
    console.log('📋 MANUAL STEPS REQUIRED:')
    console.log('1. Open your Supabase project dashboard')
    console.log('2. Go to the SQL Editor')
    console.log('3. Copy and paste the SQL statements shown above')
    console.log('4. Execute them one by one')
    console.log('')
    console.log('After running the migration, test the blog post creation again.')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Run the migration
runBlogMigration()