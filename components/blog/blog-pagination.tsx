'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaginationInfo } from "@/lib/services/blog-public-data"

interface BlogPaginationProps {
  pagination: PaginationInfo
  basePath?: string
}

export function BlogPagination({ pagination, basePath = "/blog" }: BlogPaginationProps) {
  const { currentPage, totalPages, hasPrev, hasNext } = pagination

  if (totalPages <= 1) {
    return null
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath
    }
    return `${basePath}?page=${page}`
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={1 === currentPage ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={getPageUrl(1)}>1</Link>
        </Button>
      )
      
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-muted-foreground">
            ...
          </span>
        )
      }
    }

    // Add visible page numbers
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={getPageUrl(page)}>{page}</Link>
        </Button>
      )
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-muted-foreground">
            ...
          </span>
        )
      }
      
      pages.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={getPageUrl(totalPages)}>{totalPages}</Link>
        </Button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        asChild={hasPrev}
      >
        {hasPrev ? (
          <Link href={getPageUrl(currentPage - 1)} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}
      </Button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        asChild={hasNext}
      >
        {hasNext ? (
          <Link href={getPageUrl(currentPage + 1)} className="flex items-center gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  )
}