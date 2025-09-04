/**
 * Blog Automation Test Configuration
 * 
 * Configuration settings for blog automation testing utilities.
 * Defines test parameters, timeouts, and environment-specific settings.
 */

export interface BlogAutomationTestConfig {
  // Test timeouts (in milliseconds)
  timeouts: {
    postCreation: number;
    schedulerTest: number;
    visibilityCheck: number;
    endToEndTest: number;
    integrationTest: number;
  };

  // Test data settings
  testData: {
    defaultPublishedCount: number;
    defaultScheduledCount: number;
    defaultDraftCount: number;
    scheduleOffsetMinutes: number[];
    maxTestPosts: number;
  };

  // Scheduler test settings
  scheduler: {
    verificationIntervalMs: number;
    maxRetries: number;
    immediateScheduleMinutes: number[];
  };

  // Environment settings
  environment: {
    isIntegrationEnabled: boolean;
    isE2EEnabled: boolean;
    sanityProjectId?: string;
    sanityDataset?: string;
  };

  // Test scenarios
  scenarios: {
    comprehensive: {
      enabled: boolean;
      publishedCount: number;
      scheduledCount: number;
      draftCount: number;
    };
    scheduler: {
      enabled: boolean;
      immediatePostCount: number;
      scheduleOffsetMinutes: number[];
    };
    performance: {
      enabled: boolean;
      largeDatasetSize: number;
    };
  };
}

// Default configuration
export const defaultBlogAutomationTestConfig: BlogAutomationTestConfig = {
  timeouts: {
    postCreation: 30000,      // 30 seconds
    schedulerTest: 300000,    // 5 minutes
    visibilityCheck: 15000,   // 15 seconds
    endToEndTest: 600000,     // 10 minutes
    integrationTest: 420000   // 7 minutes
  },

  testData: {
    defaultPublishedCount: 2,
    defaultScheduledCount: 2,
    defaultDraftCount: 1,
    scheduleOffsetMinutes: [1, 2, 5, 10],
    maxTestPosts: 50
  },

  scheduler: {
    verificationIntervalMs: 10000,  // 10 seconds
    maxRetries: 3,
    immediateScheduleMinutes: [1, 2, 3]
  },

  environment: {
    isIntegrationEnabled: process.env.VITEST_INTEGRATION === 'true',
    isE2EEnabled: process.env.VITEST_E2E === 'true',
    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET
  },

  scenarios: {
    comprehensive: {
      enabled: true,
      publishedCount: 3,
      scheduledCount: 3,
      draftCount: 2
    },
    scheduler: {
      enabled: true,
      immediatePostCount: 2,
      scheduleOffsetMinutes: [1, 2]
    },
    performance: {
      enabled: false, // Disabled by default
      largeDatasetSize: 20
    }
  }
};

// Test environment detection
export function getTestEnvironment(): 'unit' | 'integration' | 'e2e' {
  if (process.env.VITEST_E2E === 'true') {
    return 'e2e';
  } else if (process.env.VITEST_INTEGRATION === 'true') {
    return 'integration';
  } else {
    return 'unit';
  }
}

// Configuration validation
export function validateTestConfig(config: BlogAutomationTestConfig): string[] {
  const errors: string[] = [];

  // Validate timeouts
  if (config.timeouts.postCreation <= 0) {
    errors.push('Post creation timeout must be positive');
  }

  if (config.timeouts.schedulerTest <= 0) {
    errors.push('Scheduler test timeout must be positive');
  }

  // Validate test data settings
  if (config.testData.defaultPublishedCount < 0) {
    errors.push('Default published count cannot be negative');
  }

  if (config.testData.defaultScheduledCount < 0) {
    errors.push('Default scheduled count cannot be negative');
  }

  if (config.testData.defaultDraftCount < 0) {
    errors.push('Default draft count cannot be negative');
  }

  if (config.testData.scheduleOffsetMinutes.length === 0) {
    errors.push('Schedule offset minutes array cannot be empty');
  }

  if (config.testData.scheduleOffsetMinutes.some(offset => offset <= 0)) {
    errors.push('All schedule offset minutes must be positive');
  }

  // Validate scheduler settings
  if (config.scheduler.verificationIntervalMs <= 0) {
    errors.push('Verification interval must be positive');
  }

  if (config.scheduler.maxRetries < 0) {
    errors.push('Max retries cannot be negative');
  }

  // Validate environment settings for integration tests
  if (config.environment.isIntegrationEnabled) {
    if (!config.environment.sanityProjectId) {
      errors.push('Sanity project ID required for integration tests');
    }

    if (!config.environment.sanityDataset) {
      errors.push('Sanity dataset required for integration tests');
    }
  }

  return errors;
}

