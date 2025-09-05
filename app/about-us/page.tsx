"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Target, Globe, Lightbulb, Heart, Star, Trophy, Brain, Zap, Shield } from "lucide-react"



interface TeamMember {
    name: string
    role: string
    description: string
    image?: string
}

interface Value {
    title: string
    description: string
    icon: React.ReactNode
}

interface FAQ {
    question: string
    answer: string
}

export default function AboutUsPage() {
    const [showTeam, setShowTeam] = useState(false)
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

    useEffect(() => {
        document.title = "Top AI-Powered eLearning Company in Bangalore, India | Swift Solution"

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Learn about Swift Solution, a leading AI-powered eLearning company in Bangalore with 25+ years of experience. Discover our authentic AI transformation, deep domain expertise, and commitment to delivering measurable ROI for clients like Google and Microsoft.')
        } else {
            const meta = document.createElement('meta')
            meta.name = 'description'
            meta.content = 'Learn about Swift Solution, a leading AI-powered eLearning company in Bangalore with 25+ years of experience. Discover our authentic AI transformation, deep domain expertise, and commitment to delivering measurable ROI for clients like Google and Microsoft.'
            document.head.appendChild(meta)
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
            metaKeywords.setAttribute('content', 'about swift solution, top elearning companies in bangalore, ai-powered elearning, corporate training solutions, elearning company india, custom elearning content')
        } else {
            const meta = document.createElement('meta')
            meta.name = 'keywords'
            meta.content = 'about swift solution, top elearning companies in bangalore, ai-powered elearning, corporate training solutions, elearning company india, custom elearning content'
            document.head.appendChild(meta)
        }
    }, [])

    const teamMembers: TeamMember[] = [
        {
            name: "Keshavan Belagod",
            role: "Co-founder and Director",
            description: "Over 25 years of profound experience in the e-Learning sector. A regular and respected speaker at national e-Learning conferences in India, Keshavan holds an MPhil in e-Learning."
        },
        {
            name: "Madhusudhan Reddy",
            role: "Co-founder and Director",
            description: "Technical head of the company with over 20 years of rich experience. Madhusudhan holds an MTech in Computer Science, providing a strong technical foundation for our innovative solutions."
        },
        {
            name: "Manirangan",
            role: "Co-founder and Director",
            description: "Over 20 years of experience in e-Learning, application software selling, and IT consulting. Computer Science graduate with an MBA, blending technical knowledge with strategic business acumen."
        }
    ]

    const values: Value[] = [
        {
            title: "Client-Centricity",
            description: "Your business goals are our priority. We listen, understand, and then design solutions that are perfectly aligned with your needs.",
            icon: <Heart className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Innovation in Learning",
            description: "We continuously explore new technologies and instructional approaches to make learning more engaging and effective.",
            icon: <Lightbulb className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Measurable Impact",
            description: "We focus on delivering eLearning solutions that lead to tangible improvements in performance and clear ROI.",
            icon: <BarChart className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Expertise & Experience",
            description: "Leveraging over 25 years of specialized experience in the eLearning domain, particularly serving clients in Bangalore and across India.",
            icon: <Award className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Collaborative Partnership",
            description: "We believe in working closely with our clients, fostering a partnership built on trust and shared objectives.",
            icon: <Users className="h-8 w-8 text-orange-500" />
        }
    ]

    const faqs: FAQ[] = [
        {
            question: "Why should our business consider outsourcing to eLearning companies in Bangalore?",
            answer: "Outsourcing to eLearning companies in Bangalore offers a strategic advantage due to the region's vast talent pool of skilled instructional designers, multimedia developers, and project managers. Bangalore, known as India's Silicon Valley, is a hub for innovation and technology, ensuring access to cutting-edge eLearning solutions. Moreover, eLearning companies in Bangalore often provide significant cost efficiencies without compromising on quality, delivering world-class custom eLearning content that meets global standards."
        },
        {
            question: "What makes Bangalore a preferred destination for finding top-tier eLearning companies?",
            answer: "Bangalore is a preferred destination because it hosts a high concentration of premier educational institutions and a thriving IT and BPO sector, which cultivates a rich ecosystem for eLearning companies. This environment ensures a continuous supply of professionals proficient in the latest eLearning technologies and instructional design methodologies. When you partner with eLearning companies in Bangalore, you tap into this deep expertise and a culture of continuous learning and innovation."
        },
        {
            question: "How do eLearning companies in Bangalore ensure quality and effective communication?",
            answer: "Reputable eLearning companies in Bangalore prioritize quality and client communication by adhering to international standards (like ISO certifications) and employing robust project management methodologies (like Agile). Many professionals in Bangalore have excellent English proficiency and experience working with global clients, ensuring smooth collaboration. Furthermore, eLearning companies in Bangalore often leverage modern communication tools and flexible working hours to bridge geographical distances and time zone differences effectively."
        }
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/IMAGES/2.about us/download (2).png"
                        alt="About Swift Solution Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About Swift Solution: Pioneering the Future of Corporate Training in Bangalore
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-4xl mx-auto">
                            Our existence hinges on one simple principle: improving your business performance. We are not just another vendor; we are a strategic partner recognized as one of the top eLearning companies in Bangalore.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                Our AI Journey
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
                                Meet Our Leadership
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Foundation Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                Our Foundation: Three Decades of L&D Mastery and Client Success
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                Our professional identity is built on a fundamental understanding of the Indian L&D ecosystem, which has historically been fragmented and lacking in standardized, systematic approaches. Our journey has been a deliberate effort to build structure, quality, and consistency where it is rare.
                            </p>
                        </div>

                        {/* Foundation Pillars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-orange-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-orange-500 p-3 rounded-full">
                                        <Trophy className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">Proven Track Record</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We have successfully delivered over 1,000 projects for more than 200 distinct clients across diverse industries, including global leaders like Google, Microsoft, and Siemens.
                                </p>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">1,000+</div>
                                        <div className="text-gray-600 text-sm">Projects</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">200+</div>
                                        <div className="text-gray-600 text-sm">Clients</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">25+</div>
                                        <div className="text-gray-600 text-sm">Years</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-500 p-3 rounded-full">
                                        <Users className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">Client Relationship Mastery</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Our philosophy is built on creating long-term value, a stark contrast to the transactional nature of most providers. This is validated by client relationships that span decades and an 80% inquiry-to-order conversion rate sustained over the last 6-7 years.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold text-blue-600 text-center">80%</div>
                                    <div className="text-blue-700 text-center">Inquiry-to-Order Conversion Rate</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-green-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-green-500 p-3 rounded-full">
                                        <Target className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">Value-Based Partnerships</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    We transform one-time projects into ongoing rate contracts, demonstrating our ability to deliver long-term organizational impact. Our approach focuses on sustainable partnerships rather than transactional relationships.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-purple-100">
                                <div className="flex items-center mb-6">
                                    <div className="bg-purple-500 p-3 rounded-full">
                                        <BarChart className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">Operational Excellence</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    We have achieved consistent growth and operate with zero debt, a testament to our financial discipline. Our lean operational structure allows us to handle significant revenue variations with stable monthly costs, ensuring both competitive advantage and scalability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* AI Transformation Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                Our Edge: An Authentic, Two-Year AI-Powered Transformation
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                We are a pioneer in the authentic implementation of AI within the L&D industry. Our systematic, two-year AI transformation journey is not a theoretical exercise but a practical integration validated by enterprise client acceptance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                            <div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-blue-500 p-3 rounded-full">
                                            <Brain className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold ml-4 text-gray-900">A Systematic Journey</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        Beginning in April 2023 with the adoption of ChatGPT for scriptwriting, our journey progressed through six distinct phases. This methodical evolution included integrating AI for visual storyboards, optimizing entire project workflows, and strategically selecting AI-enhanced tools.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                                            <span className="text-gray-700">ChatGPT Integration for Scriptwriting</span>
                                        </div>
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                                            <span className="text-gray-700">AI-Enhanced Visual Storyboards</span>
                                        </div>
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                                            <span className="text-gray-700">Complete Workflow Optimization</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-green-500 p-3 rounded-full">
                                            <Globe className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold ml-4 text-gray-900">Ecosystem Consolidation</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        In 2025, we strategically consolidated our toolset around the Google ecosystem, fully transitioning to Gemini to enhance efficiency and optimize costs. Today, AI is fully integrated into our core processes, including instructional design, storyboards, media planning, scheduling, and client management.
                                    </p>
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">60-70%</div>
                                            <div className="text-green-700">Efficiency Gains in Content Preparation</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-orange-500 p-3 rounded-full">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">The Philosophy of Human-AI Collaboration</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                                    Our approach is centered on human augmentation, not replacement. AI generates, but human experts validate and review, ensuring that we improve efficiency without compromising quality. This model has been critical to gaining enterprise client acceptance for AI-enhanced deliverables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Our Values Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                What Guides Us: Our Core Values and Unwavering Commitment
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {values.map((value, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 text-center">
                                    <div className="bg-orange-50 p-4 rounded-full inline-block mb-6">
                                        {value.icon}
                                    </div>
                                    <h4 className="text-xl font-semibold mb-4 text-gray-900">{value.title}</h4>
                                    <p className="text-gray-700 leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                Frequently Asked Questions (FAQs) about eLearning in Bangalore
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-orange-50 transition-colors duration-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                                        <ChevronDown className={`h-5 w-5 text-orange-500 transform transition-transform duration-200 ${expandedFAQ === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedFAQ === index && (
                                        <div className="px-8 pb-6">
                                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Leadership Team Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                The Minds Behind Swift Solution: Our Leadership Team
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                Our leadership team brings a wealth of experience and a shared passion for leveraging technology to enhance learning and performance. Their expertise is a key reason why Swift Solution is considered one of the top eLearning companies in Bangalore.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Users className="h-12 w-12 text-orange-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-3 text-gray-900">{member.name}</h4>
                                    <p className="text-orange-600 font-semibold mb-4 text-lg">{member.role}</p>
                                    <p className="text-gray-700 leading-relaxed">{member.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Company Stats */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Swift Solution by the Numbers</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-4xl font-bold text-orange-600 mb-2">1,000+</div>
                                    <div className="text-gray-700 font-medium">Projects Delivered</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-orange-600 mb-2">200+</div>
                                    <div className="text-gray-700 font-medium">Distinct Clients</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-orange-600 mb-2">80%</div>
                                    <div className="text-gray-700 font-medium">Conversion Rate</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-orange-600 mb-2">25+</div>
                                    <div className="text-gray-700 font-medium">Years Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Unique Value Proposition Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                The Swift Solution Unique Value Proposition: Why We Lead the Market
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                Our unique value proposition is the convergence of three powerful, rarely combined elements
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
                                <div className="bg-blue-500 p-4 rounded-full inline-block mb-6">
                                    <Award className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Deep Domain Expertise</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Validated by 25 years of client success and deep market insight. Our extensive experience across diverse industries gives us unparalleled understanding of learning challenges.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
                                <div className="bg-green-500 p-4 rounded-full inline-block mb-6">
                                    <Brain className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Authentic AI Transformation</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Proven by a systematic, two-year implementation with measurable results and enterprise client acceptance. We don't just talk about AI - we live it.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
                                <div className="bg-purple-500 p-4 rounded-full inline-block mb-6">
                                    <Shield className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Unwavering Ethical Leadership</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Demonstrated through transparent, value-based practices that build lasting trust and industry credibility. Our zero-debt operation speaks to our financial integrity.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center">
                            <h3 className="text-2xl font-bold mb-4">Market Leadership Based on Authentic Experience</h3>
                            <p className="text-orange-100 mb-6 max-w-4xl mx-auto text-lg">
                                Our market leadership is based on authentic experience, not theoretical claims. We offer our clients, partners, and the industry a proven methodology for navigating the future of learning—a future that is efficient, effective, and fundamentally human.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Final CTA Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            Choose Swift Solution: Your Trusted Partner for AI-Powered eLearning
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 mb-8">
                            When you partner with Swift Solution, you are choosing one of the top eLearning companies in Bangalore with a proven track record of delivering excellence. We are passionate about helping your organization achieve its full potential through innovative and effective custom eLearning solutions.
                        </p>

                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">

                    <Contact />
                </div>
            </section>
        </div>
    )
}