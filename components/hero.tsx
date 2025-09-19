"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import DynamicContent from "@/components/dynamic-content"

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative overflow-hidden w-full">
      {/* Full-width video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '56.25%' }}>
          {/* Background with fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
          
          {/* Loading state */}
          {isLoading && mounted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Loading video...</p>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {hasError && mounted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
              <div className="text-white text-center">
                <p className="text-lg">Unable to load video. Please refresh the page.</p>
              </div>
            </div>
          )}
          
          {/* Video element - always render but control visibility */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              !mounted || isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ objectPosition: "center" }}
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setHasError(true)
              setIsLoading(false)
            }}
          >
            <source src="/Banner Video V3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

        </div>
        {/* Dark overlay with minimal opacity */}
        <div className="absolute inset-0 bg-black opacity-30 dark:opacity-40"></div>
      </div>

      {/* Height container for the video */}
      <div className="relative min-h-[80vh] md:min-h-screen">
        {/* Text container positioned at the bottom center with more space from bottom */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-10 mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-white max-w-5xl mx-auto"
          >
            <DynamicContent
              sectionKey="hero_title"
              pageSlug="home"
              as="span"
              fallback="Top eLearning Company in Bangalore: AI-Powered Corporate Training"
            />
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto mt-6"
          >
            <DynamicContent
              sectionKey="hero_subtitle"
              pageSlug="home"
              as="span"
              fallback="We deliver measurable results and exceptional ROI with our award-winning, AI-driven eLearning solutions."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex justify-center items-center"
          >
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block cursor-pointer"
            >
              <DynamicContent
                sectionKey="cta_button"
                pageSlug="home"
                as="span"
                fallback="Get a Free AI Training Consultation"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

