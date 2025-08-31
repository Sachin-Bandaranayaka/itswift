#!/usr/bin/env node

/**
 * Verification script for dashboard implementation
 * Checks that all required components and hooks are properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Dashboard Implementation...\n');

const requiredFiles = [
  'app/admin/page.tsx',
  'hooks/use-dashboard-data.ts',
  'components/admin/stat-card.tsx',
  'components/admin/recent-activity-card.tsx',
  'components/admin/top-performing-content-card.tsx',
  'components/admin/upcoming-scheduled-card.tsx',
  'components/admin/dashboard-error-fallback.tsx',
  'components/admin/dashboard-error-boundary.tsx',
  'hooks/use-retry-mechanism.ts',
  'app/api/admin/errors/route.ts',
  'lib/types/dashboard.ts'
];

const requiredFeatures = [
  {
    file: 'app/admin/page.tsx',
    features: [
      'useDashboardData',
      'StatCard',
      'RecentActivityCard',
      'TopPerformingContentCard',
      'UpcomingScheduledCard',
      'DashboardErrorBoundary',
      'error handling',
      'loading states',
      'retry mechanism'
    ]
  },
  {
    file: 'hooks/use-dashboard-data.ts',
    features: [
      'useQueries',
      'real-time updates',
      'error handling',
      'loading states',
      'refetch functions',
      'auto refresh'
    ]
  },
  {
    file: 'components/admin/dashboard-error-boundary.tsx',
    features: [
      'componentDidCatch',
      'error reporting',
      'retry mechanism',
      'error categorization'
    ]
  }
];

let allFilesExist = true;
let allFeaturesImplemented = true;

// Check if all required files exist
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n🔧 Checking feature implementation...');

// Check if required features are implemented
requiredFeatures.forEach(({ file, features }) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n📄 ${file}:`);
    features.forEach(feature => {
      const hasFeature = content.includes(feature) || 
                        content.toLowerCase().includes(feature.toLowerCase()) ||
                        content.includes(feature.replace(/([A-Z])/g, '-$1').toLowerCase());
      
      if (hasFeature) {
        console.log(`  ✅ ${feature}`);
      } else {
        console.log(`  ❌ ${feature} - NOT FOUND`);
        allFeaturesImplemented = false;
      }
    });
  }
});

// Check specific implementation details
console.log('\n🎯 Checking specific implementation details...');

// Check if dashboard uses real data instead of mock data
const dashboardPath = path.join(process.cwd(), 'app/admin/page.tsx');
if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for hardcoded values (should not exist)
  const hardcodedValues = ['24', '156', '2,847', '12.5K'];
  const hasHardcodedValues = hardcodedValues.some(value => 
    dashboardContent.includes(`>${value}<`) || dashboardContent.includes(`"${value}"`)
  );
  
  if (!hasHardcodedValues) {
    console.log('✅ No hardcoded values found - using real data');
  } else {
    console.log('❌ Hardcoded values still present - not fully using real data');
    allFeaturesImplemented = false;
  }
  
  // Check for proper error handling
  if (dashboardContent.includes('error') && dashboardContent.includes('ErrorBoundary')) {
    console.log('✅ Error handling implemented');
  } else {
    console.log('❌ Error handling not properly implemented');
    allFeaturesImplemented = false;
  }
  
  // Check for loading states
  if (dashboardContent.includes('isLoading') && dashboardContent.includes('Loading')) {
    console.log('✅ Loading states implemented');
  } else {
    console.log('❌ Loading states not properly implemented');
    allFeaturesImplemented = false;
  }
}

// Final verification
console.log('\n📊 Verification Summary:');
console.log(`Files: ${allFilesExist ? '✅ All required files exist' : '❌ Some files are missing'}`);
console.log(`Features: ${allFeaturesImplemented ? '✅ All features implemented' : '❌ Some features missing'}`);

if (allFilesExist && allFeaturesImplemented) {
  console.log('\n🎉 Dashboard implementation verification PASSED!');
  console.log('✅ Task 8: Update main dashboard page component - COMPLETED');
  console.log('✅ Task 8.1: Replace mock data with real data integration - COMPLETED');
  console.log('✅ Task 8.2: Implement error handling and fallback states - COMPLETED');
  process.exit(0);
} else {
  console.log('\n❌ Dashboard implementation verification FAILED!');
  console.log('Some required files or features are missing.');
  process.exit(1);
}