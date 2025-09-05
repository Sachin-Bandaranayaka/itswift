"use client"

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  MessageSquare,
  User,
  Eye,
  Edit3,
  Save,
  X
} from 'lucide-react'

interface ContactSubmission {
  id: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  company: string | null
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  submitted_at: string
  responded_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts')
      }
      
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contact')
      }
      
      const updatedContact = data.contact
      
      setContacts(contacts.map(contact => 
        contact.id === id ? updatedContact : contact
      ))
      
      if (selectedContact?.id === id) {
        setSelectedContact(updatedContact)
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const updateContactNotes = async (id: string, notes: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, notes }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contact')
      }
      
      const updatedContact = data.contact
      
      setContacts(contacts.map(contact => 
        contact.id === id ? updatedContact : contact
      ))
      
      if (selectedContact?.id === id) {
        setSelectedContact(updatedContact)
      }
      
      setEditingNotes(false)
    } catch (error) {
      console.error('Error updating contact notes:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New'
      case 'in_progress': return 'In Progress'
      case 'resolved': return 'Resolved'
      case 'closed': return 'Closed'
      default: return status
    }
  }

  const filteredContacts = contacts.filter(contact => 
    statusFilter === 'all' || contact.status === statusFilter
  )

  const statusCounts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    in_progress: contacts.filter(c => c.status === 'in_progress').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
    closed: contacts.filter(c => c.status === 'closed').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="flex items-center gap-2"
          >
            {status === 'all' ? 'All' : getStatusLabel(status)}
            <Badge variant="secondary" className="ml-1">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact List */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contact submissions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map((contact) => (
              <Card 
                key={contact.id} 
                className={`cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                    <Badge className={getStatusColor(contact.status)}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(contact.submitted_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {contact.message}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact Details */}
        <div className="lg:sticky lg:top-6">
          {selectedContact ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Contact Details
                  </CardTitle>
                  <Select
                    value={selectedContact.status}
                    onValueChange={(value) => updateContactStatus(selectedContact.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">First Name</label>
                    <p className="text-gray-900">{selectedContact.first_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                    <p className="text-gray-900">{selectedContact.last_name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-orange-600 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`tel:${selectedContact.phone}`}
                        className="text-orange-600 hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedContact.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{selectedContact.company}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted</label>
                  <p className="text-gray-900">
                    {new Date(selectedContact.submitted_at).toLocaleString()}
                  </p>
                </div>

                {selectedContact.responded_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responded</label>
                    <p className="text-gray-900">
                      {new Date(selectedContact.responded_at).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    {!editingNotes ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNotes(true)
                          setNotes(selectedContact.notes || '')
                        }}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateContactNotes(selectedContact.id, notes)}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingNotes(false)
                            setNotes('')
                          }}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this contact..."
                      rows={4}
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[100px]">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedContact.notes || 'No notes added yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a contact to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}