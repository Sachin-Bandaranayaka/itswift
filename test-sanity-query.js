require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function testQuery() {
  try {
    console.log('Testing publishedPostsQuery...\n');
    
    const publishedPostsQuery = `
      *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
        _id,
        title,
        publishedAt,
        _createdAt
      }
    `;
    
    const posts = await client.fetch(publishedPostsQuery);
    console.log('Published posts found:', posts.length);
    
    posts.forEach(post => {
      console.log(`- ${post.title} (${post._id})`);
      console.log(`  publishedAt: ${post.publishedAt}`);
      console.log(`  _createdAt: ${post._createdAt}`);
    });
    
    // Check if our specific post is included
    const ourPost = posts.find(p => p._id === 'K4tdAJtZqIlru9YbYK4Tt0');
    console.log('\nOur specific post found:', !!ourPost);
    
    if (!ourPost) {
      console.log('\nTesting query without time filter...');
      const allPostsQuery = `
        *[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          publishedAt,
          _createdAt
        }
      `;
      
      const allPosts = await client.fetch(allPostsQuery);
      const ourPostInAll = allPosts.find(p => p._id === 'K4tdAJtZqIlru9YbYK4Tt0');
      console.log('Our post in all posts:', !!ourPostInAll);
      if (ourPostInAll) {
        console.log('Post details:', ourPostInAll);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
