#!/usr/bin/env node

/**
 * Blog Test Data Generator Script
 * 
 * Command-line script for testing the blog test data generation functionality.
 * This script can be used to create test posts, run scenarios, and verify
 * the blog content automation system.
 */

// Note: This script requires the project to be built first
// Run: npm run build
// Then: node scripts/test-blog-data-generator.js

console.log('⚠️  This script requires a built version of the project.');
console.log('Please run: npm run build');
console.log('Then run this script again.');
process.exit(1);

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🚀 Blog Test Data Generator');
  console.log('============================\n');

  try {
    const generator = BlogTestDataGenerator.getInstance();

    switch (command) {
      case 'generate':
        await generateTestPosts(generator, args);
        break;
      
      case 'immediate':
        await createImmediatePost(generator, args);
        break;
      
      case 'comprehensive':
        await createComprehensiveDataset(generator);
        break;
      
      case 'status':
        await getTestPostsStatus(generator);
        break;
      
      case 'cleanup':
        await cleanupTestPosts(generator);
        break;
      
      case 'scenario':
        await runTestScenario(args);
        break;
      
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
      
      default:
        console.error('❌ Unknown command:', command);
        console.log('\nUse "help" to see available commands.');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function generateTestPosts(generator, args) {
  const publishedCount = parseInt(args[1]) || 1;
  const scheduledCount = parseInt(args[2]) || 1;
  const draftCount = parseInt(args[3]) || 1;

  console.log(`📝 Generating test posts: ${publishedCount} published, ${scheduledCount} scheduled, ${draftCount} drafts`);

  const result = await generator.generateTestBlogPosts({
    publishedCount,
    scheduledCount,
    draftCount,
    scheduleTimeOffsets: [2, 5, 10] // 2, 5, 10 minutes from now
  });

  if (result.error) {
    throw new Error(result.error);
  }

  console.log('✅ Successfully generated test posts:');
  console.log(`   📰 Published: ${result.published.length}`);
  console.log(`   ⏰ Scheduled: ${result.scheduled.length}`);
  console.log(`   📝 Drafts: ${result.drafts.length}`);
  console.log(`   📊 Total: ${result.posts.length}`);

  if (result.scheduled.length > 0) {
    console.log('\n⏰ Scheduled posts:');
    result.scheduled.forEach(post => {
      const scheduledTime = new Date(post.publishedAt);
      console.log(`   - ${post.title} (${scheduledTime.toLocaleString()})`);
    });
  }
}

async function createImmediatePost(generator, args) {
  const minutesFromNow = parseInt(args[1]) || 2;

  console.log(`⚡ Creating immediate scheduled post for ${minutesFromNow} minutes from now`);

  const post = await generator.createImmediateScheduledPost(minutesFromNow);

  if (!post) {
    throw new Error('Failed to create immediate scheduled post');
  }

  const scheduledTime = new Date(post.publishedAt);
  console.log('✅ Created immediate scheduled post:');
  console.log(`   📰 Title: ${post.title}`);
  console.log(`   🆔 ID: ${post._id}`);
  console.log(`   ⏰ Scheduled for: ${scheduledTime.toLocaleString()}`);
  console.log('\n💡 This post should be automatically published by the scheduler.');
}

async function createComprehensiveDataset(generator) {
  console.log('📊 Creating comprehensive test dataset...');

  const result = await generator.createComprehensiveTestDataset();

  if (result.error) {
    throw new Error(result.error);
  }

  console.log('✅ Created comprehensive test dataset:');
  console.log(`   📰 Published: ${result.summary.published}`);
  console.log(`   ⏰ Scheduled: ${result.summary.scheduled}`);
  console.log(`   📝 Drafts: ${result.summary.drafts}`);
  console.log(`   📊 Total: ${result.summary.totalPosts}`);
}

async function getTestPostsStatus(generator) {
  console.log('📊 Getting test posts status...');

  const result = await generator.getTestPostsStatus();

  if (result.error) {
    throw new Error(result.error);
  }

  if (result.posts.length === 0) {
    console.log('📭 No test posts found.');
    return;
  }

  console.log(`✅ Found ${result.posts.length} test posts:`);
  console.log();

  const published = result.posts.filter(p => p.status === 'published');
  const scheduled = result.posts.filter(p => p.status === 'scheduled');
  const drafts = result.posts.filter(p => p.status === 'draft');

  if (published.length > 0) {
    console.log('📰 Published posts:');
    published.forEach(post => {
      const publishedTime = new Date(post.publishedAt).toLocaleString();
      console.log(`   - ${post.title} (${publishedTime})`);
    });
    console.log();
  }

  if (scheduled.length > 0) {
    console.log('⏰ Scheduled posts:');
    scheduled.forEach(post => {
      const scheduledTime = new Date(post.publishedAt).toLocaleString();
      console.log(`   - ${post.title} (${scheduledTime})`);
    });
    console.log();
  }

  if (drafts.length > 0) {
    console.log('📝 Draft posts:');
    drafts.forEach(post => {
      const createdTime = new Date(post._createdAt).toLocaleString();
      console.log(`   - ${post.title} (created ${createdTime})`);
    });
    console.log();
  }

  console.log('📊 Summary:');
  console.log(`   📰 Published: ${published.length}`);
  console.log(`   ⏰ Scheduled: ${scheduled.length}`);
  console.log(`   📝 Drafts: ${drafts.length}`);
  console.log(`   📊 Total: ${result.posts.length}`);
}

async function cleanupTestPosts(generator) {
  console.log('🧹 Cleaning up test posts...');

  const result = await generator.cleanupTestPosts();

  if (result.error) {
    throw new Error(result.error);
  }

  console.log(`✅ Cleaned up ${result.deletedCount} test posts.`);
}

async function runTestScenario(args) {
  const scenarioType = args[1] || 'endToEnd';

  console.log(`🧪 Running ${scenarioType} test scenario...`);

  let scenario;
  
  switch (scenarioType) {
    case 'endToEnd':
      scenario = BlogTestHelpers.createEndToEndTestScenario();
      break;
    case 'scheduler':
      scenario = BlogTestHelpers.createSchedulerTestScenario();
      break;
    default:
      throw new Error(`Unknown scenario type: ${scenarioType}. Available: endToEnd, scheduler`);
  }

  console.log(`📋 Scenario: ${scenario.name}`);
  console.log(`📝 Description: ${scenario.description}`);
  console.log();

  const result = await BlogTestHelpers.runTestScenario(scenario);

  if (result.success) {
    console.log('✅ Test scenario completed successfully!');
    if (result.posts) {
      console.log(`📊 Created ${result.posts.length} test posts during scenario.`);
    }
  } else {
    console.log('❌ Test scenario failed!');
    if (result.error) {
      console.log(`💥 Error: ${result.error}`);
    }
  }
}

function showHelp() {
  console.log('Blog Test Data Generator Commands:');
  console.log('');
  console.log('📝 generate [published] [scheduled] [drafts]');
  console.log('   Generate test posts with specified counts');
  console.log('   Example: generate 2 3 1');
  console.log('');
  console.log('⚡ immediate [minutes]');
  console.log('   Create a post scheduled for immediate publication');
  console.log('   Example: immediate 2');
  console.log('');
  console.log('📊 comprehensive');
  console.log('   Create a comprehensive test dataset');
  console.log('');
  console.log('📊 status');
  console.log('   Show current status of all test posts');
  console.log('');
  console.log('🧹 cleanup');
  console.log('   Remove all test posts');
  console.log('');
  console.log('🧪 scenario [type]');
  console.log('   Run a test scenario (endToEnd, scheduler)');
  console.log('   Example: scenario scheduler');
  console.log('');
  console.log('❓ help');
  console.log('   Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/test-blog-data-generator.js generate 1 2 1');
  console.log('  node scripts/test-blog-data-generator.js immediate 3');
  console.log('  node scripts/test-blog-data-generator.js status');
  console.log('  node scripts/test-blog-data-generator.js scenario scheduler');
  console.log('  node scripts/test-blog-data-generator.js cleanup');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  generateTestPosts,
  createImmediatePost,
  createComprehensiveDataset,
  getTestPostsStatus,
  cleanupTestPosts,
  runTestScenario
};