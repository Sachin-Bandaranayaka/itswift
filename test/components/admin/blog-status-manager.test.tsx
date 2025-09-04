import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BlogStatusManager, BlogPostStatus } from '@/components/admin/blog-status-manager'
import { vi } from 'vitest'

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockPosts = [
  {
    _id: '1',
    title: 'Published Post',
    slug: { current: 'published-post' },
    author: { name: 'John Doe' },
    publishedAt: '2024-01-01T10:00:00Z',
    categories: [{ title: 'Technology' }],
    _createdAt: '2024-01-01T09:00:00Z',
    _updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Draft Post',
    slug: { current: 'draft-post' },
    author: { name: 'Jane Smith' },
    categories: [{ title: 'AI' }],
    _createdAt: '2024-01-02T09:00:00Z',
    _updatedAt: '2024-01-02T09:00:00Z'
  },
  {
    _id: '3',
    title: 'Scheduled Post',
    slug: { current: 'scheduled-post' },
    author: { name: 'Bob Johnson' },
    publishedAt: '2024-12-31T10:00:00Z', // Future date
    categories: [{ title: 'Innovation' }],
    _createdAt: '2024-01-03T09:00:00Z',
    _updatedAt: '2024-01-03T09:00:00Z'
  }
]

const defaultProps = {
  posts: mockPosts,
  selectedPosts: [],
  onSelectionChange: vi.fn(),
  onStatusChange: vi.fn(),
  onDeletePosts: vi.fn(),
  onDuplicatePost: vi.fn(),
  onRefresh: vi.fn()
}

describe('BlogStatusManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all posts with correct status indicators', () => {
    render(<BlogStatusManager {...defaultProps} />)
    
    expect(screen.getByText('Published Post')).toBeInTheDocument()
    expect(screen.getByText('Draft Post')).toBeInTheDocument()
    expect(screen.getByText('Scheduled Post')).toBeInTheDocument()
    
    // Check status badges
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('handles post selection correctly', () => {
    const onSelectionChange = vi.fn()
    render(<BlogStatusManager {...defaultProps} onSelectionChange={onSelectionChange} />)
    
    // Select first post
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // First post checkbox (index 0 is select all)
    
    expect(onSelectionChange).toHaveBeenCalledWith(['1'])
  })

  it('handles select all functionality', () => {
    const onSelectionChange = vi.fn()
    render(<BlogStatusManager {...defaultProps} onSelectionChange={onSelectionChange} />)
    
    // Click select all checkbox
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(selectAllCheckbox)
    
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3'])
  })

  it('shows bulk actions when posts are selected', () => {
    render(<BlogStatusManager {...defaultProps} selectedPosts={['1', '2']} />)
    
    expect(screen.getByText('2 of 3 selected')).toBeInTheDocument()
    expect(screen.getByText('Bulk actions...')).toBeInTheDocument()
  })

  it('handles individual status changes', async () => {
    const onStatusChange = vi.fn().mockResolvedValue(undefined)
    const onRefresh = vi.fn()
    
    render(
      <BlogStatusManager 
        {...defaultProps} 
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
      />
    )
    
    // Find and click on a status dropdown
    const statusSelects = screen.getAllByRole('combobox')
    fireEvent.click(statusSelects[0]) // First post status dropdown
    
    // Wait for dropdown to open and select published option
    await waitFor(() => {
      const publishedOption = screen.getByText('Published')
      fireEvent.click(publishedOption)
    })
    
    expect(onStatusChange).toHaveBeenCalledWith(['1'], 'published', expect.any(String))
    expect(onRefresh).toHaveBeenCalled()
  })

  it('handles bulk status changes', async () => {
    const onStatusChange = vi.fn().mockResolvedValue(undefined)
    const onRefresh = vi.fn()
    
    render(
      <BlogStatusManager 
        {...defaultProps} 
        selectedPosts={['1', '2']}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
      />
    )
    
    // Select bulk action
    const bulkActionSelect = screen.getByDisplayValue('Bulk actions...')
    fireEvent.click(bulkActionSelect)
    
    await waitFor(() => {
      const publishOption = screen.getByText('Publish Now')
      fireEvent.click(publishOption)
    })
    
    // Click apply button
    const applyButton = screen.getByText('Apply')
    fireEvent.click(applyButton)
    
    await waitFor(() => {
      expect(onStatusChange).toHaveBeenCalledWith(['1', '2'], 'published', expect.any(String))
      expect(toast.success).toHaveBeenCalledWith('Published 2 posts')
    })
  })

  it('handles post duplication', async () => {
    const onDuplicatePost = vi.fn()
    
    render(<BlogStatusManager {...defaultProps} onDuplicatePost={onDuplicatePost} />)
    
    // Click on more options for first post
    const moreButtons = screen.getAllByRole('button', { name: /more/i })
    fireEvent.click(moreButtons[0])
    
    await waitFor(() => {
      const duplicateOption = screen.getByText('Duplicate')
      fireEvent.click(duplicateOption)
    })
    
    expect(onDuplicatePost).toHaveBeenCalledWith('1')
  })

  it('handles post deletion with confirmation', async () => {
    const onDeletePosts = vi.fn()
    
    // Mock window.confirm
    const originalConfirm = window.confirm
    window.confirm = vi.fn(() => true)
    
    render(<BlogStatusManager {...defaultProps} onDeletePosts={onDeletePosts} />)
    
    // Click on more options for first post
    const moreButtons = screen.getAllByRole('button', { name: /more/i })
    fireEvent.click(moreButtons[0])
    
    await waitFor(() => {
      const deleteOption = screen.getByText('Delete')
      fireEvent.click(deleteOption)
    })
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this post?')
    expect(onDeletePosts).toHaveBeenCalledWith(['1'])
    
    // Restore original confirm
    window.confirm = originalConfirm
  })

  it('shows correct post metadata', () => {
    render(<BlogStatusManager {...defaultProps} />)
    
    // Check author names
    expect(screen.getByText('by John Doe')).toBeInTheDocument()
    expect(screen.getByText('by Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('by Bob Johnson')).toBeInTheDocument()
    
    // Check categories
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Innovation')).toBeInTheDocument()
  })

  it('handles bulk delete with confirmation', async () => {
    const onDeletePosts = vi.fn()
    
    // Mock window.confirm
    const originalConfirm = window.confirm
    window.confirm = vi.fn(() => true)
    
    render(
      <BlogStatusManager 
        {...defaultProps} 
        selectedPosts={['1', '2']}
        onDeletePosts={onDeletePosts}
      />
    )
    
    // Select delete bulk action
    const bulkActionSelect = screen.getByDisplayValue('Bulk actions...')
    fireEvent.click(bulkActionSelect)
    
    await waitFor(() => {
      const deleteOption = screen.getByText('Delete')
      fireEvent.click(deleteOption)
    })
    
    // Click apply button
    const applyButton = screen.getByText('Apply')
    fireEvent.click(applyButton)
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete 2 posts? This action cannot be undone.')
    expect(onDeletePosts).toHaveBeenCalledWith(['1', '2'])
    
    // Restore original confirm
    window.confirm = originalConfirm
  })
})