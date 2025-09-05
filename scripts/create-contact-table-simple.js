const { createClient } = require('@supabase/supabase-js')

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

async function createContactTable() {
  try {
    console.log('🚀 Creating contact_submissions table...')
    
    // Try to insert a test record to see if table exists
    const { data: testData, error: testError } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1)
    
    if (!testError) {
      console.log('✅ Table already exists!')
      return
    }
    
    console.log('📝 Table does not exist, please create it manually in Supabase dashboard')
    console.log('🔧 Use this SQL in the Supabase SQL Editor:')
    console.log(`
-- Create contact_submissions table
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createContactTable()