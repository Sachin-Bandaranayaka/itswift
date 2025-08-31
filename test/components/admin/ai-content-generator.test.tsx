import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AIContentGenerator } from '@/components/admin/ai-content-generator'

// Mock fetch
global.fetch = vi.fn()

describe('AIContentGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders content generation form', () => {
    render(<AIContentGenerator />)
    
    expect(screen.getByText('AI Content Generator')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/describe what content you want/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate content/i })).toBeInTheDocument()
  })

  it('shows content type selection', () => {
    render(<AIContentGenerator />)
    
    expect(screen.getByText('Blog Post')).toBeInTheDocument()
    expect(screen.getByText('Social Media')).toBeInTheDocument()
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
  })

  it('generates content when form is submitted', async () => {
    const mockResponse = {
      content: 'Generated AI content',
      suggestions: ['Suggestion 1', 'Suggestion 2'],
      seoKeywords: ['keyword1', 'keyword2']
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<AIContentGenerator />)
    
    const promptInput = screen.getByPlaceholderText(/describe what content you want/i)
    const generateButton = screen.getByRole('button', { name: /generate content/i })
    
    fireEvent.change(promptInput, { target: { value: 'Write about AI technology' } })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Generated AI content')).toBeInTheDocument()
    })
    
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Write about AI technology',
        contentType: 'blog',
        platform: undefined,
        tone: 'professional'
      })
    })
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('API Error'))

    render(<AIContentGenerator />)
    
    const promptInput = screen.getByPlaceholderText(/describe what content you want/i)
    const generateButton = screen.getByRole('button', { name: /generate content/i })
    
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to generate content/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during generation', async () => {
    ;(global.fetch as any).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<AIContentGenerator />)
    
    const promptInput = screen.getByPlaceholderText(/describe what content you want/i)
    const generateButton = screen.getByRole('button', { name: /generate content/i })
    
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } })
    fireEvent.click(generateButton)
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument()
    expect(generateButton).toBeDisabled()
  })
})