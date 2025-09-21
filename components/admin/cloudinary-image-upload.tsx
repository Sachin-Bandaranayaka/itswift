'use client'

import { useState, useCallback } from 'react'
import { CldUploadWidget, CldImage } from 'next-cloudinary'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CloudinaryImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onAltTextChange?: (altText: string) => void
  altText?: string
  label?: string
  className?: string
}

export function CloudinaryImageUpload({
  value,
  onChange,
  onAltTextChange,
  altText = '',
  label = "Featured Image",
  className = ""
}: CloudinaryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [localAltText, setLocalAltText] = useState(altText)

  const handleSuccess = useCallback((result: any) => {
    setIsUploading(false)
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url)
      toast.success("Image uploaded successfully!")
    }
  }, [onChange])

  const handleError = useCallback((error: any) => {
    setIsUploading(false)
    console.error('Upload error:', error)
    toast.error("Failed to upload image. Please try again.")
  }, [])

  const handleUploadStart = useCallback(() => {
    setIsUploading(true)
  }, [])

  const handleRemove = () => {
    onChange('')
    setLocalAltText('')
    if (onAltTextChange) {
      onAltTextChange('')
    }
    toast.success("Image removed")
  }

  const handleAltTextChange = (newAltText: string) => {
    setLocalAltText(newAltText)
    if (onAltTextChange) {
      onAltTextChange(newAltText)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {!value ? (
        <CldUploadWidget
          uploadPreset="blog_images_unsigned"
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
            maxFileSize: 10000000, // 10MB
            folder: "blog-images",
            sources: ["local", "url"],
            multiple: false,
            cropping: true,
            croppingAspectRatio: 16/9,
            showSkipCropButton: true,
            croppingShowBackButton: true,
            croppingShowDimensions: true,
          }}
          onSuccess={handleSuccess}
          onError={handleError}
          onUpload={handleUploadStart}
        >
          {({ open }) => (
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-sm text-gray-600">Uploading image...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Featured Image
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click to upload or drag and drop your image here
                    </p>
                    <Button 
                      type="button" 
                      onClick={() => open()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports JPG, PNG, GIF, WebP up to 10MB
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </CldUploadWidget>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <CldImage
                  src={value}
                  alt={localAltText || "Uploaded image"}
                  width={400}
                  height={300}
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                  crop={{
                    type: 'auto',
                    source: true
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="alt-text">Image Alt Text</Label>
                <Input
                  id="alt-text"
                  placeholder="Describe the image for accessibility"
                  value={localAltText}
                  onChange={(e) => handleAltTextChange(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alt text helps screen readers and improves SEO
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <CldUploadWidget
              uploadPreset="blog_images_unsigned"
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 10000000,
                folder: "blog-images",
              }}
              onSuccess={handleSuccess}
              onError={handleError}
              onUpload={handleUploadStart}
            >
              {({ open }) => (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => open()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace Image
                    </>
                  )}
                </Button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      )}
    </div>
  )
}