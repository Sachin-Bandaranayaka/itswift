import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Set up environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.BREVO_API_KEY = 'test-brevo-key'
process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-id'
process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-secret'
process.env.TWITTER_API_KEY = 'test-twitter-key'
process.env.TWITTER_API_SECRET = 'test-twitter-secret'
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret'
process.env.ADMIN_USERNAME = 'admin'
process.env.ADMIN_PASSWORD_HASH = '$2a$12$hashedpassword'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}))

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null })),
      upsert: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    auth: {
      signIn: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  })),
}))

// Mock OpenAI
vi.mock('openai', () => ({
  default: class OpenAI {
    chat = {
      completions: {
        create: vi.fn(() => Promise.resolve({
          choices: [{ message: { content: 'Test AI response' } }],
          usage: { total_tokens: 100 }
        }))
      }
    }
  }
}))