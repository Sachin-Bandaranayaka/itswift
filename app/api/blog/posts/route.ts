import { NextRequest, NextResponse } from 'next/server';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse and validate pagination params
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    if (Number.isNaN(page) || page < 1) {
      return NextResponse.json({ success: false, error: 'Page number must be greater than 0' }, { status: 400 });
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 9;
    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ success: false, error: 'Limit must be between 1 and 100' }, { status: 400 });
    }

    // Parse filters
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;

    // Validate dates if provided
    if (dateFrom && Number.isNaN(Date.parse(dateFrom))) {
      return NextResponse.json({ success: false, error: 'Invalid dateFrom parameter. Must be a valid ISO date string' }, { status: 400 });
    }
    if (dateTo && Number.isNaN(Date.parse(dateTo))) {
      return NextResponse.json({ success: false, error: 'Invalid dateTo parameter. Must be a valid ISO date string' }, { status: 400 });
    }

    // Sorting
    const sortByParam = (searchParams.get('sortBy') as 'publishedAt' | 'title' | '_createdAt' | null);
    const allowedSortBy = ['publishedAt', 'title', '_createdAt'] as const;
    const sortBy = sortByParam || 'publishedAt';
    if (!allowedSortBy.includes(sortBy as any)) {
      return NextResponse.json({ success: false, error: 'Invalid sortBy parameter. Must be one of: publishedAt, title, _createdAt' }, { status: 400 });
    }

    const orderParam = (searchParams.get('order') as 'asc' | 'desc' | null);
    const order: 'asc' | 'desc' = orderParam || 'desc';
    if (order !== 'asc' && order !== 'desc') {
      return NextResponse.json({ success: false, error: 'Invalid order parameter. Must be either asc or desc' }, { status: 400 });
    }

    // Enforce published-only status
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== 'published') {
      return NextResponse.json({ success: false, error: 'Only published posts are available through public API' }, { status: 400 });
    }

    const filters = {
      status: 'published' as const,
      category,
      search,
      dateFrom,
      dateTo,
      sortBy,
      order,
    };

    const result = await BlogPublicDataService.getFilteredPaginatedPosts(filters, page, limit);

    const body = {
      success: true as const,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        filters: {
          page,
          limit,
          ...filters,
        },
      },
    };

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const body = {
      success: false as const,
      error: 'Failed to fetch blog posts',
      message,
    };

    return NextResponse.json(body, {
      status: 500,
    });
  }
}