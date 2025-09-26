import { Suspense } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/blog')
}
import { BlogPageContent } from "./blog-page-content"
import { BlogLoadingSkeleton } from "@/components/blog/blog-loading-skeleton"
import { BlogErrorBoundary } from "@/components/blog/blog-error-boundary"

export default function BlogPage() {
  return (
    <BlogErrorBoundary>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <BlogLoadingSkeleton />
        </div>
      }>
        <BlogPageContent />
      </Suspense>
    </BlogErrorBoundary>
  )
}
