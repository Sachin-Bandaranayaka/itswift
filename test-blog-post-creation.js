#!/usr/bin/env node

/**
 * Test script to debug the 400 error when creating blog posts
 * This will help identify what's causing the validation to fail
 */

const API_BASE = 'http://localhost:3000'

async function testBlogPostCreation() {
  console.log('🧪 Testing blog post creation endpoint...\n')

  // Test 1: Valid blog post data
  const validPostData = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is test content for the blog post.',
    author_id: '1', // Assuming author with ID 1 exists
    status: 'draft'
  }

  console.log('📝 Test 1: Valid blog post data')
  console.log('Request data:', JSON.stringify(validPostData, null, 2))
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validPostData)
    })

    const responseData = await response.json()
    console.log(`Response status: ${response.status}`)
    console.log('Response data:', JSON.stringify(responseData, null, 2))
    
    if (response.status === 400) {
      console.log('❌ 400 Error detected with valid data!')
      console.log('Error message:', responseData.error)
    } else if (response.status === 201) {
      console.log('✅ Success with valid data')
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 2: Missing required field
  const invalidPostData = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is test content for the blog post.',
    // Missing author_id and status
  }

  console.log('📝 Test 2: Missing required fields (author_id, status)')
  console.log('Request data:', JSON.stringify(invalidPostData, null, 2))
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPostData)
    })

    const responseData = await response.json()
    console.log(`Response status: ${response.status}`)
    console.log('Response data:', JSON.stringify(responseData, null, 2))
    
    if (response.status === 400) {
      console.log('✅ Expected 400 error for missing fields')
      console.log('Error message:', responseData.error)
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 3: Check if authors exist
  console.log('📝 Test 3: Checking available authors')
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/blog/authors`)
    const responseData = await response.json()
    console.log(`Response status: ${response.status}`)
    
    if (response.status === 200 && responseData.data) {
      console.log('Available authors:', responseData.data.map(author => ({ id: author.id, name: author.name })))
    } else {
      console.log('Response data:', JSON.stringify(responseData, null, 2))
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 4: Test with empty strings (which might pass the truthy check but fail validation)
  const emptyStringData = {
    title: '',
    slug: '',
    content: '',
    author_id: '',
    status: ''
  }

  console.log('📝 Test 4: Empty string values')
  console.log('Request data:', JSON.stringify(emptyStringData, null, 2))
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emptyStringData)
    })

    const responseData = await response.json()
    console.log(`Response status: ${response.status}`)
    console.log('Response data:', JSON.stringify(responseData, null, 2))
    
    if (response.status === 400) {
      console.log('✅ Expected 400 error for empty strings')
      console.log('Error message:', responseData.error)
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

// Run the test
testBlogPostCreation().catch(console.error)