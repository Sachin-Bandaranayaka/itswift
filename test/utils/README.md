# Blog Automation Testing Utilities

This directory contains comprehensive testing utilities for the blog content automation system. These utilities provide functions for creating test posts, verifying publication and visibility, and running automated test scenarios for scheduler functionality.

## Overview

The blog automation testing utilities address the following requirements:

- **Requirement 2.1**: Create at least 3 sample blog posts with different publication statuses (published, scheduled, draft)
- **Requirement 2.2**: Test posts with past publishedAt dates (immediate publication)
- **Requirement 2.3**: Test posts with future publishedAt dates (scheduled publication)
- **Requirement 2.4**: Verify post publication and visibility through automated testing

## Files Structure

```
test/utils/
├── README.md                           # This file
├── blog-automation-testing.ts          # Main automation testing utilities
├── blog-automation-testing.test.ts     # Unit tests for automation utilities
├── blog-test-helpers.ts                # Helper functions for blog testing
├── blog-test-helpers.test.ts           # Unit tests for test helpers
└── performance-testing.ts              # Performance testing utilities

test/config/
└── blog-automation-test.config.ts      # Test configuration settings

test/integration/
└── blog-automation-integration.test.ts # Integration tests

scripts/
└── test-blog-automation.js             # Test runner script
```

## Core Components

### 1. BlogAutomationTesting Class

The main class providing comprehensive automation testing functionality:

```typescript
import { BlogAutomationTesting } from './blog-automation-testing';

// Test blog post creation with different statuses
const result = await BlogAutomationTesting.testBlogPostCreation({
  publishedCount: 2,
  scheduledCount: 2,
  draftCount: 1,
  verifyVisibility: true
});

// Test scheduler functionality
const schedulerResult = await BlogAutomationTesting.testSchedulerFunctionality({
  immediatePostCount: 2,
  scheduleOffsetMinutes: [1, 2],
  timeoutMs: 300000
});

// Run all automation tests
const allTestsResult = await BlogAutomationTesting.runAllAutomationTests();
```

### 2. BlogTestHelpers Class

Helper utilities for common testing operations:

```typescript
import { BlogTestHelpers } from './blog-test-helpers';

// Create basic test posts
const { published, scheduled, drafts } = await BlogTestHelpers.createBasicTestPosts();

// Verify post visibility
const isVisible = await BlogTestHelpers.verifyPublishedPostsVisible(['post-id-1', 'post-id-2']);

// Wait for posts to be published by scheduler
const publishedSuccessfully = await BlogTestHelpers.waitForPostsToBePublished(
  ['post-id-1', 'post-id-2'],
  300000 // 5 minute timeout
);

// Clean up test posts
const deletedCount = await BlogTestHelpers.cleanupAllTestPosts();
```

### 3. Test Scenarios

Pre-built test scenarios for common testing workflows:

```typescript
// Comprehensive automation test
const comprehensiveScenario = BlogAutomationTesting.createComprehensiveAutomationTestScenario();
const result = await BlogTestHelpers.runTestScenario(comprehensiveScenario);

// Scheduler-specific test
const schedulerScenario = BlogAutomationTesting.createSchedulerAutomationTestScenario();
const schedulerResult = await BlogTestHelpers.runTestScenario(schedulerScenario);
```

## Usage Examples

### Basic Post Creation Testing

```typescript
import { BlogAutomationTesting } from '../utils/blog-automation-testing';

describe('Blog Post Creation', () => {
  it('should create posts with different statuses', async () => {
    const result = await BlogAutomationTesting.testBlogPostCreation({
      publishedCount: 2,    // 2 published posts
      scheduledCount: 1,    // 1 scheduled post
      draftCount: 1,        // 1 draft post
      verifyVisibility: true // Verify visibility rules
    });

    expect(result.success).toBe(true);
    expect(result.details.created.total).toBe(4);
  });
});
```

### Scheduler Functionality Testing

```typescript
import { BlogAutomationTesting } from '../utils/blog-automation-testing';

describe('Scheduler Functionality', () => {
  it('should automatically publish scheduled posts', async () => {
    const result = await BlogAutomationTesting.testSchedulerFunctionality({
      immediatePostCount: 2,           // Create 2 posts for immediate publication
      scheduleOffsetMinutes: [1, 2],   // Schedule for 1 and 2 minutes from now
      timeoutMs: 300000,               // 5 minute timeout
      verificationIntervalMs: 10000    // Check every 10 seconds
    });

    expect(result.success).toBe(true);
    expect(result.details.scheduledPosts).toHaveLength(2);
  }, 360000); // 6 minute test timeout
});
```

### End-to-End Integration Testing

```typescript
import { BlogTestHelpers } from '../utils/blog-test-helpers';
import { BlogAutomationTesting } from '../utils/blog-automation-testing';

describe('End-to-End Blog Automation', () => {
  it('should run comprehensive automation test', async () => {
    const scenario = BlogAutomationTesting.createComprehensiveAutomationTestScenario();
    const result = await BlogTestHelpers.runTestScenario(scenario);

    expect(result.success).toBe(true);
  }, 600000); // 10 minute timeout
});
```

## Running Tests

