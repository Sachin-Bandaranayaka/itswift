'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlogPost } from "@/lib/services/blog-supabase-service"
import { Calendar, User, ImageIcon } from "lucide-react"

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const imageUrl = post.featured_image_url || null
  const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {imageUrl && !imageError ? (
        <div className="relative h-48 w-full bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 w-full h-full" />
            </div>
          )}
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
      ) : imageUrl && imageError ? (
        <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      ) : null}
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="line-clamp-2 block">
            {post.title}
          </Link>
        </h2>
        
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            {publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
            )}
            
            {post.author?.name && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button variant="outline" asChild className="w-full">
          <Link href={`/blog/${post.slug}`}>
            Read More
          </Link>
        </Button>
      </div>
    </div>
  )
}