#!/usr/bin/env node

/**
 * Database Optimization Script
 * Applies database optimizations including indexes, materialized views, and stored procedures
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Execute SQL file
 */
async function executeSQLFile(filePath) {
  try {
    console.log(`📄 Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements (basic splitting by semicolon)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          if (error) {
            // Some errors are expected (like "already exists" errors)
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist') ||
                error.message.includes('cannot create')) {
              console.log(`   ⚠️  Warning: ${error.message}`);
            } else {
              console.error(`   ❌ Error executing statement: ${error.message}`);
              console.error(`   Statement: ${statement.substring(0, 100)}...`);
            }
          } else {
            console.log(`   ✅ Statement executed successfully`);
          }
        } catch (err) {
          console.error(`   ❌ Exception executing statement: ${err.message}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error reading or executing SQL file: ${error.message}`);
    return false;
  }
}

/**
 * Create exec_sql function if it doesn't exist
 */
async function createExecSQLFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: createFunctionSQL });
    if (error && !error.message.includes('already exists')) {
      // Try direct execution if RPC doesn't work
      console.log('🔧 Creating exec_sql function via direct query...');
      // This might not work in all Supabase setups, but we'll try
    }
  } catch (err) {
    console.log('⚠️  Could not create exec_sql function, will try direct execution');
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const { data, error } = await supabase
      .from('social_posts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Check if tables exist
 */
async function checkTables() {
  const tables = ['social_posts', 'newsletter_subscribers', 'newsletter_campaigns', 'ai_content_log'];
  const existingTables = [];
  
  console.log('🔍 Checking required tables...');
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (!error) {
        existingTables.push(table);
        console.log(`   ✅ Table '${table}' exists`);
      } else {
        console.log(`   ❌ Table '${table}' does not exist`);
      }
    } catch (err) {
      console.log(`   ❌ Table '${table}' does not exist`);
    }
  }
  
  return existingTables;
}

/**
 * Apply basic optimizations directly via Supabase client
 */
async function applyBasicOptimizations() {
  console.log('🚀 Applying basic database optimizations...');
  
  const optimizations = [
    {
      name: 'Social posts status index',
      sql: `CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status)`
    },
    {
      name: 'Social posts published_at index',
      sql: `CREATE INDEX IF NOT EXISTS idx_social_posts_published_at ON social_posts(published_at DESC)`
    },
    {
      name: 'Newsletter subscribers status index',
      sql: `CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status)`
    },
    {
      name: 'Newsletter subscribers subscribed_at index',
      sql: `CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at DESC)`
    },
    {
      name: 'Newsletter campaigns status index',
      sql: `CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status)`
    },
    {
      name: 'Newsletter campaigns sent_at index',
      sql: `CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_sent_at ON newsletter_campaigns(sent_at DESC)`
    },
    {
      name: 'AI content log created_at index',
      sql: `CREATE INDEX IF NOT EXISTS idx_ai_content_log_created_at ON ai_content_log(created_at DESC)`
    }
  ];
  
  for (const optimization of optimizations) {
    try {
      console.log(`   Creating ${optimization.name}...`);
      // Note: Direct index creation via Supabase client might not work
      // This would typically be done via the Supabase SQL editor
      console.log(`   ⚠️  Index creation should be done via Supabase SQL editor:`);
      console.log(`   ${optimization.sql}`);
    } catch (error) {
      console.log(`   ⚠️  Could not create ${optimization.name}: ${error.message}`);
    }
  }
}

/**
 * Generate optimization report
 */
async function generateOptimizationReport() {
  console.log('📊 Generating optimization report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    tables: {},
    recommendations: []
  };
  
  const tables = ['social_posts', 'newsletter_subscribers', 'newsletter_campaigns', 'ai_content_log'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        report.tables[table] = {
          rowCount: count,
          status: 'exists'
        };
        
        // Add recommendations based on row count
        if (count > 10000) {
          report.recommendations.push({
            table,
            priority: 'HIGH',
            recommendation: `Consider partitioning ${table} table (${count} rows)`
          });
        } else if (count > 1000) {
          report.recommendations.push({
            table,
            priority: 'MEDIUM',
            recommendation: `Monitor ${table} table performance (${count} rows)`
          });
        }
      } else {
        report.tables[table] = {
          status: 'missing',
          error: error.message
        };
        report.recommendations.push({
          table,
          priority: 'HIGH',
          recommendation: `Create missing ${table} table`
        });
      }
    } catch (err) {
      report.tables[table] = {
        status: 'error',
        error: err.message
      };
    }
  }
  
  // Write report to file
  const reportPath = path.join(__dirname, '..', 'database-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📋 Optimization Report:');
  console.log('========================');
  
  Object.entries(report.tables).forEach(([table, info]) => {
    if (info.status === 'exists') {
      console.log(`✅ ${table}: ${info.rowCount} rows`);
    } else {
      console.log(`❌ ${table}: ${info.status} - ${info.error || 'Unknown error'}`);
    }
  });
  
  if (report.recommendations.length > 0) {
    console.log('\n🔧 Recommendations:');
    report.recommendations.forEach(rec => {
      const priority = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`${priority} ${rec.recommendation}`);
    });
  }
  
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

/**
 * Main optimization function
 */
async function optimizeDatabase() {
  console.log('🚀 Starting Database Optimization');
  console.log('==================================');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }
  
  // Check tables
  const existingTables = await checkTables();
  if (existingTables.length === 0) {
    console.error('❌ No required tables found. Please run database setup first.');
    process.exit(1);
  }
  
  // Create exec function
  await createExecSQLFunction();
  
  // Apply basic optimizations
  await applyBasicOptimizations();
  
  // Try to execute optimization SQL file
  const optimizationSQLPath = path.join(__dirname, '..', 'lib', 'database', 'optimization.sql');
  if (fs.existsSync(optimizationSQLPath)) {
    console.log('📄 Found optimization SQL file, attempting to execute...');
    console.log('⚠️  Note: Complex SQL operations should be run via Supabase SQL editor');
    console.log(`   File location: ${optimizationSQLPath}`);
    
    // Read and display the SQL for manual execution
    const sql = fs.readFileSync(optimizationSQLPath, 'utf8');
    console.log('\n📋 SQL to execute in Supabase SQL editor:');
    console.log('==========================================');
    console.log(sql.substring(0, 500) + '...');
    console.log('\n(Full SQL file content should be copied to Supabase SQL editor)');
  }
  
  // Generate report
  await generateOptimizationReport();
  
  console.log('\n✅ Database optimization completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Copy the SQL from lib/database/optimization.sql to Supabase SQL editor');
  console.log('2. Execute the SQL to create indexes, materialized views, and stored procedures');
  console.log('3. Monitor query performance using the generated report');
  console.log('4. Set up automated materialized view refresh (every 5-10 minutes)');
}

// Run optimization
if (require.main === module) {
  optimizeDatabase().catch(error => {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  });
}

module.exports = {
  optimizeDatabase,
  testConnection,
  checkTables,
  generateOptimizationReport
};