#!/usr/bin/env node

/**
 * Database setup script
 * Run this script to create the missing automation_rules table
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...')

    // Read the automation schema
    const schemaPath = path.join(__dirname, '..', 'lib', 'database', 'automation-schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8')

    // Split into individual statements and filter out comments
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        
        // Use raw SQL execution
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.warn(`⚠️  Error on statement ${i + 1}:`, err.message)
        errorCount++
      }
    }

    console.log(`✅ Database setup completed!`)
    console.log(`   - Successful statements: ${successCount}`)
    console.log(`   - Warnings/Errors: ${errorCount}`)

    // Test the automation_rules table
    console.log('🔍 Testing automation_rules table...')
    const { data, error } = await supabase
      .from('automation_rules')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ automation_rules table test failed:', error.message)
      console.log('\n💡 You may need to run the SQL manually in your Supabase dashboard:')
      console.log('   1. Go to your Supabase project dashboard')
      console.log('   2. Navigate to SQL Editor')
      console.log('   3. Copy and paste the contents of lib/database/automation-schema.sql')
      console.log('   4. Run the SQL')
    } else {
      console.log('✅ automation_rules table is working correctly!')
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()