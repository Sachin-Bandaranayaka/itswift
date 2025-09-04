'use client'

import { Skeleton } from "@/components/ui/skeleton"

interface BlogLoadingSkeletonProps {
  count?: number
}

export function BlogLoadingSkeleton({ count = 9 }: BlogLoadingSkeletonProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <BlogPostCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function BlogPostCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />
      
      <div className="p-6">
        {/* Categories skeleton */}
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}