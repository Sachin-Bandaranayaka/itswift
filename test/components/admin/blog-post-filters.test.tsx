import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BlogPostFilters, BlogPostStatus, SortOption } from '@/components/admin/blog-post-filters'
import { vi } from 'vitest'

const defaultProps = {
  searchTerm: '',
  onSearchChange: vi.fn(),
  statusFilter: 'all' as BlogPostStatus,
  onStatusFilterChange: vi.fn(),
  sortBy: 'newest' as SortOption,
  onSortChange: vi.fn(),
  authorFilter: '',
  onAuthorFilterChange: vi.fn(),
  categoryFilter: '',
  onCategoryFilterChange: vi.fn(),
  dateRange: {},
  onDateRangeChange: vi.fn(),
  availableAuthors: ['John Doe', 'Jane Smith', 'Bob Johnson'],
  availableCategories: ['Technology', 'AI', 'Innovation'],
  totalPosts: 10,
  filteredCount: 8,
  onClearFilters: vi.fn()
}

describe('BlogPostFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input and basic filters', () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('Search posts by title, content, or author...')).toBeInTheDocument()
    expect(screen.getByText('Filter by status')).toBeInTheDocument()
    expect(screen.getByText('Sort by')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('handles search input changes', () => {
    const onSearchChange = vi.fn()
    render(<BlogPostFilters {...defaultProps} onSearchChange={onSearchChange} />)
    
    const searchInput = screen.getByPlaceholderText('Search posts by title, content, or author...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(onSearchChange).toHaveBeenCalledWith('test search')
  })

  it('shows clear search button when search term exists', () => {
    render(<BlogPostFilters {...defaultProps} searchTerm="test" />)
    
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    expect(clearButton).toBeInTheDocument()
    
    fireEvent.click(clearButton)
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('')
  })

  it('handles status filter changes', async () => {
    const onStatusFilterChange = vi.fn()
    render(<BlogPostFilters {...defaultProps} onStatusFilterChange={onStatusFilterChange} />)
    
    const statusSelect = screen.getByDisplayValue('All Posts')
    fireEvent.click(statusSelect)
    
    await waitFor(() => {
      const publishedOption = screen.getByText('Published')
      fireEvent.click(publishedOption)
    })
    
    expect(onStatusFilterChange).toHaveBeenCalledWith('published')
  })

  it('handles sort changes', async () => {
    const onSortChange = vi.fn()
    render(<BlogPostFilters {...defaultProps} onSortChange={onSortChange} />)
    
    const sortSelect = screen.getByDisplayValue('Newest First')
    fireEvent.click(sortSelect)
    
    await waitFor(() => {
      const oldestOption = screen.getByText('Oldest First')
      fireEvent.click(oldestOption)
    })
    
    expect(onSortChange).toHaveBeenCalledWith('oldest')
  })

  it('shows advanced filters when toggle is clicked', () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    
    expect(screen.getByText('Author')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('From Date')).toBeInTheDocument()
    expect(screen.getByText('To Date')).toBeInTheDocument()
  })

  it('shows available authors in advanced filters', async () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    // Open advanced filters
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    
    // Open author dropdown
    const authorSelect = screen.getByDisplayValue('All authors')
    fireEvent.click(authorSelect)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  it('shows available categories in advanced filters', async () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    // Open advanced filters
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    
    // Open category dropdown
    const categorySelect = screen.getByDisplayValue('All categories')
    fireEvent.click(categorySelect)
    
    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('AI')).toBeInTheDocument()
      expect(screen.getByText('Innovation')).toBeInTheDocument()
    })
  })

  it('handles date range changes', () => {
    const onDateRangeChange = vi.fn()
    render(<BlogPostFilters {...defaultProps} onDateRangeChange={onDateRangeChange} />)
    
    // Open advanced filters
    const filtersButton = screen.getByText('Filters')
    fireEvent.click(filtersButton)
    
    // Change start date
    const startDateInput = screen.getByLabelText(/from date/i)
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } })
    
    expect(onDateRangeChange).toHaveBeenCalledWith({ start: '2024-01-01' })
  })

  it('shows results summary', () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    expect(screen.getByText('Showing 8 of 10 posts')).toBeInTheDocument()
  })

  it('shows filtered indicator when filters are active', () => {
    render(<BlogPostFilters {...defaultProps} searchTerm="test" />)
    
    expect(screen.getByText('(filtered)')).toBeInTheDocument()
  })

  it('shows active filter badges', () => {
    render(
      <BlogPostFilters 
        {...defaultProps} 
        searchTerm="test"
        statusFilter="published"
        authorFilter="John Doe"
      />
    )
    
    expect(screen.getByText('Search: "test"')).toBeInTheDocument()
    expect(screen.getByText('published')).toBeInTheDocument()
    expect(screen.getByText('Author: John Doe')).toBeInTheDocument()
  })

  it('shows clear filters button when filters are active', () => {
    const onClearFilters = vi.fn()
    render(
      <BlogPostFilters 
        {...defaultProps} 
        searchTerm="test"
        onClearFilters={onClearFilters}
      />
    )
    
    const clearButton = screen.getByText('Clear')
    expect(clearButton).toBeInTheDocument()
    
    fireEvent.click(clearButton)
    expect(onClearFilters).toHaveBeenCalled()
  })

  it('shows filter count badge on filters button', () => {
    render(
      <BlogPostFilters 
        {...defaultProps} 
        searchTerm="test"
        statusFilter="published"
        authorFilter="John Doe"
      />
    )
    
    // Should show badge with count of active filters
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('allows removing individual filter badges', () => {
    const onSearchChange = vi.fn()
    const onStatusFilterChange = vi.fn()
    
    render(
      <BlogPostFilters 
        {...defaultProps} 
        searchTerm="test"
        statusFilter="published"
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
      />
    )
    
    // Find and click the X button on search filter badge
    const searchBadge = screen.getByText('Search: "test"')
    const searchClearButton = searchBadge.parentElement?.querySelector('svg')
    if (searchClearButton) {
      fireEvent.click(searchClearButton)
      expect(onSearchChange).toHaveBeenCalledWith('')
    }
    
    // Find and click the X button on status filter badge
    const statusBadge = screen.getByText('published')
    const statusClearButton = statusBadge.parentElement?.querySelector('svg')
    if (statusClearButton) {
      fireEvent.click(statusClearButton)
      expect(onStatusFilterChange).toHaveBeenCalledWith('all')
    }
  })

  it('shows correct post counts in status filter options', async () => {
    render(<BlogPostFilters {...defaultProps} />)
    
    const statusSelect = screen.getByDisplayValue('All Posts')
    fireEvent.click(statusSelect)
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument() // Total posts count
    })
  })
})