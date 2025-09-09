"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Video,
  FileText,
  X,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react'

interface MediaFile {
  id: string
  url: string
  type: 'image' | 'video' | 'document'
  name: string
  size: number
}

interface ContentEditorProps {
  initialContent?: string
  placeholder?: string
  maxLength?: number
  allowedFileTypes?: string[]
  maxFileSize?: number // in MB
  onContentChange?: (content: string) => void
  onMediaUpload?: (files: MediaFile[]) => void
  className?: string
}

export function ContentEditor({
  initialContent = '',
  placeholder = 'Start writing your content...',
  maxLength = 5000,
  allowedFileTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx'],
  maxFileSize = 10,
  onContentChange,
  onMediaUpload,
  className = ''
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleContentChange = useCallback((value: string) => {
    if (value.length <= maxLength) {
      setContent(value)
      onContentChange?.(value)
    }
  }, [maxLength, onContentChange])

  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    handleContentChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }, [content, handleContentChange])

  const formatButtons = [
    { icon: Bold, label: 'Bold', before: '**', after: '**' },
    { icon: Italic, label: 'Italic', before: '*', after: '*' },
    { icon: Underline, label: 'Underline', before: '<u>', after: '</u>' },
    { icon: Link, label: 'Link', before: '[', after: '](url)' },
    { icon: List, label: 'Bullet List', before: '\n- ', after: '' },
    { icon: ListOrdered, label: 'Numbered List', before: '\n1. ', after: '' },
    { icon: Quote, label: 'Quote', before: '\n> ', after: '' },
    { icon: Code, label: 'Code', before: '`', after: '`' }
  ]

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true)
    const uploadedFiles: MediaFile[] = []

    try {
      for (const file of Array.from(files)) {
        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds ${maxFileSize}MB limit`,
            variant: 'destructive'
          })
          continue
        }

        // Create FormData for upload
        const formData = new FormData()
        formData.append('file', file)

        // Upload to your media API endpoint
        const response = await fetch('/api/social/media', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          const mediaFile: MediaFile = {
            id: crypto.randomUUID(),
            url: result.data.mediaUrl,
            type: file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document',
            name: file.name,
            size: file.size
          }
          uploadedFiles.push(mediaFile)
        } else {
          toast({
            title: 'Upload failed',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive'
          })
        }
      }

      if (uploadedFiles.length > 0) {
        setMediaFiles(prev => [...prev, ...uploadedFiles])
        onMediaUpload?.(uploadedFiles)
        toast({
          title: 'Upload successful',
          description: `${uploadedFiles.length} file(s) uploaded successfully`
        })
      }
    } catch (error) {
      toast({
        title: 'Upload error',
        description: 'An error occurred during file upload',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
    }
  }, [maxFileSize, onMediaUpload])

  const removeMediaFile = useCallback((fileId: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const renderPreview = () => {
    // Simple markdown-like preview
    let previewContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>')

    return (
      <div 
        className="prose prose-sm max-w-none p-4 border rounded-md min-h-[200px] bg-gray-50"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Editor</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-gray-50">
          {formatButtons.map((button) => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting(button.before, button.after)}
              title={button.label}
              disabled={isPreviewMode}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <div className="border-l mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isPreviewMode}
            title="Upload Media"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content Area */}
        {isPreviewMode ? (
          renderPreview()
        ) : (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[200px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'monospace' }}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Supports basic markdown formatting</span>
              <span>{content.length}/{maxLength} characters</span>
            </div>
          </div>
        )}

        {/* Media Files */}
        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Attached Media</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative border rounded-md p-2 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {file.type === 'image' && <Image className="h-4 w-4 text-blue-500" />}
                      {file.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
                      {file.type === 'document' && <FileText className="h-4 w-4 text-green-500" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMediaFile(file.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {file.type === 'image' && (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="mt-2 w-full h-20 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}

export default ContentEditor