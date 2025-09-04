'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  X,
  Calendar,
  User,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive
} from "lucide-react"

export type BlogPostStatus = 'all' | 'draft' | 'scheduled' | 'published' | 'archived'
export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'author'

interface BlogPostFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: BlogPostStatus
  onStatusFilterChange: (status: BlogPostStatus) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  authorFilter: string
  onAuthorFilterChange: (author: string) => void
  categoryFilter: string
  onCategoryFilterChange: (category: string) => void
  dateRange: { start?: string, end?: string }
  onDateRangeChange: (range: { start?: string, end?: string }) => void
  availableAuthors: string[]
  availableCategories: string[]
  totalPosts: number
  filteredCount: number
  onClearFilters: () => void
}

export function BlogPostFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  authorFilter,
  onAuthorFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  dateRange,
  onDateRangeChange,
  availableAuthors,
  availableCategories,
  totalPosts,
  filteredCount,
  onClearFilters
}: BlogPostFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const getStatusIcon = (status: BlogPostStatus) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'draft':
        return <AlertCircle className="h-4 w-4" />
      case 'archived':
        return <Archive className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusCount = (status: BlogPostStatus) => {
    // This would be calculated from the actual posts data
    // For now, we'll show the filtered count for the current status
    return status === statusFilter ? filteredCount : 0
  }

  const hasActiveFilters = 
    searchTerm || 
    statusFilter !== 'all' || 
    (authorFilter && authorFilter !== 'all') || 
    (categoryFilter && categoryFilter !== 'all') || 
    dateRange.start || 
    dateRange.end

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posts by title, content, or author..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center justify-between w-full">
                <span>All Posts</span>
                <Badge variant="outline" className="ml-2">
                  {totalPosts}
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="published">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Published
                </div>
              </div>
            </SelectItem>
            <SelectItem value="scheduled">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Scheduled
                </div>
              </div>
            </SelectItem>
            <SelectItem value="draft">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  Draft
                </div>
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Archive className="h-4 w-4 mr-2 text-gray-600" />
                  Archived
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={showAdvancedFilters ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {[searchTerm, statusFilter !== 'all', authorFilter, categoryFilter, dateRange.start, dateRange.end]
                .filter(Boolean).length}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Author Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                <User className="h-4 w-4 inline mr-1" />
                Author
              </label>
              <Select value={authorFilter} onValueChange={onAuthorFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {availableAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                <Tag className="h-4 w-4 inline mr-1" />
                Category
              </label>
              <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Start */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <Input
                type="date"
                value={dateRange.start || ''}
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <Input
                type="date"
                value={dateRange.end || ''}
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          Showing {filteredCount} of {totalPosts} posts
          {hasActiveFilters && (
            <span className="ml-2">
              (filtered)
            </span>
          )}
        </div>
        
        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span>Filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getStatusIcon(statusFilter)}
                {statusFilter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onStatusFilterChange('all')}
                />
              </Badge>
            )}
            {authorFilter && authorFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Author: {authorFilter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onAuthorFilterChange('all')}
                />
              </Badge>
            )}
            {categoryFilter && categoryFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categoryFilter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onCategoryFilterChange('all')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}