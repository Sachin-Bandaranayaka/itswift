#!/usr/bin/env node

/**
 * Manual test script for the newsletter subscription API endpoint
 * This script tests the /api/newsletter/subscribe endpoint with various scenarios
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function testNewsletterSubscribeAPI() {
  console.log('🧪 Testing Newsletter Subscribe API Endpoint')
  console.log('=' .repeat(50))

  // Test 1: Valid subscription
  console.log('\n1. Testing valid subscription...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
    console.log(`CORS Headers:`, {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 2: Missing email
  console.log('\n2. Testing missing email validation...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'John'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 3: Invalid email format
  console.log('\n3. Testing invalid email format...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 4: CORS preflight request
  console.log('\n4. Testing CORS preflight (OPTIONS)...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'OPTIONS'
    })

    console.log(`Status: ${response.status}`)
    console.log(`CORS Headers:`, {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Max-Age': response.headers.get('Access-Control-Max-Age')
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 5: Invalid JSON
  console.log('\n5. Testing invalid JSON...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 6: Email only (minimal valid request)
  console.log('\n6. Testing email-only subscription...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'minimal@example.com'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 7: Custom source
  console.log('\n7. Testing custom source...')
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'custom-source@example.com',
        source: 'api'
      })
    })

    const data = await response.json()
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  console.log('\n✅ Newsletter Subscribe API testing completed!')
}

// Run the tests
testNewsletterSubscribeAPI().catch(console.error)