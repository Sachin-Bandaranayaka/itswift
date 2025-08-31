import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

// Mock the theme provider
vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() })
}))

describe('AdminSidebar', () => {
  it('renders navigation items', () => {
    render(<AdminSidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Blog Posts')).toBeInTheDocument()
    expect(screen.getByText('Social Media')).toBeInTheDocument()
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Automation')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Scheduler')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(<AdminSidebar />)
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/admin')
    
    const blogLink = screen.getByRole('link', { name: /blog posts/i })
    expect(blogLink).toHaveAttribute('href', '/admin/blog')
    
    const socialLink = screen.getByRole('link', { name: /social media/i })
    expect(socialLink).toHaveAttribute('href', '/admin/social')
  })

  it('displays user profile section', () => {
    render(<AdminSidebar />)
    
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })
})