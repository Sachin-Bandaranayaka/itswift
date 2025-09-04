# Blog Scheduler API Endpoints

This document describes the blog scheduler API endpoints that allow administrators to manage and monitor scheduled blog posts.

## Authentication

All endpoints require admin authentication. Requests must include valid admin session tokens.

## Endpoints

### GET /api/admin/blog/scheduled

Retrieves all scheduled blog posts along with scheduler statistics and queue information.

**Authentication:** Required (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "scheduledPosts": [
      {
        "_id": "post-id",
        "title": "Post Title",
        "slug": { "current": "post-slug" },
        "publishedAt": "2024-12-10T10:00:00Z",
        "status": "scheduled",
        "author": {
          "_id": "author-id",
          "name": "Author Name"
        },
        "categories": [
          {
            "_id": "category-id",
            "title": "Category Name"
          }
        ]
      }
    ],
    "count": 1,
    "statistics": {
      "totalScheduled": 5,
      "readyToProcess": 2,
      "inQueue": 1,
      "processing": false,
      "failed": 0,
      "lastRun": "2024-12-09T12:00:00.000Z",
      "nextRun": "2024-12-09T12:05:00.000Z",
      "errors": []
    },
    "queue": {
      "size": 1,
      "items": [
        {
          "id": "post-id",
          "type": "blog",
          "retryCount": 0,
          "maxRetries": 3,
          "nextRetry": "2024-12-09T12:00:00.000Z",
          "lastError": null
        }
      ]
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch scheduled blog posts",
  "message": "Detailed error message"
}
```

### POST /api/admin/blog/process-scheduled

Manually triggers processing of all scheduled blog posts that are ready for publication.

**Authentication:** Required (Admin)

**Request Body:** None required

**Response:**
```json
{
  "success": true,
  "message": "Processed 3 blog posts",
  "data": {
    "processed": 3,
    "successful": 2,
    "failed": 1,
    "publishedPosts": ["post-id-1", "post-id-2"],
    "errors": [
      "Failed to publish post-id-3: Network error"
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to process scheduled blog posts",
  "message": "Detailed error message"
}
```

## Usage Examples

### Fetch Scheduled Posts

```javascript
const response = await fetch('/api/admin/blog/scheduled', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-admin-token'
  }
})

const data = await response.json()
if (data.success) {
  console.log(`Found ${data.data.count} scheduled posts`)
  console.log('Scheduler statistics:', data.data.statistics)
}
```

### Process Scheduled Posts

```javascript
const response = await fetch('/api/admin/blog/process-scheduled', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-admin-token',
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
if (data.success) {
  console.log(`Successfully processed ${data.data.successful} posts`)
  if (data.data.errors.length > 0) {
    console.warn('Processing errors:', data.data.errors)
  }
}
```

## Error Handling

The endpoints implement comprehensive error handling:

1. **Authentication Errors (401)**: Returned when the request lacks valid admin authentication
2. **Server Errors (500)**: Returned when there are issues with the scheduler service or database
3. **Method Not Allowed (405)**: Returned when using incorrect HTTP methods

## Rate Limiting

These endpoints are protected by standard admin API rate limiting to prevent abuse.

## Monitoring

The endpoints provide detailed statistics and error information to help monitor the health of the blog scheduling system:

- **Processing Statistics**: Track successful and failed processing attempts
- **Queue Information**: Monitor the current state of the processing queue
- **Error Tracking**: Collect and report processing errors for debugging
- **Timing Information**: Track when the scheduler last ran and when it's scheduled to run next

## Integration with Cron Jobs

These endpoints are designed to work with automated cron jobs:

- The `process-scheduled` endpoint can be called by cron jobs to automatically publish scheduled posts
- The `scheduled` endpoint can be used for monitoring and health checks
- Both endpoints provide detailed logging and error reporting for operational monitoring