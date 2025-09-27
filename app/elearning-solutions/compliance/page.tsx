"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import DynamicContent from '@/components/dynamic-content';
import { usePageContent } from "@/hooks/use-page-content"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown } from "lucide-react"

const PAGE_SLUG = "elearning-solutions/compliance"

export default function CompliancePage() {
    const { getContent, isLoading } = usePageContent(PAGE_SLUG)

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20">
                <div className="absolute inset-0">
                    <Image
                        src={getContent("hero_background_image", "/IMAGES/10.compliance/download.png")}
                        alt={getContent("hero_background_alt", "Compliance Training Background")}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            <DynamicContent 
                                sectionKey="hero_title" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Online Compliance Training Courses in Bangalore"
                                as="span"
                            />
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            <DynamicContent 
                                sectionKey="hero_subtitle" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Transforming Corporate Regulatory Adherence with Engaging, Scalable Solutions"
                                as="span"
                            />
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                <DynamicContent 
                                    sectionKey="hero_cta_primary" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Get Started"
                                    as="span"
                                />
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#approach" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                <DynamicContent 
                                    sectionKey="hero_cta_secondary" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Learn More"
                                    as="span"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Content Sections - Integrated into styled sections below */}

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                <DynamicContent 
                                    sectionKey="intro_title" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Comprehensive Online Compliance Training Solutions for Modern Businesses"
                                    as="span"
                                />
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    <DynamicContent 
                                        sectionKey="intro_paragraph_1" 
                                        pageSlug="elearning-solutions/compliance" 
                                        fallback="In today's complex regulatory environment, mandatory compliance with financial, criminal, company, and civil laws is essential for protecting both employees and business interests. Traditional compliance training approaches often devolve into tedious checkbox exercises that fail to engage employees or deliver meaningful results."
                                        as="span"
                                    />
                                </p>
                                <p className="text-lg text-gray-700 mb-4">
                                    <DynamicContent 
                                        sectionKey="intro_paragraph_2" 
                                        pageSlug="elearning-solutions/compliance" 
                                        fallback="At Swift Solution, we're transforming this paradigm by creating dynamic, engaging, and highly effective online compliance training courses in Bangalore that turn regulatory requirements into valuable learning experiences."
                                        as="span"
                                    />
                                </p>
                                <p className="text-lg text-gray-700">
                                    <DynamicContent 
                                        sectionKey="intro_paragraph_3" 
                                        pageSlug="elearning-solutions/compliance" 
                                        fallback="Our specialized team combines deep subject matter expertise with innovative instructional design to develop compliance training that employees actually want to complete. We understand that effective compliance isn't just about meeting regulatory requirements, it's about creating a culture of integrity and responsibility throughout your organization."
                                        as="span"
                                    />
                                </p>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">
                                    <DynamicContent 
                                        sectionKey="problems_title" 
                                        pageSlug="elearning-solutions/compliance" 
                                        fallback="Why Traditional Compliance Training Falls Short"
                                        as="span"
                                    />
                                </h3>
                                <ul className="space-y-4 w-full max-w-md">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <DynamicContent 
                                                sectionKey="problem_1_description" 
                                                pageSlug="elearning-solutions/compliance" 
                                                fallback="Content that fails to engage learners or demonstrate real-world relevance"
                                                as="span"
                                            />
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <DynamicContent 
                                                sectionKey="problem_2_description" 
                                                pageSlug="elearning-solutions/compliance" 
                                                fallback="Difficulty managing and tracking completion across distributed teams"
                                                as="span"
                                            />
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <DynamicContent 
                                                sectionKey="problem_3_description" 
                                                pageSlug="elearning-solutions/compliance" 
                                                fallback="Inconsistent delivery that creates compliance gaps and potential liability"
                                                as="span"
                                            />
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <DynamicContent 
                                                sectionKey="problem_4_description" 
                                                pageSlug="elearning-solutions/compliance" 
                                                fallback="Poor knowledge retention that undermines the training's purpose"
                                                as="span"
                                            />
                                        </span>
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
                            <DynamicContent 
                                sectionKey="approach_title" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Our Approach to Online Compliance Training Excellence"
                                as="span"
                            />
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            <DynamicContent 
                                sectionKey="approach_description" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="What sets Swift Solution apart in the crowded field of eLearning companies in Bangalore is our commitment to creating compliance training that's both effective and engaging."
                                as="span"
                            />
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <a href="/elearning-consultancy/instructional-design" className="block bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Users className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                <DynamicContent 
                                    sectionKey="approach_card_1_title" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Subject Matter Expertise"
                                    as="span"
                                />
                            </h3>
                            <p className="text-gray-700">
                                <DynamicContent 
                                    sectionKey="approach_card_1_description" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="We leverage the latest in learning design and subject matter expertise to develop courses that align perfectly with your business requirements and industry-specific regulations."
                                    as="span"
                                />
                            </p>
                        </a>
                        <a href="/elearning-services/rapid-elearning" className="block bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Layers className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                <DynamicContent 
                                    sectionKey="approach_card_2_title" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Rapid Development"
                                    as="span"
                                />
                            </h3>
                            <p className="text-gray-700">
                                <DynamicContent 
                                    sectionKey="approach_card_2_description" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Using rapid learning tools and proven methodologies, we can quickly create, customize, or offer readymade compliance courses tailored specifically to your organizational needs."
                                    as="span"
                                />
                            </p>
                        </a>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                <Award className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                <DynamicContent 
                                    sectionKey="approach_card_3_title" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Continuous Updates"
                                    as="span"
                                />
                            </h3>
                            <p className="text-gray-700">
                                <DynamicContent 
                                    sectionKey="approach_card_3_description" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="We regularly update our content to reflect the latest regulatory changes, giving your employees access to the most current compliance information available."
                                    as="span"
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Catalog Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            <DynamicContent 
                                sectionKey="catalog_title" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Comprehensive Compliance Training Course Catalog"
                                as="span"
                            />
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            <DynamicContent 
                                sectionKey="catalog_description" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Our extensive library of online compliance training courses covers critical areas that modern businesses must address"
                                as="span"
                            />
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                <DynamicContent 
                                    sectionKey="course_1_title" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Competition Law"
                                    as="span"
                                />
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                <DynamicContent 
                                    sectionKey="course_1_description" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Ensure fair business practices and prevent anti-competitive behavior"
                                    as="span"
                                />
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Criminal Finances Act
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Protect your organization from financial crime and corruption
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Incident Reporting
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Establish clear protocols for reporting compliance violations
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Risk Assessment
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Identify and mitigate compliance risks before they become problems
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Sexual Harassment Prevention
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Create a safe, respectful workplace environment
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Anti-Bribery Training
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Implement robust anti-corruption measures throughout your operations
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Anti-Money Laundering
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Detect and prevent financial crimes within your organization
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                Information Security
                            </h3>
                            <p className="text-gray-700 ml-13 pl-10">
                                Safeguard sensitive data and maintain regulatory compliance
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
                            <DynamicContent 
                                sectionKey="advantages_title" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="The Swift Solution Advantage for Corporate Compliance Training"
                                as="span"
                            />
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            <DynamicContent 
                                sectionKey="advantages_description" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="When you partner with Swift Solution for your online compliance training needs in Bangalore, you gain several distinct advantages"
                                as="span"
                            />
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Rapid Implementation</h3>
                            <p className="text-gray-700">
                                Using our efficient development process, we can create and deploy customized compliance training within days, not weeks or months. This agility ensures your organization can respond quickly to new regulatory requirements or compliance gaps.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Engaging, Interactive Content</h3>
                            <p className="text-gray-700">
                                We transform compliance topics from dry, technical material into engaging learning experiences through interactive scenarios, real-world case studies, and multimedia elements that maintain learner interest and improve knowledge retention.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Customization That Reflects Your Business Reality</h3>
                            <p className="text-gray-700">
                                Our compliance courses aren't generic templates—they're carefully tailored to reflect your specific industry challenges, organizational policies, and business practices, making the training immediately relevant to your employees.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Comprehensive Tracking and Reporting</h3>
                            <p className="text-gray-700">
                                Our robust LMS provides detailed analytics on completion rates, assessment scores, and knowledge gaps, giving you complete visibility into your compliance training program's effectiveness and areas for improvement.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Continuous Updates and Support</h3>
                            <p className="text-gray-700">
                                Regulations change constantly, and your compliance training must evolve accordingly. We provide regular content updates to ensure your training materials remain current with the latest regulatory requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transforming Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Transforming Compliance Training from Burden to Benefit
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The most effective compliance training doesn't just satisfy regulatory requirements—it transforms organizational culture.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                            <p className="text-lg text-gray-700 mb-6">
                                At Swift Solution, we design our online compliance courses to:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Build genuine understanding of why compliance matters, not just what rules to follow</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Develop critical thinking skills that help employees navigate complex ethical situations</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Create a culture of integrity that extends beyond mere rule-following</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Reduce compliance incidents through improved awareness and decision-making</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Protect your organization's reputation and financial health through proactive compliance</span>
                                </li>
                            </ul>
                            <p className="text-lg text-gray-700 mt-6">
                                Our clients consistently report that employees find our compliance training more engaging and valuable than traditional approaches, leading to better completion rates, higher knowledge retention, and ultimately, stronger compliance outcomes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <DynamicFAQ pageSlug="elearning-solutions/compliance" />

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            <DynamicContent 
                                sectionKey="cta_title" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Partner with Swift Solution for Compliance Excellence"
                                as="span"
                            />
                        </h2>
                        <p className="text-xl mb-8">
                            <DynamicContent 
                                sectionKey="cta_description" 
                                pageSlug="elearning-solutions/compliance" 
                                fallback="Don't settle for checkbox compliance training that fails to engage employees or drive real behavioral change. Partner with Swift Solution, one of the leading eLearning companies in Bangalore, to develop online compliance training courses that transform regulatory requirements into valuable learning experiences."
                                as="span"
                            />
                        </p>
                        <div className="flex justify-center">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                <DynamicContent 
                                    sectionKey="cta_button" 
                                    pageSlug="elearning-solutions/compliance" 
                                    fallback="Schedule a Consultation"
                                    as="span"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <Contact />
            </section>
        </div>
    )
}