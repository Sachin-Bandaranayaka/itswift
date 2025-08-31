import { NextRequest, NextResponse } from 'next/server';
import { BlogDataService } from '@/lib/services/blog-data';
import { SocialDataService } from '@/lib/services/social-data';
import { NewsletterDataService } from '@/lib/services/newsletter-data';
import { ScheduledItem } from '@/lib/types/dashboard';

const blogDataService = new BlogDataService();
const socialDataService = new SocialDataService();
const newsletterDataService = new NewsletterDataService();

export async function GET(request: NextRequest) {
  try {
    // Fetch upcoming scheduled content from all sources in parallel
    const [blogScheduled, socialScheduled, newsletterScheduled] = await Promise.allSettled([
      blogDataService.getScheduledBlogPosts(),
      socialDataService.getScheduledSocialPosts(),
      newsletterDataService.getScheduledNewsletterCampaigns()
    ]);

    const scheduled: ScheduledItem[] = [];

    // Collect successful results
    if (blogScheduled.status === 'fulfilled') {
      scheduled.push(...blogScheduled.value);
    }
    if (socialScheduled.status === 'fulfilled') {
      scheduled.push(...socialScheduled.value);
    }
    if (newsletterScheduled.status === 'fulfilled') {
      scheduled.push(...newsletterScheduled.value);
    }

    // Sort by scheduled time and return top 5
    const sortedScheduled = scheduled
      .filter(item => item.scheduledAt) // Filter out items without scheduledAt
      .sort((a, b) => {
        const dateA = new Date(a.scheduledAt);
        const dateB = new Date(b.scheduledAt);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);

    // Collect any errors
    const errors = [
      ...(blogScheduled.status === 'rejected' ? [{ type: 'blog', error: blogScheduled.reason?.message }] : []),
      ...(socialScheduled.status === 'rejected' ? [{ type: 'social', error: socialScheduled.reason?.message }] : []),
      ...(newsletterScheduled.status === 'rejected' ? [{ type: 'newsletter', error: newsletterScheduled.reason?.message }] : [])
    ];

    return NextResponse.json({
      success: true,
      data: sortedScheduled,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in dashboard scheduled API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}