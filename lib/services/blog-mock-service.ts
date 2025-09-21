import { BlogPost, BlogAuthor, BlogCategory, BlogPostFilters, PaginationOptions } from './blog-supabase-service'

// Mock data for development
const mockAuthors: BlogAuthor[] = [
  {
    id: '1',
    name: 'John Smith',
    slug: 'john-smith',
    bio: 'Senior eLearning Consultant with 10+ years of experience in corporate training.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'john@itswift.com',
    social_links: { linkedin: 'https://linkedin.com/in/johnsmith' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    bio: 'Learning Technology Specialist focused on innovative training solutions.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@itswift.com',
    social_links: { linkedin: 'https://linkedin.com/in/sarahjohnson' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'eLearning Trends',
    slug: 'elearning-trends',
    description: 'Latest trends and innovations in eLearning technology',
    color: '#3B82F6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Corporate Training',
    slug: 'corporate-training',
    description: 'Best practices for corporate training and development',
    color: '#10B981',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Learning Technology',
    slug: 'learning-technology',
    description: 'Technology solutions for modern learning environments',
    color: '#8B5CF6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of eLearning: Trends to Watch in 2024',
    slug: 'future-of-elearning-trends-2024',
    excerpt: 'Discover the key trends shaping the future of eLearning and how they will impact corporate training programs.',
    content: `
      <h2>Introduction</h2>
      <p>The eLearning landscape is evolving rapidly, with new technologies and methodologies emerging every year. As we look ahead to 2024, several key trends are set to reshape how organizations approach employee training and development.</p>
      
      <h2>Key Trends for 2024</h2>
      <h3>1. AI-Powered Personalization</h3>
      <p>Artificial intelligence is revolutionizing how learning content is delivered and personalized for individual learners.</p>
      
      <h3>2. Microlearning and Just-in-Time Training</h3>
      <p>Short, focused learning modules that can be consumed quickly are becoming increasingly popular.</p>
      
      <h3>3. Virtual and Augmented Reality</h3>
      <p>Immersive technologies are creating new possibilities for hands-on training experiences.</p>
      
      <h2>Conclusion</h2>
      <p>Organizations that embrace these trends will be better positioned to create effective, engaging learning experiences for their employees.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    author_id: '1',
    category_id: '1',
    status: 'published',
    is_featured: true,
    views: 1250,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    meta_title: 'The Future of eLearning: Trends to Watch in 2024',
    meta_description: 'Discover the key trends shaping the future of eLearning and how they will impact corporate training programs.',
    meta_keywords: 'elearning, trends, 2024, corporate training, AI, microlearning',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[0],
    category: mockCategories[0]
  },
  {
    id: '2',
    title: 'Building Effective Corporate Training Programs',
    slug: 'building-effective-corporate-training-programs',
    excerpt: 'Learn how to design and implement training programs that drive real business results.',
    content: `
      <h2>The Foundation of Effective Training</h2>
      <p>Creating successful corporate training programs requires careful planning, clear objectives, and ongoing evaluation.</p>
      
      <h2>Key Components</h2>
      <h3>1. Needs Assessment</h3>
      <p>Understanding what skills gaps exist in your organization is the first step to effective training.</p>
      
      <h3>2. Learning Objectives</h3>
      <p>Clear, measurable objectives help ensure training programs deliver tangible results.</p>
      
      <h3>3. Engagement Strategies</h3>
      <p>Interactive content and varied delivery methods keep learners engaged throughout the program.</p>
      
      <h2>Measuring Success</h2>
      <p>Regular assessment and feedback collection help optimize training programs for maximum impact.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    author_id: '2',
    category_id: '2',
    status: 'published',
    is_featured: false,
    views: 890,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    meta_title: 'Building Effective Corporate Training Programs',
    meta_description: 'Learn how to design and implement training programs that drive real business results.',
    meta_keywords: 'corporate training, program design, employee development, learning objectives',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[1],
    category: mockCategories[1]
  },
  {
    id: '3',
    title: 'Leveraging Technology for Better Learning Outcomes',
    slug: 'leveraging-technology-better-learning-outcomes',
    excerpt: 'Explore how modern technology can enhance learning experiences and improve training effectiveness.',
    content: `
      <h2>The Role of Technology in Modern Learning</h2>
      <p>Technology has transformed the way we approach learning and development, offering new opportunities for engagement and effectiveness.</p>
      
      <h2>Key Technologies</h2>
      <h3>1. Learning Management Systems (LMS)</h3>
      <p>Modern LMS platforms provide comprehensive tools for content delivery, tracking, and assessment.</p>
      
      <h3>2. Mobile Learning</h3>
      <p>Mobile-first approaches enable learning anytime, anywhere, fitting into busy schedules.</p>
      
      <h3>3. Analytics and Reporting</h3>
      <p>Data-driven insights help optimize learning programs and demonstrate ROI.</p>
      
      <h2>Implementation Best Practices</h2>
      <p>Successful technology adoption requires careful planning, user training, and ongoing support.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    author_id: '1',
    category_id: '3',
    status: 'published',
    is_featured: false,
    views: 675,
    published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
    meta_title: 'Leveraging Technology for Better Learning Outcomes',
    meta_description: 'Explore how modern technology can enhance learning experiences and improve training effectiveness.',
    meta_keywords: 'learning technology, LMS, mobile learning, analytics, training effectiveness',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[0],
    category: mockCategories[2]
  },
  {
    id: '4',
    title: 'Measuring Training ROI: A Comprehensive Guide',
    slug: 'measuring-training-roi-comprehensive-guide',
    excerpt: 'Learn how to calculate and demonstrate the return on investment for your training programs.',
    content: `
      <h2>Why Measuring ROI Matters</h2>
      <p>Demonstrating the value of training programs is crucial for securing ongoing investment and support from leadership.</p>
      
      <h2>ROI Calculation Methods</h2>
      <h3>1. Kirkpatrick's Four Levels</h3>
      <p>A proven framework for evaluating training effectiveness at multiple levels.</p>
      
      <h3>2. Phillips ROI Model</h3>
      <p>Extends Kirkpatrick's model to include financial ROI calculations.</p>
      
      <h3>3. Business Impact Metrics</h3>
      <p>Direct measurement of business outcomes linked to training initiatives.</p>
      
      <h2>Implementation Tips</h2>
      <p>Start with clear baselines, use multiple measurement methods, and communicate results effectively to stakeholders.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    author_id: '2',
    category_id: '2',
    status: 'published',
    is_featured: true,
    views: 1100,
    published_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    meta_title: 'Measuring Training ROI: A Comprehensive Guide',
    meta_description: 'Learn how to calculate and demonstrate the return on investment for your training programs.',
    meta_keywords: 'training ROI, Kirkpatrick model, Phillips ROI, business impact, training evaluation',
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[1],
    category: mockCategories[1]
  },
  {
    id: '5',
    title: 'Creating Engaging Microlearning Content',
    slug: 'creating-engaging-microlearning-content',
    excerpt: 'Discover best practices for developing bite-sized learning content that maximizes retention.',
    content: `
      <h2>What is Microlearning?</h2>
      <p>Microlearning delivers content in small, focused chunks that can be consumed quickly and easily.</p>
      
      <h2>Benefits of Microlearning</h2>
      <h3>1. Improved Retention</h3>
      <p>Shorter content pieces are easier to remember and apply.</p>
      
      <h3>2. Flexible Learning</h3>
      <p>Learners can fit training into their busy schedules more easily.</p>
      
      <h3>3. Just-in-Time Support</h3>
      <p>Provides immediate access to relevant information when needed.</p>
      
      <h2>Design Principles</h2>
      <p>Focus on single learning objectives, use multimedia effectively, and ensure content is immediately applicable.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    author_id: '1',
    category_id: '1',
    status: 'published',
    is_featured: false,
    views: 820,
    published_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
    meta_title: 'Creating Engaging Microlearning Content',
    meta_description: 'Discover best practices for developing bite-sized learning content that maximizes retention.',
    meta_keywords: 'microlearning, content design, retention, just-in-time learning, bite-sized content',
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[0],
    category: mockCategories[0]
  },
  {
    id: '6',
    title: 'The Psychology of Adult Learning',
    slug: 'psychology-of-adult-learning',
    excerpt: 'Understanding how adults learn differently and how to design training programs accordingly.',
    content: `
      <h2>Adult Learning Principles</h2>
      <p>Adults have unique learning needs and preferences that differ significantly from children.</p>
      
      <h2>Key Characteristics</h2>
      <h3>1. Self-Directed Learning</h3>
      <p>Adults prefer to take control of their learning experience and set their own pace.</p>
      
      <h3>2. Experience-Based</h3>
      <p>Adults bring valuable experience that should be incorporated into learning activities.</p>
      
      <h3>3. Problem-Centered</h3>
      <p>Learning is most effective when it addresses real-world problems and challenges.</p>
      
      <h2>Practical Applications</h2>
      <p>Design training that respects adult learners' time, experience, and autonomy while providing practical, applicable knowledge.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author_id: '2',
    category_id: '2',
    status: 'published',
    is_featured: false,
    views: 950,
    published_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(), // 42 days ago
    meta_title: 'The Psychology of Adult Learning',
    meta_description: 'Understanding how adults learn differently and how to design training programs accordingly.',
    meta_keywords: 'adult learning, andragogy, self-directed learning, experience-based learning',
    created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockAuthors[1],
    category: mockCategories[1]
  }
]

export class BlogMockService {
  async getPosts(filters: BlogPostFilters = {}, pagination: PaginationOptions = {}): Promise<{
    posts: BlogPost[]
    total: number
    hasMore: boolean
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    let filteredPosts = [...mockPosts]

    // Apply filters
    if (filters.category) {
      filteredPosts = filteredPosts.filter(post => post.category_id === filters.category)
    }
    if (filters.author) {
      filteredPosts = filteredPosts.filter(post => post.author_id === filters.author)
    }
    if (filters.status) {
      filteredPosts = filteredPosts.filter(post => post.status === filters.status)
    }
    if (filters.featured !== undefined) {
      filteredPosts = filteredPosts.filter(post => post.is_featured === filters.featured)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      )
    }

    // Sort by published_at (newest first)
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at)
      const dateB = new Date(b.published_at || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    const { page = 1, limit = 10 } = pagination
    const offset = (page - 1) * limit
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)

    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      hasMore: offset + limit < filteredPosts.length
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockPosts.find(post => post.slug === slug) || null
  }

  async getCategories(): Promise<BlogCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockCategories]
  }

  async getAuthors(): Promise<BlogAuthor[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockAuthors]
  }

  async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockPosts.filter(post => post.is_featured).slice(0, limit)
  }

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const sortedPosts = [...mockPosts].sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at)
      const dateB = new Date(b.published_at || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })
    return sortedPosts.slice(0, limit)
  }

  async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    const searchLower = query.toLowerCase()
    const results = mockPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower)
    )
    return results.slice(0, limit)
  }

  async incrementViews(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.views += 1
    }
  }
}