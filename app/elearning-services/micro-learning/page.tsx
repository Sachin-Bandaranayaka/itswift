"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import { CheckCircle, Award, BarChart, Layers, Users, Clock, Target, Zap, Brain, Play, Gamepad2, Smartphone, FileCheck, Wrench, Share2, Route, TrendingUp, Repeat, Film, Settings } from "lucide-react"

export default function MicroLearningPage() {

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
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    const mainContent = document.getElementById('main-content');
                                    mainContent?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section id="main-content" className="py-16 bg-white">
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
                        <DynamicFAQ 
                            pageSlug="micro-learning"
                            title="Frequently Asked Questions (FAQs) about Micro-Learning"
                            className="mb-16"
                        />

                        {/* Our Services */}
                        <div className="mb-16">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Micro-Learning Services</h3>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    Comprehensive solutions designed to deliver engaging and effective micro-learning experiences
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "Interactive Video Modules",
                                        description: "Engaging video content with interactive elements and assessments",
                                        icon: <Play className="h-6 w-6" />,
                                        color: "from-blue-500 to-blue-600"
                                    },
                                    {
                                        title: "Gamified Learning Paths",
                                        description: "Game-based learning with rewards, badges, and progress tracking",
                                        icon: <Gamepad2 className="h-6 w-6" />,
                                        color: "from-purple-500 to-purple-600"
                                    },
                                    {
                                        title: "Mobile Learning Apps",
                                        description: "Native mobile applications for learning on-the-go",
                                        icon: <Smartphone className="h-6 w-6" />,
                                        color: "from-green-500 to-green-600"
                                    },
                                    {
                                        title: "Microlearning Assessments",
                                        description: "Quick, focused assessments to reinforce learning objectives",
                                        icon: <FileCheck className="h-6 w-6" />,
                                        color: "from-orange-500 to-orange-600"
                                    },
                                    {
                                        title: "Performance Support Tools",
                                        description: "Just-in-time resources and job aids for immediate application",
                                        icon: <Wrench className="h-6 w-6" />,
                                        color: "from-red-500 to-red-600"
                                    },
                                    {
                                        title: "Social Learning Features",
                                        description: "Collaborative learning through discussions and peer interactions",
                                        icon: <Share2 className="h-6 w-6" />,
                                        color: "from-indigo-500 to-indigo-600"
                                    },
                                    {
                                        title: "Adaptive Learning Paths",
                                        description: "Personalized learning journeys based on individual progress",
                                        icon: <Route className="h-6 w-6" />,
                                        color: "from-teal-500 to-teal-600"
                                    },
                                    {
                                        title: "Real-time Analytics",
                                        description: "Comprehensive insights into learning progress and engagement",
                                        icon: <TrendingUp className="h-6 w-6" />,
                                        color: "from-pink-500 to-pink-600"
                                    },
                                    {
                                        title: "Spaced Repetition Systems",
                                        description: "Scientifically-backed repetition schedules for better retention",
                                        icon: <Repeat className="h-6 w-6" />,
                                        color: "from-yellow-500 to-yellow-600"
                                    },
                                    {
                                        title: "Multimedia Content",
                                        description: "Rich media experiences with videos, animations, and audio",
                                        icon: <Film className="h-6 w-6" />,
                                        color: "from-cyan-500 to-cyan-600"
                                    },
                                    {
                                        title: "Interactive Simulations",
                                        description: "Realistic scenarios and simulations for hands-on practice",
                                        icon: <Settings className="h-6 w-6" />,
                                        color: "from-emerald-500 to-emerald-600"
                                    }
                                ].map((service, index) => (
                                    <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                        <div className="p-6">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                {service.icon}
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                                {service.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Development Process */}
                        <div className="mb-16">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4 text-gray-900">Development Process</h3>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    Our proven 4-step methodology ensures successful micro-learning implementation
                                </p>
                            </div>
                            <div className="relative">
                                {/* Connection Line */}
                                <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200"></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        {
                                            step: "01",
                                            title: "Content Analysis",
                                            description: "We analyze your existing content and identify optimal micro-learning opportunities.",
                                            icon: <Users className="h-8 w-8" />,
                                            color: "from-blue-500 to-blue-600"
                                        },
                                        {
                                            step: "02",
                                            title: "Module Design",
                                            description: "Each module is designed with clear objectives and engaging interactive elements.",
                                            icon: <Layers className="h-8 w-8" />,
                                            color: "from-purple-500 to-purple-600"
                                        },
                                        {
                                            step: "03",
                                            title: "Development & Testing",
                                            description: "We develop and rigorously test each module for optimal user experience.",
                                            icon: <Award className="h-8 w-8" />,
                                            color: "from-green-500 to-green-600"
                                        },
                                        {
                                            step: "04",
                                            title: "Deployment & Analytics",
                                            description: "Seamless deployment with comprehensive analytics and performance tracking.",
                                            icon: <BarChart className="h-8 w-8" />,
                                            color: "from-orange-500 to-orange-600"
                                        }
                                    ].map((step, index) => (
                                        <div key={index} className="relative group">
                                            {/* Step Number Circle */}
                                            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300`}>
                                                {step.step}
                                            </div>

                                            {/* Card */}
                                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 pt-12 border border-gray-100 group-hover:-translate-y-2">
                                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white mb-6 group-hover:scale-105 transition-transform duration-300`}>
                                                    {step.icon}
                                                </div>
                                                <h4 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-gray-700 transition-colors">
                                                    {step.title}
                                                </h4>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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