// Get configuration with environment overrides
export function getBlogAutomationTestConfig(): BlogAutomationTestConfig {
  const config = { ...defaultBlogAutomationTestConfig };

  // Apply environment-specific overrides
  const environment = getTestEnvironment();

  switch (environment) {
    case 'integration':
      // Longer timeouts for integration tests
      config.timeouts.schedulerTest = 420000; // 7 minutes
      config.timeouts.endToEndTest = 600000;  // 10 minutes
      break;

    case 'e2e':
      // Even longer timeouts for E2E tests
      config.timeouts.schedulerTest = 600000;  // 10 minutes
      config.timeouts.endToEndTest = 900000;   // 15 minutes
      config.scenarios.performance.enabled = true;
      break;

    case 'unit':
    default:
      // Shorter timeouts for unit tests
      config.timeouts.postCreation = 15000;   // 15 seconds
      config.timeouts.visibilityCheck = 10000; // 10 seconds
      break;
  }

  // Validate the final configuration
  const errors = validateTestConfig(config);
  if (errors.length > 0) {
    throw new Error(`Invalid test configuration: ${errors.join(', ')}`);
  }

  return config;
}

// Test utilities for configuration
export class TestConfigHelper {
  private static config: BlogAutomationTestConfig;

  static getConfig(): BlogAutomationTestConfig {
    if (!this.config) {
      this.config = getBlogAutomationTestConfig();
    }
    return this.config;
  }

  static isIntegrationTest(): boolean {
    return this.getConfig().environment.isIntegrationEnabled;
  }

  static isE2ETest(): boolean {
    return this.getConfig().environment.isE2EEnabled;
  }

  static getTimeout(type: keyof BlogAutomationTestConfig['timeouts']): number {
    return this.getConfig().timeouts[type];
  }

  static getTestDataConfig(): BlogAutomationTestConfig['testData'] {
    return this.getConfig().testData;
  }

  static getSchedulerConfig(): BlogAutomationTestConfig['scheduler'] {
    return this.getConfig().scheduler;
  }

  static getScenarioConfig(scenario: keyof BlogAutomationTestConfig['scenarios']): any {
    return this.getConfig().scenarios[scenario];
  }

  static shouldSkipTest(testType: 'integration' | 'e2e'): boolean {
    const config = this.getConfig();
    
    switch (testType) {
      case 'integration':
        return !config.environment.isIntegrationEnabled;
      case 'e2e':
        return !config.environment.isE2EEnabled;
      default:
        return false;
    }
  }

  static logTestEnvironment(): void {
    const config = this.getConfig();
    const environment = getTestEnvironment();
    
    console.log(`🔧 Test Environment: ${environment}`);
    console.log(`📊 Integration Tests: ${config.environment.isIntegrationEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`🎯 E2E Tests: ${config.environment.isE2EEnabled ? 'Enabled' : 'Disabled'}`);
    
    if (config.environment.isIntegrationEnabled) {
      console.log(`🗄️  Sanity Project: ${config.environment.sanityProjectId || 'Not configured'}`);
      console.log(`📁 Sanity Dataset: ${config.environment.sanityDataset || 'Not configured'}`);
    }
  }
}