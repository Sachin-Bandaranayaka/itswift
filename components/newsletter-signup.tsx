"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, User, Loader2, CheckCircle, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Validation schema
const newsletterSignupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

type NewsletterSignupFormData = z.infer<typeof newsletterSignupSchema>

export interface NewsletterSignupProps {
  className?: string
  variant?: 'default' | 'compact' | 'inline'
  showNameFields?: boolean
  placeholder?: string
  buttonText?: string
  title?: string
  description?: string
}

export function NewsletterSignup({
  className,
  variant = 'default',
  showNameFields = true,
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  title = "Stay Updated",
  description = "Subscribe to our newsletter for the latest updates and insights.",
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const form = useForm<NewsletterSignupFormData>({
    resolver: zodResolver(newsletterSignupSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  })

  const onSubmit = async (data: NewsletterSignupFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName || undefined,
          last_name: data.lastName || undefined,
          source: 'homepage',
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      let result: any
      try {
        result = await response.json()
      } catch (parseError) {
        throw new Error('Invalid response from server. Please try again.')
      }

      if (!response.ok) {
        // Handle specific error types with user-friendly messages
        let errorMessage = result.error || 'Failed to subscribe'
        
        // Map common error codes to user-friendly messages
        if (result.code) {
          switch (result.code) {
            case 'VALIDATION_ERROR':
              if (result.details?.field === 'email') {
                errorMessage = 'Please enter a valid email address.'
              } else if (result.details?.errors) {
                errorMessage = result.details.errors[0] || errorMessage
              }
              break
            case 'RATE_LIMIT_ERROR':
              errorMessage = 'Too many attempts. Please wait a moment and try again.'
              break
            case 'NEWSLETTER_SERVICE_ERROR':
              errorMessage = 'Subscription service is temporarily unavailable. Please try again later.'
              break
            case 'BREVO_SERVICE_ERROR':
              errorMessage = 'Email service is temporarily unavailable. Your subscription has been saved and will be processed shortly.'
              break
            default:
              // Use the provided error message or fallback
              errorMessage = result.error || 'An unexpected error occurred. Please try again.'
          }
        }

        throw new Error(errorMessage)
      }

      setSubmitStatus('success')
      form.reset()
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch (error) {
      setSubmitStatus('error')
      
      // Handle different error types
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setErrorMessage(errorMessage)
      
      // Auto-hide error message after 10 seconds
      setTimeout(() => {
        if (submitStatus === 'error') {
          setSubmitStatus('idle')
          setErrorMessage('')
        }
      }, 10000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Compact variant for inline usage
  if (variant === 'compact' || variant === 'inline') {
    return (
      <div className={cn("w-full max-w-md", className)}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {variant === 'compact' && (
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
            
            <div className={cn(
              "flex gap-2",
              variant === 'inline' ? "flex-row" : "flex-col sm:flex-row"
            )}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={placeholder}
                        type="email"
                        autoComplete="email"
                        disabled={isSubmitting}
                        className={cn(
                          "transition-colors",
                          form.formState.errors.email && "border-destructive"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="shrink-0"
                size={variant === 'inline' ? 'default' : 'default'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    {buttonText}
                  </>
                )}
              </Button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <CheckCircle className="h-4 w-4" />
                <span>Successfully subscribed! Check your email for confirmation.</span>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </Form>
      </div>
    )
  }

  // Default card variant
  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={placeholder}
                      type="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className={cn(
                        "transition-colors",
                        form.formState.errors.email && "border-destructive"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Fields */}
            {showNameFields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          type="text"
                          autoComplete="given-name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          type="text"
                          autoComplete="family-name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  {buttonText}
                </>
              )}
            </Button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-4 w-4" />
                <span>Successfully subscribed! Check your email for confirmation.</span>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Privacy Notice */}
            <p className="text-xs text-muted-foreground text-center">
              By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}