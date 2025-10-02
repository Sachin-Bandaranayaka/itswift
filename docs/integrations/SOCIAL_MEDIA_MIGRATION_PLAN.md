# Social Media Integration Migration Plan

## Current State
- Custom LinkedIn and Twitter API integration
- Complex OAuth flow management
- Manual token refresh handling
- Custom scheduling system
- Rate limiting management

## ❌ Buffer API - Not Available
**Issue**: Buffer no longer supports creation of new developer apps.

## ✅ Recommended Alternatives

### Option 1: Ayrshare API ⭐ (BEST CHOICE)
- **Cost**: $20/month for 1,000 posts, $50/month for 5,000 posts
- **Pros**: 
  - Developer-friendly API designed for apps like yours
  - Simple REST API, no OAuth complexity
  - Supports LinkedIn, Twitter, Facebook, Instagram, YouTube, TikTok
  - Built-in scheduling, analytics, and media upload
  - Great documentation and support
  - Free tier: 5 posts/month for testing
- **Cons**: Newer service (but growing fast)
- **Best for**: Developers building social media features

### Option 2: Hootsuite API
- **Pros**: Robust API, good documentation, handles OAuth
- **Cons**: More expensive ($99/month minimum for API access)
- **Best for**: Enterprise solutions

### Option 3: Social Pilot API
- **Pros**: Affordable ($30/month), good features
- **Cons**: Smaller platform, less robust
- **Best for**: Budget-conscious solutions

### Option 4: Keep Custom Implementation but Simplify
- **Pros**: Full control, no monthly fees
- **Cons**: More maintenance required
- **Best for**: Technical teams who want control

### Migration Steps

#### 1. Set Up Buffer Account
1. Create Buffer account at buffer.com
2. Connect your LinkedIn and Twitter accounts
3. Get API access token from Buffer dashboard
4. Note your profile IDs for each connected account

#### 2. Replace Custom Implementation
Instead of managing:
- OAuth flows
- Token refresh
- Rate limiting
- Direct platform APIs

You'll just use Buffer's simple API:
```javascript
// Old way (complex)
const linkedinAPI = createLinkedInAPI()
await linkedinAPI.post(content, scheduledTime)

// New way (simple)
await fetch('https://api.bufferapp.com/1/updates/create.json', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${BUFFER_TOKEN}` },
  body: JSON.stringify({
    text: content,
    profile_ids: [linkedinProfileId, twitterProfileId],
    scheduled_at: scheduledTime
  })
})
```

#### 3. Environment Variables
Replace current social media env vars with:
```env
# Replace all LinkedIn/Twitter vars with:
BUFFER_ACCESS_TOKEN=your_buffer_token
BUFFER_LINKEDIN_PROFILE_ID=your_linkedin_profile_id
BUFFER_TWITTER_PROFILE_ID=your_twitter_profile_id
```

#### 4. Update Database Schema
Keep your existing `social_posts` table but simplify:
- Remove platform-specific token fields
- Add `buffer_update_id` for tracking
- Keep scheduling and status fields

#### 5. Simplified API Endpoints
Replace complex social me