import { supabaseAdmin } from '../supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Execute the automation schema SQL
 */
export async function setupAutomationTables(): Promise<{ success: boolean; error?: string }> {
  try {
    // Read the automation schema SQL file
    const schemaPath = join(process.cwd(), 'lib/database/automation-schema.sql')
    const schemaSql = readFileSync(schemaPath, 'utf-8')

    // Split the SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
        if (error) {
          console.error('Error executing SQL statement:', error)
          console.error('Statement:', statement)
          // Continue with other statements even if one fails
        }
      }
    }

    // Test if automation_rules table exists
    const { error: testError } = await supabaseAdmin
      .from('automation_rules')
      .select('count')
      .limit(1)

    if (testError) {
      return { 
        success: false, 
        error: `Failed to create automation_rules table: ${testError.message}` 
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to setup automation tables:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Simple function to execute raw SQL (for development/setup only)
 */
export async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql })
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}