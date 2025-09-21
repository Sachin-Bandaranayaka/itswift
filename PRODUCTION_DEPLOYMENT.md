# Production Deployment Guide

## Environment Variables Required for Production

### Critical Environment Variables

The following environment variables are **required** for production deployment:

#### Authentication & Base URL
```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here
```

**Important**: `NEXTAUTH_URL` must be set to your actual domain in production. This is used for:
- Internal API calls (audit logging, version history)
- Authentication redirects
- Password reset emails

#### Database & External Services
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key

# Social Media (Ayrshare)
AYRSHARE_API_KEY=your-ayrshare-api-key

# LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Twitter
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

# Admin Credentials
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=your-bcrypt-hashed-password
```

## Recent Fixes Applied

### Issue: Internal HTTP Calls Failing in Production

**Problem**: The application was making HTTP calls to `localhost:3000` in production, which fails in serverless environments.

**Solution**: Replaced internal HTTP calls with direct service calls:

1. **Audit Logging**: Created `AuditLogger` service to replace HTTP calls to `/api/admin/blog/audit`
2. **Version History**: Created `VersionHistoryService` to replace HTTP calls to `/api/admin/blog/versions`

### Files Modified:
- `/app/api/admin/blog/status/route.ts` - Fixed audit logging
- `/app/api/admin/blog/bulk/route.ts` - Fixed audit logging for bulk operations
- `/app/api/admin/blog/save/route.ts` - Fixed version history logging
- `/app/api/admin/blog/audit/route.ts` - Updated to use AuditLogger service

### New Services Created:
- `/lib/services/audit-logger.ts` - Centralized audit logging
- `/lib/services/version-history.ts` - Centralized version history
- `/lib/utils/url.ts` - URL utilities for environment detection

## Deployment Checklist

### Before Deployment:
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Verify all required environment variables are set
- [ ] Test the application in a production-like environment
- [ ] Ensure database migrations are applied

### After Deployment:
- [ ] Verify audit logging is working (check `/api/admin/blog/audit`)
- [ ] Test blog post creation/editing
- [ ] Test bulk operations
- [ ] Monitor logs for any remaining localhost errors

## Troubleshooting

### Common Issues:

1. **"fetch failed" errors**: Usually indicates `NEXTAUTH_URL` is not set or incorrect
2. **ECONNREFUSED errors**: Indicates the app is trying to connect to localhost in production
3. **Authentication issues**: Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET`

### Monitoring:
- Check application logs for any remaining localhost references
- Monitor the audit logs to ensure they're being written correctly
- Test all admin functionality after deployment

## Environment-Specific Notes

### Vercel Deployment:
- Set environment variables in the Vercel dashboard
- `NEXTAUTH_URL` should be your Vercel domain (e.g., `https://yourapp.vercel.app`)

### AWS Lambda/Serverless:
- The application now avoids internal HTTP calls in serverless environments
- Ensure all environment variables are properly configured in your deployment platform

### Traditional Server:
- Set environment variables in your server configuration
- `NEXTAUTH_URL` should be your server's domain