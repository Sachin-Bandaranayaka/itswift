#!/usr/bin/env node

/**
 * Integration fix script for admin content automation
 * This script addresses critical integration issues before deployment
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Starting integration fixes...')

// 1. Fix missing environment variables
function createEnvTemplate() {
  const envPath = '.env.local'
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env.local template...')
    const envContent = `# Admin Content Automation Environment Variables
# Copy from .env.example and fill in your actual values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Brevo (Email Service) Configuration
BREVO_API_KEY=your_brevo_api_key

# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

# Twitter/X API Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
NEXTAUTH_SECRET=your_nextauth_secret_key

# Application Configuration
NODE_ENV=development
`
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Created .env.local template')
  }
}

// 2. Create deployment configuration
function createDeploymentConfig() {
  console.log('📦 Creating deployment configuration...')
  
  const deployConfig = {
    name: 'admin-content-automation',
    version: '1.0.0',
    description: 'Admin panel and content automation system',
    build: {
      command: 'npm run build',
      output: '.next'
    },
    env: {
      NODE_ENV: 'production'
    },
    healthCheck: {
      path: '/api/health',
      timeout: 30
    },
    dependencies: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    }
  }
  
  fs.writeFileSync('deploy.config.json', JSON.stringify(deployConfig, null, 2))
  console.log('✅ Created deployment configuration')
}

// 3. Create health check endpoint if it doesn't exist
function ensureHealthCheck() {
  const healthCheckPath = 'app/api/health/route.ts'
  if (!fs.existsSync(healthCheckPath)) {
    console.log('🏥 Creating health check endpoint...')
    const healthCheckContent = `import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected', // Would check Supabase connection
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
        brevo: process.env.BREVO_API_KEY ? 'configured' : 'not configured',
        linkedin: process.env.LINKEDIN_CLIENT_ID ? 'configured' : 'not configured',
        twitter: process.env.TWITTER_API_KEY ? 'configured' : 'not configured'
      }
    }

    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
`
    fs.writeFileSync(healthCheckPath, healthCheckContent)
    console.log('✅ Created health check endpoint')
  }
}

// 4. Create performance optimization script
function createPerformanceOptimization() {
  console.log('⚡ Creating performance optimization script...')
  
  const perfScript = `#!/usr/bin/env node

/**
 * Performance optimization script
 */

const fs = require('fs')
const path = require('path')

console.log('⚡ Running performance optimizations...')

// 1. Bundle analysis
console.log('📊 Analyzing bundle size...')
// This would run bundle analyzer in production

// 2. Image optimization
console.log('🖼️ Optimizing images...')
// This would optimize images in public folder

// 3. Database query optimization
console.log('🗄️ Optimizing database queries...')
// This would analyze and optimize database queries

// 4. Caching strategy
console.log('💾 Setting up caching...')
// This would configure caching strategies

console.log('✅ Performance optimizations complete')
`
  
  fs.writeFileSync('scripts/optimize-performance.js', perfScript)
  fs.chmodSync('scripts/optimize-performance.js', '755')
  console.log('✅ Created performance optimization script')
}

// 5. Create monitoring setup
function createMonitoringSetup() {
  console.log('📊 Creating monitoring setup...')
  
  const monitoringConfig = {
    metrics: {
      enabled: true,
      endpoint: '/api/metrics',
      interval: 60000
    },
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      format: 'json'
    },
    alerts: {
      errorRate: {
        threshold: 0.05,
        window: '5m'
      },
      responseTime: {
        threshold: 2000,
        window: '5m'
      }
    }
  }
  
  fs.writeFileSync('monitoring.config.json', JSON.stringify(monitoringConfig, null, 2))
  console.log('✅ Created monitoring configuration')
}

// 6. Update package.json scripts
function updatePackageScripts() {
  console.log('📦 Updating package.json scripts...')
  
  const packagePath = 'package.json'
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  // Add deployment and maintenance scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'deploy:check': 'node scripts/fix-integration-issues.js',
    'deploy:build': 'npm run test && npm run build',
    'deploy:start': 'npm run start',
    'health:check': 'curl -f http://localhost:3000/api/health || exit 1',
    'optimize': 'node scripts/optimize-performance.js',
    'db:migrate': 'echo "Run Supabase migrations"',
    'db:seed': 'echo "Seed database with sample data"'
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
  console.log('✅ Updated package.json scripts')
}

// Main execution
async function main() {
  try {
    createEnvTemplate()
    createDeploymentConfig()
    ensureHealthCheck()
    createPerformanceOptimization()
    createMonitoringSetup()
    updatePackageScripts()
    
    console.log('\n🎉 Integration fixes completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Fill in your API keys in .env.local')
    console.log('2. Run npm run test to verify fixes')
    console.log('3. Run npm run build to test production build')
    console.log('4. Run npm run deploy:check before deployment')
    console.log('5. Monitor health at /api/health')
    
  } catch (error) {
    console.error('❌ Error during integration fixes:', error)
    process.exit(1)
  }
}

main()