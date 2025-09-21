import { BlogSupabaseService } from '@/lib/services/blog-supabase-service';
import type { BlogPost } from '@/lib/services/blog-supabase-service';
import Image from 'next/image';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SocialShareButtons } from '@/components/blog/social-share-buttons';
import { BlogErrorBoundary } from '@/components/blog/blog-error-boundary';
import { BlogErrorFallback } from '@/components/blog/blog-error-fallback';

type Post = BlogPost;

interface Props {
    params: {
        slug: string;
    };
}

// Calculate reading time based on word count
function calculateReadingTime(content: string): number {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
    
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const blogService = new BlogSupabaseService();
        const post = await blogService.getPostBySlug(params.slug);

        if (!post) {
            return {
                title: 'Post Not Found',
                description: 'The requested blog post could not be found.',
            };
        }

        const imageUrl = post.featured_image_url || undefined;
        const publishedDate = post.published_at ? new Date(post.published_at).toISOString() : undefined;
        const categoryName = post.category?.name;

        return {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on our blog`,
            openGraph: {
                title: post.title,
                description: post.excerpt || `Read ${post.title} on our blog`,
                type: 'article',
                publishedTime: publishedDate,
                authors: post.author?.name ? [post.author.name] : undefined,
                tags: categoryName ? [categoryName] : undefined,
                images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || `Read ${post.title} on our blog`,
                images: imageUrl ? [imageUrl] : undefined,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post',
            description: 'Read our latest blog post',
        };
    }
}

function BlogPostErrorFallback({ errorMessage, onRetry }: { errorMessage: string; onRetry?: () => void }) {
    return (
        <BlogErrorFallback 
            error={errorMessage}
            onRetry={onRetry}
        />
    );
}

export default async function BlogPost({ params }: Props) {
    try {
        const blogService = new BlogSupabaseService();
        const post = await blogService.getPostBySlug(params.slug);

        if (!post) {
            notFound();
        }

        // Increment view count
        await blogService.incrementViews(post.id);

        const imageUrl = post.featured_image_url || undefined;
        const publishedDate = post.published_at ? new Date(post.published_at) : null;
        const readingTime = calculateReadingTime(post.content || '');

        return (
            <BlogErrorBoundary>
                <article className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="mb-4">
                            {post.category && (
                                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                    {post.category.name}
                                </span>
                            )}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {post.title}
                        </h1>
                        
                        {post.excerpt && (
                            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {publishedDate && (
                                <time dateTime={post.published_at}>
                                    {format(publishedDate, 'MMMM d, yyyy')}
                                </time>
                            )}
                            
                            {post.author?.name && (
                                 <span>By {post.author.name}</span>
                             )}
                            
                            <span>{readingTime} min read</span>
                            
                            {post.views && post.views > 0 && (
                                <span>{post.views.toLocaleString()} views</span>
                            )}
                        </div>
                    </header>

                    {/* Featured Image */}
                    {imageUrl && (
                        <div className="mb-8">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none mb-8">
                        {post.content && (
                            <div 
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                className="prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border"
                            />
                        )}
                    </div>

                    {/* Social Share */}
                    <div className="border-t pt-8">
                        <SocialShareButtons 
                            url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
                            title={post.title}
                            description={post.excerpt}
                        />
                    </div>
                </article>
            </BlogErrorBoundary>
        );
    } catch (error) {
        console.error('Error loading blog post:', error);
        return (
            <BlogPostErrorFallback 
                errorMessage="Failed to load blog post. Please try again later."
            />
        );
    }
}