'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  Edit, 
  Trash2,
  Loader2,
  Star,
  Search,
  MessageSquareQuote
} from "lucide-react"
import { toast } from "sonner"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface TestimonialFormData {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar_url: string
  display_order: number
  is_active: boolean
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    avatar_url: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/testimonials?includeInactive=true')
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setIsEditing(true)
      setSelectedTestimonial(testimonial)
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url || '',
        display_order: testimonial.display_order,
        is_active: testimonial.is_active,
      })
    } else {
      setIsEditing(false)
      setSelectedTestimonial(null)
      setFormData({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        avatar_url: '',
        display_order: testimonials.length,
        is_active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedTestimonial(null)
    setIsEditing(false)
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      avatar_url: '',
      display_order: 0,
      is_active: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.role || !formData.company || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && selectedTestimonial) {
        // Update existing testimonial
        const response = await fetch(`/api/testimonials/${selectedTestimonial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to update testimonial')
        }

        toast.success('Testimonial updated successfully')
      } else {
        // Create new testimonial
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to create testimonial')
        }

        toast.success('Testimonial created successfully')
      }

      handleCloseDialog()
      fetchTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error(isEditing ? 'Failed to update testimonial' : 'Failed to create testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete testimonial')
      }

      toast.success('Testimonial deleted successfully')
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial')
    }
  }

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !testimonial.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle testimonial status')
      }

      toast.success(`Testimonial ${!testimonial.is_active ? 'activated' : 'deactivated'}`)
      fetchTestimonials()
    } catch (error) {
      console.error('Error toggling testimonial:', error)
      toast.error('Failed to toggle testimonial status')
    }
  }

  // Filter testimonials based on search and filters
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesActive = 
      filterActive === 'all' ||
      (filterActive === 'active' && testimonial.is_active) ||
      (filterActive === 'inactive' && !testimonial.is_active)
    
    return matchesSearch && matchesActive
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareQuote className="h-6 w-6" />
                Testimonials Management
              </CardTitle>
              <CardDescription>
                Manage client testimonials displayed on your website
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterActive('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterActive === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterActive('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={filterActive === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterActive('inactive')}
                size="sm"
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredTestimonials.length} of {testimonials.length} testimonials
            </p>
          </div>

          {/* Testimonials Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role & Company</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No testimonials found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">
                        {testimonial.display_order}
                      </TableCell>
                      <TableCell className="font-medium">
                        {testimonial.name}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{testimonial.role}</p>
                          <p className="text-xs text-gray-500">{testimonial.company}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-md">
                          {testimonial.content}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={testimonial.is_active ? 'default' : 'secondary'}>
                          {testimonial.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(testimonial)}
                            title={testimonial.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Switch checked={testimonial.is_active} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(testimonial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(testimonial.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the testimonial information below'
                : 'Fill in the details to create a new testimonial'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  placeholder="Training Manager"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Tech Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the testimonial text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-24"
                  />
                  <div className="flex gap-0.5">
                    {[...Array(formData.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
                <Input
                  id="avatar_url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                />
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              {/* Is Active */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active (visible on website)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Testimonial' : 'Create Testimonial'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


