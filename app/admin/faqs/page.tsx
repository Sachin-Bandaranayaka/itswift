'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Edit, 
  Trash2,
  Loader2,
  HelpCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

interface FAQ {
  id: string
  question: string
  answer: string
  page_slug: string
  category?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FAQFormData {
  question: string
  answer: string
  page_slug: string
  category: string
  display_order: number
  is_active: boolean
}

function formatPageLabel(slug: string) {
  if (!slug) return ''
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase())
}

// Common page slugs with better labels
const PAGE_LABELS: Record<string, string> = {
  'homepage': 'Homepage',
  'about-us': 'About Us',
  'contact': 'Contact',
  'elearning-services': 'eLearning Services',
  'custom-elearning': 'Custom eLearning',
  'rapid-elearning': 'Rapid eLearning',
  'on-boarding': 'On-boarding',
  'micro-learning': 'Micro Learning',
  'video-based-training': 'Video Based Training',
  'translation-localization': 'Translation & Localization',
  'ai-powered-solutions': 'AI Powered Solutions',
  'convert-flash-to-html': 'Flash to HTML5',
  'ilt-to-elearning': 'ILT to eLearning'
}

function getPageLabel(slug: string): string {
  return PAGE_LABELS[slug] || formatPageLabel(slug)
}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPage, setFilterPage] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [pageOptions, setPageOptions] = useState<string[]>([])
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    page_slug: '',
    category: '',
    display_order: 0,
    is_active: true
  })

  // Fetch FAQs
  const fetchFaqs = async (page = currentPage) => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      })
      
      // Add filters if they're not 'all'
      if (filterPage !== 'all') params.append('page_slug', filterPage)
      if (filterCategory !== 'all') params.append('category', filterCategory)
      if (filterActive !== 'all') params.append('is_active', filterActive)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/faqs?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const result = await response.json()
      
      if (result.success) {
        setFaqs(result.data.faqs || [])
        setTotalCount(result.meta?.pagination?.total || 0)
        setTotalPages(result.meta?.pagination?.totalPages || 1)
        setCurrentPage(result.meta?.pagination?.page || 1)
        setPageOptions(result.meta?.availableFilters?.pageSlugs || [])
        setCategoryOptions(result.meta?.availableFilters?.categories || [])
      } else {
        toast.error('Failed to fetch FAQs')
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      toast.error('Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }

  // Load FAQs on component mount
  // Trigger API call when filters change
  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
    fetchFaqs(1)
  }, [searchTerm, filterPage, filterCategory, filterActive])

  // Initial load
  useEffect(() => {
    fetchFaqs()
  }, [])

  // Ensure filters remain valid if available options change
  useEffect(() => {
    if (filterPage !== 'all' && !pageOptions.includes(filterPage)) {
      setFilterPage('all')
    }
  }, [pageOptions, filterPage])

  useEffect(() => {
    if (filterCategory !== 'all' && !categoryOptions.includes(filterCategory)) {
      setFilterCategory('all')
    }
  }, [categoryOptions, filterCategory])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = isEditing ? `/api/admin/faqs/${selectedFaq?.id}` : '/api/admin/faqs'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(isEditing ? 'FAQ updated successfully' : 'FAQ created successfully')
        setIsDialogOpen(false)
        resetForm()
        fetchFaqs()
      } else {
        toast.error(result.error || 'Failed to save FAQ')
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
      toast.error('Failed to save FAQ')
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('FAQ deleted successfully')
        fetchFaqs()
      } else {
        toast.error('Failed to delete FAQ')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      page_slug: '',
      category: '',
      display_order: 0,
      is_active: true
    })
    setSelectedFaq(null)
    setIsEditing(false)
  }

  // Open edit dialog
  const openEditDialog = (faq: FAQ) => {
    setSelectedFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      page_slug: faq.page_slug,
      category: faq.category || '',
      display_order: faq.display_order,
      is_active: faq.is_active
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Open create dialog
  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions for different pages
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {/* Quick Page Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Quick Page Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filterPage === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterPage('all')}
            >
              All Pages ({faqs.length})
            </Button>
            {['homepage', 'custom-elearning', 'rapid-elearning', 'on-boarding', 'micro-learning'].map(slug => {
              const count = faqs.filter(faq => faq.page_slug === slug).length
              if (count === 0) return null
              return (
                <Button
                  key={slug}
                  variant={filterPage === slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPage(slug)}
                >
                  {getPageLabel(slug)} ({count})
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="page-filter">Page</Label>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger>
                  <SelectValue placeholder="All pages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pages</SelectItem>
                  {pageOptions.map(slug => (
                    <SelectItem key={slug} value={slug}>
                      {getPageLabel(slug)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="active-filter">Status</Label>
              <Select value={filterActive} onValueChange={setFilterActive}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            FAQs ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FAQs found. Create your first FAQ to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq: FAQ) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium max-w-md">
                      <div className="truncate" title={faq.question}>
                        {faq.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={faq.page_slug === 'homepage' ? 'default' : 'outline'}
                        className={faq.page_slug === 'homepage' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                      >
                        {getPageLabel(faq.page_slug)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {faq.category && (
                        <Badge variant="secondary">{faq.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{faq.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={faq.is_active ? "default" : "secondary"}>
                        {faq.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} FAQs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage - 1
                    setCurrentPage(newPage)
                    fetchFaqs(newPage)
                  }}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(pageNum)
                          fetchFaqs(pageNum)
                        }}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage + 1
                    setCurrentPage(newPage)
                    fetchFaqs(newPage)
                  }}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit FAQ' : 'Create New FAQ'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the FAQ details below.' : 'Fill in the details to create a new FAQ.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page_slug">Page *</Label>
                <Input
                  id="page_slug"
                  value={formData.page_slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, page_slug: e.target.value }))}
                  placeholder="e.g., homepage"
                  list="page-slug-options"
                  required
                />
                <datalist id="page-slug-options">
                  {pageOptions.map(slug => (
                    <option key={slug} value={slug}>
                      {getPageLabel(slug)}
                    </option>
                  ))}
                  {/* Common page suggestions */}
                  <option value="homepage">Homepage</option>
                  <option value="about-us">About Us</option>
                  <option value="contact">Contact</option>
                  <option value="custom-elearning">Custom eLearning</option>
                  <option value="rapid-elearning">Rapid eLearning</option>
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Optional category"
                  list="faq-category-options"
                />
                <datalist id="faq-category-options">
                  {categoryOptions.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the FAQ question"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the FAQ answer"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <Select 
                  value={formData.is_active.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
