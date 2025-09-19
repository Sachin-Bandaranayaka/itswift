// Debug script to test the exact same context as the service
import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// Load the correct env file
config({ path: '.env.local' });

// Use the exact same configuration as the service
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  stega: false,
});

// Use the exact same query as the service
const publishedPostsQuery = `
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    mainImage,
    author,
    categories,
    publishedAt
  }
`;

console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('- Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('- API Version:', process.env.NEXT_PUBLIC_SANITY_API_VERSION);
console.log('- Has Token:', !!process.env.SANITY_API_TOKEN);
console.log('- useCdn:', process.env.NODE_ENV === 'production');

async function testServiceContext() {
  try {
    console.log('\nTesting with service context...');
    const posts = await client.fetch(publishedPostsQuery);
    console.log('Service context posts count:', posts.length);
    console.log('Service context post IDs:', posts.map(p => p._id));
    
    // Also test without perspective
    const clientWithoutPerspective = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
      token: process.env.SANITY_API_TOKEN,
      useCdn: process.env.NODE_ENV === 'production',
      stega: false,
    });
    
    const postsWithoutPerspective = await clientWithoutPerspective.fetch(publishedPostsQuery);
    console.log('\nWithout perspective posts count:', postsWithoutPerspective.length);
    console.log('Without perspective post IDs:', postsWithoutPerspective.map(p => p._id));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testServiceContext();
