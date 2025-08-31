import { NextRequest, NextResponse } from 'next/server';
import { BlogDataService } from '@/lib/services/blog-data';
import { SocialDataService } from '@/lib/services/social-data';
import { NewsletterDataService } from '@/lib/services/newsletter-data';
import { AIUsageDataService } from '@/lib/services/ai-usage-data';

export const dynamic = 'force-dynamic'

const blogDataService = new BlogDataService();
const socialDataService = new SocialDataService();
const newsletterDataService = new NewsletterDataService();
const aiUsageDataService = new AIUsageDataService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'blog', 'social', 'newsletter', 'ai', or 'all'

    let result;

    switch (type) {
      case 'blog':
        result = await blogDataService.getBlogStats();
        break;
      case 'social':
        result = await socialDataService.getSocialStats();
        break;
      case 'newsletter':
        result = await newsletterDataService.getNewsletterStats();
        break;
      case 'ai':
        result = await aiUsageDataService.getAIUsageStats();
        break;
      case 'all':
      default:
        // Fetch all stats in parallel
        const [blogStats, socialStats, newsletterStats, aiUsage] = await Promise.allSettled([
          blogDataService.getBlogStats(),
          socialDataService.getSocialStats(),
          newsletterDataService.getNewsletterStats(),
          aiUsageDataService.getAIUsageStats()
        ]);

        result = {
          blogStats: blogStats.status === 'fulfilled' ? blogStats.value : null,
          socialStats: socialStats.status === 'fulfilled' ? socialStats.value : null,
          newsletterStats: newsletterStats.status === 'fulfilled' ? newsletterStats.value : null,
          aiUsage: aiUsage.status === 'fulfilled' ? aiUsage.value : null,
          errors: [
            ...(blogStats.status === 'rejected' ? [{ type: 'blog', error: blogStats.reason?.message }] : []),
            ...(socialStats.status === 'rejected' ? [{ type: 'social', error: socialStats.reason?.message }] : []),
            ...(newsletterStats.status === 'rejected' ? [{ type: 'newsletter', error: newsletterStats.reason?.message }] : []),
            ...(aiUsage.status === 'rejected' ? [{ type: 'ai', error: aiUsage.reason?.message }] : [])
          ]
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in dashboard stats API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}