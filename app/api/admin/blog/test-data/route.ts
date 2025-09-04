/**
 * Blog Test Data API Endpoint
 * 
 * Provides API endpoints for creating and managing test blog posts
 * for testing the blog content automation system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { BlogTestDataGenerator } from '@/lib/services/blog-test-data-generator';
import { BlogTestHelpers } from '@/test/utils/blog-test-helpers';

const generator = BlogTestDataGenerator.getInstance();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, options } = body;

    switch (action) {
      case 'generate':
        return await handleGenerateTestPosts(options);
      
      case 'immediate':
        return await handleCreateImmediatePost(options);
      
      case 'comprehensive':
        return await handleCreateComprehensiveDataset();
      
      case 'cleanup':
        return await handleCleanupTestPosts();
      
      case 'status':
        return await handleGetTestPostsStatus();
      
      case 'scenario':
        return await handleRunTestScenario(options);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: generate, immediate, comprehensive, cleanup, status, scenario' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in blog test data API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get current test posts status
    const result = await generator.getTestPostsStatus();
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: result.posts,
      summary: {
        total: result.posts.length,
        published: result.posts.filter(p => p.status === 'published').length,
        scheduled: result.posts.filter(p => p.status === 'scheduled').length,
        drafts: result.posts.filter(p => p.status === 'draft').length
      }
    });
  } catch (error) {
    console.error('Error getting test posts status:', error);
    return NextResponse.json(
      { error: 'Failed to get test posts status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleGenerateTestPosts(options: any) {
  const result = await generator.generateTestBlogPosts(options);
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Generated ${result.posts.length} test blog posts`,
    summary: {
      total: result.posts.length,
      published: result.published.length,
      scheduled: result.scheduled.length,
      drafts: result.drafts.length
    },
    posts: result.posts
  });
}

async function handleCreateImmediatePost(options: any) {
  const { minutesFromNow = 2 } = options || {};
  
  const post = await generator.createImmediateScheduledPost(minutesFromNow);
  
  if (!post) {
    return NextResponse.json(
      { error: 'Failed to create immediate scheduled post' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Created immediate scheduled post for ${minutesFromNow} minutes from now`,
    post
  });
}

async function handleCreateComprehensiveDataset() {
  const result = await generator.createComprehensiveTestDataset();
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Created comprehensive test dataset',
    summary: result.summary,
    posts: result.posts
  });
}

async function handleCleanupTestPosts() {
  const result = await generator.cleanupTestPosts();
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Cleaned up ${result.deletedCount} test blog posts`,
    deletedCount: result.deletedCount
  });
}

async function handleGetTestPostsStatus() {
  const result = await generator.getTestPostsStatus();
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    posts: result.posts,
    summary: {
      total: result.posts.length,
      published: result.posts.filter(p => p.status === 'published').length,
      scheduled: result.posts.filter(p => p.status === 'scheduled').length,
      drafts: result.posts.filter(p => p.status === 'draft').length
    }
  });
}

async function handleRunTestScenario(options: any) {
  const { scenarioType = 'endToEnd' } = options || {};
  
  let scenario;
  
  switch (scenarioType) {
    case 'endToEnd':
      scenario = BlogTestHelpers.createEndToEndTestScenario();
      break;
    case 'scheduler':
      scenario = BlogTestHelpers.createSchedulerTestScenario();
      break;
    default:
      return NextResponse.json(
        { error: 'Invalid scenario type. Supported types: endToEnd, scheduler' },
        { status: 400 }
      );
  }

  const result = await BlogTestHelpers.runTestScenario(scenario);
  
  return NextResponse.json({
    success: result.success,
    message: result.success ? 'Test scenario completed successfully' : 'Test scenario failed',
    scenario: scenario.name,
    error: result.error,
    posts: result.posts
  });
}