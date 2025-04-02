"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Services() {
    const services = [
        {
            title: "Custom E-Learning Development",
            icon: "/icons/custom-learning.svg",
            description: "We specialize in custom e-learning development, creating courses that are as unique as your business. Whether it's compliance training, onboarding, leadership development, or product knowledge, our bespoke elearning ensures that your workforce is engaged and empowered.",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500"
        },
        {
            title: "Rapid E-Learning Development",
            icon: "/icons/rapid-learning.svg",
            description: "Our rapid e-learning solutions leverage cutting-edge rapid e-learning software and proven frameworks to accelerate content creation. With a focus on speed and quality, we help businesses meet urgent training deadlines without sacrificing learner engagement.",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-500"
        },
        {
            title: "Microlearning Modules",
            icon: "/icons/microlearning.svg",
            description: "Swift Solution's microlearning strategies deliver high-impact learning in short bursts. Perfect for modern learners, our micro learning modules are mobile-friendly, accessible anytime, and designed using microlearning best practices to maximize knowledge retention.",
            iconBg: "bg-green-100",
            iconColor: "text-green-500"
        },
        {
            title: "Interactive E-Learning & Game-Based Learning",
            icon: "/icons/interactive-learning.svg",
            description: "Engage learners with interactive e-learning and game e-learning experiences. From quizzes to simulations and interactive online learning PPTs, we ensure your learners stay motivated and active participants in their learning journey.",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-500"
        },
        {
            title: "Payroll",
            icon: "/icons/payroll.svg",
            description: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500"
        },
        {
            title: "Training",
            icon: "/icons/training.svg",
            description: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.",
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
                    <h2 className="text-4xl font-bold mb-4">Our Comprehensive E-Learning Services</h2>
                    <p className="text-xl text-gray-600">At Swift Solution, we offer a complete suite of elearning services</p>
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
                                                    alt={service.title}
                                                    fill
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
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 flex-grow">{service.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
} 