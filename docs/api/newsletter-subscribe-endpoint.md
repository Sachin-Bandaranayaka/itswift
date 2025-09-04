# Newsletter Subscribe API Endpoint

## Overview

The Newsletter Subscribe API endpoint allows users to subscribe to newsletters from the homepage or other frontend applications. It provides comprehensive validation, duplicate handling, and CORS support for frontend integration.

## Endpoint Details

- **URL**: `/api/newsletter/subscribe`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **CORS**: Enabled with wildcard origin support

## Request Format

### Request Body

```json
{
  "email": "user@example.com",           // Required: Valid email address
  "first_name": "John",                  // Optional: First name
  "last_name": "Doe",                    // Optional: Last name
  "source": "homepage"                   // Optional: Subscription source (defaults to "homepage")
}
```

### Required Fields

- `email`: Must be a valid email format

### Optional Fields

- `first_name`: String, max 100 characters
- `last_name`: String, max 100 characters  
- `source`: String, one of: `homepage`, `admin`, `import`, `api` (defaults to `homepage`)

## Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter!",
  "subscriber": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "source": "homepage",
    "subscribed_at": "2024-01-01T12:00:00Z"
  }
}
```

### Already Subscribed Response (200 OK)

```json
{
  "success": true,
  "message": "You are already subscribed to our newsletter!",
  "subscriber": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "status": "active"
  }
}
```

### Reactivation Response (200 OK)

When a previously unsubscribed user subscribes again:

```json
{
  "success": true,
  "message": "Welcome back! Your newsletter subscription has been reactivated.",
  "subscriber": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "source": "homepage"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Email is required",
  "code": "VALIDATION_ERROR"
}
```

### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "Invalid email format"
  ]
}
```

### Server Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## CORS Support

The endpoint includes full CORS support for frontend integration:

### CORS Headers

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Max-Age: 86400`

### Preflight Request (OPTIONS)

```bash
curl -X OPTIONS http://localhost:3000/api/newsletter/subscribe
```

Returns 200 OK with CORS headers.

## Usage Examples

### Basic Subscription

```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Full Subscription with Name

```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### JavaScript/Fetch Example

```javascript
const response = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe'
  })
});

const data = await response.json();

if (data.success) {
  console.log('Subscribed successfully:', data.message);
} else {
  console.error('Subscription failed:', data.error);
}
```

### React Hook Example

```javascript
import { useState } from 'react';

function useNewsletterSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email, firstName, lastName) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        return data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Network error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error, success };
}
```

## Error Handling

### Client-Side Error Handling

```javascript
try {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com' })
  });

  const data = await response.json();

  if (!data.success) {
    // Handle different error types
    switch (data.code) {
      case 'VALIDATION_ERROR':
        console.error('Validation error:', data.details || data.error);
        break;
      case 'INTERNAL_ERROR':
        console.error('Server error occurred');
        break;
      default:
        console.error('Unknown error:', data.error);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Validation Rules

### Email Validation
- Must be a valid email format (RFC 5322 compliant)
- Automatically converted to lowercase
- Trimmed of whitespace

### Name Validation
- Maximum 100 characters each
- Trimmed of whitespace
- Optional fields

### Source Validation
- Must be one of: `homepage`, `admin`, `import`, `api`
- Defaults to `homepage` if not provided

## Security Features

- Input sanitization and validation
- SQL injection prevention through parameterized queries
- XSS prevention through proper input handling
- Rate limiting (if configured at the server level)
- CORS headers for controlled access

## Database Integration

The endpoint integrates with the `newsletter_subscribers` table with the following behavior:

1. **New Subscription**: Creates new record with `active` status
2. **Duplicate Active**: Returns friendly message without creating duplicate
3. **Reactivation**: Updates existing `unsubscribed` record to `active` status
4. **Error Handling**: Graceful fallback with proper error messages

## Testing

Run the test suite:

```bash
npm test test/app/api/newsletter/subscribe.test.ts
npm test test/integration/newsletter-subscribe-api.test.ts
```

Manual testing script:

```bash
node scripts/test-newsletter-subscribe-api.js
```

## Requirements Satisfied

This endpoint satisfies the following requirements from the specification:

- **1.1**: Newsletter signup from homepage
- **1.4**: Email validation and duplicate handling  
- **1.5**: Success/error messaging
- **7.1**: Public API endpoint for newsletter signup
- **7.3**: Appropriate success/error responses

## Related Documentation

- [Newsletter Subscribers Service](../lib/database/services/newsletter-subscribers.md)
- [Newsletter Validation](../lib/database/newsletter-validation.md)
- [Error Handling](../lib/utils/error-handler.md)