#!/usr/bin/env node

/**
 * Blog Automation Test Runner
 * 
 * Script to run comprehensive blog automation tests including:
 * - Blog post creation with different statuses
 * - Scheduler functionality testing
 * - Publication and visibility verification
 * - End-to-end automation scenarios
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(message, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function runCommand(command, description) {
  try {
    log(`\n🚀 ${description}...`, 'blue');
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    if (output.trim()) {
      console.log(output);
    }
    
    logSuccess(`${description} completed successfully`);
    return true;
  } catch (error) {
    logError(`${description} failed`);
    if (error.stdout) {
      console.log('STDOUT:', error.stdout);
    }
    if (error.stderr) {
      console.log('STDERR:', error.stderr);
    }
    return false;
  }
}

async function checkPrerequisites() {
  logHeader('Checking Prerequisites');
  
  try {
    // Check if we're in the right directory
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    require(packageJsonPath);
    logSuccess('Found package.json');
  } catch (error) {
    logError('package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  try {
    // Check if vitest is available
    execSync('npx vitest --version', { stdio: 'pipe' });
    logSuccess('Vitest is available');
  } catch (error) {
    logError('Vitest not found. Please install dependencies first.');
    process.exit(1);
  }

  try {
    // Check if TypeScript is available
    execSync('npx tsc --version', { stdio: 'pipe' });
    logSuccess('TypeScript is available');
  } catch (error) {
    logWarning('TypeScript not found. Some tests may fail.');
  }

  // Check environment variables
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET) {
    logSuccess('Sanity configuration found');
  } else {
    logWarning('Sanity environment variables not found. Integration tests may be skipped.');
  }
}

async function runUnitTests() {
  logHeader('Running Blog Automation Unit Tests');
  
  const testFiles = [
    'test/utils/blog-automation-testing.test.ts',
    'test/utils/blog-test-helpers.test.ts',
    'test/lib/services/blog-test-data-generator.test.ts'
  ];

  let allPassed = true;

  for (const testFile of testFiles) {
    const success = await runCommand(
      `npx vitest run ${testFile} --reporter=verbose`,
      `Running ${testFile}`
    );
    
    if (!success) {
      allPassed = false;
    }
  }

  return allPassed;
}

async function runIntegrationTests() {
  logHeader('Running Blog Automation Integration Tests');
  
  logWarning('Integration tests require a working Sanity connection');
  logInfo('Set VITEST_INTEGRATION=true to enable integration tests');
  
  const integrationEnv = process.env.VITEST_INTEGRATION === 'true';
  
  if (!integrationEnv) {
    logWarning('Integration tests skipped. Set VITEST_INTEGRATION=true to run them.');
    return true;
  }

  const success = await runCommand(
    'VITEST_INTEGRATION=true npx vitest run test/integration/blog-automation-integration.test.ts --reporter=verbose --timeout=600000',
    'Running integration tests'
  );

  return success;
}

async function runEndToEndTests() {
  logHeader('Running End-to-End Blog Automation Tests');
  
  logInfo('This will test the complete blog automation workflow');
  logWarning('This may take several minutes and requires Sanity connection');
  
  // Check if user wants to run E2E tests
  if (process.argv.includes('--skip-e2e')) {
    logWarning('End-to-end tests skipped (--skip-e2e flag provided)');
    return true;
  }

  if (process.env.VITEST_INTEGRATION !== 'true') {
    logWarning('End-to-end tests skipped. Set VITEST_INTEGRATION=true to run them.');
    return true;
  }

  const success = await runCommand(
    'VITEST_INTEGRATION=true npx vitest run test/integration/blog-automation-integration.test.ts --reporter=verbose --timeout=600000 --testNamePattern="End-to-End"',
    'Running end-to-end automation tests'
  );

  return success;
}

async function runTypeChecking() {
  logHeader('Running TypeScript Type Checking');
  
  const success = await runCommand(
    'npx tsc --noEmit --project tsconfig.json',
    'Checking TypeScript types'
  );

  return success;
}

async function generateTestReport() {
  logHeader('Generating Test Report');
  
  const success = await runCommand(
    'npx vitest run test/utils/blog-automation-testing.test.ts test/utils/blog-test-helpers.test.ts --reporter=json --outputFile=test-results.json',
    'Generating test report'
  );

  if (success) {
    logInfo('Test report saved to test-results.json');
  }

  return success;
}

async function main() {
  const startTime = Date.now();
  
  log('🚀 Blog Automation Test Suite', 'bright');
  log('Testing blog content automation system functionality\n', 'cyan');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const skipIntegration = args.includes('--skip-integration');
  const skipE2E = args.includes('--skip-e2e');
  const skipTypeCheck = args.includes('--skip-types');
  const onlyUnit = args.includes('--unit-only');

  let allTestsPassed = true;

  try {
    // Check prerequisites
    await checkPrerequisites();

    // Run type checking
    if (!skipTypeCheck && !onlyUnit) {
      const typeCheckPassed = await runTypeChecking();
      if (!typeCheckPassed) {
        allTestsPassed = false;
        logWarning('Type checking failed, but continuing with tests...');
      }
    }

    // Run unit tests
    const unitTestsPassed = await runUnitTests();
    if (!unitTestsPassed) {
      allTestsPassed = false;
    }

    // Run integration tests
    if (!skipIntegration && !onlyUnit) {
      const integrationTestsPassed = await runIntegrationTests();
      if (!integrationTestsPassed) {
        allTestsPassed = false;
      }
    }

    // Run end-to-end tests
    if (!skipE2E && !onlyUnit) {
      const e2eTestsPassed = await runEndToEndTests();
      if (!e2eTestsPassed) {
        allTestsPassed = false;
      }
    }

    // Generate test report
    if (!onlyUnit) {
      await generateTestReport();
    }

    // Final results
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    logHeader('Test Results Summary');
    
    if (allTestsPassed) {
      logSuccess(`All tests passed! ✨ (${duration}s)`);
      log('\n🎉 Blog automation system is working correctly!', 'green');
    } else {
      logError(`Some tests failed! (${duration}s)`);
      log('\n💥 Please check the test output above for details.', 'red');
      process.exit(1);
    }

  } catch (error) {
    logError('Test suite failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Handle command line help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Blog Automation Test Runner

Usage: node scripts/test-blog-automation.js [options]

Options:
  --help, -h          Show this help message
  --skip-integration  Skip integration tests
  --skip-e2e         Skip end-to-end tests
  --skip-types       Skip TypeScript type checking
  --unit-only        Run only unit tests

Environment Variables:
  VITEST_INTEGRATION=true    Enable integration and E2E tests
  NEXT_PUBLIC_SANITY_PROJECT_ID    Sanity project ID
  NEXT_PUBLIC_SANITY_DATASET       Sanity dataset name

Examples:
  node scripts/test-blog-automation.js                    # Run all tests
  node scripts/test-blog-automation.js --unit-only        # Run only unit tests
  VITEST_INTEGRATION=true node scripts/test-blog-automation.js  # Run with integration tests
`);
  process.exit(0);
}

// Run the test suite
main().catch(error => {
  logError('Unexpected error:');
  console.error(error);
  process.exit(1);
});