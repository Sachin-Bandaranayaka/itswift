import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag, pageSlug } = body

    // Revalidate specific path if provided
    if (path) {
      revalidatePath(path)
    }

    // Revalidate specific tag if provided
    if (tag) {
      revalidateTag(tag)
    }

    // Revalidate page-specific paths if pageSlug is provided
    if (pageSlug) {
      // Revalidate the main page
      revalidatePath(pageSlug === 'home' ? '/' : `/${pageSlug}`)
      
      // Revalidate the content API for this page
      revalidatePath(`/api/content?page=${pageSlug}`)
      
      // Revalidate any dynamic routes that might use this content
      revalidateTag(`content-${pageSlug}`)
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in revalidation API:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    )
  }
}