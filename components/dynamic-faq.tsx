"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Head from "next/head"

interface FAQ {
  id: string
  question: string
  answer: string
  page_slug: string
  category?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FAQCategory {
  title: string
  faqs: FAQ[]
}

interface DynamicFAQProps {
  pageSlug: string
  title?: string
  className?: string
  sectionId?: string
}

export default function DynamicFAQ({ pageSlug, title, className = "", sectionId }: DynamicFAQProps) {
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true // First question open by default
  })

  // Fetch FAQs for the specific page
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/faqs?page=${pageSlug}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        const result = await response.json()
        
        if (result.success) {
          const faqs: FAQ[] = result.data
          
          // Group FAQs by category
          const categorizedFAQs = faqs.reduce((acc: Record<string, FAQ[]>, faq) => {
            const category = faq.category || 'General'
            if (!acc[category]) {
              acc[category] = []
            }
            acc[category].push(faq)
            return acc
          }, {})
          
          // Convert to array format and sort by display_order
          const categories: FAQCategory[] = Object.entries(categorizedFAQs).map(([categoryName, categoryFaqs]) => ({
            title: categoryName.toUpperCase(),
            faqs: categoryFaqs.sort((a, b) => a.display_order - b.display_order)
          }))
          
          setFaqCategories(categories)
        } else {
          setError(result.error || 'Failed to fetch FAQs')
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err)
        setError('Failed to load FAQs')
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [pageSlug])

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const itemKey = `${categoryIndex}-${itemIndex}`
    setOpenItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  const isOpen = (categoryIndex: number, itemIndex: number) => {
    const itemKey = `${categoryIndex}-${itemIndex}`
    return !!openItems[itemKey]
  }

  // Generate FAQ schema for SEO
  const generateFAQSchema = () => {
    const allFAQs = faqCategories.flatMap(category => category.faqs)
    
    if (allFAQs.length === 0) return null

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFAQs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }

    return (
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
    )
  }

  if (loading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (faqCategories.length === 0) {
    return null // Don't render anything if no FAQs
  }

  const sectionClassName = ['py-16 bg-white', className].filter(Boolean).join(' ')

  return (
    <>
      {generateFAQSchema()}
      <section id={sectionId} className={sectionClassName}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[1fr,2fr] gap-16 max-w-7xl mx-auto">
            {/* Left side - title */}
            <div>
              <h2 className="text-4xl font-bold sticky top-24">
                {title || "Frequently Asked Questions"}
              </h2>
            </div>

            {/* Right side - FAQ content */}
            <div>
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                    {category.title}
                  </h3>
                  <div className="space-y-px">
                    {category.faqs.map((faq, itemIndex) => {
                      const isItemOpen = isOpen(categoryIndex, itemIndex);

                      return (
                        <div key={faq.id} className="border-t border-gray-200 first:border-t-0">
                          <button
                            onClick={() => toggleItem(categoryIndex, itemIndex)}
                            className="flex justify-between items-center w-full py-6 text-left"
                          >
                            <span className={`text-lg font-medium ${isItemOpen ? "text-blue-500" : "text-gray-900"}`}>
                              {faq.question}
                            </span>
                            <span className="ml-6 flex-shrink-0">
                              {isItemOpen ? (
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              ) : (
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              )}
                            </span>
                          </button>
                          {isItemOpen && (
                            <div className="pb-6">
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
