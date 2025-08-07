"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Clock, Target, Zap, Brain } from "lucide-react"

interface FAQItem {
    question: string
    answer: string
    icon: React.ReactNode
}

export default function MicroLearningPage() {
    const [showFAQs, setShowFAQs] = useState(false)

    const faqItems: FAQItem[] = [
        {
            question: "What is micro-learning and how does it differ from traditional eLearning?",
            answer: "Micro-learning delivers content in small, focused chunks that can be consumed in 2-10 minutes. Unlike traditional eLearning courses that may take hours, micro-learning modules focus on specific learning objectives, making them perfect for busy professionals who need just-in-time learning.",
            icon: <Clock className="h-5 w-5 text-orange-500" />
        },
        {
            question: "How effective is micro-learning for knowledge retention?",
            answer: "Research shows that micro-learning can improve knowledge retention by up to 80% compared to traditional learning methods. The spaced repetition and focused content delivery align with how our brains naturally process and retain information.",
            icon: <Brain className="h-5 w-5 text-orange-500" />
        },
        {
            question: "What types of content work best for micro-learning?",
            answer: "Micro-learning works exceptionally well for: \n• Product knowledge updates\n• Compliance training\n• Skill-based tutorials\n• Safety procedures\n• Software training\n• Sales techniques\n• Customer service protocols",
            icon: <Target className="h-5 w-5 text-orange-500" />
        },
        {
            question: "How do you ensure engagement in such short learning modules?",
            answer: "We use interactive elements like quizzes, scenarios, gamification, and multimedia content. Each module includes clear learning objectives, engaging visuals, and immediate feedback to maintain learner attention and motivation throughout the brief learning experience.",
            icon: <Zap className="h-5 w-5 text-orange-500" />
        },
        {
            question: "Can micro-learning modules be integrated with our existing LMS?",
            answer: "Yes, our micro-learning modules are designed to be SCORM and xAPI compliant, ensuring seamless integration with most Learning Management Systems. We also provide detailed analytics and progress tracking capabilities.",
            icon: <CheckCircle className="h-5 w-5 text-orange-500" />
        }
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/4. micro learning/download (1).png" 
                        alt="Micro-Learning Solutions Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Micro-Learning Solutions
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Bite-sized learning modules that deliver maximum impact in minimum time
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                            Transform Learning with Micro-Learning
                        </h2>
                        
                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-gray-700 mb-6">
                                In today's fast-paced business environment, traditional lengthy training sessions are becoming obsolete. 
                                Swift Solution's micro-learning approach delivers targeted, bite-sized content that fits seamlessly into 
                                your employees' busy schedules while maximizing learning effectiveness.
                            </p>
                            
                            <p className="text-gray-700 mb-6">
                                Our micro-learning modules are designed based on cognitive science principles, ensuring optimal knowledge 
                                retention and immediate application. Each module focuses on a single learning objective, making complex 
                                topics digestible and actionable.
                            </p>
                        </div>

                        {/* Why Choose Our Micro-Learning */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Why Choose Our Micro-Learning?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Time-Efficient Learning</h4>
                                        <p className="text-gray-700">2-10 minute modules that fit into any schedule</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Higher Retention Rates</h4>
                                        <p className="text-gray-700">Up to 80% better knowledge retention</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Mobile-First Design</h4>
                                        <p className="text-gray-700">Learn anywhere, anytime on any device</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Just-in-Time Learning</h4>
                                        <p className="text-gray-700">Access relevant content when you need it most</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h3>
                                <button
                                    onClick={() => setShowFAQs(!showFAQs)}
                                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                >
                                    <span>{showFAQs ? 'Hide' : 'Show'} FAQs</span>
                                    <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${showFAQs ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            
                            {showFAQs && (
                                <div className="space-y-6">
                                    {faqItems.map((faq, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                            <div className="flex items-start space-x-3 mb-3">
                                                {faq.icon}
                                                <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
                                            </div>
                                            <p className="text-gray-700 ml-8 whitespace-pre-line">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Our Services */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Our Micro-Learning Services</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[
                                    "Interactive Video Modules",
                                    "Gamified Learning Paths",
                                    "Mobile Learning Apps",
                                    "Microlearning Assessments",
                                    "Performance Support Tools",
                                    "Social Learning Features",
                                    "Adaptive Learning Paths",
                                    "Real-time Analytics",
                                    "Spaced Repetition Systems",
                                    "Multimedia Content",
                                    "Interactive Simulations"
                                ].map((service, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200">
                                        <span className="text-sm font-medium">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Development Process */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Development Process</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: "Content Analysis",
                                        description: "We analyze your existing content and identify optimal micro-learning opportunities.",
                                        icon: <Users className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Module Design",
                                        description: "Each module is designed with clear objectives and engaging interactive elements.",
                                        icon: <Layers className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Development & Testing",
                                        description: "We develop and rigorously test each module for optimal user experience.",
                                        icon: <Award className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Deployment & Analytics",
                                        description: "Seamless deployment with comprehensive analytics and performance tracking.",
                                        icon: <BarChart className="h-8 w-8 text-orange-500" />
                                    }
                                ].map((step, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                        <div className="bg-orange-50 p-3 rounded-full inline-block mb-4">
                                            {step.icon}
                                        </div>
                                        <h4 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h4>
                                        <p className="text-gray-700">{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Benefits of Micro-Learning</h3>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">For Learners</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Flexible learning that fits busy schedules</li>
                                            <li>• Improved knowledge retention and recall</li>
                                            <li>• Immediate application of learned skills</li>
                                            <li>• Reduced cognitive overload</li>
                                            <li>• Enhanced engagement and motivation</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">For Organizations</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Reduced training costs and time</li>
                                            <li>• Higher completion rates</li>
                                            <li>• Faster skill development</li>
                                            <li>• Better ROI on training investments</li>
                                            <li>• Scalable learning solutions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Ready to Transform Your Training?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get in touch with our micro-learning experts to discuss your training needs.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}