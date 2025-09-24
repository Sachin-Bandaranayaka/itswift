"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown } from "lucide-react"

export default function OnboardingPage() {
    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/9.onboarding/download (1).png" 
                        alt="Employee Onboarding Solutions Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Online Employee Onboarding Solutions in Bangalore
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Transforming New Hire Experiences with Engaging, Scalable Solutions
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#approach" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Comprehensive Online Onboarding Solutions for Modern Organizations
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    In today's competitive business landscape, attracting top talent is only half the battle—retaining them through an exceptional onboarding experience is equally crucial. Traditional onboarding approaches often overwhelm new hires with information overload and fail to create meaningful connections to your organization.
                                </p>
                                <p className="text-lg text-gray-700 mb-4">
                                    At Swift Solution, we're revolutionizing this critical process by creating dynamic, engaging, and highly effective online employee induction training courses in Bangalore that transform standard onboarding into powerful learning experiences.
                                </p>
                                <p className="text-lg text-gray-700">
                                    Our specialized team combines deep organizational development expertise with innovative instructional design to develop onboarding solutions that new employees genuinely appreciate. We understand that effective onboarding isn't just about paperwork and policies—it's about creating a sense of belonging and purpose from day one.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">Why Traditional Onboarding Falls Short</h3>
                                <ul className="space-y-4 w-full max-w-md">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Information overload leading to poor knowledge retention</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Inconsistent messaging from multiple stakeholders</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Difficulty managing onboarding across distributed teams</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Limited personalization for different roles</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Approach Section */}
            <section id="approach" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our Approach to Online Onboarding Excellence
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            What sets Swift Solution apart in the crowded field of eLearning companies in Bangalore is our commitment to creating onboarding experiences that are both effective and engaging.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Organizational Psychology</h3>
                            <p className="text-gray-700">
                                We leverage the latest in learning design and organizational psychology to develop induction programs that align perfectly with your company culture and business objectives.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Layers className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Rapid Development</h3>
                            <p className="text-gray-700">
                                Using rapid learning tools and proven methodologies, we can quickly create, customize, or offer readymade onboarding courses tailored specifically to your organizational needs.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Award className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Brand Alignment</h3>
                            <p className="text-gray-700">
                                Our modules are meticulously designed to reflect your brand identity, core values, and unique workplace culture, ensuring your new hires receive a consistent and authentic introduction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Catalog Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Comprehensive Onboarding Solutions Catalog
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our extensive library of online employee induction training courses covers critical areas that modern organizations must address
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Pre-boarding Engagement
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Connect with new hires before their first day to build excitement and reduce anxiety
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Company Culture & Values
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Immerse new employees in your organizational culture through engaging storytelling
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Policies & Procedures
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Transform dry compliance content into interactive learning experiences
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Role-specific Training
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Accelerate time-to-productivity with targeted skill development
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Team Integration
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Foster meaningful connections with managers and team members
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Product & Service Knowledge
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Build foundational understanding of your offerings
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Systems & Tools Training
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Ensure technical proficiency with essential workplace systems
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Career Development Pathways
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Demonstrate growth opportunities from day one
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            The Swift Solution Advantage for Corporate Onboarding
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            When you partner with Swift Solution for your online employee induction training needs in Bangalore, you gain several distinct advantages
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Accelerated Implementation</h3>
                            <p className="text-gray-700">
                                Using our efficient development process, we can create and deploy customized onboarding solutions within days, not weeks or months. This agility ensures your organization can quickly onboard new hires without lengthy development cycles.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Engaging, Interactive Content</h3>
                            <p className="text-gray-700">
                                We transform standard onboarding content into engaging learning experiences through interactive scenarios, real-world case studies, and multimedia elements that maintain learner interest and improve knowledge retention.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Customization That Reflects Your Culture</h3>
                            <p className="text-gray-700">
                                Our onboarding courses aren't generic templates—they're carefully tailored to reflect your specific organizational culture, values, and business practices, making the training immediately relevant to your new employees.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Comprehensive Tracking and Reporting</h3>
                            <p className="text-gray-700">
                                Our robust LMS provides detailed analytics on completion rates, assessment scores, and knowledge gaps, giving you complete visibility into your onboarding program's effectiveness and areas for improvement.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Continuous Updates and Support</h3>
                            <p className="text-gray-700">
                                As your organization evolves, your onboarding must evolve accordingly. We provide regular content updates to ensure your training materials remain current with the latest organizational changes and requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Engagement Strategies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Innovative Onboarding Engagement Strategies
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Swift Solution provides you customized onboarding and induction eLearning modules by delivering solutions through innovative technologies making them engaging and scalable to multiple teams across geographies.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Microlearning for Maximum Retention</h3>
                            <p className="text-gray-700">
                                We break down complex onboarding content into bite-sized, focused learning modules that new hires can easily digest and retain. This approach prevents information overload and allows for flexible, self-paced learning.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Gamification Elements</h3>
                            <p className="text-gray-700">
                                By incorporating game mechanics like points, badges, leaderboards, and challenges, we transform standard onboarding into an engaging, motivating experience that drives completion and knowledge retention.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Virtual Reality Workplace Tours</h3>
                            <p className="text-gray-700">
                                For distributed teams, our virtual reality solutions provide immersive workplace tours that help remote employees feel connected to your physical environment and culture.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Social Learning Components</h3>
                            <p className="text-gray-700">
                                We integrate social learning elements that connect new hires with peers and mentors, fostering a sense of community and belonging from day one.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Mobile-First Design</h3>
                            <p className="text-gray-700">
                                All our onboarding solutions are built with a mobile-first approach, ensuring new employees can access training anytime, anywhere, on any device.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <DynamicFAQ
                sectionId="faq"
                pageSlug="on-boarding"
                title="Frequently Asked Questions (FAQs) about Employee Onboarding"
            />

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <Contact />
            </section>
        </div>
    )
}
