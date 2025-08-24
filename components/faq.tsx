"use client"

import { useState } from "react"
import { motion } from "framer-motion"

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
                    answer: "Our AI-enabled solutions go beyond basic personalization. We use AI to create truly adaptive learning experiences that cater to the individual needs of each learner, resulting in higher engagement, better knowledge retention, and a greater return on investment. This makes us the best eLearning company in Bangalore for AI-powered corporate training."
                },
                {
                    question: "Why is Swift Solution considered the best eLearning company in Bangalore?",
                    answer: "With over 20 years of experience, a proven track record with global clients like Google, Microsoft, and Siemens, and our commitment to AI-powered innovation, Swift Solution stands out as the top eLearning company in Bangalore. We deliver measurable results and exceptional ROI for our clients."
                },
                {
                    question: "What makes Swift Solution different from other eLearning solutions providers in Bangalore?",
                    answer: "As a leading eLearning solutions provider in Bangalore, we offer end-to-end services including custom content development, LMS integration, and AI-powered personalization. Our 20+ years of experience and partnerships with global leaders set us apart from other providers in the market."
                }
            ]
        },
        {
            title: "AI-POWERED SOLUTIONS",
            faqs: [
                {
                    question: "How do AI-enabled eLearning solutions improve training effectiveness?",
                    answer: "Our AI-enabled eLearning solutions analyze learner behavior and performance to create personalized learning paths, provide real-time feedback, and optimize content delivery. This results in higher engagement rates, better knowledge retention, and improved training ROI for organizations."
                },
                {
                    question: "What data-driven insights can Swift Solution provide?",
                    answer: "Our AI-powered analytics provide valuable insights into learner performance, content effectiveness, completion rates, and skill gaps. This data-driven approach allows you to continuously measure and improve your return on investment while making informed decisions about your training programs."
                },
                {
                    question: "How does gamification enhance the learning experience?",
                    answer: "We incorporate gamification elements like points, badges, leaderboards, and interactive scenarios to make learning more engaging and memorable. This approach not only increases learner motivation but also improves knowledge retention and practical application of skills in the workplace."
                }
            ]
        }
    ]

    return (
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
    )
} 
