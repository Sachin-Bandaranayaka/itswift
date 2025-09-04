import { urlForImage } from '@/lib/sanity.image';
import { BlogApiClient } from '@/lib/services/blog-api-client';
import Image from 'next/image';
import { format } from 'date-fns';
import { PortableText } from '@portabletext/react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SocialShareButtons } from '@/components/blog/social-share-buttons';
import { BlogErrorBoundary } from '@/components/blog/blog-error-boundary';
import { BlogErrorFallback } from '@/components/blog/blog-error-fallback';

interface Post {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage: any;
    body: any;
    publishedAt: string;
    author: {
        name: string;
        image: any;
        bio: any;
    };
    categories: Array<{ title: string }>;
    excerpt?: string;
}

interface Props {
    params: {
        slug: string;
    };
}

// Calculate reading time based on word count
function calculateReadingTime(body: any[]): number {
    if (!body || !Array.isArray(body)) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = body
        .filter(block => block._type === 'block' && block.children)
        .reduce((count, block) => {
            const blockText = block.children
                .map((child: any) => child.text || '')
                .join(' ');
            return count + blockText.split(/\s+/).filter(word => word.length > 0).length;
        }, 0);
    
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const post = await BlogApiClient.getPostBySlug(params.slug) as Post;

        if (!post) {
            return {
                title: 'Post Not Found',
                description: 'The requested blog post could not be found.',
            };
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swiftsolution.com';
        const postUrl = `${siteUrl}/blog/${params.slug}`;
        const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.width(1200).height(630).url() : `${siteUrl}/og-image.jpg`;
        
        // Create excerpt from body if not available
        const description = post.excerpt || 
            (post.body && Array.isArray(post.body) ? 
                post.body
                    .filter(block => block._type === 'block' && block.children)
                    .map(block => block.children.map((child: any) => child.text).join(''))
                    .join(' ')
                    .substring(0, 160) + '...' 
                : 'Read this insightful blog post about eLearning and corporate training.');

        const publishedTime = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
        const categories = post.categories?.map(cat => cat.title) || [];

        return {
            title: `${post.title} | Swift Solution Blog`,
            description,
            keywords: `${categories.join(', ')}, eLearning, corporate training, Swift Solution`,
            authors: [{ name: post.author?.name || 'Swift Solution' }],
            publishedTime,
            alternates: {
                canonical: postUrl,
            },
            openGraph: {
                type: 'article',
                locale: 'en_US',
                url: postUrl,
                siteName: 'Swift Solution',
                title: post.title,
                description,
                images: [
                    {
                        url: imageUrl || '',
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                publishedTime,
                authors: [post.author?.name || 'Swift Solution'],
                tags: categories,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description,
                images: [imageUrl || ''],
                creator: '@SwiftSolution',
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post | Swift Solution',
            description: 'Read our latest insights on eLearning and corporate training.',
        };
    }
}

// Error fallback component for blog post
function BlogPostErrorFallback({ error, onRetry }: { error: Error; onRetry?: () => void }) {
    return (
        <div className="container mx-auto px-4 py-12">
            <BlogErrorFallback
                error={error}
                onRetry={onRetry}
                showRetry={false}
            />
        </div>
    )
}

export default async function BlogPost({ params }: Props) {
    try {
        const post = await BlogApiClient.getPostBySlug(params.slug) as Post;

        if (!post) {
            notFound();
        }

        // Generate structured data for SEO
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swiftsolution.com';
        const postUrl = `${siteUrl}/blog/${params.slug}`;
        const imageUrl = post.mainImage ? urlForImage(post.mainImage)?.url() : undefined;
        
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt || post.title,
            image: imageUrl ? [imageUrl] : undefined,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: {
                '@type': 'Person',
                name: post.author?.name || 'Swift Solution',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Swift Solution',
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logo.png`,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': postUrl,
            },
            keywords: post.categories?.map(cat => cat.title).join(', '),
            articleSection: post.categories?.[0]?.title || 'eLearning',
            url: postUrl,
        };

        return (
            <BlogErrorBoundary showBackToBlog={true}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <article className="container mx-auto px-4 py-8">
                    {/* Breadcrumb Navigation */}
                    <nav className="max-w-3xl mx-auto mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li>
                                <a href="/" className="hover:text-gray-900">Home</a>
                            </li>
                            <li>/</li>
                            <li>
                                <a href="/blog" className="hover:text-gray-900">Blog</a>
                            </li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium truncate" title={post.title}>
                                {post.title}
                            </li>
                        </ol>
                    </nav>

                    <header className="max-w-3xl mx-auto mb-8">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4 text-gray-600">
                                {post.author?.image && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={urlForImage(post.author.image)?.url() || ''}
                                            alt={post.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{post.author?.name}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        {post.publishedAt && (
                                            <time dateTime={post.publishedAt}>
                                                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                                            </time>
                                        )}
                                        {post.body && (
                                            <>
                                                <span>•</span>
                                                <span>{calculateReadingTime(post.body)} min read</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <SocialShareButtons 
                                url={postUrl}
                                title={post.title}
                                description={post.excerpt || post.title}
                            />
                        </div>
                    </header>

                {post.mainImage && (
                    <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={urlForImage(post.mainImage)?.url() || ''}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="max-w-3xl mx-auto prose prose-lg prose-gray dark:prose-invert">
                    <PortableText
                        value={post.body}
                        components={{
                            types: {
                                image: ({ value }) => (
                                    <figure className="my-8">
                                        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                                            <Image
                                                src={urlForImage(value)?.url() || ''}
                                                alt={value.alt || ''}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        {value.alt && (
                                            <figcaption className="text-center text-sm text-gray-600 mt-2">
                                                {value.alt}
                                            </figcaption>
                                        )}
                                    </figure>
                                ),
                            },
                            block: {
                                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700">
                                        {children}
                                    </blockquote>
                                ),
                            },
                            marks: {
                                link: ({ children, value }) => (
                                    <a
                                        href={value.href}
                                        target={value.blank ? '_blank' : undefined}
                                        rel={value.blank ? 'noopener noreferrer' : undefined}
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        {children}
                                    </a>
                                ),
                            },
                        }}
                    />
                </div>

                {post.categories && post.categories.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-8">
                        <div className="flex flex-wrap gap-2">
                            {post.categories.map((category) => (
                                <span
                                    key={category.title}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {post.author?.bio && (
                    <div className="max-w-3xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">About the Author</h2>
                        <div className="prose">
                            <PortableText value={post.author.bio} />
                        </div>
                    </div>
                )}

                {/* Social sharing at the bottom */}
                <div className="max-w-3xl mx-auto mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-600">Share this article:</p>
                        <SocialShareButtons 
                            url={postUrl}
                            title={post.title}
                            description={post.excerpt || post.title}
                            size="sm"
                        />
                    </div>
                    
                    {/* Back to Blog button */}
                    <div className="text-center">
                        <a
                            href="/blog"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            ← Back to Blog
                        </a>
                    </div>
                </div>
            </article>
            </BlogErrorBoundary>
        );
    } catch (error) {
        console.error('Error loading blog post:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('fetch') || error.message.includes('network')) {
                return (
                    <BlogPostErrorFallback 
                        error={new Error('Unable to load blog post. Please check your internet connection and try again.')}
                    />
                );
            }
            
            if (error.message.includes('timeout')) {
                return (
                    <BlogPostErrorFallback 
                        error={new Error('Blog post loading timed out. Please try again.')}
                    />
                );
            }
        }
        
        // Generic fallback for when Sanity client isn't configured or other errors
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Unable to Load Blog Post</h1>
                    <p className="text-gray-600 mb-6">
                        We're experiencing technical difficulties loading this blog post. 
                        This might be due to a temporary issue with our content management system.
                    </p>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                            You can try refreshing the page or return to the blog homepage.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Refresh Page
                            </button>
                            <a 
                                href="/blog"
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back to Blog
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 