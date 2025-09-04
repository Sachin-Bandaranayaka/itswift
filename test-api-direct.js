// Test API routes directly
// Run with: node test-api-direct.js

const { BlogPublicDataService } = require('./lib/services/blog-public-data.ts');

async function testService() {
  try {
    console.log('Testing BlogPublicDataService directly...\n');
    
    console.log('1. Testing getAllPublishedPosts...');
    const posts = await BlogPublicDataService.getAllPublishedPosts();
    console.log('✅ getAllPublishedPosts works, found', posts.length, 'posts');
    
    console.log('\n2. Testing getAvailableCategories...');
    const categories = await BlogPublicDataService.getAvailableCategories();
    console.log('✅ getAvailableCategories works, found', categories.length, 'categories');
    
    console.log('\n3. Testing getPaginatedPosts...');
    const paginatedData = await BlogPublicDataService.getPaginatedPosts({
      status: 'published'
    }, 1, 5);
    console.log('✅ getPaginatedPosts works');
    console.log('Posts:', paginatedData.posts.length);
    console.log('Pagination:', paginatedData.pagination);
    
  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testService();