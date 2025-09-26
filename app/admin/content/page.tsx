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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  id: string
  slug: string
  title: string
  description?: string
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  contentSectionCount?: number
}

// Define all pages in the website
interface PageWithContentCount extends Page {
  contentSectionCount: number
}

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 25, 50]

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [pages, setPages] = useState<PageWithContentCount[]>([])
  const [loading, setLoading] = useState(false)
  const [pagesLoading, setPagesLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalSections, setTotalSections] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [pageInput, setPageInput] = useState('1')
  const [seoForm, setSeoForm] = useState({
    title: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })
  const [seoSaving, setSeoSaving] = useState(false)
  const { toast } = useToast()

  const paginationStart = totalSections === 0 || sections.length === 0
    ? 0
    : (currentPage - 1) * pageSize + 1
  const paginationEnd = totalSections === 0 || sections.length === 0
    ? 0
    : Math.min(paginationStart + sections.length - 1, totalSections)
  const hasPagination = totalPages > 1
  const shouldShowPaginationControls = totalSections > 0 && (hasPagination || totalSections > pageSize || pageSize !== DEFAULT_PAGE_SIZE)

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

        const normalizedPages: PageWithContentCount[] = (data.pages || []).map((page: any) => ({
          id: page.id,
          slug: page.slug,
          title: page.title,
          description: page.description ?? undefined,
          metaTitle: page.meta_title ?? undefined,
          metaDescription: page.meta_description ?? undefined,
          metaKeywords: page.meta_keywords ?? undefined,
          contentSectionCount: page.content_count ?? 0
        }))

        setPages(normalizedPages)
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

  useEffect(() => {
    if (selectedPage) {
      setSeoForm({
        title: selectedPage.title || '',
        metaTitle: selectedPage.metaTitle || '',
        metaDescription: selectedPage.metaDescription || '',
        metaKeywords: selectedPage.metaKeywords || ''
      })
    } else {
      setSeoForm({
        title: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
      })
    }
  }, [selectedPage])

  const fetchPageSections = async (pageSlug: string, pageNumber = 1, size = pageSize) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content/sections?page_slug=${pageSlug}&page=${pageNumber}&limit=${size}`)
      const result = await response.json()
      
      if (response.ok) {
        setSections(result.data || [])
        const pagination = result.pagination
        if (pagination) {
          setCurrentPage(pagination.page || pageNumber)
          setTotalPages(pagination.totalPages || 1)
          setTotalSections(pagination.total || (result.data?.length || 0))
          setPageInput(String(pagination.page || pageNumber))
        } else {
          setCurrentPage(pageNumber)
          setTotalPages(1)
          setTotalSections(result.data?.length || 0)
          setPageInput(String(pageNumber))
        }
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

  const handleSaveSeoSettings = async () => {
    if (!selectedPage) return

    const currentPageId = selectedPage.id

    try {
      setSeoSaving(true)
      const response = await fetch(`/api/admin/pages/${currentPageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: seoForm.title,
          meta_title: seoForm.metaTitle,
          meta_description: seoForm.metaDescription,
          meta_keywords: seoForm.metaKeywords
        }),
      })

      const result = await response.json()

      if (response.ok && result?.data) {
        const updatedPage = result.data
        setSelectedPage((prev) => prev ? {
          ...prev,
          title: updatedPage.title,
          description: updatedPage.description ?? undefined,
          metaTitle: updatedPage.meta_title ?? undefined,
          metaDescription: updatedPage.meta_description ?? undefined,
          metaKeywords: updatedPage.meta_keywords ?? undefined,
        } : prev)

        setPages((prevPages) => prevPages.map((page) => page.id === currentPageId ? {
          ...page,
          title: updatedPage.title,
          description: updatedPage.description ?? undefined,
          metaTitle: updatedPage.meta_title ?? undefined,
          metaDescription: updatedPage.meta_description ?? undefined,
          metaKeywords: updatedPage.meta_keywords ?? undefined,
        } : page))

        setSeoForm({
          title: updatedPage.title || '',
          metaTitle: updatedPage.meta_title || '',
          metaDescription: updatedPage.meta_description || '',
          metaKeywords: updatedPage.meta_keywords || ''
        })

        toast({
          title: 'Success',
          description: 'SEO settings updated successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'Failed to update SEO settings',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive'
      })
    } finally {
      setSeoSaving(false)
    }
  }

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page)
    setEditingSection(null)
    fetchPageSections(page.slug, 1, pageSize)
  }

  const handlePageChange = (pageNumber: number) => {
    if (!selectedPage) return
    if (pageNumber < 1 || pageNumber > totalPages) return
    setPageInput(String(pageNumber))
    fetchPageSections(selectedPage.slug, pageNumber, pageSize)
  }

  const handlePreviousPage = () => {
    if (currentPage <= 1) return
    handlePageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage >= totalPages) return
    handlePageChange(currentPage + 1)
  }

  const handlePageSizeChange = (value: string) => {
    const parsedSize = parseInt(value, 10)
    if (Number.isNaN(parsedSize)) {
      return
    }

    if (parsedSize === pageSize) {
      return
    }

    setPageSize(parsedSize)
    setCurrentPage(1)
    setPageInput('1')

    if (selectedPage) {
      fetchPageSections(selectedPage.slug, 1, parsedSize)
    }
  }

  const handlePageInputChange = (value: string) => {
    setPageInput(value)
  }

  const handleJumpToPage = () => {
    if (!selectedPage) {
      return
    }

    const parsedPage = parseInt(pageInput, 10)
    if (Number.isNaN(parsedPage)) {
      setPageInput(String(currentPage))
      return
    }

    const clampedPage = Math.min(Math.max(parsedPage, 1), Math.max(totalPages, 1))
    setPageInput(String(clampedPage))

    if (clampedPage !== currentPage) {
      fetchPageSections(selectedPage.slug, clampedPage, pageSize)
    }
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
    setCurrentPage(1)
    setTotalPages(1)
    setTotalSections(0)
    setPageInput('1')
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
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Update the page title and meta tags used for SEO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={seoForm.title}
                  onChange={(e) => setSeoForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter the page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={seoForm.metaTitle}
                  onChange={(e) => setSeoForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Displayed in browser tabs and search results"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={seoForm.metaDescription}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
                rows={3}
                placeholder="Add a concise summary that appears in search results"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-keywords">Meta Keywords</Label>
              <Input
                id="meta-keywords"
                value={seoForm.metaKeywords}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                placeholder="keyword one, keyword two, keyword three"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveSeoSettings} disabled={seoSaving}>
                {seoSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save SEO Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

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
                {shouldShowPaginationControls && (
                  <div className="flex flex-col gap-4 border-t pt-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <p className="text-sm text-muted-foreground">
                        {totalSections === 0
                          ? 'No sections available yet.'
                          : `Showing ${paginationStart}-${paginationEnd} of ${totalSections}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Per page</span>
                        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((option) => (
                              <SelectItem key={option} value={String(option)}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Page</span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={pageInput}
                          onChange={(event) => handlePageInputChange(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              handleJumpToPage()
                            }
                          }}
                          className="w-20"
                        />
                        <Button variant="outline" size="sm" onClick={handleJumpToPage} disabled={loading}>
                          Go
                        </Button>
                        <span className="text-sm text-muted-foreground">of {Math.max(totalPages, 1)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1 || loading}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages || loading || totalSections === 0}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
