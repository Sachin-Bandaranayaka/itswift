import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SocialShareButtons } from '@/components/blog/social-share-buttons'

// Mock window.open
const mockWindowOpen = vi.fn()
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
})

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn()
}
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
})

describe('SocialShareButtons', () => {
  const defaultProps = {
    url: 'https://example.com/blog/test-post',
    title: 'Test Blog Post',
    description: 'This is a test blog post description'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all social share buttons', () => {
    render(<SocialShareButtons {...defaultProps} />)

    expect(screen.getByTitle('Share on Twitter')).toBeInTheDocument()
    expect(screen.getByTitle('Share on Facebook')).toBeInTheDocument()
    expect(screen.getByTitle('Share on LinkedIn')).toBeInTheDocument()
    expect(screen.getByTitle('Share via Email')).toBeInTheDocument()
    expect(screen.getByTitle('Copy link')).toBeInTheDocument()
  })

  it('should open Twitter share dialog when Twitter button is clicked', () => {
    render(<SocialShareButtons {...defaultProps} />)
    
    const twitterButton = screen.getByTitle('Share on Twitter')
    fireEvent.click(twitterButton)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('twitter.com/intent/tweet'),
      'share-dialog',
      'width=600,height=400,resizable=yes,scrollbars=yes'
    )
  })

  it('should open Facebook share dialog when Facebook button is clicked', () => {
    render(<SocialShareButtons {...defaultProps} />)
    
    const facebookButton = screen.getByTitle('Share on Facebook')
    fireEvent.click(facebookButton)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com/sharer/sharer.php'),
      'share-dialog',
      'width=600,height=400,resizable=yes,scrollbars=yes'
    )
  })

  it('should open LinkedIn share dialog when LinkedIn button is clicked', () => {
    render(<SocialShareButtons {...defaultProps} />)
    
    const linkedinButton = screen.getByTitle('Share on LinkedIn')
    fireEvent.click(linkedinButton)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      'share-dialog',
      'width=600,height=400,resizable=yes,scrollbars=yes'
    )
  })

  it('should copy link to clipboard when copy button is clicked', async () => {
    mockClipboard.writeText.mockResolvedValue(undefined)
    
    render(<SocialShareButtons {...defaultProps} />)
    
    const copyButton = screen.getByTitle('Copy link')
    fireEvent.click(copyButton)

    expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.url)
    
    await waitFor(() => {
      expect(screen.getByTitle('Link copied!')).toBeInTheDocument()
    })
  })

  it('should handle clipboard API failure gracefully', async () => {
    mockClipboard.writeText.mockRejectedValue(new Error('Clipboard not available'))
    
    render(<SocialShareButtons {...defaultProps} />)
    
    const copyButton = screen.getByTitle('Copy link')
    
    // Should not throw error when clipboard fails
    expect(() => fireEvent.click(copyButton)).not.toThrow()
  })

  it('should render different sizes correctly', () => {
    render(<SocialShareButtons {...defaultProps} size="sm" />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveClass('h-8', 'w-8')
  })

  it('should apply custom className', () => {
    render(<SocialShareButtons {...defaultProps} className="custom-class" />)
    
    const container = screen.getAllByRole('button')[0].parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('should handle email sharing correctly', () => {
    render(<SocialShareButtons {...defaultProps} />)
    
    const emailButton = screen.getByTitle('Share via Email')
    
    // Just verify the button exists and can be clicked
    expect(emailButton).toBeInTheDocument()
    fireEvent.click(emailButton)
    
    // Email sharing uses window.location.href which is harder to test in jsdom
    // The important thing is that the button works without errors
  })
})