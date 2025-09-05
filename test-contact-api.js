// Test script for contact API
const fetch = require('node-fetch')

async function testContactAPI() {
  try {
    console.log('🧪 Testing contact API...')
    
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      message: 'This is a test message from the contact form.'
    }
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📊 Response Status:', response.status)
    console.log('📋 Response Data:', result)
    
    if (response.ok) {
      console.log('✅ Contact API test successful!')
    } else {
      console.log('❌ Contact API test failed!')
    }
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

testContactAPI()