'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link, 
  Mail,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialShareButtonsProps {
  url: string
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SocialShareButtons({ 
  url, 
  title, 
  description = '', 
  size = 'md',
  className 
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform]
    
    if (platform === 'email') {
      window.location.href = shareUrl
    } else {
      window.open(
        shareUrl,
        'share-dialog',
        'width=600,height=400,resizable=yes,scrollbars=yes'
      )
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const buttonSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        className={cn(buttonSize[size], 'hover:bg-blue-50 hover:border-blue-300')}
        onClick={() => handleShare('twitter')}
        title="Share on Twitter"
      >
        <Twitter size={iconSize[size]} className="text-blue-500" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(buttonSize[size], 'hover:bg-blue-50 hover:border-blue-600')}
        onClick={() => handleShare('facebook')}
        title="Share on Facebook"
      >
        <Facebook size={iconSize[size]} className="text-blue-600" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(buttonSize[size], 'hover:bg-blue-50 hover:border-blue-700')}
        onClick={() => handleShare('linkedin')}
        title="Share on LinkedIn"
      >
        <Linkedin size={iconSize[size]} className="text-blue-700" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(buttonSize[size], 'hover:bg-gray-50 hover:border-gray-400')}
        onClick={() => handleShare('email')}
        title="Share via Email"
      >
        <Mail size={iconSize[size]} className="text-gray-600" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(buttonSize[size], 'hover:bg-gray-50 hover:border-gray-400')}
        onClick={handleCopyLink}
        title={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? (
          <Check size={iconSize[size]} className="text-green-600" />
        ) : (
          <Link size={iconSize[size]} className="text-gray-600" />
        )}
      </Button>
    </div>
  )
}