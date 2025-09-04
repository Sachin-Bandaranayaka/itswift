// Simple test script to verify API routes work
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000/api/blog';

async function testApiRoutes() {
  console.log('Testing Blog API Routes...\n');

  try {
    // Test categories endpoint
    console.log('1. Testing /api/blog/categories');
    const categoriesResponse = await fetch(`${BASE_URL}/categories`);
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Categories endpoint working');
      console.log('Categories:', categories.slice(0, 3)); // Show first 3
    } else {
      console.log('❌ Categories endpoint failed:', categoriesResponse.status);
    }

    // Test posts endpoint
    console.log('\n2. Testing /api/blog/posts');
    const postsResponse = await fetch(`${BASE_URL}/posts?page=1&limit=3`);
    if (postsResponse.ok) {
      const postsData = await postsResponse.json();
      console.log('✅ Posts endpoint working');
      console.log('Posts count:', postsData.posts?.length || 0);
      console.log('Pagination:', postsData.pagination);
    } else {
      console.log('❌ Posts endpoint failed:', postsResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure your Next.js development server is running on port 3000');
  }
}

testApiRoutes();