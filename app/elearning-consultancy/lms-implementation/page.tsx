"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Phone, Mail, FileText, Calendar } from "lucide-react"

export default function LMSImplementationPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How long does a typical Moodle LMS implementation take?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        The timeline for Moodle LMS implementation varies based on complexity, customization requirements, and integration needs. A standard implementation typically takes 4-6 weeks, while more complex projects with extensive customization may require 8-12 weeks. Our agile implementation methodology ensures the fastest possible deployment without compromising quality or functionality.
                    </p>
                </>
            )
        },
        {
            question: "Can you migrate our existing courses and user data from another LMS?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        Absolutely. Our LMS migration services include comprehensive data transfer from virtually any learning platform to Moodle. We carefully map and migrate courses, user accounts, completion records, and other essential data to ensure continuity in your training programs. Our migration specialists have successfully completed transitions from platforms like Blackboard, Canvas, TalentLMS, and proprietary systems.
                    </p>
                </>
            )
        },
        {
            question: "How do you ensure our Moodle LMS implementation is secure?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        Security is paramount in our implementation process. We implement multiple layers of protection, including secure server configurations, encrypted data transmission, regular security updates, and role-based access controls. We also conduct security audits and vulnerability assessments to identify and address potential risks before they can be exploited.
                    </p>
                </>
            )
        },
        {
            question: "What kind of support do you provide after implementation?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        We offer comprehensive post-implementation support through our outsourced LMS support staff services. This includes technical maintenance, user support, content updates, system monitoring, and strategic guidance. Our support packages can be tailored to your specific needs, from basic technical assistance to full LMS administration and management.
                    </p>
                </>
            )
        },
        {
            question: "Can you customize the Moodle interface to match our brand?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        Yes, custom theme development is a core component of our implementation services. We create Moodle themes that perfectly align with your organizational branding, incorporating your logo, color scheme, typography, and other visual elements. This customization creates a seamless experience that reinforces your brand identity throughout the learning journey.
                    </p>
                </>
            )
        },
        {
            question: "How does Moodle LMS implementation improve training ROI?",
            answer: (
                <>
                    <p className="text-gray-600 mb-4">
                        Professional Moodle implementation significantly improves training ROI through multiple mechanisms: reduced administrative overhead, decreased delivery costs, improved completion rates, better knowledge retention, and enhanced reporting capabilities. Our clients typically see ROI improvements of 30-50% compared to previous training approaches, with some reporting even higher returns based on specific use cases and metrics.
                    </p>
                </>
            )
        }
    ];

    const services = [
        {
            title: "Moodle LMS Installation and Configuration",
            description: "We handle the complete technical setup of your Moodle LMS, including server configuration, database setup, and core installation. Our experts configure all system settings to ensure optimal performance, security, and user experience from the start.",
            icon: <Layers className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Custom Theme Development",
            description: "We bring unique design and theme development skills to strengthen your brand presence. Our custom Moodle themes reflect your organizational identity while enhancing usability and engagement, creating a seamless learning experience that feels like a natural extension of your brand.",
            icon: <Award className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Moodle Plugin Integration",
            description: "We identify and implement the perfect combination of Moodle plugins to extend functionality and address your specific training requirements. From advanced reporting to gamification and virtual classrooms, we enhance your LMS with carefully selected plugins that add real value.",
            icon: <CheckCircle className="h-12 w-12 text-orange-500" />
        },
        {
            title: "LMS Migration Services",
            description: "Transitioning from another LMS? Our migration specialists ensure a smooth transfer of all courses, user data, and completion records to your new Moodle platform. We meticulously plan and execute migrations to minimize disruption and preserve your valuable training history.",
            icon: <ArrowRight className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Moodle Cloud Hosting",
            description: "Our managed hosting services provide a secure, high-performance environment for your Moodle LMS. With guaranteed uptime, automatic backups, and proactive monitoring, you can focus on training delivery while we ensure your platform remains fast, secure, and reliable.",
            icon: <BarChart className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Outsourced LMS Support Staff",
            description: "Our dedicated support team becomes an extension of your organization, providing ongoing administration, user support, and technical maintenance. From day-to-day operations to strategic guidance, our outsourced LMS support staff ensures your Moodle platform continues to deliver value.",
            icon: <Users className="h-12 w-12 text-orange-500" />
        }
    ];

    const advantages = [
        {
            title: "Certified Moodle Expertise",
            description: "Our implementation team includes certified Moodle specialists with extensive experience across diverse industries and use cases. This expertise ensures your implementation follows best practices while avoiding common pitfalls that can compromise success.",
            icon: <Award className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Rapid Implementation Methodology",
            description: "Our efficient implementation process delivers a fully functional, customized Moodle LMS in weeks, not months. This agility ensures your organization can quickly begin realizing the benefits of your new learning platform without extended delays.",
            icon: <ArrowRight className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Seamless System Integration",
            description: "We ensure your Moodle LMS works harmoniously with your existing technology ecosystem, including HR systems, content repositories, and authentication services. These integrations create a unified experience while eliminating redundant data entry and management.",
            icon: <Layers className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Comprehensive Training and Knowledge Transfer",
            description: "We provide thorough training for administrators and end-users, ensuring everyone can effectively utilize the new platform. Our documentation and knowledge transfer processes build internal capability while reducing dependency on external support.",
            icon: <Users className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Ongoing Optimization and Support",
            description: "Our relationship continues beyond implementation with proactive monitoring, regular updates, and continuous improvement recommendations. This ongoing partnership ensures your Moodle LMS evolves alongside your organizational needs and technological advancements.",
            icon: <BarChart className="h-8 w-8 text-orange-500" />
        }
    ];

    const strategies = [
        {
            title: "Blended Learning Architecture",
            description: "We implement Moodle LMS configurations that seamlessly combine self-paced online learning with virtual instructor-led sessions and social learning components. This blended approach maximizes engagement while accommodating diverse learning preferences.",
        },
        {
            title: "Microlearning Framework",
            description: "Our implementations include microlearning structures that deliver bite-sized, focused learning modules perfect for today's busy professionals. This approach improves knowledge retention while enabling learning in the flow of work.",
        },
        {
            title: "Adaptive Learning Pathways",
            description: "We configure your Moodle LMS to deliver personalized learning experiences based on role, skill level, and performance. These adaptive pathways ensure each learner receives the most relevant content at the optimal time.",
        },
        {
            title: "Gamification Elements",
            description: "Our implementations incorporate game mechanics like points, badges, leaderboards, and challenges to drive motivation and completion. These gamification elements transform standard training into engaging learning experiences.",
        },
        {
            title: "Comprehensive Analytics Dashboard",
            description: "We implement robust reporting and analytics capabilities that provide actionable insights into learning activities and outcomes. These dashboards enable data-driven decisions about training effectiveness and future investments.",
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20">
                <div className="absolute inset-0">
                    <Image
                        src="/IMAGES/12.LMS Implementation/download.png"
                        alt="LMS Implementation Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Moodle LMS Implementation Services in Bangalore: Expert Solutions for Corporate Training
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Transform your corporate training with our expert Moodle LMS implementation services
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

            {/* Services Section */}
            <section id="services" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Comprehensive Moodle LMS Implementation Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our extensive portfolio of Moodle LMS implementation services covers all aspects of your learning technology needs
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

            {/* Advantages Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            The Swift Solution Advantage for Moodle LMS Implementation
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            When you partner with Swift Solution for your Moodle LMS implementation needs in Bangalore, you gain several distinct advantages
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => (
                            <div key={index} className="flex bg-white rounded-lg p-6 shadow-md border border-gray-100">
                                <div className="mr-4 flex-shrink-0">
                                    {advantage.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{advantage.title}</h3>
                                    <p className="text-gray-600 text-sm">{advantage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Strategies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Innovative Moodle LMS Implementation Strategies
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Swift Solution provides customized Moodle LMS implementation services by delivering solutions through innovative approaches that make your learning platform more powerful, engaging, and effective
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {strategies.map((strategy, index) => (
                            <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{strategy.title}</h3>
                                <p className="text-gray-700">{strategy.description}</p>
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
                                Frequently Asked Questions (FAQs) about Moodle LMS Implementation Services
                            </h2>
                        </div>

                        {/* Right side - FAQ content */}
                        <div>
                            <div className="mb-12">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                                    MOODLE LMS IMPLEMENTATION
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