### Using the Test Runner Script

The easiest way to run all blog automation tests:

```bash
# Run all tests (unit tests only by default)
node scripts/test-blog-automation.js

# Run with integration tests (requires Sanity connection)
VITEST_INTEGRATION=true node scripts/test-blog-automation.js

# Run only unit tests
node scripts/test-blog-automation.js --unit-only

# Skip integration tests
node scripts/test-blog-automation.js --skip-integration

# Skip end-to-end tests
node scripts/test-blog-automation.js --skip-e2e

# Get help
node scripts/test-blog-automation.js --help
```

### Using Vitest Directly

```bash
# Run unit tests
npx vitest run test/utils/blog-automation-testing.test.ts

# Run integration tests (requires Sanity connection)
VITEST_INTEGRATION=true npx vitest run test/integration/blog-automation-integration.test.ts

# Run all blog automation tests
npx vitest run test/utils/blog-automation-testing.test.ts test/utils/blog-test-helpers.test.ts

# Run with watch mode
npx vitest test/utils/blog-automation-testing.test.ts
```

## Configuration

Test configuration is managed through `test/config/blog-automation-test.config.ts`:

```typescript
import { getBlogAutomationTestConfig, TestConfigHelper } from '../config/blog-automation-test.config';

// Get current configuration
const config = getBlogAutomationTestConfig();

// Check if integration tests are enabled
const isIntegration = TestConfigHelper.isIntegrationTest();

// Get timeout for specific test type
const timeout = TestConfigHelper.getTimeout('schedulerTest');

// Get test data configuration
const testDataConfig = TestConfigHelper.getTestDataConfig();
```

### Environment Variables

- `VITEST_INTEGRATION=true` - Enable integration tests
- `VITEST_E2E=true` - Enable end-to-end tests
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID (required for integration tests)
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name (required for integration tests)

## Test Types

### Unit Tests

- Test individual functions and methods
- Mock external dependencies
- Fast execution (< 30 seconds)
- No external service dependencies

### Integration Tests

- Test interaction with Sanity CMS
- Require actual Sanity connection
- Moderate execution time (2-10 minutes)
- Test real data creation and retrieval

### End-to-End Tests

- Test complete automation workflows
- Include scheduler functionality testing
- Long execution time (5-15 minutes)
- Test real-world scenarios

## Test Data Management

### Creating Test Data

```typescript
import { BlogTestDataGenerator } from '@/lib/services/blog-test-data-generator';

const generator = BlogTestDataGenerator.getInstance();

// Create comprehensive test dataset
const result = await generator.createComprehensiveTestDataset();

// Create posts with specific schedule times
const scheduleTimes = [
  new Date(Date.now() + 60000),  // 1 minute from now
  new Date(Date.now() + 120000)  // 2 minutes from now
];
const posts = await generator.createPostsWithScheduleTimes(scheduleTimes);
```

### Cleaning Up Test Data

```typescript
// Clean up all test posts
const deletedCount = await generator.cleanupTestPosts();

// Using helpers
const deletedCount = await BlogTestHelpers.cleanupAllTestPosts();
```

### Monitoring Test Posts

```typescript
// Get status of all test posts
const status = await generator.getTestPostsStatus();

// Using helpers
const status = await BlogTestHelpers.getTestPostsStatus();
```

## Best Practices

### 1. Test Isolation

- Each test should create its own test data
- Clean up test data after each test
- Use unique identifiers for test posts

### 2. Timeout Management

- Use appropriate timeouts for different test types
- Account for scheduler processing time
- Provide meaningful timeout error messages

### 3. Error Handling

- Handle Sanity connection failures gracefully
- Provide clear error messages
- Implement retry mechanisms for flaky operations

### 4. Test Data Naming

- Use descriptive names for test posts
- Include timestamps to avoid conflicts
- Use consistent naming patterns

### 5. Verification

- Always verify post visibility after creation
- Check both positive and negative cases
- Verify scheduler timing accuracy

## Troubleshooting

### Common Issues

1. **Sanity Connection Errors**
   - Verify environment variables are set
   - Check network connectivity
   - Ensure Sanity project permissions

2. **Scheduler Test Timeouts**
   - Increase timeout values for slower environments
   - Check scheduler cron job configuration
   - Verify system clock synchronization

3. **Test Data Cleanup Issues**
   - Run manual cleanup: `await BlogTestHelpers.cleanupAllTestPosts()`
   - Check Sanity Studio for orphaned test posts
   - Verify delete permissions

4. **Flaky Tests**
   - Increase verification intervals
   - Add retry mechanisms
   - Check for race conditions

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=blog-automation:* npm test
```

## Contributing

When adding new test utilities:

1. Follow the existing naming conventions
2. Add comprehensive unit tests
3. Update this README with usage examples
4. Consider integration test requirements
5. Add appropriate error handling

## Related Files

- `lib/services/blog-test-data-generator.ts` - Test data generation service
- `lib/services/blog-post-scheduler.ts` - Blog post scheduler service
- `test/lib/services/blog-data-enhanced.test.ts` - Blog data service tests
- `scripts/process-scheduled-blog-posts.js` - Scheduler processing script