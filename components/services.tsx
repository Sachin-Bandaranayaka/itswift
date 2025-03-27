"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Services() {
    const services = [
        {
            title: "Custom E-Learning Development",
            icon: "/icons/custom-learning.svg",
            description: "We specialize in custom e-learning development, creating courses that are as unique as your business. Whether it's compliance training, onboarding, leadership development, or product knowledge, our bespoke elearning ensures that your workforce is engaged and empowered.",
            gradient: "from-blue-500 to-indigo-600",
            iconBg: "bg-blue-100"
        },
        {
            title: "Rapid E-Learning Development",
            icon: "/icons/rapid-learning.svg",
            description: "Our rapid e-learning solutions leverage cutting-edge rapid e-learning software and proven frameworks to accelerate content creation. With a focus on speed and quality, we help businesses meet urgent training deadlines without sacrificing learner engagement.",
            gradient: "from-orange-500 to-red-500",
            iconBg: "bg-orange-100"
        },
        {
            title: "Microlearning Modules",
            icon: "/icons/microlearning.svg",
            description: "Swift Solution's microlearning strategies deliver high-impact learning in short bursts. Perfect for modern learners, our micro learning modules are mobile-friendly, accessible anytime, and designed using microlearning best practices to maximize knowledge retention.",
            gradient: "from-green-500 to-teal-500",
            iconBg: "bg-green-100"
        },
        {
            title: "Interactive E-Learning & Game-Based Learning",
            icon: "/icons/interactive-learning.svg",
            description: "Engage learners with interactive e-learning and game e-learning experiences. From quizzes to simulations and interactive online learning PPTs, we ensure your learners stay motivated and active participants in their learning journey.",
            gradient: "from-purple-500 to-pink-500",
            iconBg: "bg-purple-100"
        }
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
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

                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Top gradient bar */}
                            <div className={`h-3 w-full bg-gradient-to-r ${service.gradient}`}></div>

                            <div className="p-8">
                                {/* Large centered icon */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className={`w-24 h-24 ${service.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                                        <div className="relative w-16 h-16">
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
                                    <h3 className="text-2xl font-bold text-gray-800 text-center">{service.title}</h3>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>

                                {/* Learn more link */}
                                <div className="mt-6 text-center">
                                    <a href="#" className={`inline-flex items-center text-${service.gradient.split('-')[1].split(' ')[0]} font-medium hover:underline`}>
                                        Learn more
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
} 