// Test script to verify Sanity connection in production
const { createClient } = require('next-sanity');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: 'published',
});

async function testConnection() {
    try {
        console.log('Testing Sanity connection...');
        console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
        console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
        console.log('Token exists:', !!process.env.SANITY_API_TOKEN);
        
        const posts = await client.fetch('*[_type == "post"][0...1]');
        console.log('✅ Connection successful!');
        console.log('Sample posts:', posts.length);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();