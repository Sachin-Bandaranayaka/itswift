# Admin Content Automation - Deployment Guide

## 🚀 Deployment Overview

This guide covers the complete deployment process for the Admin Content Automation system, including environment setup, configuration, and monitoring.

## 📋 Pre-Deployment Checklist

### 1. Environment Requirements
- [ ] Node.js 18+ installed
- [ ] npm 8+ installed
- [ ] Supabase project created
- [ ] API keys obtained for all services

### 2. Service Accounts Setup
- [ ] OpenAI API key
- [ ] Brevo (email service) API key
- [ ] LinkedIn API credentials
- [ ] Twitter/X API credentials
- [ ] Supabase project configured

### 3. Code Preparation
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Database schema deployed

## 🔧 Environment Configuration

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

#### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### OpenAI Configuration
```env
OPENAI_API_KEY=sk-your_openai_api_key
```

#### Email Service (Brevo)
```env
BREVO_API_KEY=xkeysib-your_brevo_api_key
```

#### Social Media APIs
```env
# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

# Twitter/X
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

#### Authentication
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 3. Generate Admin Password Hash
```bash
npm run setup-admin
```

## 🗄️ Database Setup

### 1. Supabase Project Setup
1. Create a new Supabase project
2. Copy the project URL and API keys
3. Run the database migrations

### 2. Database Schema
The database schema is located in `lib/database/schema.sql`. Apply it to your Supabase project:

```sql
-- Run the contents of lib/database/schema.sql in your Supabase SQL editor
```

### 3. Row Level Security (RLS)
Ensure RLS policies are properly configured for data security.

## 🏗️ Build and Deploy

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm run test
```

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm run start
```

## 🔍 Health Checks

### 1. System Health Endpoint
Visit `/api/health` to check system status:

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "database": "connected",
    "openai": "configured",
    "brevo": "configured",
    "linkedin": "configured",
    "twitter": "configured"
  }
}
```

### 2. Integration Dashboard
Access the integration dashboard at `/admin` to monitor all services.

## 📊 Monitoring and Logging

### 1. Application Monitoring
- Health checks at `/api/health`
- Metrics endpoint at `/api/metrics`
- Integration dashboard for real-time status

### 2. Error Logging
- Console logging for development
- Structured logging for production
- Error tracking and alerting

### 3. Performance Monitoring
- Response time tracking
- Database query performance
- API rate limiting monitoring

## 🔒 Security Configuration

### 1. Authentication
- Admin panel protected by NextAuth
- Session management with timeouts
- Role-based access control

### 2. API Security
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure API key storage

### 3. Data Protection
- Supabase RLS policies
- Encrypted sensitive data
- HTTPS enforcement

## 🚀 Deployment Platforms

### Vercel Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic builds

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Server Deployment
1. Set up Node.js environment
2. Configure reverse proxy (nginx)
3. Set up process manager (PM2)
4. Configure SSL certificates

## 🔄 Maintenance

### 1. Regular Tasks
- Monitor system health
- Update dependencies
- Backup database
- Review logs

### 2. Scaling Considerations
- Database connection pooling
- CDN for static assets
- Load balancing for high traffic
- Caching strategies

### 3. Updates and Patches
- Test in staging environment
- Deploy during low-traffic periods
- Monitor post-deployment
- Rollback plan ready

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://your-project.supabase.co/rest/v1/
```

#### 2. API Integration Failures
- Verify API keys are correct
- Check rate limits
- Review API documentation for changes

#### 3. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

#### 4. Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check admin credentials
- Review session configuration

### Support Contacts
- Technical issues: Check logs and health dashboard
- API issues: Refer to service documentation
- Database issues: Check Supabase dashboard

## 📈 Performance Optimization

### 1. Frontend Optimization
- Image optimization
- Code splitting
- Bundle analysis
- Caching strategies

### 2. Backend Optimization
- Database query optimization
- API response caching
- Connection pooling
- Background job processing

### 3. Monitoring Tools
- Performance metrics
- Error tracking
- User analytics
- System resource monitoring

## 🔄 Backup and Recovery

### 1. Database Backups
- Automated Supabase backups
- Manual backup procedures
- Recovery testing

### 2. Configuration Backups
- Environment variables
- API configurations
- Deployment settings

### 3. Disaster Recovery
- Recovery procedures
- Data restoration
- Service failover

## 📞 Support and Maintenance

### 1. Documentation
- API documentation
- User guides
- Troubleshooting guides

### 2. Monitoring
- 24/7 health monitoring
- Alert notifications
- Performance tracking

### 3. Updates
- Security patches
- Feature updates
- Dependency updates

---

## Quick Start Commands

```bash
# Setup
npm install
cp .env.example .env.local
# Edit .env.local with your values

# Development
npm run dev

# Testing
npm run test

# Production Build
npm run build
npm run start

# Health Check
curl http://localhost:3000/api/health

# Integration Check
npm run deploy:check
```

For additional support, refer to the troubleshooting section or check the integration dashboard at `/admin`.