-- Migration: Newsletter Subscribers Enhancements
-- Description: Add source tracking, unsubscribe tokens, and Brevo sync fields
-- Date: 2025-01-03

-- Add new columns to newsletter_subscribers table
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'homepage',
ADD COLUMN IF NOT EXISTS unsubscribe_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS brevo_contact_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

-- Create unique constraint for unsubscribe_token (only if not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsubscribe_token 
ON newsletter_subscribers(unsubscribe_token) 
WHERE unsubscribe_token IS NOT NULL;

-- Create index for source filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_source 
ON newsletter_subscribers(source);

-- Create index for Brevo contact ID
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_brevo_contact_id 
ON newsletter_subscribers(brevo_contact_id) 
WHERE brevo_contact_id IS NOT NULL;

-- Create index for last_synced_at for sync monitoring
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_last_synced_at 
ON newsletter_subscribers(last_synced_at) 
WHERE last_synced_at IS NOT NULL;

-- Add check constraint for source values
ALTER TABLE newsletter_subscribers 
ADD CONSTRAINT IF NOT EXISTS chk_newsletter_subscribers_source 
CHECK (source IN ('homepage', 'admin', 'import', 'api'));

-- Update existing records to have a default source
UPDATE newsletter_subscribers 
SET source = 'admin' 
WHERE source IS NULL;

-- Make source column NOT NULL after setting defaults
ALTER TABLE newsletter_subscribers 
ALTER COLUMN source SET NOT NULL;