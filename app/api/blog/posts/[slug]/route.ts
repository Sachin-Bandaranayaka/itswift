import { NextRequest, NextResponse } from 'next/server';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await BlogPublicDataService.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false as const,
          error: 'Post not found',
          message: `No post found for slug: ${slug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true as const,
        data: post,
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false as const, error: 'Failed to fetch blog post', message },
      { status: 500 }
    );
  }
}