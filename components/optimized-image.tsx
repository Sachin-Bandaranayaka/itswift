"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  className?: string
}

/**
 * Optimized Image component with progressive loading and blur effect
 * Automatically handles loading states for smooth UX
 * 
 * @example
 * <OptimizedImage 
 *   src="/IMAGES/photo.jpg"
 *   alt="Description"
 *   width={1200}
 *   height={800}
 *   priority={true} // Use for above-the-fold images
 * />
 */
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        className={`
          duration-700 ease-in-out
          ${isLoading 
            ? 'scale-110 blur-2xl grayscale' 
            : 'scale-100 blur-0 grayscale-0'
          }
          ${className}
        `}
        {...props}
      />
      
      {/* Optional loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

// Export as default as well
export default OptimizedImage

