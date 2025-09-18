# Content Management System Guide

## Overview

This guide explains how to use the dynamic content management system built for Swift Solution. The system allows you to manage website content through an admin interface and display it dynamically on the frontend.

## Features

- ✅ **Admin Interface**: Full CRUD operations for content sections
- ✅ **Dynamic Content Components**: Reusable React components for displaying content
- ✅ **API Endpoints**: RESTful API for content management
- ✅ **Database Schema**: Structured content storage with versioning support
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Responsive Design**: Mobile-friendly admin interface

## Database Schema

### Tables Created

1. **`pages`** - Website pages
   - `id` (UUID, Primary Key)
   - `slug` (Text, Unique)
   - `title` (Text)
   - `description` (Text)
   - `meta_title` (Text)
   - `meta_description` (Text)
   - `meta_keywords` (Text)
   - `is_active` (Boolean)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

2. **`page_content_sections`** - Content sections
   - `id` (UUID, Primary Key)
   - `page_id` (UUID, Foreign Key to pages)
   - `section_key` (Text) - Unique identifier for the content section
   - `section_type` (Text) - Type of content (text, html, markdown, image, video)
   - `content` (Text) - Main content
   - `content_html` (Text) - HTML version of content
   - `display_order` (Integer) - Order for displaying sections
   - `is_active` (Boolean)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

3. **`page_content_versions`** - Content versioning (for future use)
   - `id` (UUID, Primary Key)
   - `section_id` (UUID, Foreign Key)
   - `content` (Text)
   - `content_html` (Text)
   - `version_number` (Integer)
   - `created_by` (UUID)
   - `created_at` (Timestamp)

## API Endpoints

### Content Sections

#### GET `/api/admin/content/sections`
Retrieve content sections with optional filtering.

**Query Parameters:**
- `page_slug` (optional) - Filter by page slug
- `section_key` (optional) - Filter by section key
- `is_active` (optional) - Filter by active status

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "section_key": "hero-title",
      "section_type": "text",
      "content": "Welcome to Swift Solution",
      "display_order": 1,
      "is_active": true,
      "pages": {
        "slug": "home",
        "title": "Home Page"
      }
    }
  ]
}
```

#### POST `/api/admin/content/sections`
Create a new content section.

**Request Body:**
```json
{
  "page_id": "uuid",
  "section_key": "hero-title",
  "section_type": "text",
  "content": "Welcome to Swift Solution",
  "content_html": "<h1>Welcome to Swift Solution</h1>",
  "display_order": 1,
  "is_active": true
}
```

#### GET `/api/admin/content/sections/[id]`
Retrieve a specific content section.

#### PUT `/api/admin/content/sections/[id]`
Update a content section.

#### DELETE `/api/admin/content/sections/[id]`
Delete a content section.

## Frontend Components

### DynamicContent Component

The main component for displaying dynamic content.

```tsx
import { DynamicContent } from '@/components/dynamic-content'

// Basic usage
<DynamicContent 
  sectionKey="hero-title" 
  pageSlug="home"
  fallback={<h1>Default Title</h1>}
/>

// With custom styling
<DynamicContent 
  sectionKey="hero-description" 
  pageSlug="home"
  className="text-lg text-gray-600"
  as="p"
  fallback="Default description text"
/>
```

**Props:**
- `sectionKey` (string, required) - The unique key for the content section
- `pageSlug` (string, optional) - Filter by specific page
- `fallback` (ReactNode, optional) - Content to show if dynamic content fails to load
- `className` (string, optional) - CSS classes to apply
- `as` (string, optional) - HTML element to render (default: 'div')

### DynamicContentGroup Component

Display multiple content sections from a page.

```tsx
import { DynamicContentGroup } from '@/components/dynamic-content'

<DynamicContentGroup 
  pageSlug="about"
  className="space-y-4"
  fallback={<div>Loading content...</div>}
/>
```

### useContent Hook

For programmatic access to content data.

```tsx
import { useContent } from '@/components/dynamic-content'

