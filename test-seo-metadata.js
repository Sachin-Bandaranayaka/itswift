// Test script to verify SEO metadata implementation
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test pages to verify
const testPages = [
  '/', // Homepage (should use defaults)
  '/about-us', // Should have imported SEO data
  '/blog', // Should have imported SEO data
  '/contact', // Should have imported SEO data
  '/ai-powered-solutions', // Should have imported SEO data
  '/non-existent-page' // Should use defaults
];

// Simulate the SEO metadata service logic
async function testSeoMetadata() {
  console.log('🧪 Testing SEO Metadata Implementation\n');
  
  for (const path of testPages) {
    console.log(`\n📄 Testing path: ${path}`);
    console.log('=' .repeat(50));
    
    try {
      // Normalize path and get slug candidates (mimicking seo-metadata.ts logic)
      const normalizedPath = path === '/' ? '' : path.replace(/^\//, '').replace(/\/$/, '');
      const slugCandidates = normalizedPath ? [normalizedPath] : ['', 'home', 'index'];
      
      console.log(`🔍 Slug candidates: [${slugCandidates.join(', ')}]`);
      
      // Query the database for SEO record
      const { data: seoRecords, error } = await supabase
        .from('pages')
        .select('slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords')
        .in('slug', slugCandidates)
        .eq('is_active', true);
      
      if (error) {
        console.log(`❌ Database error: ${error.message}`);
        continue;
      }
      
      console.log(`📊 Found ${seoRecords?.length || 0} matching records`);
      
      if (seoRecords && seoRecords.length > 0) {
        const record = seoRecords[0]; // Take the first match
        console.log(`✅ Using record for slug: "${record.slug}"`);
        console.log(`📝 Title: ${record.meta_title || record.title || 'DEFAULT'}`);
        console.log(`📄 Description: ${record.meta_description || record.description || 'DEFAULT'}`);
        
        // Test keyword combination logic
        const primaryKeywords = record.primary_keywords;
        const secondaryKeywords = record.secondary_keywords;
        const metaKeywords = record.meta_keywords;
        
        let combinedKeywords = null;
        if (primaryKeywords && secondaryKeywords) {
          combinedKeywords = `${primaryKeywords}, ${secondaryKeywords}`;
        } else if (primaryKeywords) {
          combinedKeywords = primaryKeywords;
        } else if (secondaryKeywords) {
          combinedKeywords = secondaryKeywords;
        } else if (metaKeywords) {
          combinedKeywords = metaKeywords;
        }
        
        console.log(`🏷️  Keywords: ${combinedKeywords || 'DEFAULT'}`);
        console.log(`   - Primary: ${primaryKeywords || 'None'}`);
        console.log(`   - Secondary: ${secondaryKeywords || 'None'}`);
        console.log(`   - Meta: ${metaKeywords || 'None'}`);
      } else {
        console.log(`⚠️  No SEO record found - will use defaults`);
        console.log(`📝 Title: DEFAULT (Swift Solution - AI-Powered eLearning Solutions)`);
        console.log(`📄 Description: DEFAULT (Transform your workforce...)`);
        console.log(`🏷️  Keywords: DEFAULT (AI-powered eLearning, corporate training...)`);
      }
    } catch (err) {
      console.log(`❌ Error testing ${path}: ${err.message}`);
    }
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('- Homepage should use default metadata');
  console.log('- Pages with imported data should show custom SEO metadata');
  console.log('- Primary + secondary keywords should be combined');
  console.log('- Non-existent pages should fall back to defaults');
}

// Run the test
testSeoMetadata().catch(console.error);