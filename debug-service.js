require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function debugService() {
  try {
    console.log('=== DEBUGGING SERVICE METHODS ===\n');
    
    // Test direct Sanity query
    console.log('1. Direct Sanity query:');
    const directQuery = `
      *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
        _id,
        title,
        publishedAt,
        _createdAt,
        _updatedAt
      }
    `;
    
    const directPosts = await client.fetch(directQuery);
    console.log(`Found ${directPosts.length} posts via direct query`);
    directPosts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
    });
    
    // Test the publishedPostsQuery from queries.ts
    console.log('\n2. Using publishedPostsQuery:');
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
    
    const queryPosts = await client.fetch(publishedPostsQuery);
    console.log(`Found ${queryPosts.length} posts via publishedPostsQuery`);
    queryPosts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
    });
    
    // Check if there's a difference
    const directIds = directPosts.map(p => p._id).sort();
    const queryIds = queryPosts.map(p => p._id).sort();
    
    console.log('\n3. Comparison:');
    console.log('Direct query IDs:', directIds);
    console.log('Published query IDs:', queryIds);
    console.log('Are they the same?', JSON.stringify(directIds) === JSON.stringify(queryIds));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugService();
