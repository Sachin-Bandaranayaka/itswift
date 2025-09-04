import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { getBrevoService } from '@/lib/integrations/brevo'

interface SyncStats {
  total: number
  synced: number
  failed: number
  skipped: number
  errors: string[]
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting Brevo sync via API...')
    
    // Get all active subscribers from local database
    const result = await NewsletterSubscribersService.getByStatus('active')
    
    if (result.error) {
      return NextResponse.json(
        { error: `Failed to fetch subscribers: ${result.error}` },
        { status: 500 }
      )
    }

    const subscribers = result.data
    const stats: SyncStats = {
      total: subscribers.length,
      synced: 0,
      failed: 0,
      skipped: 0,
      errors: []
    }

    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to sync',
        stats
      })
    }

    // Initialize Brevo service
    const brevoService = getBrevoService()

    // Test Brevo connection first
    const connectionTest = await brevoService.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: `Brevo connection failed: ${connectionTest.error}` },
        { status: 500 }
      )
    }

    // Sync each subscriber
    for (const subscriber of subscribers) {
      try {
        // Skip if already synced recently (has brevo_contact_id and last_synced_at within 24 hours)
        if (subscriber.brevo_contact_id && subscriber.last_synced_at) {
          const lastSynced = new Date(subscriber.last_synced_at)
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          
          if (lastSynced > oneDayAgo) {
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
          
          stats.synced++
        } else {
          stats.failed++
          stats.errors.push(`${subscriber.email}: ${syncResult.error}`)
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        stats.failed++
        stats.errors.push(`${subscriber.email}: ${errorMessage}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed: ${stats.synced} synced, ${stats.failed} failed, ${stats.skipped} skipped`,
      stats
    })

  } catch (error) {
    console.error('Error syncing subscribers to Brevo:', error)
    return NextResponse.json(
      { error: 'Internal server error during sync' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get sync status - count subscribers that need syncing
    const result = await NewsletterSubscribersService.getByStatus('active')
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    const subscribers = result.data
    let needsSync = 0
    let alreadySynced = 0

    for (const subscriber of subscribers) {
      if (!subscriber.brevo_contact_id || !subscriber.last_synced_at) {
        needsSync++
      } else {
        const lastSynced = new Date(subscriber.last_synced_at)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        if (lastSynced <= oneDayAgo) {
          needsSync++
        } else {
          alreadySynced++
        }
      }
    }

    return NextResponse.json({
      total: subscribers.length,
      needsSync,
      alreadySynced,
      canSync: needsSync > 0
    })

  } catch (error) {
    console.error('Error getting sync status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}