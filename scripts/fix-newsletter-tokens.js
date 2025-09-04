#!/usr/bin/env node

/**
 * Fix missing unsubscribe tokens for existing newsletter subscribers
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { randomBytes, createHash } = require('crypto');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Generate a secure unsubscribe token
 */
function generateUnsubscribeToken(subscriberId, email) {
    const randomData = randomBytes(16).toString('hex');
    const hash = createHash('sha256');
    hash.update(`${subscriberId}:${email}:${randomData}:${Date.now()}`);
    return hash.digest('hex');
}

async function fixMissingTokens() {
    console.log('🔍 Checking for subscribers missing unsubscribe tokens...');

    try {
        // Get all subscribers without unsubscribe tokens
        const { data: subscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, unsubscribe_token')
            .is('unsubscribe_token', null);

        if (error) {
            console.error('❌ Error fetching subscribers:', error);
            return;
        }

        if (!subscribers || subscribers.length === 0) {
            console.log('✅ All subscribers already have unsubscribe tokens!');
            return;
        }

        console.log(`📝 Found ${subscribers.length} subscribers missing tokens. Generating tokens...`);

        let fixed = 0;
        let failed = 0;

        for (const subscriber of subscribers) {
            try {
                const token = generateUnsubscribeToken(subscriber.id, subscriber.email);

                const { error: updateError } = await supabase
                    .from('newsletter_subscribers')
                    .update({ unsubscribe_token: token })
                    .eq('id', subscriber.id);

                if (updateError) {
                    console.error(`❌ Failed to update token for ${subscriber.email}:`, updateError);
                    failed++;
                } else {
                    console.log(`✅ Generated token for ${subscriber.email}`);
                    fixed++;
                }
            } catch (error) {
                console.error(`❌ Error processing ${subscriber.email}:`, error);
                failed++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Fixed: ${fixed} subscribers`);
        console.log(`   ❌ Failed: ${failed} subscribers`);

        if (fixed > 0) {
            console.log('\n🎉 Unsubscribe tokens have been generated successfully!');
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

async function verifyTokens() {
    console.log('\n🔍 Verifying all subscribers have tokens...');

    try {
        const { data: allSubscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, unsubscribe_token, status')
            .eq('status', 'active');

        if (error) {
            console.error('❌ Error fetching subscribers for verification:', error);
            return;
        }

        const missingTokens = allSubscribers.filter(sub => !sub.unsubscribe_token);

        console.log(`📊 Verification Results:`);
        console.log(`   Total active subscribers: ${allSubscribers.length}`);
        console.log(`   Subscribers with tokens: ${allSubscribers.length - missingTokens.length}`);
        console.log(`   Subscribers missing tokens: ${missingTokens.length}`);

        if (missingTokens.length === 0) {
            console.log('✅ All active subscribers have unsubscribe tokens!');
        } else {
            console.log('❌ Some subscribers still missing tokens:');
            missingTokens.forEach(sub => {
                console.log(`   - ${sub.email}`);
            });
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
    }
}

async function main() {
    console.log('🚀 Starting newsletter token fix...\n');

    await fixMissingTokens();
    await verifyTokens();

    console.log('\n✨ Newsletter token fix completed!');
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { fixMissingTokens, verifyTokens };