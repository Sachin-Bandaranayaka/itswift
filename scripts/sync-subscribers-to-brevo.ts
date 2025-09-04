#!/usr/bin/env node

/**
 * Sync local newsletter subscribers to Brevo contacts
 * This script will sync all active subscribers from your local database to Brevo
 * 
 * Usage:
 *   npm run sync-brevo
 *   or
 *   npx tsx scripts/sync-subscribers-to-brevo.ts
 */

import { NewsletterSubscribersService } from '../lib/database/services/newsletter-subscribers'
import { getBrevoService } from '../lib/integrations/brevo'

interface SyncStats {
  total: number
  synced: number
  failed: number
  skipped: number
  errors: string[]
}

async function syncSubscribersToBrevo(): Promise<SyncStats> {
  const stats: SyncStats = {
    total: 0,
    synced: 0,
    failed: 0,
    skipped: 0,
    errors: []
  }

  try {
    console.log('🔄 Starting subscriber sync to Brevo...')
    
    // Get all active subscribers from local database
    const result = await NewsletterSubscribersService.getByStatus('active')
    
    if (result.error) {
      throw new Error(`Failed to fetch subscribers: ${result.error}`)
    }

    const subscribers = result.data
    stats.total = subscribers.length

    console.log(`📊 Found ${subscribers.length} active subscribers to sync`)

    if (subscribers.length === 0) {
      console.log('✅ No subscribers to sync')
      return stats
    }

    // Initialize Brevo service
    const brevoService = getBrevoService()

    // Test Brevo connection first
    console.log('🔗 Testing Brevo connection...')
    const connectionTest = await brevoService.testConnection()
    if (!connectionTest.success) {
      throw new Error(`Brevo connection failed: ${connectionTest.error}`)
    }
    console.log('✅ Brevo connection successful')

    // Sync each subscriber
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i]
      const progress = `[${i + 1}/${subscribers.length}]`
      
      try {
        console.log(`${progress} Syncing ${subscriber.email}...`)
        
        // Skip if already synced recently (has brevo_contact_id and last_synced_at within 24 hours)
        if (subscriber.brevo_contact_id && subscriber.last_synced_at) {
          const lastSynced = new Date(subscriber.last_synced_at)
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          
          if (lastSynced > oneDayAgo) {
            console.log(`${progress} ⏭️  Skipping ${subscriber.email} (recently synced)`)
            stats.skipped++
            continue
          }
        }

        // Sync subscriber to Brevo
        const syncResult = await brevoService.syncSubscriber(subscriber)
        
        if (syncResult.success) {
          // Update local database with sync info
          await NewsletterSubscribersService.update(subscriber.id, {
            brevo_contact_id: syncResult.brevo_contact_id,
            last_synced_at: new Date().toISOString()
          })
          
          console.log(`${progress} ✅ Synced ${subscriber.email}`)
          stats.synced++
        } else {
          console.log(`${progress} ❌ Failed to sync ${subscriber.email}: ${syncResult.error}`)
          stats.failed++
          stats.errors.push(`${subscriber.email}: ${syncResult.error}`)
        }

        // Add small delay to avoid rate limiting
        if (i < subscribers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.log(`${progress} ❌ Error syncing ${subscriber.email}: ${errorMessage}`)
        stats.failed++
        stats.errors.push(`${subscriber.email}: ${errorMessage}`)
      }
    }

    console.log('\n📈 Sync Summary:')
    console.log(`Total subscribers: ${stats.total}`)
    console.log(`Successfully synced: ${stats.synced}`)
    console.log(`Failed: ${stats.failed}`)
    console.log(`Skipped: ${stats.skipped}`)

    if (stats.errors.length > 0) {
      console.log('\n❌ Errors:')
      stats.errors.forEach(error => console.log(`  - ${error}`))
    }

    return stats

  } catch (error) {
    console.error('💥 Sync failed:', error)
    throw error
  }
}

// Run the sync if this script is executed directly
if (require.main === module) {
  syncSubscribersToBrevo()
    .then((stats) => {
      if (stats.failed === 0) {
        console.log('\n🎉 Sync completed successfully!')
        process.exit(0)
      } else {
        console.log('\n⚠️  Sync completed with errors')
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('💥 Sync failed:', error)
      process.exit(1)
    })
}

export { syncSubscribersToBrevo }