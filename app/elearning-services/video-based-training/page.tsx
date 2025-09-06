"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Play, Video, Camera, Edit, Mic, Monitor } from "lucide-react"

interface FAQItem {
    question: string
    answer: string
}

export default function VideoBasedTrainingPage() {
    const [openFAQs, setOpenFAQs] = useState<Record<number, boolean>>({
        0: true // First question open by default
    })

    const toggleFAQ = (index: number) => {
        setOpenFAQs(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const faqItems: FAQItem[] = [
        {
            question: "What types of video-based training do you create?",
            answer: "We create a wide range of video training content including: instructional videos, product demonstrations, software tutorials, compliance training, onboarding videos, leadership development content, safety training, and interactive video scenarios."
        },
        {
            question: "How do you ensure high production quality in your videos?",
            answer: "We use professional-grade equipment, experienced videographers, and post-production specialists. Our process includes scriptwriting, storyboarding, professional filming, advanced editing, color correction, audio enhancement, and quality assurance testing."
        },
        {
            question: "Can you create interactive video training content?",
            answer: "Yes! We specialize in interactive video training that includes clickable hotspots, branching scenarios, embedded quizzes, knowledge checks, and decision-point interactions. This approach significantly increases engagement and knowledge retention."
        },
        {
            question: "Do you provide video hosting and delivery solutions?",
            answer: "Absolutely. We offer secure video hosting, adaptive streaming for different devices and bandwidths, LMS integration, analytics tracking, and content delivery network (CDN) services to ensure optimal viewing experience worldwide."
        },
        {
            question: "How do you handle multilingual video training requirements?",
            answer: "We provide comprehensive multilingual services including professional voice-over in multiple languages, subtitle creation, cultural adaptation, and localization of visual elements to ensure your training resonates with global audiences."
        },
        {
            question: "What's the typical timeline for video training production?",
            answer: "Timeline varies based on complexity and length. Simple training videos take 2-3 weeks, while complex interactive video series may require 6-8 weeks. We provide detailed project timelines during the planning phase."
        }
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/IMAGES/video based learning.jpg"
                        alt="Video-Based Training Solutions"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Video-Based Training Solutions
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Engaging video training that captivates learners and drives real results
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    const contentSection = document.getElementById('main-content');
                                    contentSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                            >
                                Get Started
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
                            Transform Learning with Professional Video Training
                        </h2>

                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-gray-700 mb-6">
                                Video-based training has become the gold standard for corporate learning, offering unparalleled
                                engagement and knowledge retention. Swift Solution creates professional, high-impact video training
                                content that transforms complex concepts into compelling visual narratives that learners actually
                                want to watch and remember.
                            </p>

                            <p className="text-gray-700 mb-6">
                                Our comprehensive video training solutions combine cinematic production quality with instructional
                                design expertise. From concept to delivery, we handle every aspect of video training development,
                                ensuring your content not only looks professional but delivers measurable learning outcomes.
                            </p>
                        </div>

                        {/* Why Choose Our Video Training */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Why Choose Our Video-Based Training?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Professional Production Quality</h4>
                                        <p className="text-gray-700">Cinematic quality videos that reflect your brand</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Interactive Elements</h4>
                                        <p className="text-gray-700">Engaging interactions that boost retention</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Multi-Device Compatibility</h4>
                                        <p className="text-gray-700">Optimized for desktop, tablet, and mobile</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Analytics & Tracking</h4>
                                        <p className="text-gray-700">Detailed insights into learner engagement</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Multilingual Support</h4>
                                        <p className="text-gray-700">Professional voice-over and subtitles</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">LMS Integration</h4>
                                        <p className="text-gray-700">Seamless integration with your learning platform</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mb-16">
                            <div className="grid md:grid-cols-[1fr,2fr] gap-16">
                                {/* Left side - title */}
                                <div>
                                    <h3 className="text-4xl font-bold sticky top-24">
                                        Frequently Asked Questions (FAQs) about Video-Based Training
                                    </h3>
                                </div>

                                {/* Right side - FAQ content */}
                                <div>
                                    <div className="mb-12">
                                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                                            VIDEO-BASED TRAINING
                                        </h4>
                                        <div className="space-y-px">
                                            {faqItems.map((faq, index) => {
                                                const isItemOpen = openFAQs[index];

                                                return (
                                                    <div key={index} className="border-t border-gray-200 first:border-t-0">
                                                        <button
                                                            onClick={() => toggleFAQ(index)}
                                                            className="flex justify-between items-center w-full py-6 text-left"
                                                        >
                                                            <span className={`text-lg font-medium ${isItemOpen ? "text-blue-500" : "text-gray-900"}`}>
                                                                {faq.question}
                                                            </span>
                                                            <span className="ml-6 flex-shrink-0">
                                                                {isItemOpen ? (
                                                                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                        </button>
                                                        {isItemOpen && (
                                                            <div className="pb-6">
                                                                <p className="text-gray-600">{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Training Types */}
                        <div className="mb-16">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4 text-gray-900">Video Training Solutions We Offer</h3>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    Comprehensive video training solutions designed to engage learners and deliver measurable results
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "Instructional Videos",
                                        description: "Step-by-step tutorials and educational content for skill development",
                                        icon: <Play className="h-6 w-6" />,
                                        color: "from-blue-500 to-blue-600"
                                    },
                                    {
                                        title: "Product Demonstrations",
                                        description: "Showcase product features and benefits through engaging video content",
                                        icon: <Video className="h-6 w-6" />,
                                        color: "from-purple-500 to-purple-600"
                                    },
                                    {
                                        title: "Software Tutorials",
                                        description: "Interactive software training with screen recordings and walkthroughs",
                                        icon: <Monitor className="h-6 w-6" />,
                                        color: "from-green-500 to-green-600"
                                    },
                                    {
                                        title: "Compliance Training",
                                        description: "Regulatory and policy training videos for organizational compliance",
                                        icon: <CheckCircle className="h-6 w-6" />,
                                        color: "from-orange-500 to-orange-600"
                                    },
                                    {
                                        title: "Onboarding Videos",
                                        description: "Welcome new employees with comprehensive orientation videos",
                                        icon: <Users className="h-6 w-6" />,
                                        color: "from-red-500 to-red-600"
                                    },
                                    {
                                        title: "Leadership Development",
                                        description: "Executive and management training through scenario-based videos",
                                        icon: <Award className="h-6 w-6" />,
                                        color: "from-indigo-500 to-indigo-600"
                                    },
                                    {
                                        title: "Safety Training",
                                        description: "Workplace safety procedures and emergency response training",
                                        icon: <CheckCircle className="h-6 w-6" />,
                                        color: "from-teal-500 to-teal-600"
                                    },
                                    {
                                        title: "Sales Training",
                                        description: "Sales techniques and customer interaction training videos",
                                        icon: <BarChart className="h-6 w-6" />,
                                        color: "from-pink-500 to-pink-600"
                                    },
                                    {
                                        title: "Customer Service",
                                        description: "Customer support and service excellence training modules",
                                        icon: <Users className="h-6 w-6" />,
                                        color: "from-yellow-500 to-yellow-600"
                                    },
                                    {
                                        title: "Technical Training",
                                        description: "Complex technical concepts simplified through visual demonstrations",
                                        icon: <Layers className="h-6 w-6" />,
                                        color: "from-cyan-500 to-cyan-600"
                                    },
                                    {
                                        title: "Interactive Scenarios",
                                        description: "Branching video scenarios for decision-making practice",
                                        icon: <Play className="h-6 w-6" />,
                                        color: "from-emerald-500 to-emerald-600"
                                    },
                                    {
                                        title: "Animated Explainers",
                                        description: "Animated videos that simplify complex concepts and processes",
                                        icon: <Video className="h-6 w-6" />,
                                        color: "from-violet-500 to-violet-600"
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

                        {/* Production Process */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Our Video Production Process</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: "Strategy & Planning",
                                        description: "We define objectives, target audience, and create detailed scripts and storyboards.",
                                        icon: <Users className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Pre-Production",
                                        description: "Location scouting, talent casting, equipment setup, and production scheduling.",
                                        icon: <Camera className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Production & Filming",
                                        description: "Professional filming with high-end equipment and experienced production crew.",
                                        icon: <Video className="h-8 w-8 text-orange-500" />
                                    },
                                    {
                                        title: "Post-Production",
                                        description: "Expert editing, motion graphics, audio enhancement, and interactive element integration.",
                                        icon: <Edit className="h-8 w-8 text-orange-500" />
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

                        {/* Video Training Benefits */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Benefits of Video-Based Training</h3>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">Learning Benefits</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 95% retention rate vs 10% for text</li>
                                            <li>• Visual and auditory learning combined</li>
                                            <li>• Self-paced learning flexibility</li>
                                            <li>• Consistent message delivery</li>
                                            <li>• Complex concepts simplified</li>
                                            <li>• Emotional connection and engagement</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">Business Benefits</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• Reduced training costs over time</li>
                                            <li>• Scalable to unlimited learners</li>
                                            <li>• 24/7 availability</li>
                                            <li>• Measurable learning analytics</li>
                                            <li>• Professional brand representation</li>
                                            <li>• Global reach with localization</li>
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
                            Ready to Create Compelling Video Training?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Contact our video production experts to discuss your training video needs.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}