"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, Code } from "lucide-react"

export default function ConvertFlashToHtmlPage() {

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/3.custom learning/download (3).png" 
                        alt="Flash to HTML5 Conversion Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Flash to HTML5 Conversion
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Modernize your legacy Flash content with seamless HTML5 conversion services
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
                            Future-Proof Your eLearning Content
                        </h2>
                        
                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-gray-700 mb-6">
                                With Adobe Flash officially discontinued and no longer supported by modern browsers, 
                                organizations worldwide face the challenge of converting their valuable Flash-based eLearning 
                                content to modern, accessible formats. Swift Solution specializes in seamless Flash to HTML5 
                                conversion that preserves your content's functionality while enhancing its accessibility and performance.
                            </p>
                            
                            <p className="text-gray-700 mb-6">
                                Our expert team uses cutting-edge HTML5, CSS3, and JavaScript technologies to recreate your 
                                Flash content with pixel-perfect accuracy. We ensure that all animations, interactions, and 
                                multimedia elements are preserved while making your content mobile-friendly and future-proof.
                            </p>
                        </div>

                        {/* Why Choose Our Conversion Services */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Why Choose Our Flash to HTML5 Conversion?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Pixel-Perfect Conversion</h4>
                                        <p className="text-gray-700">Maintain exact visual design and functionality</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Mobile Compatibility</h4>
                                        <p className="text-gray-700">Works seamlessly on all devices and browsers</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">SCORM Compliance</h4>
                                        <p className="text-gray-700">Maintains LMS compatibility and tracking</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Enhanced Performance</h4>
                                        <p className="text-gray-700">Faster loading and better user experience</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Accessibility Standards</h4>
                                        <p className="text-gray-700">WCAG 2.1 compliant for inclusive learning</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Future-Proof Technology</h4>
                                        <p className="text-gray-700">Built with modern web standards</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Conversion Process */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Our Conversion Process</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: "Content Analysis",
                                        description: "We thoroughly analyze your Flash content to understand its structure, interactions, and requirements.",
                                        icon: <Users className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Technical Planning",
                                        description: "Our team creates a detailed conversion plan, identifying the best HTML5 technologies for your content.",
                                        icon: <Layers className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "HTML5 Development",
                                        description: "We recreate your content using modern HTML5, CSS3, and JavaScript, maintaining all functionality.",
                                        icon: <Code className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Testing & Delivery",
                                        description: "Comprehensive testing across devices and browsers ensures perfect functionality before delivery.",
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

                        {/* Content Types We Convert */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Content Types We Convert</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[
                                    "Interactive eLearning Courses",
                                    "Educational Games",
                                    "Training Simulations",
                                    "Product Demonstrations",
                                    "Assessment Tools",
                                    "Interactive Presentations",
                                    "Multimedia Tutorials",
                                    "Virtual Labs",
                                    "Scenario-Based Learning",
                                    "Interactive Infographics",
                                    "Learning Games",
                                    "Compliance Training"
                                ].map((type, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200">
                                        <span className="text-sm font-medium">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Benefits of HTML5 Conversion</h3>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">Technical Benefits</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Cross-browser compatibility</li>
                                            <li>• Mobile and tablet support</li>
                                            <li>• Faster loading times</li>
                                            <li>• Better security</li>
                                            <li>• SEO-friendly content</li>
                                            <li>• Accessibility compliance</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">Business Benefits</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Protect your content investment</li>
                                            <li>• Reach mobile learners</li>
                                            <li>• Reduce maintenance costs</li>
                                            <li>• Improve user experience</li>
                                            <li>• Future-proof your training</li>
                                            <li>• Maintain SCORM compliance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <DynamicFAQ
                sectionId="faq"
                pageSlug="convert-flash-to-html"
                title="Frequently Asked Questions"
            />

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Ready to Convert Your Flash Content?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Contact our conversion experts to discuss your Flash to HTML5 migration needs.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}
