import { client } from '@/lib/sanity.client';
import { urlForImage } from '@/lib/sanity.image';
import { postQuery } from '@/lib/queries';
import Image from 'next/image';
import { format } from 'date-fns';
import { PortableText } from '@portabletext/react';

interface Post {
    _id: string;
    title: string;
    mainImage: any;
    body: any;
    publishedAt: string;
    author: {
        name: string;
        image: any;
        bio: any;
    };
    categories: Array<{ title: string }>;
}

interface Props {
    params: {
        slug: string;
    };
}

export default async function BlogPost({ params }: Props) {
    try {
        const post = await client.fetch<Post>(postQuery, { slug: params.slug });

        if (!post) {
            return <div className="container mx-auto px-4 py-16 text-center">Post not found</div>;
        }

        return (
            <article className="container mx-auto px-4 py-8">
                <header className="max-w-3xl mx-auto mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-6">
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
                            {post.publishedAt && (
                                <time dateTime={post.publishedAt} className="text-sm">
                                    {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                                </time>
                            )}
                        </div>
                    </div>
                </header>

                {post.mainImage && (
                    <div className="relative w-full h-[400px] mb-8">
                        <Image
                            src={urlForImage(post.mainImage)?.url() || ''}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="max-w-3xl mx-auto prose prose-lg">
                    <PortableText
                        value={post.body}
                        components={{
                            types: {
                                image: ({ value }) => (
                                    <div className="relative w-full h-[400px] my-8">
                                        <Image
                                            src={urlForImage(value)?.url() || ''}
                                            alt={value.alt || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
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
            </article>
        );
    } catch (error) {
        // Fallback for when Sanity client isn't configured or other errors
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Blog Coming Soon</h1>
                <p className="text-gray-600">This blog is currently under construction. Please check back later.</p>
            </div>
        );
    }
} 