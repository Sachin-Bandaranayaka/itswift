# Brevo Newsletter Sync Guide

## The Problem

Your newsletter system has two separate databases:
1. **Local Database** (Supabase) - where subscribers are stored when they sign up
2. **Brevo Contacts** - where Brevo stores contacts for sending emails

Currently, subscribers are only added to your local database but not synced to Brevo. This is why:
- Your admin panel shows subscribers (from local database)
- Your Brevo dashboard shows few/no contacts
- Newsletter campaigns show recipients but emails aren't sent

## The Solution

I've created a sync system to connect your local subscribers with Brevo contacts.

### 1. Test Your Brevo Connection

First, make sure your Brevo API is working:

```bash
npm run test-brevo
```

This will verify your `BREVO_API_KEY` is configured correctly.

### 2. Sync Existing Subscribers

Run the sync script to sync all your existing subscribers to Brevo:

```bash
npm run sync-brevo
```

This will:
- Get all active subscribers from your local database
- Create corresponding contacts in Brevo
- Update your local database with Brevo contact IDs
- Show you a progress report

### 3. Use the Admin Panel

You can also sync from your admin panel:
1. Go to `http://localhost:3000/admin/newsletter`
2. Click the "Sync to Brevo" button in the Subscribers tab
3. Wait for the sync to complete

### 4. Automatic Sync for New Subscribers

New subscribers will now automatically sync to Brevo when they:
- Subscribe through your website
- Are added through the admin panel

## What Happens During Sync

1. **Creates Brevo Contacts**: Each local subscriber becomes a Brevo contact
2. **Adds to Default List**: Contacts are added to your default Brevo list (ID: 1)
3. **Syncs Attributes**: Name, email, source, and subscription date are synced
4. **Updates Local Database**: Stores Brevo contact ID and sync timestamp
5. **Handles Duplicates**: Updates existing Brevo contacts if they already exist

## Environment Variables

Make sure you have these in your `.env.local`:

```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_DEFAULT_LIST_ID=1
```

## Troubleshooting

### "No contacts in Brevo dashboard"
- Run `npm run sync-brevo` to sync existing subscribers
- Check that `BREVO_API_KEY` is correct
- Verify your Brevo account is active

### "Sync failed" errors
- Check your internet connection
- Verify Brevo API key permissions
- Look at the error details in the console

### "Rate limit exceeded"
- The sync includes delays to avoid rate limits
- If you hit limits, wait and try again
- Large subscriber lists may take time

## Monitoring Sync Status

After syncing, your subscribers table will show:
- `brevo_contact_id`: The ID in Brevo
- `last_synced_at`: When they were last synced

## Next Steps

1. **Test the sync**: Run `npm run sync-brevo`
2. **Check Brevo**: Verify contacts appear in your Brevo dashboard
3. **Test campaigns**: Try sending a test newsletter
4. **Monitor**: New subscribers will auto-sync going forward

## Files Modified

- `scripts/sync-subscribers-to-brevo.ts` - Manual sync script
- `scripts/test-brevo-connection.ts` - Connection test script
- `app/api/admin/newsletter/sync-brevo/route.ts` - Admin sync API
- `app/api/newsletter/subscribe/route.ts` - Auto-sync for new subscribers
- `app/admin/newsletter/page.tsx` - Added sync button to admin UI

The sync system is now in place and will keep your local database and Brevo contacts synchronized!