import { NextRequest, NextResponse } from 'next/server';
import { BlogDataService } from '@/lib/services/blog-data';
import { SocialDataService } from '@/lib/services/social-data';
import { NewsletterDataService } from '@/lib/services/newsletter-data';
import { AIUsageDataService } from '@/lib/services/ai-usage-data';
import { ActivityItem } from '@/lib/types/dashboard';

const blogDataService = new BlogDataService();
const socialDataService = new SocialDataService();
const newsletterDataService = new NewsletterDataService();
const aiUsageDataService = new AIUsageDataService();

export async function GET(request: NextRequest) {
  try {
    // Fetch recent activity from all sources in parallel
    const [blogActivity, socialActivity, newsletterActivity, aiActivity] = await Promise.allSettled([
      blogDataService.getRecentBlogActivity(),
      socialDataService.getRecentSocialActivity(),
      newsletterDataService.getRecentNewsletterActivity(),
      aiUsageDataService.getRecentAIActivity()
    ]);

    const activities: ActivityItem[] = [];

    // Collect successful results
    if (blogActivity.status === 'fulfilled') {
      activities.push(...blogActivity.value);
    }
    if (socialActivity.status === 'fulfilled') {
      activities.push(...socialActivity.value);
    }
    if (newsletterActivity.status === 'fulfilled') {
      activities.push(...newsletterActivity.value);
    }
    if (aiActivity.status === 'fulfilled') {
      activities.push(...aiActivity.value);
    }

    // Sort by timestamp and return top 10
    const sortedActivities = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    // Collect any errors
    const errors = [
      ...(blogActivity.status === 'rejected' ? [{ type: 'blog', error: blogActivity.reason?.message }] : []),
      ...(socialActivity.status === 'rejected' ? [{ type: 'social', error: socialActivity.reason?.message }] : []),
      ...(newsletterActivity.status === 'rejected' ? [{ type: 'newsletter', error: newsletterActivity.reason?.message }] : []),
      ...(aiActivity.status === 'rejected' ? [{ type: 'ai', error: aiActivity.reason?.message }] : [])
    ];

    return NextResponse.json({
      success: true,
      data: sortedActivities,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in dashboard activity API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}