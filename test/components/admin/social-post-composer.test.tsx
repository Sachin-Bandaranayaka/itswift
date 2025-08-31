import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SocialPostComposer } from '@/components/admin/social-post-composer'

global.fetch = vi.fn()

describe('SocialPostComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders post composition form', () => {
    render(<SocialPostComposer />)
    
    expect(screen.getByText('Create Social Media Post')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post now/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /schedule/i })).toBeInTheDocument()
  })

  it('shows platform selection tabs', () => {
    render(<SocialPostComposer />)
    
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Twitter/X')).toBeInTheDocument()
  })

  it('shows character count for different platforms', () => {
    render(<SocialPostComposer />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    
    // Should show character count
    expect(screen.getByText(/17/)).toBeInTheDocument() // Length of "Test post content"
  })

  it('validates character limits for Twitter', () => {
    render(<SocialPostComposer />)
    
    // Switch to Twitter tab
    fireEvent.click(screen.getByText('Twitter/X'))
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    const longContent = 'a'.repeat(281) // Over Twitter limit
    fireEvent.change(textarea, { target: { value: longContent } })
    
    expect(screen.getByText(/exceeds character limit/i)).toBeInTheDocument()
  })

  it('posts content immediately when "Post Now" is clicked', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, postId: '123' })
    })

    render(<SocialPostComposer />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    const postButton = screen.getByRole('button', { name: /post now/i })
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(postButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'linkedin',
          content: 'Test post content',
          mediaUrls: [],
          publishNow: true
        })
      })
    })
  })

  it('schedules content when "Schedule" is clicked', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, postId: '123' })
    })

    render(<SocialPostComposer />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    const scheduleButton = screen.getByRole('button', { name: /schedule/i })
    
    fireEvent.change(textarea, { target: { value: 'Scheduled post content' } })
    fireEvent.click(scheduleButton)
    
    // Should show scheduling modal
    expect(screen.getByText(/schedule post/i)).toBeInTheDocument()
  })

  it('handles API errors when posting', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(<SocialPostComposer />)
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    const postButton = screen.getByRole('button', { name: /post now/i })
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(postButton)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to publish post/i)).toBeInTheDocument()
    })
  })
})