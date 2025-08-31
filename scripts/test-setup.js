#!/usr/bin/env node

/**
 * Test script to verify the setup is working
 */

require('dotenv').config({ path: '.env.local' })

async function testSetup() {
  console.log('🧪 Testing Admin Content Automation Setup...\n')

  // Test environment variables
  console.log('📋 Environment Variables:')
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'NEXTAUTH_SECRET'
  ]

  let missingVars = []
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value || value.startsWith('placeholder_') || value.startsWith('your_')) {
      console.log(`❌ ${varName}: Missing or placeholder`)
      missingVars.push(varName)
    } else {
      console.log(`✅ ${varName}: Configured`)
    }
  })

  console.log('\n🔗 Testing Supabase Connection...')
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await supabase
      .from('social_posts')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
    } else {
      console.log('✅ Supabase connection successful')
    }
  } catch (error) {
    console.log('❌ Supabase test failed:', error.message)
  }

  console.log('\n🤖 Testing OpenAI Connection...')
  try {
    const OpenAI = require('openai')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 5,
    })

    if (completion.choices[0]?.message?.content) {
      console.log('✅ OpenAI connection successful')
    } else {
      console.log('❌ OpenAI connection failed: No response')
    }
  } catch (error) {
    console.log('❌ OpenAI test failed:', error.message)
  }

  console.log('\n📊 Setup Summary:')
  if (missingVars.length === 0) {
    console.log('🎉 All required environment variables are configured!')
  } else {
    console.log(`⚠️  ${missingVars.length} environment variables need attention`)
  }

  console.log('\n🚀 Ready to start development server with: npm run dev')
}

testSetup().catch(console.error)