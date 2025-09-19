require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

// Create client with same config as service (including perspective)
const serviceClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published', // This is the key difference!
  stega: false,
});

// Create client without perspective
const normalClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

const publishedPostsQuery = `
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    publishedAt
  }
`;

async function testPerspective() {
  try {
    console.log('=== TESTING PERSPECTIVE SETTING ===\n');
    
    console.log('1. Service client (with perspective: "published"):');
    const servicePosts = await serviceClient.fetch(publishedPostsQuery);
    console.log(`Found ${servicePosts.length} posts`);
    servicePosts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
    });
    
    console.log('\n2. Normal client (no perspective):');
    const normalPosts = await normalClient.fetch(publishedPostsQuery);
    console.log(`Found ${normalPosts.length} posts`);
    normalPosts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
    });
    
    console.log('\n3. Comparison:');
    const serviceIds = servicePosts.map(p => p._id).sort();
    const normalIds = normalPosts.map(p => p._id).sort();
    console.log('Service client IDs:', serviceIds);
    console.log('Normal client IDs:', normalIds);
    console.log('Are they the same?', JSON.stringify(serviceIds) === JSON.stringify(normalIds));
    
    if (serviceIds.length !== normalIds.length) {
      const missingInService = normalIds.filter(id => !serviceIds.includes(id));
      const extraInService = serviceIds.filter(id => !normalIds.includes(id));
      console.log('Missing in service:', missingInService);
      console.log('Extra in service:', extraInService);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPerspective();
