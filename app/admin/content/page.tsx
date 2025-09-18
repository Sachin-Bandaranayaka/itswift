'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { ArrowLeft, Edit, Save, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ContentSection {
  id: string
  page_id?: string
  section_key: string
  section_type: string
  content: string
  content_html?: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
  pages?: {
    slug: string
    title: string
  }
}

interface Page {
  slug: string
  title: string
  description?: string
}

// Define all pages in the website
interface PageWithContentCount extends Page {
  contentSectionCount: number
}

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [pages, setPages] = useState<PageWithContentCount[]>([])
  const [loading, setLoading] = useState(false)
  const [pagesLoading, setPagesLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const { toast } = useToast()

  // Fetch pages from database
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setPagesLoading(true)
        const response = await fetch('/api/admin/pages')
        if (!response.ok) {
          throw new Error('Failed to fetch pages')
        }
        const data = await response.json()
        setPages(data.pages || [])
      } catch (error) {
        console.error('Error fetching pages:', error)
        toast({
          title: "Error",
          description: "Failed to load pages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setPagesLoading(false)
      }
    }

    fetchPages()
  }, [])

  const fetchPageSections = async (pageSlug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content/sections?page_slug=${pageSlug}`)
      const result = await response.json()
      
      if (response.ok) {
        setSections(result.data || [])
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch page content',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch page content',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page)
    setEditingSection(null)
    fetchPageSections(page.slug)
  }

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section.id)
    setEditContent(section.content)
  }

  const handleSaveSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/content/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Content updated successfully',
        })
        
        // Update the local state
        setSections(sections.map(section => 
          section.id === sectionId 
            ? { ...section, content: editContent }
            : section
        ))
        
        setEditingSection(null)
        setEditContent('')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update content',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content',
        variant: 'destructive'
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditContent('')
  }

  const goBackToPageList = () => {
    setSelectedPage(null)
    setSections([])
    setEditingSection(null)
  }

  if (selectedPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={goBackToPageList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedPage.title}</h1>
            <p className="text-muted-foreground">
              Edit content for this page
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Content</CardTitle>
            <CardDescription>
              Edit the text content for {selectedPage.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading content...</div>
            ) : sections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No content sections found for this page.
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{section.section_key}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {section.section_type}
                        </Badge>
                      </div>
                      {editingSection !== section.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSection(section)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {editingSection === section.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveSection(section.id)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Select a page to edit its content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Pages</CardTitle>
          <CardDescription>
            Click on any page to view and edit its content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pagesLoading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading pages...</span>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Title</TableHead>
                  <TableHead>URL Path</TableHead>
                  <TableHead>Content Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.slug} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      /{page.slug === 'home' ? '' : page.slug}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {page.contentSectionCount > 0 ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {page.contentSectionCount} sections
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            No content
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageSelect(page)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {page.contentSectionCount > 0 ? 'Edit Content' : 'Add Content'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}