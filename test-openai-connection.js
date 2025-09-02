// Simple test to verify OpenAI API key is working
require('dotenv').config({ path: '.env.local' })

async function testOpenAI() {
  console.log('Testing OpenAI connection...')
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
  console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...')
  
  try {
    const { testOpenAIConnection } = require('./lib/integrations/openai.ts')
    const result = await testOpenAIConnection()
    console.log('Connection test result:', result)
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testOpenAI()