function MyComponent() {
  const { content, loading, error } = useContent('hero-title', 'home')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading content</div>
  
  return <h1>{content?.content}</h1>
}
```

## Admin Interface

### Accessing the Admin Panel

1. Navigate to `/admin/content`
2. Use the admin interface to manage content sections
3. The interface provides:
   - List view of all content sections
   - Create/Edit forms
   - Delete functionality
   - Filtering by page
   - Status management (active/inactive)

### Content Types Supported

1. **Text** - Plain text content
2. **HTML** - Rich HTML content
3. **Markdown** - Markdown formatted content (rendered as plain text for now)
4. **Image** - Image URLs
5. **Video** - Video URLs

## Usage Examples

### 1. Hero Section with Dynamic Content

```tsx
// components/hero-dynamic.tsx
import { DynamicContent } from '@/components/dynamic-content'

export default function HeroDynamic() {
  return (
    <section className="hero">
      <h1>
        <DynamicContent
          sectionKey="hero-title"
          pageSlug="home"
          fallback="Default Hero Title"
        />
      </h1>
      <p>
        <DynamicContent
          sectionKey="hero-description"
          pageSlug="home"
          fallback="Default hero description"
        />
      </p>
    </section>
  )
}
```

### 2. About Section

```tsx
// components/about-dynamic.tsx
import { DynamicContentGroup } from '@/components/dynamic-content'

export default function AboutDynamic() {
  return (
    <section className="about">
      <DynamicContentGroup
        pageSlug="about"
        className="space-y-6"
        fallback={
          <div>
            <h2>About Us</h2>
            <p>Default about content...</p>
          </div>
        }
      />
    </section>
  )
}
```

### 3. Conditional Content

```tsx
import { useContent } from '@/components/dynamic-content'

function ConditionalContent() {
  const { content, loading } = useContent('special-offer', 'home')
  
  // Only show if content exists and is active
  if (!loading && content && content.is_active) {
    return (
      <div className="special-offer">
        {content.content}
      </div>
    )
  }
  
  return null
}
```

## Best Practices

### 1. Section Key Naming

Use descriptive, hierarchical naming:
- `hero-title`
- `hero-description`
- `hero-cta-button`
- `about-title`
- `about-description`
- `services-title`
- `services-item-1`

### 2. Fallback Content

Always provide meaningful fallback content:

```tsx
<DynamicContent
  sectionKey="hero-title"
  fallback={<h1>Welcome to Our Website</h1>}
/>
```

### 3. Error Handling

The components handle errors gracefully, but you can also use the hook for custom error handling:

```tsx
const { content, loading, error } = useContent('hero-title')

if (error) {
  console.error('Failed to load content:', error)
  // Handle error appropriately
}
```

### 4. Performance

- Content is fetched on component mount
- Use React's built-in caching for repeated requests
- Consider implementing a content cache for production

## Security Considerations

1. **Admin Access**: Ensure proper authentication for `/admin/content`
2. **Content Validation**: Validate HTML content to prevent XSS
3. **API Security**: Implement proper authorization for API endpoints
4. **Input Sanitization**: Sanitize user inputs in the admin interface

## Future Enhancements

1. **Content Versioning**: Track changes and allow rollbacks
2. **Rich Text Editor**: WYSIWYG editor for HTML content
3. **Media Management**: Upload and manage images/videos
4. **Content Scheduling**: Schedule content publication
5. **Multi-language Support**: Internationalization
6. **Content Templates**: Predefined content structures
7. **SEO Optimization**: Automatic meta tag generation
8. **Content Analytics**: Track content performance

## Troubleshooting

### Common Issues

1. **Content Not Loading**
   - Check API endpoint accessibility
   - Verify section_key spelling
   - Check browser console for errors

2. **Admin Interface Not Working**
   - Ensure proper authentication
   - Check database connection
   - Verify API endpoints are accessible

3. **TypeScript Errors**
   - Ensure Database interface is properly imported
   - Check type definitions in `/lib/database/types.ts`

### Debug Mode

Enable debug logging by adding to your component:

```tsx
const { content, loading, error } = useContent('hero-title')
console.log('Content debug:', { content, loading, error })
```

## Support

For issues or questions about the content management system:

1. Check this documentation
2. Review the component source code in `/components/dynamic-content.tsx`
3. Check API endpoints in `/app/api/admin/content/`
4. Review database schema in the migration files

---

*This content management system provides a solid foundation for dynamic content management. Extend and customize it based on your specific needs.*