"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Head from "next/head"

type FAQItem = {
    question: string
    answer: string
}

export default function FAQ() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({
        "0-0": true // First question open by default
    })

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

    const faqCategories = [
        {
            title: "ELEARNING IN BANGALORE",
            faqs: [
                {
                    question: "What are the benefits of partnering with an eLearning company in Bangalore?",
                    answer: "Bangalore is a global hub for technology and innovation, offering access to a vast pool of talent and resources. Partnering with an eLearning company in Bangalore gives you access to cutting-edge solutions, cost-effective services, and a culture of excellence. Swift Solution, as the top eLearning company in Bangalore, combines local expertise with global standards to deliver exceptional results."
                },
                {
                    question: "How does Swift Solution's AI-enabled approach differ from other eLearning providers?",
                    answer: "Our AI-enabled approach goes beyond simple automation. We use AI to create personalized learning paths, provide real-time feedback, and generate data-driven insights to continuously improve learning outcomes. This allows us to deliver a truly adaptive and engaging learning experience that is tailored to the unique needs of each learner."
                },
                {
                    question: "Why is Swift Solution considered the best eLearning company in Bangalore?",
                    answer: "Our 20+ years of experience, our impressive client portfolio (including Google, Microsoft, and Siemens), our commitment to innovation, and our focus on delivering measurable results are just a few of the reasons why we are considered the best eLearning company in Bangalore. But don't just take our word for it - our client testimonials and case studies speak for themselves."
                }
            ]
        }
    ]

    // Generate FAQ schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqCategories.flatMap(category => 
            category.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        )
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-[1fr,2fr] gap-16 max-w-7xl mx-auto">
                    {/* Left side - title */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-bold sticky top-24"
                        >
                            Frequently Asked Questions (FAQs) about eLearning in Bangalore
                        </motion.h2>
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
                                            <div key={itemIndex} className="border-t border-gray-200 first:border-t-0">
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
