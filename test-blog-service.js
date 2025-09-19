require('dotenv').config({ path: '.env.local' });

// Mock the module path resolution for ES modules
const path = require('path');
const { pathToFileURL } = require('url');

async function testService() {
  try {
    // Import the service using dynamic import
    const serviceModule = await import(pathToFileURL(path.resolve('./lib/services/blog-public-data.ts')).href);
    const { BlogPublicDataService } = serviceModule;
    
    console.log('Testing BlogPublicDataService...\n');
    
    console.log('1. Testing getAllPublishedPosts...');
    const allPosts = await BlogPublicDataService.getAllPublishedPosts();
    console.log(`Found ${allPosts.length} published posts`);
    
    const ourPost = allPosts.find(p => p._id === 'K4tdAJtZqIlru9YbYK4Tt0');
    console.log('Our post found in getAllPublishedPosts:', !!ourPost);
    
    if (ourPost) {
      console.log('Post details:', {
        id: ourPost._id,
        title: ourPost.title,
        publishedAt: ourPost.publishedAt
      });
    }
    
    console.log('\n2. Testing getPaginatedPosts...');
    const paginatedResult = await BlogPublicDataService.getPaginatedPosts(
      { status: 'published' },
      1,
      10
    );
    
    console.log(`Paginated result: ${paginatedResult.posts.length} posts`);
    const ourPostInPaginated = paginatedResult.posts.find(p => p._id === 'K4tdAJtZqIlru9YbYK4Tt0');
    console.log('Our post found in getPaginatedPosts:', !!ourPostInPaginated);
    
    console.log('\nAll posts in paginated result:');
    paginatedResult.posts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
    });
    
  } catch (error) {
    console.error('Error testing service:', error);
  }
}

testService();
