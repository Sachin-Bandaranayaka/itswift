// Simple SEO metadata test using HTTP requests
const http = require('http');

async function testPageSeo(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Test-Bot/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Extract meta tags using simple regex
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descriptionMatch = data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const keywordsMatch = data.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
        const ogTitleMatch = data.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const ogDescriptionMatch = data.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        
        resolve({
          path,
          title: titleMatch ? titleMatch[1] : null,
          description: descriptionMatch ? descriptionMatch[1] : null,
          keywords: keywordsMatch ? keywordsMatch[1] : null,
          ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
          ogDescription: ogDescriptionMatch ? ogDescriptionMatch[1] : null,
          status: res.statusCode
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runSeoTests() {
  console.log('🧪 Testing SEO Metadata Implementation');
  console.log('=====================================\n');

  const testPages = [
    '/',
    '/about-us',
    '/blog',
    '/contact',
    '/ai-powered-solutions',
    '/case-studies',
    '/custom-elearning'
  ];

  for (const path of testPages) {
    try {
      console.log(`📄 Testing: ${path}`);
      const result = await testPageSeo(path);
      
      console.log(`   Status: ${result.status}`);
      console.log(`   Title: ${result.title ? '✅' : '❌'} ${result.title || 'Missing'}`);
      console.log(`   Description: ${result.description ? '✅' : '❌'} ${result.description ? 'Present' : 'Missing'}`);
      console.log(`   Keywords: ${result.keywords ? '✅' : '❌'} ${result.keywords ? 'Present' : 'Missing'}`);
      console.log(`   OG Title: ${result.ogTitle ? '✅' : '❌'} ${result.ogTitle ? 'Present' : 'Missing'}`);
      console.log(`   OG Description: ${result.ogDescription ? '✅' : '❌'} ${result.ogDescription ? 'Present' : 'Missing'}`);
      
      if (result.keywords) {
        console.log(`   Keywords Preview: "${result.keywords.substring(0, 80)}${result.keywords.length > 80 ? '...' : ''}"`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('🎯 Test Summary:');
  console.log('- All pages should have titles, descriptions, and keywords');
  console.log('- Pages with imported data should show custom SEO content');
  console.log('- Primary and secondary keywords should be combined');
  console.log('- Open Graph tags should be present for social sharing');
}

// Run the tests
runSeoTests().catch(console.error);