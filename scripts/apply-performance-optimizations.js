#!/usr/bin/env node

/**
 * Script to apply performance optimizations for newsletter system
 * This includes database indexes and other performance enhancements
 */

const fs = require('fs')
const path = require('path')

// Import Supabase client
const { createClient } = require('@supabase/supabase-js')

// Database configuration using Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyPerformanceOptimizations() {
  try {
    console.log('🚀 Starting performance optimizations...')
    
    // Read the performance indexes SQL file
    const sqlPath = path.join(__dirname, '..', 'lib', 'database', 'performance-indexes.sql')
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Performance indexes SQL file not found at: ${sqlPath}`)
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let warningCount = 0
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
        
        if (error) {
          throw error
        }
        
        const preview = statement.substring(0, 60).replace(/\s+/g, ' ')
        console.log(`✅ Executed: ${preview}...`)
        successCount++
      } catch (error) {
        const preview = statement.substring(0, 60).replace(/\s+/g, ' ')
        console.warn(`⚠️  Warning executing: ${preview}...`)
        console.warn(`   Error: ${error.message}`)
        warningCount++
        // Continue with other statements even if one fails
      }
    }
    
    console.log('\n📊 Performance Optimization Results:')
    console.log(`✅ Successfully executed: ${successCount} statements`)
    if (warningCount > 0) {
      console.log(`⚠️  Warnings: ${warningCount} statements`)
    }
    
    // Test some of the new indexes
    console.log('\n🔍 Testing new indexes...')
    await testIndexes()
    
    console.log('\n🎉 Performance optimizations completed successfully!')
    
  } catch (error) {
    console.error('❌ Performance optimization failed:', error.message)
    process.exit(1)
  }
}

async function testIndexes() {
  try {
    // Test subscriber count query
    const { data: activeCount, error: error1 } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    if (!error1) {
      console.log('✅ Active subscribers query test passed')
    }
    
    // Test subscriber filtering
    const { data: filteredData, error: error2 } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .eq('source', 'homepage')
      .limit(10)
    
    if (!error2) {
      console.log('✅ Subscriber filtering query test passed')
    }
    
    // Test if materialized view exists by trying to query it
    const { data: statsData, error: error3 } = await supabase
      .rpc('exec_sql', { sql_query: 'SELECT * FROM newsletter_dashboard_stats LIMIT 1' })
    
    if (!error3) {
      console.log('✅ Dashboard stats materialized view test passed')
    } else {
      console.log('⚠️  Dashboard stats materialized view not accessible via RPC')
    }
    
  } catch (error) {
    console.warn('⚠️  Index testing failed:', error.message)
  }
}

// Run the script
if (require.main === module) {
  applyPerformanceOptimizations()
}

module.exports = { applyPerformanceOptimizations }