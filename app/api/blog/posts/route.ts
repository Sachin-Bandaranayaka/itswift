import { NextRequest, NextResponse } from 'next/server';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '9')));
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const filters = {
      category,
      search,
      status: 'published' as const,
    };

    const data = await BlogPublicDataService.getPaginatedPosts(filters, page, limit);
    
    // Add cache headers for better performance
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Return more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Unable to connect to content management system' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 504 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}