'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

export interface BlogFilters {
  search: string
  category: string
  sortBy: 'published_at' | 'title'
  sortOrder: 'asc' | 'desc'
}

interface BlogFiltersProps {
  filters: BlogFilters
  categories: string[]
  onFiltersChange: (filters: BlogFilters) => void
  isLoading?: boolean
}

export function BlogFiltersComponent({ 
  filters, 
  categories, 
  onFiltersChange, 
  isLoading = false 
}: BlogFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({ ...filters, search: localSearch })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, filters, onFiltersChange])

  const handleClearFilters = () => {
    setLocalSearch('')
    onFiltersChange({
      search: '',
      category: '',
      sortBy: 'published_at',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = filters.search || filters.category || 
    filters.sortBy !== 'published_at' || filters.sortOrder !== 'desc'

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setLocalSearch('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || "all"}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value === "all" ? "" : value })}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-') as [BlogFilters['sortBy'], BlogFilters['sortOrder']]
            onFiltersChange({ ...filters, sortBy, sortOrder })
          }}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published_at-desc">Newest First</SelectItem>
            <SelectItem value="published_at-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Active filters:</span>
          </div>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setLocalSearch('')
                  onFiltersChange({ ...filters, search: '' })
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ ...filters, category: '' })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(filters.sortBy !== 'published_at' || filters.sortOrder !== 'desc') && (
            <Badge variant="secondary" className="gap-1">
              Sort: {filters.sortBy === 'published_at' ? 'Date' : 'Title'} ({filters.sortOrder === 'desc' ? 'Desc' : 'Asc'})
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFiltersChange({ ...filters, sortBy: 'published_at', sortOrder: 'desc' })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}