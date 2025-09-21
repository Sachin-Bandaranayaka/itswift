import { BlogPost } from '@/lib/services/blog-supabase-service';

interface BlogJsonLdProps {
  post: BlogPost;
  fullUrl: string;
  siteUrl: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function BlogJsonLd({ post, fullUrl, siteUrl }: BlogJsonLdProps) {
  // Generate FAQ items based on blog content
  const generateFAQs = (post: BlogPost): FAQItem[] => {
    const category = post.category?.name || 'eLearning';
    
    return [
      {
        question: `What is the main problem this ${category.toLowerCase()} article solves?`,
        answer: post.excerpt || `This article addresses key challenges in ${category.toLowerCase()} and provides practical solutions for better learning outcomes.`
      },
      {
        question: `What is the key solution or takeaway from "${post.title}"?`,
        answer: `The main takeaway is understanding how to effectively implement ${category.toLowerCase()} strategies that drive measurable results and improve learning engagement.`
      },
      {
        question: `How can I implement the advice from this ${category.toLowerCase()} article?`,
        answer: `Start by assessing your current learning strategy, then apply the step-by-step recommendations outlined in the article to achieve better training outcomes.`
      }
    ];
  };

  const faqs = generateFAQs(post);
  const publishedDate = post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const modifiedDate = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : publishedDate;
  const imageUrl = post.featured_image_url || `${siteUrl}/placeholder.jpg`;
  const authorName = post.author?.name || 'Swift Solution Team';
  const category = post.category?.name || 'eLearning';
  
  // Generate keywords based on category and title
  const generateKeywords = (title: string, category: string): string => {
    const baseKeywords = ['eLearning', 'corporate training', 'instructional design'];
    const categoryKeywords = category.toLowerCase().includes('ai') ? ['AI in education', 'artificial intelligence'] : [category.toLowerCase()];
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3);
    
    return [...baseKeywords, ...categoryKeywords, ...titleWords].join(', ');
  };

  const keywords = generateKeywords(post.title, category);

  const structuredData: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        "headline": post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title,
        "description": post.excerpt?.length && post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt || `Read ${post.title} - Expert insights on ${category.toLowerCase()} from Swift Solution`,
        "image": {
          "@type": "ImageObject",
          "url": imageUrl,
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": `${siteUrl}/about-us`
        },
        "publisher": {
          "@type": "Organization",
          "name": "Swift Solution Pvt Ltd",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/IMAGES/Swift_logo_new.png`
          }
        },
        "datePublished": publishedDate,
        "dateModified": modifiedDate,
        "articleSection": category,
        "keywords": keywords
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": fullUrl
          }
        ]
      }
    ]
  };

  // Add VideoObject if the post contains video content
  if (post.content && (post.content.includes('youtube.com') || post.content.includes('vimeo.com') || post.content.includes('video'))) {
    const videoSchema = {
      "@type": "VideoObject",
      "name": `${post.title} - Video Guide`,
      "description": `Video content for ${post.title} - ${post.excerpt || 'Expert insights on eLearning and corporate training'}`,
      "thumbnailUrl": imageUrl,
      "uploadDate": publishedDate,
      "duration": "PT5M", // Default 5 minutes, can be made dynamic
      "publisher": {
        "@type": "Organization",
        "name": "Swift Solution Pvt Ltd",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/IMAGES/Swift_logo_new.png`
        }
      }
    };
    
    structuredData["@graph"].push(videoSchema);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}