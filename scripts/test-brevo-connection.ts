#!/usr/bin/env node

/**
 * Test Brevo API connection and configuration
 */

import { getBrevoService } from '../lib/integrations/brevo'

async function testBrevoConnection() {
  try {
    console.log('🔗 Testing Brevo API connection...')
    
    // Check if API key is configured
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      console.error('❌ BREVO_API_KEY environment variable is not set')
      console.log('Please add your Brevo API key to your .env.local file:')
      console.log('BREVO_API_KEY=your_api_key_here')
      process.exit(1)
    }

    console.log('✅ API key found')
    
    // Test connection
    const brevoService = getBrevoService()
    const result = await brevoService.testConnection()
    
    if (result.success) {
      console.log('✅ Brevo connection successful!')
      console.log('🎉 Your Brevo integration is working correctly')
    } else {
      console.error('❌ Brevo connection failed:', result.error)
      console.log('\nTroubleshooting tips:')
      console.log('1. Check that your BREVO_API_KEY is correct')
      console.log('2. Verify your Brevo account is active')
      console.log('3. Ensure your API key has the necessary permissions')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Error testing Brevo connection:', error)
    process.exit(1)
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testBrevoConnection()
}

export { testBrevoConnection }