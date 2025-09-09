"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, BarChart, Layers, Target, BookOpen, Lightbulb } from "lucide-react"

export default function InstructionalDesignPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is instructional design and why is it important?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Instructional design is the systematic process of creating educational experiences that make learning effective, efficient, and engaging. It combines learning theory, pedagogical principles, and technology to design training programs that achieve specific learning objectives and drive measurable business outcomes.
                    </p>
                </>
            )
        },
        {
            question: "How long does it take to develop a custom instructional design solution?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        The timeline varies based on project complexity, content volume, and customization requirements. A typical instructional design project takes 6-12 weeks, including analysis, design, development, and testing phases. We provide detailed project timelines during our initial consultation to ensure clear expectations.
                    </p>
                </>
            )
        },
        {
            question: "Can you redesign our existing training materials?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Absolutely. We specialize in transforming existing training content into engaging, pedagogically sound learning experiences. Our instructional designers analyze your current materials and redesign them using proven learning methodologies to improve engagement, retention, and application.
                    </p>
                </>
            )
        },
        {
            question: "What learning theories do you apply in your instructional design?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        We apply evidence-based learning theories including Bloom's Taxonomy, Gagne's Nine Events of Instruction, Adult Learning Theory, Cognitive Load Theory, and Social Learning Theory. Our approach is tailored to your audience and learning objectives, ensuring maximum effectiveness.
                    </p>
                </>
            )
        },
        {
            question: "How do you measure the effectiveness of instructional design?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        We use Kirkpatrick's Four-Level Evaluation Model to measure training effectiveness: reaction, learning, behavior, and results. We implement assessment strategies, analytics, and feedback mechanisms to track learner progress and demonstrate ROI through improved performance metrics.
                    </p>
                </>
            )
        }
    ];

    const services = [
        {
            title: "Learning Needs Analysis",
            description: "We conduct comprehensive analysis to identify performance gaps, learning objectives, and target audience characteristics. This foundation ensures our instructional design solutions address real business needs and deliver measurable results.",
            icon: <Target className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Curriculum Design and Development",
            description: "Our instructional designers create structured learning pathways that guide learners from basic concepts to advanced applications. We design curricula that build knowledge progressively while maintaining engagement throughout the learning journey.",
            icon: <BookOpen className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Interactive Learning Experiences",
            description: "We design engaging, interactive learning experiences that promote active participation and knowledge retention. From scenario-based learning to gamification elements, we create memorable training that drives behavior change.",
            icon: <Lightbulb className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Assessment and Evaluation Design",
            description: "We develop comprehensive assessment strategies that accurately measure learning outcomes and provide meaningful feedback. Our evaluation frameworks help organizations track training effectiveness and demonstrate ROI.",
            icon: <CheckCircle className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Blended Learning Solutions",
            description: "We design optimal combinations of online, instructor-led, and experiential learning components. Our blended approaches maximize learning effectiveness while accommodating diverse learning preferences and organizational constraints.",
            icon: <Layers className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Learning Technology Integration",
            description: "We seamlessly integrate instructional design with learning technologies, ensuring your training content works effectively across all platforms and devices. Our technology-enhanced designs improve accessibility and engagement.",
            icon: <BarChart className="h-12 w-12 text-orange-500" />
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20">
                <div className="absolute inset-0">
                    <Image
                        src="/IMAGES/13.Instruction designer/download.png"
                        alt="Instructional Design Services Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Expert Instructional Design Services: Transform Your Training Programs
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Create engaging, effective learning experiences that drive real business results through proven instructional design methodologies
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Professional Instructional Design Services That Drive Results
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Transform your training programs with evidence-based instructional design that engages learners and achieves business objectives
                            </p>
                        </div>

                        {/* Key Challenge Highlight */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-12 border-l-4 border-orange-500">
                            <div className="flex items-start">
                                <div className="bg-orange-100 rounded-full p-3 mr-6 flex-shrink-0">
                                    <Target className="h-8 w-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">The Training Effectiveness Challenge</h3>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        Many organizations struggle with training programs that fail to engage learners or drive meaningful behavior change. Without proper instructional design, even well-intentioned training initiatives often result in <span className="font-semibold text-orange-600">poor knowledge retention, low completion rates, and minimal impact on job performance</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Solution Highlight */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                            <div>
                                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <Lightbulb className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    Swift Solution delivers <span className="font-semibold text-orange-600">expert instructional design services</span> that transform ordinary training content into engaging, effective learning experiences that drive measurable business results.
                                </p>
                                <div className="flex items-center text-orange-600">
                                    <ArrowRight className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Evidence-based design methodologies</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Our Approach</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Learner-centered design principles</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Performance-focused outcomes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Engaging interactive experiences</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Comprehensive Instructional Design Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our full-service instructional design solutions cover every aspect of effective learning program development
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-5">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-16 max-w-7xl mx-auto">
                        {/* Left side - title */}
                        <div>
                            <h2 className="text-4xl font-bold sticky top-24">
                                Frequently Asked Questions (FAQs) about Instructional Design Services
                            </h2>
                        </div>

                        {/* Right side - FAQ content */}
                        <div>
                            <div className="mb-12">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                                    INSTRUCTIONAL DESIGN
                                </h3>
                                <div className="space-y-px">
                                    {faqs.map((faq, index) => {
                                        const isItemOpen = openFaqIndex === index;

                                        return (
                                            <div key={index} className="border-t border-gray-200 first:border-t-0">
                                                <button
                                                    onClick={() => toggleFaq(index)}
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
                                                        {faq.answer}
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
            </section>

            {/* Contact Section */}
            <section id="contact">
                <Contact />
            </section>
        </div>
    )
}