'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  History, 
  Clock, 
  FileText, 
  Calendar,
  User,
  Loader2,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface VersionEntry {
  _id: string
  _rev: string
  _createdAt: string
  _updatedAt: string
  title: string
  version: string
}

interface BlogVersionHistoryProps {
  postId: string
  isOpen: boolean
  onClose: () => void
}

export function BlogVersionHistory({ postId, isOpen, onClose }: BlogVersionHistoryProps) {
  const [versions, setVersions] = useState<VersionEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && postId) {
      fetchVersions()
    }
  }, [isOpen, postId])

  const fetchVersions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/blog/versions?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setVersions(data.versions || [])
      } else {
        toast.error('Failed to fetch version history')
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
      toast.error('Failed to fetch version history')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVersionBadge = (version: VersionEntry, index: number) => {
    if (index === 0) {
      return <Badge variant="default">Current</Badge>
    }
    return <Badge variant="outline">v{versions.length - index}</Badge>
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Version History</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVersions}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading version history...
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No version history found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Version history will appear here as you make changes to your post.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <Card key={version._id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <CardTitle className="text-base">{version.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {formatDate(version._updatedAt)}
                          </CardDescription>
                        </div>
                      </div>
                      {getVersionBadge(version, index)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Rev: {version._rev}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {version._createdAt !== version._updatedAt ? 'Modified' : 'Created'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Timeline connector */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-6 bg-gray-200 dark:bg-gray-700" />
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Version history tracks changes to your blog post. Each save creates a new version that you can reference.
          </p>
        </div>
      </div>
    </div>
  )
}