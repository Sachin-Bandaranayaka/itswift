#!/usr/bin/env node

/**
 * Test script for newsletter unsubscribe API endpoints
 * This script tests the unsubscribe functionality
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function testUnsubscribeEndpoints() {
  console.log('🧪 Testing Newsletter Unsubscribe API Endpoints...\n')

  try {
    // Test 1: GET /api/newsletter/unsubscribe without token (should redirect with error)
    console.log('1. Testing GET /api/newsletter/unsubscribe without token...')
    const response1 = await fetch(`${BASE_URL}/api/newsletter/unsubscribe`, {
      redirect: 'manual'
    })
    
    if (response1.status === 307) {
      const location = response1.headers.get('location')
      if (location && location.includes('error=missing_token')) {
        console.log('✅ Correctly redirects with missing_token error')
      } else {
        console.log('❌ Unexpected redirect location:', location)
      }
    } else {
      console.log('❌ Expected 307 redirect, got:', response1.status)
    }

    // Test 2: GET /api/newsletter/unsubscribe with invalid token
    console.log('\n2. Testing GET /api/newsletter/unsubscribe with invalid token...')
    const response2 = await fetch(`${BASE_URL}/api/newsletter/unsubscribe?token=invalid-token`, {
      redirect: 'manual'
    })
    
    if (response2.status === 307) {
      const location = response2.headers.get('location')
      if (location && location.includes('error=invalid_token')) {
        console.log('✅ Correctly redirects with invalid_token error')
      } else {
        console.log('❌ Unexpected redirect location:', location)
      }
    } else {
      console.log('❌ Expected 307 redirect, got:', response2.status)
    }

    // Test 3: POST /api/newsletter/unsubscribe without token
    console.log('\n3. Testing POST /api/newsletter/unsubscribe without token...')
    const response3 = await fetch(`${BASE_URL}/api/newsletter/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confirmed: true
      })
    })
    
    const data3 = await response3.json()
    if (response3.status === 400 && data3.error === 'Missing unsubscribe token') {
      console.log('✅ Correctly returns error for missing token')
    } else {
      console.log('❌ Unexpected response:', response3.status, data3)
    }

    // Test 4: POST /api/newsletter/unsubscribe without confirmation
    console.log('\n4. Testing POST /api/newsletter/unsubscribe without confirmation...')
    const response4 = await fetch(`${BASE_URL}/api/newsletter/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'some-token',
        confirmed: false
      })
    })
    
    const data4 = await response4.json()
    if (response4.status === 400 && data4.error === 'Unsubscribe not confirmed') {
      console.log('✅ Correctly returns error for unconfirmed unsubscribe')
    } else {
      console.log('❌ Unexpected response:', response4.status, data4)
    }

    // Test 5: GET /api/newsletter/subscriber-by-token without token
    console.log('\n5. Testing GET /api/newsletter/subscriber-by-token without token...')
    const response5 = await fetch(`${BASE_URL}/api/newsletter/subscriber-by-token`)
    
    const data5 = await response5.json()
    if (response5.status === 400 && data5.error === 'Missing token parameter') {
      console.log('✅ Correctly returns error for missing token parameter')
    } else {
      console.log('❌ Unexpected response:', response5.status, data5)
    }

    // Test 6: GET /api/newsletter/subscriber-by-token with invalid token
    console.log('\n6. Testing GET /api/newsletter/subscriber-by-token with invalid token...')
    const response6 = await fetch(`${BASE_URL}/api/newsletter/subscriber-by-token?token=invalid-token`)
    
    const data6 = await response6.json()
    if (response6.status === 404 && data6.error === 'Invalid or expired token') {
      console.log('✅ Correctly returns error for invalid token')
    } else {
      console.log('❌ Unexpected response:', response6.status, data6)
    }

    console.log('\n🎉 All unsubscribe endpoint tests completed!')
    console.log('\nNote: Tests with valid tokens require actual database data and are tested in integration tests.')

  } catch (error) {
    console.error('❌ Error testing unsubscribe endpoints:', error.message)
    process.exit(1)
  }
}

// Run the tests
testUnsubscribeEndpoints()