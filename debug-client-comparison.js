require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

// Create the same client as the service uses
const serviceClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

// Create our test client
const testClient = createClient({
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
    slug,
    mainImage,
    excerpt,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      title
    },
    _createdAt,
    _updatedAt
  }
`;

async function compareClients() {
  try {
    console.log('=== COMPARING SANITY CLIENTS ===\n');
    
    console.log('Environment variables:');
    console.log('- PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('- DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log('- API_VERSION:', process.env.NEXT_PUBLIC_SANITY_API_VERSION);
    console.log('- HAS_TOKEN:', !!process.env.SANITY_API_TOKEN);
    console.log();
    
    console.log('1. Service client results:');
    const servicePosts = await serviceClient.fetch(publishedPostsQuery);
    console.log(`Found ${servicePosts.length} posts`);
    servicePosts.forEach(post => {
      console.log(`- ${post.title} (${post._id}) - Published: ${post.publishedAt}`);
    });
    
    console.log('\n2. Test client results:');
    const testPosts = await testClient.fetch(publishedPostsQuery);
    console.log(`Found ${testPosts.length} posts`);
    testPosts.forEach(post => {
      console.log(`- ${post.title} (${post._id}) - Published: ${post.publishedAt}`);
    });
    
    console.log('\n3. Comparison:');
    console.log('Service client IDs:', servicePosts.map(p => p._id).sort());
    console.log('Test client IDs:', testPosts.map(p => p._id).sort());
    console.log('Are they the same?', JSON.stringify(servicePosts.map(p => p._id).sort()) === JSON.stringify(testPosts.map(p => p._id).sort()));
    
    // Let's also check what "now()" evaluates to
    console.log('\n4. Current time check:');
    const nowQuery = `now()`;
    const currentTime = await serviceClient.fetch(nowQuery);
    console.log('Current time according to Sanity:', currentTime);
    
    // Check all posts regardless of publishedAt
    console.log('\n5. All posts (regardless of publishedAt):');
    const allPostsQuery = `*[_type == "post"] | order(publishedAt desc) { _id, title, publishedAt }`;
    const allPosts = await serviceClient.fetch(allPostsQuery);
    console.log(`Found ${allPosts.length} total posts`);
    allPosts.forEach(post => {
      const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
      const isInFuture = publishedDate && publishedDate > new Date();
      console.log(`- ${post.title} (${post._id}) - Published: ${post.publishedAt} ${isInFuture ? '(FUTURE)' : ''}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

compareClients();
