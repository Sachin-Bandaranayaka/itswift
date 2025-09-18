'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  MoreHorizontal,
  Linkedin,
  Twitter,
  Calendar,
  Clock
} from "lucide-react"
import { format } from "date-fns"

interface SocialPostPreviewProps {
  platform: 'linkedin' | 'twitter'
  content: string
  mediaUrls?: string[]
  scheduledAt?: string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
}

export function SocialPostPreview({
  platform,
  content,
  mediaUrls = [],
  scheduledAt,
  authorName = "Your Company",
  authorHandle = "@yourcompany",
  authorAvatar
}: SocialPostPreviewProps) {
  const formatContent = (text: string) => {
    // Convert hashtags to styled spans
    return text.replace(/#(\w+)/g, '<span class="text-blue-600 font-medium">#$1</span>')
      .replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
  }

  const formatScheduledTime = () => {
    if (!scheduledAt) return null
    try {
      return format(new Date(scheduledAt), 'MMM d, yyyy at h:mm a')
    } catch {
      return scheduledAt
    }
  }

  if (platform === 'linkedin') {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">LinkedIn Preview</CardTitle>
          </div>
          {scheduledAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Scheduled for {formatScheduledTime()}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LinkedIn Post Structure */}
          <div className="bg-white border rounded-lg p-4 space-y-3">
            {/* Author Info */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={authorAvatar} alt={`${authorName} profile picture`} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{authorName}</h4>
                  <Badge variant="secondary" className="text-xs">1st</Badge>
                </div>
                <p className="text-xs text-gray-600">Company Title • 2h</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Content */}
            <div className="space-y-3">
              <div 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(content) }}
              />
              
              {/* Media Preview */}
              {mediaUrls.length > 0 && (
                <div className="space-y-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="bg-gray-100 rounded border p-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📷</span>
                        <span className="truncate">{url}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Engagement Actions */}
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">Comment</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Repeat2 className="h-4 w-4" />
                  <span className="text-xs">Repost</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Share className="h-4 w-4" />
                  <span className="text-xs">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Twitter Preview
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Twitter className="h-5 w-5" />
          <CardTitle className="text-lg">Twitter/X Preview</CardTitle>
        </div>
        {scheduledAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Scheduled for {formatScheduledTime()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Twitter Post Structure */}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          {/* Author Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={authorAvatar} alt={`${authorName} profile picture`} />
              <AvatarFallback className="bg-gray-100">
                {authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm">{authorName}</h4>
                <span className="text-gray-500 text-sm">{authorHandle}</span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">2h</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <div 
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
            
            {/* Media Preview */}
            {mediaUrls.length > 0 && (
              <div className="space-y-2">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="bg-gray-100 rounded border p-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📷</span>
                      <span className="truncate">{url}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Engagement Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">Reply</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs">Retweet</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                <Heart className="h-4 w-4" />
                <span className="text-xs">Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <Share className="h-4 w-4" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}