import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialPostComposer } from '@/components/admin/social-post-composer'

// Mock the MediaUpload component
vi.mock('@/components/admin/media-upload', () => ({
  MediaUpload: ({ onUpload }: { onUpload: (url: string) => void }) => (
    <div data-testid="media-upload">
      <button onClick={() => onUpload('https://example.com/test.jpg')}>
        Upload Media
      </button>
    </div>
  )
}))

// Mock the SocialPostPreview component
vi.mock('@/components/admin/social-post-preview', () => ({
  SocialPostPreview: ({ content, platform }: { content: string; platform: string }) => (
    <div data-testid={`preview-${platform}`}>
      Preview: {content}
    </div>
  )
}))

// Mock fetch
global.fetch = vi.fn()

const mockProps = {
  onSave: vi.fn(),
  onSchedule: vi.fn(),
  isLoading: false
}

describe('SocialPostComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { id: 'test-post-id' } })
    })
  })

  it('renders all form elements', () => {
    render(<SocialPostComposer {...mockProps} />)
    
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('X (Twitter)')).toBeInTheDocument()
    expect(screen.getByText('Save Draft')).toBeInTheDocument()
    expect(screen.getByText('Schedule Post')).toBeInTheDocument()
    expect(screen.getByText('Publish Now')).toBeInTheDocument()
  })

  it('updates content when typing', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'Test post content')
    
    expect(textarea).toHaveValue('Test post content')
  })

  it('toggles platform selection', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const linkedinCheckbox = screen.getByRole('checkbox', { name: /linkedin/i })
    const twitterCheckbox = screen.getByRole('checkbox', { name: /x \(twitter\)/i })
    
    // Initially both should be checked
    expect(linkedinCheckbox).toBeChecked()
    expect(twitterCheckbox).toBeChecked()
    
    // Uncheck LinkedIn
    await user.click(linkedinCheckbox)
    expect(linkedinCheckbox).not.toBeChecked()
    expect(twitterCheckbox).toBeChecked()
  })

  it('shows character count for different platforms', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'A'.repeat(100))
    
    // Should show character counts for both platforms
    expect(screen.getByText('100/3000')).toBeInTheDocument() // LinkedIn
    expect(screen.getByText('100/280')).toBeInTheDocument() // Twitter
  })

  it('warns when content exceeds platform limits', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'A'.repeat(300)) // Exceeds Twitter limit
    
    expect(screen.getByText('300/280')).toBeInTheDocument()
    // Should show warning styling (you might need to check for specific classes)
  })

  it('handles media upload', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const uploadButton = screen.getByText('Upload Media')
    await user.click(uploadButton)
    
    expect(screen.getByDisplayValue('https://example.com/test.jpg')).toBeInTheDocument()
  })

  it('calls onSave when Save Draft is clicked', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'Draft content')
    
    const saveButton = screen.getByText('Save Draft')
    await user.click(saveButton)
    
    expect(mockProps.onSave).toHaveBeenCalledWith({
      content: 'Draft content',
      platforms: ['linkedin', 'twitter'],
      mediaUrls: [],
      scheduleDate: undefined
    })
  })

  it('publishes post immediately when Publish Now is clicked', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'Immediate post')
    
    const publishButton = screen.getByText('Publish Now')
    await user.click(publishButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Immediate post',
          platforms: ['linkedin', 'twitter'],
          mediaUrls: []
        })
      })
    })
  })

  it('schedules post when Schedule Post is clicked', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'Scheduled post')
    
    // Set a future date
    const dateInput = screen.getByDisplayValue('')
    await user.type(dateInput, '2024-12-31')
    
    const scheduleButton = screen.getByText('Schedule Post')
    await user.click(scheduleButton)
    
    expect(mockProps.onSchedule).toHaveBeenCalled()
  })

  it('shows preview when preview tab is selected', async () => {
    const user = userEvent.setup()
    render(<SocialPostComposer {...mockProps} />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    await user.type(textarea, 'Preview content')
    
    const previewTab = screen.getByText('Preview')
    await user.click(previewTab)
    
    expect(screen.getByText('Preview: Preview content')).toBeInTheDocument()
  })

  it('disables buttons when loading', () => {
    render(<SocialPostComposer {...mockProps} isLoading={true} />)
    
    expect(screen.getByText('Save Draft')).toBeDisabled()
    expect(screen.getByText('Schedule Post')).toBeDisabled()
    expect(screen.getByText('Publish Now')).toBeDisabled()
  })

  it('loads initial data when provided', () => {
    const initialData = {
      content: 'Initial content',
      platforms: ['linkedin'],
      mediaUrls: ['https://example.com/initial.jpg'],
      scheduleDate: new Date('2024-12-31T10:00:00Z')
    }
    
    render(<SocialPostComposer {...mockProps} initialData={initialData} />)
    
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com/initial.jpg')).toBeInTheDocument()
    
    const linkedinCheckbox = screen.getByRole('checkbox', { name: /linkedin/i })
    const twitterCheckbox = screen.getByRole('checkbox', { name: /x \(twitter\)/i })
    
    expect(linkedinCheckbox).toBeChecked()
    expect(twitterCheckbox).not.toBeChecked()
  })
})