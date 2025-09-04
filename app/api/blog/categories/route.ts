import { NextResponse } from 'next/server';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

export async function GET() {
  try {
    const categories = await BlogPublicDataService.getAvailableCategories();
    
    // Transform to expected format
    const formattedCategories = categories.map(category => ({ title: category }));
    
    return NextResponse.json(formattedCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return empty array as fallback instead of error
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    });
  }
}