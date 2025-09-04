import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

// Integration test to verify the blog scheduler API endpoints work correctly
describe('Blog Scheduler API Integration Tests', () => {
  let app: any
  let server: any
  let baseUrl: string

  beforeAll(async () => {
    // Skip integration tests in CI or if not explicitly enabled
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return
    }

    const dev = process.env.NODE_ENV !== 'production'
    app = next({ dev, dir: process.cwd() })
    const handle = app.getRequestHandler()

    await app.prepare()

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    })

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const port = server.address()?.port
        baseUrl = `http://localhost:${port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    if (server) {
      server.close()
    }
    if (app) {
      await app.close()
    }
  })

  it('should require authentication for scheduled posts endpoint', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return
    }

    const response = await fetch(`${baseUrl}/api/admin/blog/scheduled`)
    
    expect(response.status).toBe(401)
    
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('should require authentication for process scheduled endpoint', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return
    }

    const response = await fetch(`${baseUrl}/api/admin/blog/process-scheduled`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    expect(response.status).toBe(401)
    
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('should return proper error for invalid HTTP methods', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return
    }

    // Test invalid method for scheduled endpoint (should only accept GET)
    const response1 = await fetch(`${baseUrl}/api/admin/blog/scheduled`, {
      method: 'POST'
    })
    expect(response1.status).toBe(405)

    // Test invalid method for process-scheduled endpoint (should only accept POST)
    const response2 = await fetch(`${baseUrl}/api/admin/blog/process-scheduled`, {
      method: 'GET'
    })
    expect(response2.status).toBe(405)
  })
})