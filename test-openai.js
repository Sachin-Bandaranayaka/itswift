// Simple test script to verify OpenAI API key
require('dotenv').config({ path: '.env.local' });

console.log('Testing OpenAI API key...');
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false);

// Test the actual connection
const OpenAI = require('openai');

async function testConnection() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "Hello, API is working!"' }],
      max_tokens: 10,
    });

    console.log('✅ OpenAI API connection successful!');
    console.log('Response:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ OpenAI API connection failed:');
    console.error('Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testConnection();