// Test Sanity connection
// Run with: node test-sanity-connection.js

const { createClient } = require('next-sanity');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'q7zm6kfe';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-05';
const token = process.env.SANITY_API_TOKEN;

console.log('Testing Sanity connection...');
console.log('Project ID:', projectId);
console.log('Dataset:', dataset);
console.log('API Version:', apiVersion);
console.log('Token available:', !!token);

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: 'published',
    stega: false,
});

async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    const result = await client.fetch('*[_type == "post"][0..2]{_id, title}');
    console.log('✅ Connection successful');
    console.log('Sample posts:', result);
    
    console.log('\n2. Testing published posts query...');
    const publishedPosts = await client.fetch(`
      *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) [0..2] {
        _id,
        title,
        slug,
        publishedAt
      }
    `);
    console.log('✅ Published posts query successful');
    console.log('Published posts:', publishedPosts);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 This might be a token issue. Check your SANITY_API_TOKEN in .env.local');
    }
    
    if (error.message.includes('not found')) {
      console.log('\n💡 This might be a project ID or dataset issue. Check your Sanity configuration.');
    }
  }
}

testConnection();