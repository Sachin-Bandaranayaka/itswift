"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, MessageCircle, Shield, Clock, Zap, Users, BarChart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    const categories = [
        { id: "all", name: "All Questions", icon: <MessageCircle className="h-4 w-4" /> },
        { id: "services", name: "Our Services", icon: <Shield className="h-4 w-4" /> },
        { id: "rapid", name: "Rapid Learning", icon: <Clock className="h-4 w-4" /> },
        { id: "micro", name: "Microlearning", icon: <Zap className="h-4 w-4" /> },
        { id: "corporate", name: "Corporate Solutions", icon: <Users className="h-4 w-4" /> },
        { id: "performance", name: "Performance", icon: <BarChart className="h-4 w-4" /> }
    ]

    const faqs = [
        {
            question: "What Makes Swift Solution's Custom E-Learning Development Unique?",
            answer: "At Swift Solution, we believe learning should reflect the DNA of your organization. Our custom e-learning development is built from the ground up to address your specific business needs, values, and goals. With over two decades of experience, our team crafts custom online learning that delivers results—whether you're onboarding new employees or reskilling a global workforce.",
            categories: ["services", "corporate"]
        },
        {
            question: "How Can Rapid E-Learning Solutions Help My Organization Stay Agile?",
            answer: "In today's fast-moving business environment, speed matters. Our rapid e-learning development uses pre-approved frameworks and rapid e-learning software to deliver courses faster, without compromising quality. Whether you need to launch an employee elearning program quickly or provide just-in-time compliance training, our rapid elearning services are designed for agility and effectiveness.",
            categories: ["rapid", "services"]
        },
        {
            question: "Why Are Microlearning Modules So Effective for Modern Learners?",
            answer: "Our microlearning modules are designed to deliver focused, relevant content in under 10 minutes. This approach, guided by our microlearning best practices, allows employees to engage in micro learning during short breaks or between tasks. As one of the few companies with deep expertise in microlearning strategies, Swift Solution ensures knowledge sticks—when and where it's needed.",
            categories: ["micro", "services"]
        },
        {
            question: "How Can Game-Based Learning Increase Employee Engagement?",
            answer: "People learn best when they are engaged. Our game e-learning solutions use gamification techniques—like points, levels, and rewards—to motivate learners and foster healthy competition. Whether it's a compliance module or sales training, interactive e-learning built on gamified frameworks makes the learning process fun, memorable, and impactful.",
            categories: ["services", "corporate"]
        },
        {
            question: "What Are the Benefits of Outsourcing Learning and Development to Swift Solution?",
            answer: "By outsourcing learning and development to Swift Solution, you get access to a team of dedicated experts in e-learning content development without the overhead costs of an internal team. Our content development outsourcing services help businesses scale their training programs efficiently, providing flexibility, scalability, and rapid deployment.",
            categories: ["services", "corporate"]
        },
        {
            question: "How Do Swift Solution's Corporate E-Learning Solutions Improve Business Performance?",
            answer: "Our corporate e-learning solutions are designed to align with your organization's KPIs. We create custom e-learning solutions for employee elearning, leadership development, compliance, and sales enablement—driving measurable improvements in productivity, knowledge retention, and business outcomes.",
            categories: ["corporate", "performance"]
        },
        {
            question: "What Industries Does Swift Solution Serve?",
            answer: "Swift Solution works with industries ranging from healthcare to finance, manufacturing to retail. Whether you need interactive e-learning, microlearning modules, or corporate elearning solutions, our expertise ensures your learners get a training experience that's relevant and effective.",
            categories: ["services", "corporate"]
        }
    ]

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const filteredFaqs = faqs.filter(faq => {
        // Filter by category
        if (activeCategory !== "all" && !faq.categories.includes(activeCategory)) {
            return false
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        }

        return true
    })

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-gray-600"
                    >
                        Everything you need to know about our e-learning services
                    </motion.p>

                    {/* Search and filter section */}
                    <div className="mt-12 mb-10">
                        <div className="relative max-w-md mx-auto mb-8">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search for questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B38] focus:border-transparent transition duration-200"
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category.id
                                            ? "bg-[#FF6B38] text-white shadow-md"
                                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="mr-2">{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <AnimatePresence>
                        {filteredFaqs.length > 0 ? (
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredFaqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                                    >
                                        <button
                                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                            onClick={() => toggleQuestion(index)}
                                        >
                                            <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? "bg-[#FF6B38] text-white" : "bg-gray-100"
                                                }`}>
                                                {openIndex === index ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {openIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="px-6 pb-6"
                                                >
                                                    <div className="border-t border-gray-100 pt-4">
                                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full">
                                    <Search className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">No Questions Found</h3>
                                <p className="text-gray-500 mb-6">
                                    We couldn't find any questions matching your search criteria.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                                    className="text-[#FF6B38] font-medium hover:underline"
                                >
                                    Clear search and filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CTA section below FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto mt-16 bg-gradient-to-r from-[#FF6B38] to-[#FF8B38] rounded-2xl overflow-hidden shadow-lg"
                >
                    <div className="p-8 md:p-12 text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="mb-6 text-white/90">
                            Our team of e-learning experts is ready to help you find the perfect solution for your organization.
                        </p>
                        <a
                            href="#contact"
                            className="inline-block bg-white text-[#FF6B38] font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition duration-200"
                        >
                            Contact Us Today
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
} 