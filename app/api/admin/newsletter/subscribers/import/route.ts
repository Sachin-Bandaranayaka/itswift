import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV must have at least a header and one data row' },
        { status: 400 }
      )
    }

    // Parse CSV
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    const emailIndex = headers.findIndex(h => h.includes('email'))
    const firstNameIndex = headers.findIndex(h => h.includes('first') && h.includes('name'))
    const lastNameIndex = headers.findIndex(h => h.includes('last') && h.includes('name'))
    const tagsIndex = headers.findIndex(h => h.includes('tag'))

    if (emailIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have an email column' },
        { status: 400 }
      )
    }

    const subscribers = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      
      if (values.length <= emailIndex || !values[emailIndex]) {
        continue // Skip rows without email
      }

      const subscriber = {
        email: values[emailIndex],
        first_name: firstNameIndex !== -1 ? values[firstNameIndex] || undefined : undefined,
        last_name: lastNameIndex !== -1 ? values[lastNameIndex] || undefined : undefined,
        tags: tagsIndex !== -1 && values[tagsIndex] 
          ? values[tagsIndex].split(';').map(tag => tag.trim()).filter(Boolean)
          : undefined
      }

      subscribers.push(subscriber)
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No valid subscribers found in CSV' },
        { status: 400 }
      )
    }

    // Import subscribers
    const result = await NewsletterSubscribersService.bulkImport(subscribers)

    return NextResponse.json({
      message: 'Import completed',
      success: result.success,
      failed: result.failed,
      errors: result.errors.slice(0, 10), // Limit errors shown
      totalProcessed: subscribers.length
    })
  } catch (error) {
    console.error('Error importing subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}