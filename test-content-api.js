// Test script for content management API
const API_BASE = 'http://localhost:3000/api/admin/content';

async function testContentAPI() {
  try {
    console.log('Testing Content Management API...\n');

    // First, get the home page ID
    const pagesResponse = await fetch(`${API_BASE}/pages`);
    const pagesData = await pagesResponse.json();
    console.log('Pages:', pagesData);

    const homePage = pagesData.data?.find(page => page.slug === 'home');
    if (!homePage) {
      console.error('Home page not found');
      return;
    }

    console.log(`\nFound home page: ${homePage.title} (ID: ${homePage.id})\n`);

    // Test creating a content section
    const sampleSection = {
      page_id: homePage.id,
      section_key: 'hero_title',
      section_type: 'text',
      content: 'Welcome to Swift Solution - Your AI-Powered eLearning Partner',
      display_order: 1,
      is_active: true
    };

    console.log('Creating sample content section...');
    const createResponse = await fetch(`${API_BASE}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleSection)
    });

    const createResult = await createResponse.json();
    console.log('Create result:', createResult);

    // Test fetching content sections
    console.log('\nFetching content sections for home page...');
    const sectionsResponse = await fetch(`${API_BASE}/sections?page_slug=home`);
    const sectionsData = await sectionsResponse.json();
    console.log('Sections:', sectionsData);

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testContentAPI();