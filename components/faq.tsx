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
            title: "CUSTOM E-LEARNING",
            faqs: [
                {
                    question: "What Makes Swift Solution's Custom E-Learning Development Unique?",
                    answer: "At Swift Solution, we believe learning should reflect the DNA of your organization. Our custom e-learning development is built from the ground up to address your specific business needs, values, and goals. With over two decades of experience, our team crafts custom online learning that delivers results—whether you're onboarding new employees or reskilling a global workforce."
                },
                {
                    question: "How Can Rapid E-Learning Solutions Help My Organization Stay Agile?",
                    answer: "In today's fast-moving business environment, speed matters. Our rapid e-learning development uses pre-approved frameworks and rapid e-learning software to deliver courses faster, without compromising quality. Whether you need to launch an employee elearning program quickly or provide just-in-time compliance training, our rapid elearning services are designed for agility and effectiveness."
                },
                {
                    question: "Why Are Microlearning Modules So Effective for Modern Learners?",
                    answer: "Our microlearning modules are designed to deliver focused, relevant content in under 10 minutes. This approach, guided by our microlearning best practices, allows employees to engage in micro learning during short breaks or between tasks. As one of the few companies with deep expertise in microlearning strategies, Swift Solution ensures knowledge sticks—when and where it's needed."
                },
                {
                    question: "How Can Game-Based Learning Increase Employee Engagement?",
                    answer: "People learn best when they are engaged. Our game e-learning solutions use gamification techniques—like points, levels, and rewards—to motivate learners and foster healthy competition. Whether it's a compliance module or sales training, interactive e-learning built on gamified frameworks makes the learning process fun, memorable, and impactful."
                }
            ]
        },
        {
            title: "BUSINESS SOLUTIONS",
            faqs: [
                {
                    question: "What Are the Benefits of Outsourcing Learning and Development to Swift Solution?",
                    answer: "By outsourcing learning and development to Swift Solution, you get access to a team of dedicated experts in e-learning content development without the overhead costs of an internal team. Our content development outsourcing services help businesses scale their training programs efficiently, providing flexibility, scalability, and rapid deployment."
                },
                {
                    question: "How Do Swift Solution's Corporate E-Learning Solutions Improve Business Performance?",
                    answer: "Our corporate e-learning solutions are designed to align with your organization's KPIs. We create custom e-learning solutions for employee elearning, leadership development, compliance, and sales enablement—driving measurable improvements in productivity, knowledge retention, and business outcomes."
                },
                {
                    question: "What Industries Does Swift Solution Serve?",
                    answer: "Swift Solution works with industries ranging from healthcare to finance, manufacturing to retail. Whether you need interactive e-learning, microlearning modules, or corporate elearning solutions, our expertise ensures your learners get a training experience that's relevant and effective."
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
                            Everything you need to know.
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
