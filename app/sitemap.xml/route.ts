import { NextResponse } from 'next/server'

// Dynamic sitemap generator for better SEO
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itswift.com'
  const currentDate = new Date().toISOString().split('T')[0]

  // Define page type
  type SitemapPage = {
    url: string
    priority: string
    changefreq: string
    lastmod?: string
  }

  // Static pages with their priorities and change frequencies
  const staticPages: SitemapPage[] = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
    { url: '/about-us', priority: '0.9', changefreq: 'monthly' },
    { url: '/contact', priority: '0.9', changefreq: 'monthly' },
    { url: '/quote', priority: '0.9', changefreq: 'monthly' },
    { url: '/awards', priority: '0.8', changefreq: 'monthly' },
    { url: '/case-studies', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    
    // E-Learning Services
    { url: '/elearning-services', priority: '0.9', changefreq: 'weekly' },
    { url: '/elearning-services/custom-elearning', priority: '0.9', changefreq: 'weekly' },
    { url: '/elearning-services/rapid-elearning', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/micro-learning', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/game-based-elearning', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/video-based-training', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/ilt-to-elearning', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/webinar-to-elearning', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/convert-flash-to-html', priority: '0.7', changefreq: 'monthly' },
    { url: '/elearning-services/translation-localization', priority: '0.7', changefreq: 'monthly' },
    { url: '/elearning-services/elearning-translation-localization', priority: '0.7', changefreq: 'monthly' },
    { url: '/elearning-services/on-boarding', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-services/ai-powered-solutions', priority: '0.8', changefreq: 'weekly' },
    
    // E-Learning Solutions
    { url: '/elearning-solutions', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-solutions/compliance', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-solutions/on-boarding', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-solutions/sales-enablement', priority: '0.8', changefreq: 'monthly' },
    
    // E-Learning Consultancy
    { url: '/elearning-consultancy', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-consultancy/instructional-design', priority: '0.8', changefreq: 'monthly' },
    { url: '/elearning-consultancy/lms-implementation', priority: '0.8', changefreq: 'monthly' },
    
    // Legal and utility pages
    { url: '/privacy-policy', priority: '0.7', changefreq: 'yearly' },
  ]

  // TODO: Add dynamic blog posts from your CMS/database
  // Example for when you have blog posts:
  /*
  const blogPosts = await getBlogPosts() // Your function to fetch blog posts
  const blogUrls = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: post.updatedAt || post.publishedAt
  }))
  */

  const allPages = [
    ...staticPages,
    // ...blogUrls, // Uncomment when you have dynamic blog posts
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}