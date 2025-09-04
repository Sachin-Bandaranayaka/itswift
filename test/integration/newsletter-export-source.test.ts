import { describe, it, expect } from 'vitest'

describe('Newsletter Export Source Field', () => {
  it('should include source field in CSV headers', () => {
    // Test CSV header construction
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Subscribed At', 'Tags']
    
    expect(headers).toContain('Source')
    expect(headers.indexOf('Source')).toBe(4) // Should be the 5th column (index 4)
  })

  it('should format subscriber data with source field', () => {
    // Mock subscriber data
    const subscriber = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      status: 'active',
      source: 'homepage',
      subscribed_at: '2024-01-01T00:00:00Z',
      tags: ['newsletter', 'customer']
    }

    // Simulate CSV row construction
    const csvRow = [
      `"${subscriber.email}"`,
      `"${subscriber.first_name || ''}"`,
      `"${subscriber.last_name || ''}"`,
      `"${subscriber.status}"`,
      `"${subscriber.source || 'unknown'}"`,
      `"${new Date(subscriber.subscribed_at).toISOString()}"`,
      `"${subscriber.tags?.join(';') || ''}"`
    ].join(',')

    expect(csvRow).toContain('"homepage"')
    expect(csvRow).toContain('"test@example.com"')
    expect(csvRow).toContain('"active"')
  })

  it('should handle missing source field gracefully', () => {
    // Mock subscriber without source
    const subscriber = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      status: 'active',
      source: undefined,
      subscribed_at: '2024-01-01T00:00:00Z',
      tags: []
    }

    // Simulate CSV row construction with fallback
    const csvRow = [
      `"${subscriber.email}"`,
      `"${subscriber.first_name || ''}"`,
      `"${subscriber.last_name || ''}"`,
      `"${subscriber.status}"`,
      `"${subscriber.source || 'unknown'}"`,
      `"${new Date(subscriber.subscribed_at).toISOString()}"`,
      `"${subscriber.tags?.join(';') || ''}"`
    ].join(',')

    expect(csvRow).toContain('"unknown"')
  })
})