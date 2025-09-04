import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

describe('Admin Newsletter Subscribers Source Filtering', () => {
  const testSubscribers = [
    {
      email: 'homepage@test.com',
      first_name: 'Homepage',
      last_name: 'User',
      source: 'homepage' as const,
      status: 'active' as const
    },
    {
      email: 'admin@test.com',
      first_name: 'Admin',
      last_name: 'User',
      source: 'admin' as const,
      status: 'active' as const
    },
    {
      email: 'import@test.com',
      first_name: 'Import',
      last_name: 'User',
      source: 'import' as const,
      status: 'active' as const
    },
    {
      email: 'api@test.com',
      first_name: 'API',
      last_name: 'User',
      source: 'api' as const,
      status: 'active' as const
    }
  ]

  let createdSubscriberIds: string[] = []

  beforeEach(async () => {
    // Create test subscribers
    for (const subscriber of testSubscribers) {
      const result = await NewsletterSubscribersService.create(subscriber)
      if (result.data) {
        createdSubscriberIds.push(result.data.id)
      }
    }
  })

  afterEach(async () => {
    // Clean up test subscribers
    for (const id of createdSubscriberIds) {
      await NewsletterSubscribersService.delete(id)
    }
    createdSubscriberIds = []
  })

  it('should filter subscribers by homepage source', async () => {
    const result = await NewsletterSubscribersService.getAll({}, { source: 'homepage' })
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const homepageSubscribers = result.data.filter(sub => 
      testSubscribers.some(test => test.email === sub.email)
    )
    
    expect(homepageSubscribers).toHaveLength(1)
    expect(homepageSubscribers[0].email).toBe('homepage@test.com')
    expect(homepageSubscribers[0].source).toBe('homepage')
  })

  it('should filter subscribers by admin source', async () => {
    const result = await NewsletterSubscribersService.getAll({}, { source: 'admin' })
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const adminSubscribers = result.data.filter(sub => 
      testSubscribers.some(test => test.email === sub.email)
    )
    
    expect(adminSubscribers).toHaveLength(1)
    expect(adminSubscribers[0].email).toBe('admin@test.com')
    expect(adminSubscribers[0].source).toBe('admin')
  })

  it('should filter subscribers by import source', async () => {
    const result = await NewsletterSubscribersService.getAll({}, { source: 'import' })
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const importSubscribers = result.data.filter(sub => 
      testSubscribers.some(test => test.email === sub.email)
    )
    
    expect(importSubscribers).toHaveLength(1)
    expect(importSubscribers[0].email).toBe('import@test.com')
    expect(importSubscribers[0].source).toBe('import')
  })

  it('should return all subscribers when no source filter is applied', async () => {
    const result = await NewsletterSubscribersService.getAll({}, {})
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const testSubscriberEmails = testSubscribers.map(sub => sub.email)
    const foundTestSubscribers = result.data.filter(sub => 
      testSubscriberEmails.includes(sub.email)
    )
    
    expect(foundTestSubscribers).toHaveLength(4)
  })

  it('should search subscribers with source filtering', async () => {
    const result = await NewsletterSubscribersService.search('test.com', {}, { source: 'homepage' })
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const homepageSubscribers = result.data.filter(sub => 
      testSubscribers.some(test => test.email === sub.email)
    )
    
    expect(homepageSubscribers).toHaveLength(1)
    expect(homepageSubscribers[0].email).toBe('homepage@test.com')
    expect(homepageSubscribers[0].source).toBe('homepage')
  })

  it('should combine status and source filters', async () => {
    // Create an unsubscribed homepage subscriber
    const unsubscribedResult = await NewsletterSubscribersService.create({
      email: 'unsubscribed-homepage@test.com',
      source: 'homepage',
      status: 'unsubscribed'
    })
    
    if (unsubscribedResult.data) {
      createdSubscriberIds.push(unsubscribedResult.data.id)
    }

    // Filter by both source and status
    const result = await NewsletterSubscribersService.getAll({}, { 
      source: 'homepage', 
      status: 'active' 
    })
    
    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
    
    const filteredSubscribers = result.data.filter(sub => 
      ['homepage@test.com', 'unsubscribed-homepage@test.com'].includes(sub.email)
    )
    
    // Should only return the active homepage subscriber
    expect(filteredSubscribers).toHaveLength(1)
    expect(filteredSubscribers[0].email).toBe('homepage@test.com')
    expect(filteredSubscribers[0].source).toBe('homepage')
    expect(filteredSubscribers[0].status).toBe('active')
  })
})