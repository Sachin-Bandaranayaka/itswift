import { NextRequest, NextResponse } from 'next/server'
import { writeFile, appendFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, postIds, originalPostId, newPostId, newStatus, publishedAt, timestamp } = body

    // Create audit log entry
    const auditEntry = {
      timestamp: timestamp || new Date().toISOString(),
      action,
      ...(postIds && { postIds }),
      ...(originalPostId && { originalPostId }),
      ...(newPostId && { newPostId }),
      ...(newStatus && { newStatus }),
      ...(publishedAt && { publishedAt }),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    }

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs')
    if (!existsSync(logsDir)) {
      await mkdir(logsDir, { recursive: true })
    }

    // Write to audit log file
    const logFile = path.join(logsDir, 'blog-audit.log')
    const logLine = JSON.stringify(auditEntry) + '\n'

    try {
      await appendFile(logFile, logLine)
    } catch (writeError) {
      console.error('Error writing to audit log:', writeError)
      // Don't fail the request if logging fails
    }

    // Also log to console for development
    console.log('Blog Audit:', auditEntry)

    return NextResponse.json({
      success: true,
      message: 'Audit entry logged'
    })
  } catch (error) {
    console.error('Error logging audit entry:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to log audit entry'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')

    // Read audit log file
    const logFile = path.join(process.cwd(), 'logs', 'blog-audit.log')
    
    if (!existsSync(logFile)) {
      return NextResponse.json({
        success: true,
        entries: [],
        message: 'No audit log found'
      })
    }

    const { readFile } = await import('fs/promises')
    const logContent = await readFile(logFile, 'utf-8')
    
    // Parse log entries
    const entries = logContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line)
        } catch {
          return null
        }
      })
      .filter(entry => entry !== null)
      .reverse() // Most recent first

    // Filter by action if specified
    let filteredEntries = entries
    if (action) {
      filteredEntries = entries.filter(entry => entry.action === action)
    }

    // Limit results
    const limitedEntries = filteredEntries.slice(0, limit)

    return NextResponse.json({
      success: true,
      entries: limitedEntries,
      total: filteredEntries.length,
      showing: limitedEntries.length
    })
  } catch (error) {
    console.error('Error reading audit log:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read audit log',
        entries: []
      },
      { status: 500 }
    )
  }
}