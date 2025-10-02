"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar_url?: string
  display_order: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Number of testimonials to show at once based on screen size
  const testimonialsPerView = 3

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Fallback to default testimonials if fetch fails
      setTestimonials([
        {
          id: '1',
          name: "John Smith",
          role: "Training Manager",
          company: "Tech Corp",
          content: "The eLearning solutions provided by Swift Solution have transformed our corporate training program. The results have been outstanding.",
          rating: 5,
          display_order: 1,
        },
        {
          id: '2',
          name: "Sarah Johnson",
          role: "HR Director",
          company: "Global Industries",
          content: "Exceptional quality and attention to detail. Their team truly understands the importance of effective learning solutions.",
          rating: 5,
          display_order: 2,
        },
        {
          id: '3',
          name: "Michael Chen",
          role: "L&D Lead",
          company: "Innovation Labs",
          content: "The microlearning modules developed by Swift Solution have significantly improved our employee engagement rates.",
          rating: 5,
          display_order: 3,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (testimonials.length > testimonialsPerView) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }, [testimonials.length, testimonialsPerView])

  const prevSlide = () => {
    if (testimonials.length > testimonialsPerView) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isPaused && testimonials.length > testimonialsPerView) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, nextSlide, testimonials.length, testimonialsPerView])

  // Get visible testimonials for current slide
  const getVisibleTestimonials = () => {
    if (testimonials.length <= testimonialsPerView) {
      return testimonials
    }
    const visible = []
    for (let i = 0; i < testimonialsPerView; i++) {
      const index = (currentIndex + i) % testimonials.length
      visible.push(testimonials[index])
    }
    return visible
  }

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const visibleTestimonials = getVisibleTestimonials()
  const showControls = testimonials.length > testimonialsPerView

  return (
    <section 
      className="py-24 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Buttons */}
          {showControls && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}-${index}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FF6B38] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          {showControls && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#FF6B38] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Progress indicator when paused */}
        {showControls && isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-sm text-gray-500"
          >
            Auto-rotation paused
          </motion.div>
        )}
      </div>
    </section>
  )
}

