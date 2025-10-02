# Social Media Integration Setup

This document explains how to set up and configure the social media integration for LinkedIn and Twitter/X posting.

## Overview

The social media integration allows you to:
- Create and schedule posts for LinkedIn and Twitter/X
- Automatically publish scheduled posts
- Track engagement metrics
- Manage posts through a unified interface
- Use AI-powered optimal timing suggestions
- Bulk schedule multiple posts

## Prerequisites

1. LinkedIn Developer Account and App
2. Twitter/X Developer Account and App
3. Environment variables configured
4. Supabase database set up

## LinkedIn Setup

### 1. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Fill in the required information:
   - App name: Your app name
   - LinkedIn Page: Your company page (or personal profile)
   - Privacy policy URL: Your privacy policy
   - App logo: Upload a logo
4. In the "Products" tab, request access to:
   - Share on LinkedIn
   - Sign In with LinkedIn
5. In the "Auth" tab, add redirect URLs:
   - `http://localhost:3000/api/auth/linkedin/callback` (development)
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)

### 2. Get LinkedIn Credentials

From your LinkedIn app dashboard:
- Client ID
- Client Secret

### 3. Get Access Token

You'll need to implement OAuth flow or use LinkedIn's tools to get an access token with the following scopes:
- `w_member_social` (to post content)
- `r_liteprofile` (to read profile info)

## Twitter/X Setup

### 1. Create Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. Configure app permissions:
   - Read and Write (to post tweets)
   - Direct Messages (optional)

### 2. Get Twitter Credentials

From your Twitter app dashboard:
- API Key (Consumer Key)
- API Secret (Consumer Secret)
- Access Token
- Access Token Secret
- Bearer Token (for API v2)

## Environment Variables

Add the following to your `.env.local` file:

```env
# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback

# Twitter/X API Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

## Database Setup

The social media integration uses the following Supabase tables:
- `social_posts` - Stores social media posts
- `content_analytics` - Stores engagement metrics

These should already be created if you followed the main setup instructions.

## Scheduled Posts Processing

### Automatic Processing (Recommended)

Set up a cron job to automatically process scheduled posts:

```bash
# Edit crontab
crontab -e

# Add this line to check every 5 minutes
*/5 * * * * /usr/bin/node /path/to/your/app/scripts/process-scheduled-posts.js

# Or every 15 minutes for less frequent checking
*/15 * * * * /usr/bin/node /path/to/your/app/scripts/process-scheduled-posts.js
```

### Manual Processing

You can also manually trigger scheduled post processing:

```bash
# Run the script directly
node scripts/process-scheduled-posts.js

# Or via API call
curl -X POST http://localhost:3000/api/admin/social/process-scheduled
```

## Usage

### 1. Check API Status

Go to the Social Media > Settings tab in the admin panel to verify your API connections are working.

### 2. Create Posts

- Use the "New Post" button to create individual posts
- Use the "Bulk Schedule" feature for multiple posts
- Set scheduling times or save as drafts

### 3. Manage Posts

- View all posts in the Posts tab
- Use the Calendar tab to see scheduled posts visually
- Check Optimal Timing suggestions for best posting times

### 4. Publishing

Posts can be published:
- Automatically when scheduled time arrives (via cron job)
- Manually using the "Publish Now" option
- In bulk using the bulk actions

## API Endpoints

The integration provides several API endpoints:

- `POST /api/admin/social/publish` - Publish a single post
- `PUT /api/admin/social/publish` - Batch publish multiple posts
- `GET /api/admin/social/status` - Check API status and token validity
- `POST /api/admin/social/status` - Update engagement metrics
- `GET /api/admin/social/process-scheduled` - Check scheduled posts
- `POST /api/admin/social/process-scheduled` - Process scheduled posts

## Troubleshooting

### Common Issues

1. **"API not configured" error**
   - Check that all required environment variables are set
   - Restart the application after updating environment variables

2. **"Token validation failed" error**
   - Verify your access tokens are valid and not expired
   - Check that your app has the required permissions
   - For LinkedIn, ensure your access token has `w_member_social` scope
   - For Twitter, ensure your tokens have read/write permissions

3. **Posts not publishing automatically**
   - Verify the cron job is set up correctly
   - Check the cron job logs for errors
   - Ensure the application is running and accessible

4. **Rate limiting errors**
   - LinkedIn: 100 posts per day per user
   - Twitter: Various limits depending on API tier
   - The system includes retry logic and delays to handle rate limits

### Debugging

1. Check the API status in the admin panel
2. Look at server logs for detailed error messages
3. Test API connections manually using the status endpoint
4. Verify database connectivity and table structure

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Access Tokens**: Store securely and rotate regularly
3. **Rate Limiting**: Respect platform rate limits to avoid suspension
4. **Content Validation**: The system includes basic content validation
5. **Error Handling**: Failed posts are marked as failed rather than retried indefinitely

## Limitations

1. **Media Upload**: Currently supports media URLs, not direct file uploads
2. **LinkedIn**: Limited post analytics compared to native LinkedIn tools
3. **Twitter**: Some advanced features require higher API tiers
4. **Real-time**: Metrics updates are not real-time, updated periodically

## Support

For issues with the social media integration:
1. Check this documentation
2. Verify your API credentials and permissions
3. Check the application logs
4. Test with the provided API endpoints
5. Consult the LinkedIn and Twitter API documentation for platform-specific issues