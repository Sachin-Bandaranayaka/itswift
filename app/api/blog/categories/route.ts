import { NextResponse } from 'next/server';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

export async function GET() {
  try {
    const categories = await BlogPublicDataService.getAvailableCategories();

    const body = {
      success: true as const,
      data: {
        categories,
        count: categories.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const body = {
      success: false as const,
      error: 'Failed to fetch blog categories',
      message,
    };

    return NextResponse.json(body, {
      status: 500,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    });
  }
}