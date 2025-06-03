"use client"

import React from "react"
import { ArrowRight } from "lucide-react"

export default function ElearningConsultancyPage() {
    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            E-Learning Consultancy Services
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Expert e-learning consultancy services to transform your training and development programs
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="/elearning-consultancy/lms-implementation" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Explore LMS Implementation
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our E-Learning Consultancy Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Comprehensive e-learning consultancy services to help you implement, optimize, and manage your learning technology ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <a href="/elearning-consultancy/lms-implementation" className="group">
                            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">Moodle LMS Implementation</h3>
                                <p className="text-gray-600 mb-4">Expert Moodle LMS implementation services for corporate training excellence.</p>
                                <div className="flex items-center text-orange-600 font-medium">
                                    Learn more
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </a>

                        {/* Placeholder for future services */}
                        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full opacity-50">
                            <h3 className="text-xl font-bold mb-3 text-gray-900">LMS Strategy & Selection</h3>
                            <p className="text-gray-600 mb-4">Strategic guidance to select the right LMS for your organization's needs.</p>
                            <div className="flex items-center text-gray-400 font-medium">
                                Coming soon
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full opacity-50">
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Learning Technology Ecosystem</h3>
                            <p className="text-gray-600 mb-4">Build an integrated learning technology ecosystem for maximum impact.</p>
                            <div className="flex items-center text-gray-400 font-medium">
                                Coming soon
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 