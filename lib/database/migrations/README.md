# Database Migrations

This directory contains database migration scripts for the newsletter signup integration feature.

## Newsletter Subscribers Enhancement Migration

### Overview
This migration adds new columns to the `newsletter_subscribers` table to support:
- Source tracking (homepage, admin, import, api)
- Secure unsubscribe tokens
- Brevo email service integration
- Sync status tracking

### Files
- `001_newsletter_subscribers_enhancements.sql` - Individual migration statements
- `newsletter_enhancement_complete.sql` - Complete migration script for manual execution

### New Columns Added
- `source` - VARCHAR(50) NOT NULL - Tracks where the subscriber signed up
- `unsubscribe_token` - VARCHAR(255) - Secure token for unsubscribe links
- `brevo_contact_id` - VARCHAR(255) - Brevo service contact ID for sync
- `last_synced_at` - TIMESTAMP WITH TIME ZONE - Last sync timestamp

### Indexes Created
- `idx_newsletter_subscribers_unsubscribe_token` - Unique index on unsubscribe_token
- `idx_newsletter_subscribers_source` - Index for source filtering
- `idx_newsletter_subscribers_brevo_contact_id` - Index for Brevo contact lookups
- `idx_newsletter_subscribers_last_synced_at` - Index for sync monitoring

### Constraints Added
- Check constraint on `source` column to ensure valid values only

## How to Run the Migration

### Option 1: Manual Execution (Recommended for Supabase)
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `newsletter_enhancement_complete.sql`
4. Execute the script

### Option 2: Using the Migration Script
```bash
node scripts/run-newsletter-migration.js
```
Note: This will output SQL statements to run manually if direct execution is not available.

### Verification
After running the migration, verify it was successful:
```bash
node scripts/verify-newsletter-migration.js
```

## Rollback
If you need to rollback this migration, run the following SQL:

```sql
-- Remove new columns
ALTER TABLE newsletter_subscribers 
DROP COLUMN IF EXISTS source,
DROP COLUMN IF EXISTS unsubscribe_token,
DROP COLUMN IF EXISTS brevo_contact_id,
DROP COLUMN IF EXISTS last_synced_at;

-- Drop indexes
DROP INDEX IF EXISTS idx_newsletter_subscribers_unsubscribe_token;
DROP INDEX IF EXISTS idx_newsletter_subscribers_source;
DROP INDEX IF EXISTS idx_newsletter_subscribers_brevo_contact_id;
DROP INDEX IF EXISTS idx_newsletter_subscribers_last_synced_at;

-- Drop constraint
ALTER TABLE newsletter_subscribers 
DROP CONSTRAINT IF EXISTS chk_newsletter_subscribers_source;
```

## Post-Migration Steps
1. Update your application code to use the new fields
2. Test the newsletter signup functionality
3. Verify Brevo integration works with new fields
4. Update any existing subscribers with appropriate source values

## Troubleshooting
- If columns already exist, the migration will skip them safely
- If constraints fail, check for existing data that violates the new rules
- If indexes fail to create, check for duplicate data in the indexed columns