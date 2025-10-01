"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import DynamicContent from "./dynamic-content"

export default function Services() {
    const services = [
        {
            titleKey: "service_1_title",
            titleFallback: "Unmatched Experience and a Proven Track Record",
            icon: "/icons/custom-learning.svg",
            descriptionKey: "service_1_description",
            descriptionFallback: "With over 20 years of experience, we have a proven track record of delivering high-impact eLearning solutions to a diverse clientele. Our portfolio showcases our ability to handle projects of any scale and complexity, delivering exceptional results every time.",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500"
        },
        {
            titleKey: "service_2_title",
            titleFallback: "A Team of Passionate Learning Experts",
            icon: "/icons/rapid-learning.svg",
            descriptionKey: "service_2_description",
            descriptionFallback: "Our team of learning consultants, instructional designers, and developers are the heart of our organization. Their passion for learning and commitment to excellence are the driving forces behind our success. This is why we are consistently recognized as one of the top eLearning companies in Bangalore.",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-500"
        },
        {
            titleKey: "service_3_title",
            titleFallback: "Trusted by Global Leaders like Google, Microsoft, and Siemens",
            icon: "/icons/microlearning.svg",
            descriptionKey: "service_3_description",
            descriptionFallback: "Our client list speaks for itself. We are proud to have partnered with some of the world's leading companies, including Google, Microsoft, and Siemens. This is a testament to our ability to deliver world-class eLearning solutions that meet the highest standards of quality and effectiveness.",
            iconBg: "bg-green-100",
            iconColor: "text-green-500"
        },
        {
            titleKey: "service_4_title",
            titleFallback: "AI-Enabled eLearning Solutions: The Future of Corporate Training",
            icon: "/icons/interactive-learning.svg",
            descriptionKey: "service_4_description",
            descriptionFallback: "As a visionary AI-enabled eLearning solutions company in Bangalore, we are pioneering the use of artificial intelligence to create personalized, adaptive, and engaging learning experiences. Our AI-powered solutions are designed to optimize learning outcomes and maximize your return on investment.",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-500"
        },
        {
            titleKey: "service_5_title",
            titleFallback: "Personalized Learning Paths for Maximum Impact",
            icon: "/icons/payroll.svg",
            descriptionKey: "service_5_description",
            descriptionFallback: "Our AI-driven platform analyzes individual learner data to create personalized learning paths that cater to their unique needs and learning styles. This ensures that every employee receives the right training at the right time, maximizing knowledge retention and application.",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500"
        },
        {
            titleKey: "service_6_title",
            titleFallback: "Gamification and Interactive Content That Engages and Inspires",
            icon: "/icons/training.svg",
            descriptionKey: "service_6_description",
            descriptionFallback: "We believe that learning should be an enjoyable and immersive experience. That's why we incorporate gamification, simulations, and interactive content into our eLearning solutions. This not only makes learning more engaging but also improves knowledge retention and application.",
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500"
        }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center mb-16"
                >
                    <DynamicContent 
                        sectionKey="services_title" 
                        pageSlug="home"
                        fallback={<h2 className="text-4xl font-bold mb-4">Why Swift Solution is the Best eLearning Company in Bangalore</h2>}
                    />
                    <DynamicContent 
                        sectionKey="services_description" 
                        pageSlug="home"
                        fallback={
                            <p className="text-xl text-gray-600">Choosing the right eLearning partner is a critical decision for any organization. Here's why Swift Solution is the undisputed choice for businesses seeking the best eLearning company in Bangalore.</p>
                        }
                    />
                </motion.div>

                <div className="max-w-7xl mx-auto overflow-hidden rounded-lg border border-gray-200">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-200">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative bg-white group"
                            >
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center`}>
                                            <div className="relative w-6 h-6">
                                                <Image
                                                    src={service.icon}
                                                    alt={service.titleFallback}
                                                    fill
                                                    sizes="24px"
                                                    className="object-contain"
                                                    onError={(e) => {
                                                        // Fallback for missing images
                                                        e.currentTarget.src = "/placeholder.svg";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <DynamicContent
                                        sectionKey={service.titleKey}
                                        pageSlug="home"
                                        as="h3"
                                        className="text-xl font-semibold text-gray-800 mb-3"
                                        fallback={service.titleFallback}
                                    />
                                    <DynamicContent
                                        sectionKey={service.descriptionKey}
                                        pageSlug="home"
                                        as="p"
                                        className="text-gray-600 flex-grow"
                                        fallback={service.descriptionFallback}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}