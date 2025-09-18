// Script to add more sample content sections
const API_BASE = 'http://localhost:3000/api/admin/content';

async function addMoreContent() {
  try {
    console.log('Adding more sample content sections...\n');

    // Get the home page ID
    const pagesResponse = await fetch(`${API_BASE}/pages`);
    const pagesData = await pagesResponse.json();
    const homePage = pagesData.data?.find(page => page.slug === 'home');

    if (!homePage) {
      console.error('Home page not found');
      return;
    }

    const sampleSections = [
      {
        page_id: homePage.id,
        section_key: 'hero_subtitle',
        section_type: 'text',
        content: 'Transform your corporate training with our award-winning, AI-driven eLearning solutions that deliver measurable results and exceptional ROI.',
        display_order: 2,
        is_active: true
      },
      {
        page_id: homePage.id,
        section_key: 'cta_button',
        section_type: 'text',
        content: 'Get Started Today',
        display_order: 3,
        is_active: true
      },
      {
        page_id: homePage.id,
        section_key: 'features_title',
        section_type: 'text',
        content: 'Why Choose Swift Solution?',
        display_order: 4,
        is_active: true
      },
      {
        page_id: homePage.id,
        section_key: 'feature_1',
        section_type: 'html',
        content: 'AI-Powered Learning',
        content_html: '<h3 class="text-lg font-semibold text-blue-600">AI-Powered Learning</h3><p class="text-gray-600">Leverage cutting-edge AI technology to create personalized learning experiences that adapt to each learner\'s needs.</p>',
        display_order: 5,
        is_active: true
      }
    ];

    for (const section of sampleSections) {
      console.log(`Creating section: ${section.section_key}`);
      
      const response = await fetch(`${API_BASE}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(section)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✓ Created: ${section.section_key}`);
      } else {
        console.log(`✗ Failed: ${section.section_key} - ${result.error}`);
      }
    }

    console.log('\nFetching all content sections for home page...');
    const sectionsResponse = await fetch(`${API_BASE}/sections?page_slug=home`);
    const sectionsData = await sectionsResponse.json();
    
    console.log(`\nTotal sections: ${sectionsData.data?.length || 0}`);
    sectionsData.data?.forEach(section => {
      console.log(`- ${section.section_key}: ${section.content.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('Error adding content:', error);
  }
}

addMoreContent();