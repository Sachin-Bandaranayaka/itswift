// Helper functions for Brevo integration to avoid circular imports

import { getSupabaseAdmin } from '../supabase'
import { NewsletterSubscriber } from '../database/types'

/**
 * Get subscriber by email for Brevo integration
 * This is a lightweight helper to avoid circular imports with the main service
 */
export async function getSubscriberByEmailForBrevo(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching newsletter subscriber by email for Brevo:', error)
      return null
    }

    return data as NewsletterSubscriber || null
  } catch (error) {
    console.error('Error fetching newsletter subscriber by email for Brevo:', error)
    return null
  }
}

/**
 * Update subscriber's Brevo sync information
 */
export async function updateSubscriberBrevoSync(
  subscriberId: string, 
  brevoContactId: string
): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('newsletter_subscribers')
      .update({
        brevo_contact_id: brevoContactId,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', subscriberId)

    if (error) {
      console.error('Error updating subscriber Brevo sync info:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating subscriber Brevo sync info:', error)
    return false
  }
}

/**
 * Mark subscriber as sync failed
 */
export async function markSubscriberSyncFailed(
  subscriberId: string, 
  errorMessage: string
): Promise<boolean> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('newsletter_subscribers')
      .update({
        last_synced_at: new Date().toISOString(),
        // We could add a sync_error field to track failures, but for now we'll just log
      })
      .eq('id', subscriberId)

    if (error) {
      console.error('Error marking subscriber sync as failed:', error)
      return false
    }

    console.warn(`Subscriber ${subscriberId} sync failed: ${errorMessage}`)
    return true
  } catch (error) {
    console.error('Error marking subscriber sync as failed:', error)
    return false
  }
}