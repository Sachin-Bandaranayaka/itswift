# Social Media API Setup Guide

This guide will walk you through obtaining the necessary API credentials for LinkedIn and Twitter/X integration in your content automation system.

## Prerequisites

Before starting, ensure you have:
- A LinkedIn business account
- A Twitter/X account
- Administrative access to create developer applications

## LinkedIn API Setup

### Step 1: Access LinkedIn Developer Portal
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click "Create App" in the top right corner

### Step 2: Create Your LinkedIn Application
1. **App Name**: Enter a descriptive name for your application
2. **LinkedIn Page**: Select your company's LinkedIn page (required)
3. **App Logo**: Upload your company logo (optional but recommended)
4. **Legal Agreement**: Accept the LinkedIn API Terms of Use
5. Click "Create App"

### Step 3: Configure App Settings
1. In your app dashboard, go to the "Auth" tab
2. **Authorized Redirect URLs**: Add your application's callback URL
   - For development: `http://localhost:3000/api/auth/linkedin/callback`
   - For production: `https://yourdomain.com/api/auth/linkedin/callback`

### Step 4: Request API Products
1. Go to the "Products" tab in your app dashboard
2. Request access to:
   - **Share on LinkedIn**: For posting content
   - **Sign In with LinkedIn**: For authentication
3. Fill out the use case form explaining your content automation needs
4. Wait for approval (usually 1-7 business days)

### Step 5: Get Your Credentials
Once approved:
1. Go to the "Auth" tab
2. Copy your **Client ID** and **Client Secret**
3. Add these to your `.env.local` file:
   ```
   LINKEDIN_CLIENT_ID=your_actual_client_id_here
   LINKEDIN_CLIENT_SECRET=your_actual_client_secret_here
   ```

## Twitter/X API Setup

### Step 1: Access Twitter Developer Portal
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter/X account
3. Apply for a developer account if you don't have one

### Step 2: Create a New Project and App
1. Click "Create Project"
2. **Project Name**: Enter a descriptive name
3. **Use Case**: Select "Making a bot" or "Exploring the API"
4. **Project Description**: Describe your content automation system
5. **App Name**: Create a unique app name
6. **App Environment**: Choose "Development" initially

### Step 3: Generate API Keys
1. After creating the app, you'll see your API keys
2. **IMPORTANT**: Copy and save these immediately as they won't be shown again:
   - API Key (Consumer Key)
   - API Secret Key (Consumer Secret)

### Step 4: Generate Access Tokens
1. In your app dashboard, go to "Keys and Tokens"
2. Under "Access Token and Secret", click "Generate"
3. Copy and save:
   - Access Token
   - Access Token Secret

### Step 5: Configure App Permissions
1. Go to "App Settings" → "User authentication settings"
2. Click "Set up" and configure:
   - **App permissions**: Read and Write
   - **Type of App**: Web App
   - **Callback URI**: `https://yourdomain.com/api/auth/twitter/callback`
   - **Website URL**: Your website URL
3. Save settings

### Step 6: Add Credentials to Environment
Add these to your `.env.local` file:
```
TWITTER_API_KEY=your_actual_api_key_here
TWITTER_API_SECRET=your_actual_api_secret_here
TWITTER_ACCESS_TOKEN=your_actual_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_actual_access_token_secret_here
```

## Important Security Notes

1. **Never commit API keys to version control**
2. **Use environment variables** for all sensitive credentials
3. **Rotate keys regularly** for security
4. **Monitor API usage** to detect unauthorized access
5. **Use HTTPS** for all callback URLs in production

## Rate Limits and Considerations

### LinkedIn API Limits
- **Posts**: 100 posts per day per person
- **Rate limiting**: 500 requests per day for most endpoints
- **Content guidelines**: Must comply with LinkedIn's professional content standards

### Twitter API Limits
- **Tweets**: 300 tweets per 15-minute window
- **API calls**: Varies by endpoint (typically 15-300 requests per 15-minute window)
- **Content guidelines**: Must comply with Twitter's automation rules

## Testing Your Setup

After obtaining all credentials:

1. Update your `.env.local` file with real values
2. Restart your development server
3. Test the social media posting functionality
4. Verify posts appear correctly on both platforms

## Troubleshooting

### Common LinkedIn Issues
- **App not approved**: Ensure your use case clearly explains content automation needs
- **Invalid redirect URI**: Double-check callback URLs match exactly
- **Scope errors**: Verify you have the correct API products approved

### Common Twitter Issues
- **Authentication errors**: Ensure all 4 credentials are correct
- **Permission denied**: Check app permissions are set to "Read and Write"
- **Rate limit exceeded**: Implement proper rate limiting in your application

## Support Resources

- **LinkedIn Developer Support**: [LinkedIn Help Center](https://www.linkedin.com/help/linkedin/answer/a1342443)
- **Twitter Developer Support**: [Twitter Developer Community](https://twittercommunity.com/)

## Next Steps

Once you have all credentials configured:
1. Test posting functionality in development
2. Deploy to production with production callback URLs
3. Monitor API usage and performance
4. Set up proper error handling and logging

---

**Note**: API approval processes can take several days. Plan accordingly and apply for access well before your launch date.