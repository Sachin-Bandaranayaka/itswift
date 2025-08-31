import { NextRequest, NextResponse } from 'next/server';
import { BlogDataService } from '@/lib/services/blog-data';
import { SocialDataService } from '@/lib/services/social-data';
import { NewsletterDataService } from '@/lib/services/newsletter-data';
import { PerformingContentItem } from '@/lib/types/dashboard';

const blogDataService = new BlogDataService();
const socialDataService = new SocialDataService();
const newsletterDataService = new NewsletterDataService();

export async function GET(request: NextRequest) {
  try {
    // Fetch top performing content from all sources in parallel
    const [blogContent, socialContent, newsletterContent] = await Promise.allSettled([
      blogDataService.getTopPerformingBlogPosts(),
      socialDataService.getTopPerformingSocialContent(),
      newsletterDataService.getTopPerformingNewsletterCampaigns()
    ]);

    const content: PerformingContentItem[] = [];

    // Collect successful results
    if (blogContent.status === 'fulfilled') {
      content.push(...blogContent.value);
    }
    if (socialContent.status === 'fulfilled') {
      content.push(...socialContent.value);
    }
    if (newsletterContent.status === 'fulfilled') {
      content.push(...newsletterContent.value);
    }

    // Sort by engagement metrics (prioritize content with higher engagement)
    const sortedContent = content
      .sort((a, b) => {
        const aEngagement = (a.metrics.likes || 0) + (a.metrics.shares || 0) + (a.metrics.opens || 0) + (a.metrics.clicks || 0);
        const bEngagement = (b.metrics.likes || 0) + (b.metrics.shares || 0) + (b.metrics.opens || 0) + (b.metrics.clicks || 0);
        return bEngagement - aEngagement;
      })
      .slice(0, 5);

    // Collect any errors
    const errors = [
      ...(blogContent.status === 'rejected' ? [{ type: 'blog', error: blogContent.reason?.message }] : []),
      ...(socialContent.status === 'rejected' ? [{ type: 'social', error: socialContent.reason?.message }] : []),
      ...(newsletterContent.status === 'rejected' ? [{ type: 'newsletter', error: newsletterContent.reason?.message }] : [])
    ];

    return NextResponse.json({
      success: true,
      data: sortedContent,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in dashboard performance API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}