"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import Link from "next/link"
import {
    ArrowRight,
    CheckCircle,
    Award,
    BarChart,
    Layers,
    Users,
    ChevronDown,
    Globe,
    Clock,
    ShieldCheck,
    Zap,
    Puzzle,
    Search,
    Database,
    Bot,
    User,
    Settings,
    CheckSquare,
    Server,
    FileText,
    TrendingUp,
    CheckCheck,
    Star
} from "lucide-react"

export default function RapidElearningPage() {

    // Define benefits
    const benefits = [
        {
            icon: <Clock className="h-12 w-12 text-white" />,
            title: "Accelerated Development Timeline",
            description: "Traditional custom e-learning can take months to develop. Our Bangalore-based rapid authoring approach reduces development time by 40-60%, allowing you to deploy critical training within weeks or even days depending on complexity.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <BarChart className="h-12 w-12 text-white" />,
            title: "Cost-Effective Solution for Indian Businesses",
            description: "Rapid e-learning development typically costs 30-50% less than fully customized courses while maintaining high quality standards. This makes professional e-learning accessible for organizations with limited training budgets, providing exceptional value for Indian companies.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <CheckCheck className="h-12 w-12 text-white" />,
            title: "Consistent Quality and Engagement",
            description: "Our rapid authoring tools include built-in interactive elements, assessment templates, and engagement features that ensure learner participation and knowledge retention without extensive custom programming. We maintain global quality standards while understanding local learning preferences.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <Zap className="h-12 w-12 text-white" />,
            title: "Responsive Design for India's Mobile-First Workforce",
            description: "All our rapid e-learning content is automatically optimized for seamless performance across desktops, tablets, and mobile devices, ensuring your learners can access training anywhere, anytime—essential in India's mobile-first environment where over 70% of digital learning happens on smartphones.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <Settings className="h-12 w-12 text-white" />,
            title: "Easy Updates and Maintenance",
            description: "When policies change or content needs updating, rapid authoring tools allow for quick modifications without rebuilding entire courses, saving you time and resources in the long run. This is particularly valuable for compliance training that must adapt to changing regulations.",
            bgColor: "from-orange-500 to-orange-600"
        }
    ];

    // Define the tools we use
    const tools = [
        {
            name: "Articulate 360 Suite",
            description: "For highly interactive, scenario-based learning with advanced interactions",
            icon: <Award className="h-10 w-10 text-orange-500" />
        },
        {
            name: "Adobe Captivate",
            description: "For software simulation, complex interactions, and responsive design",
            icon: <Puzzle className="h-10 w-10 text-orange-500" />
        },
        {
            name: "Lectora Inspire",
            description: "For accessibility-compliant and text-heavy content with multilingual support",
            icon: <FileText className="h-10 w-10 text-orange-500" />
        },
        {
            name: "iSpring Suite",
            description: "For PowerPoint-based rapid conversion with minimal learning curve",
            icon: <Layers className="h-10 w-10 text-orange-500" />
        },
        {
            name: "Elucidat",
            description: "For collaborative, cloud-based development across distributed teams",
            icon: <Users className="h-10 w-10 text-orange-500" />
        },
        {
            name: "Rise 360",
            description: "For responsive, mobile-first learning experiences optimized for smartphones",
            icon: <Zap className="h-10 w-10 text-orange-500" />
        }
    ];

    // Define challenges & solutions
    const challenges = [
        {
            question: "Are you worried about meeting tight training deadlines?",
            answer: "Our Bangalore-based rapid development approach can reduce typical e-learning production timelines by up to 60%, helping you meet even the most challenging deadlines without sacrificing quality. We understand the urgency of corporate training initiatives.",
            icon: <Clock className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Finding it difficult to handle global training requirements from India?",
            answer: "Our rapid authoring tools support multilingual content development and localization, allowing efficient deployment across global teams with consistent quality. We bridge the gap between Indian operations and international standards.",
            icon: <Globe className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Do your timelines not match your available resources?",
            answer: "We can develop 100+ courses over a period of a year at a cost-effective rate compared to fully customized courses, making large-scale training initiatives manageable. Our team of 50+ e-learning specialists in Bangalore can scale to meet your needs.",
            icon: <Users className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Are your budgets too tight for customized courses?",
            answer: "Rapid e-learning development offers significant cost savings while maintaining professional quality, interactive elements, and effective instructional design. We provide transparent pricing with no hidden costs.",
            icon: <BarChart className="h-12 w-12 text-orange-500" />
        }
    ];

    // Define the process steps
    const processSteps = [
        {
            number: "01",
            title: "Discovery & Analysis",
            description: "We identify your specific learning objectives, audience needs, and technical requirements within the first 48 hours, with special attention to Indian corporate training contexts."
        },
        {
            number: "02",
            title: "Content Strategy",
            description: "Our instructional designers create an optimized content structure that maximizes engagement while ensuring all learning objectives are met, incorporating cultural nuances when needed."
        },
        {
            number: "03",
            title: "Rapid Prototyping",
            description: "We develop a functional prototype using our rapid authoring tools within 3-5 business days for your review and feedback, allowing for early course correction."
        },
        {
            number: "04",
            title: "Accelerated Development",
            description: "Our Bangalore team leverages pre-built templates, interaction models, and assessment frameworks to expedite the development process while maintaining quality."
        },
        {
            number: "05",
            title: "Quality Assurance",
            description: "Every course undergoes comprehensive testing for functionality, accessibility, and instructional effectiveness across multiple devices and platforms."
        },
        {
            number: "06",
            title: "Deployment Support",
            description: "We ensure smooth implementation on your learning management system (LMS) or provide hosting solutions if needed, with technical support from our Bangalore office."
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/8.Rapid elearning/download (1).png" 
                        alt="Rapid eLearning Development Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Custom E-Learning Content Development Using Rapid Authoring Tools in Bangalore
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Transform Your Training with Fast, Flexible, and Effective E-Learning Solutions from India's Leading Rapid Development Experts
                        </p>
                        <p className="text-lg mb-8 text-orange-100">
                            Are you struggling to deploy high-quality e-learning content within tight deadlines? Based in Bangalore, our expert team specializes in custom e-learning content development using rapid authoring tools that deliver engaging, interactive learning experiences without compromising quality or extending timelines.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#benefits" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Rapid Authoring Tools for Your E-Learning Content?
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our rapid development approach delivers high-quality training solutions in a fraction of the time and cost of traditional methods.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                            >
                                <div className={`p-6 bg-gradient-to-r ${benefit.bgColor} flex items-center justify-center`}>
                                    {benefit.icon}
                                </div>
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our Rapid E-Learning Development Process
                        </h2>
                        <p className="text-lg text-gray-700">
                            We've refined our rapid e-learning development methodology to deliver maximum value while minimizing development time.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative pl-16"
                                >
                                    <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-lg text-xl font-bold">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-700">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Industry-Leading Rapid Authoring Tools We Utilize
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our e-learning specialists are certified experts in today's most powerful rapid authoring platforms.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 p-6"
                            >
                                <div className="mb-4 flex justify-center">
                                    {tool.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">
                                    {tool.name}
                                </h3>
                                <p className="text-gray-700 text-center">
                                    {tool.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <p className="text-gray-700 max-w-3xl mx-auto">
                            We select the optimal tool based on your specific learning objectives, technical requirements, and deployment environment. Our team holds official certifications in all major platforms, ensuring expert implementation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Multilingual Support */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Multilingual Support for Indian and Global Audiences
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                We offer comprehensive multilingual e-learning development to support India's diverse linguistic landscape:
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Content development in all major Indian languages including Hindi, Tamil, Telugu, Kannada, Bengali, and more</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Culturally appropriate localization, not just translation</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Single-source development for efficient multilingual deployment</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Voice-over services with native speakers</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Cultural adaptation of examples, scenarios, and visuals</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <Image
                                    src="/IMAGES/8.Rapid elearning/download (4).png"
                                    alt="Multilingual E-Learning Development"
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center space-x-2 text-white">
                                        <Globe className="h-6 w-6" />
                                        <span className="text-sm font-medium">Multilingual Solutions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Challenges Section */}
            <section id="challenges" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Common Challenges Solved by Rapid E-Learning
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our rapid development approach addresses the most common obstacles faced by organizations implementing e-learning programs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {challenges.map((challenge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        {challenge.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                            {challenge.question}
                                        </h3>
                                        <p className="text-gray-700">
                                            {challenge.answer}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Swift Solution in Bangalore for Your Rapid E-Learning Development?
                        </h2>
                        <p className="text-lg text-gray-700">
                            With over 20 years of specialized experience in e-learning content development in India, our team brings unmatched expertise to your training challenges.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <Award className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Certified Experts</h3>
                            <p className="text-gray-700">Our developers hold advanced certifications in all major rapid authoring tools with regular skill upgrades</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <User className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Instructional Design Excellence</h3>
                            <p className="text-gray-700">Degreed instructional designers with 10+ years average experience in Indian corporate training contexts</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <Star className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Industry Recognition</h3>
                            <p className="text-gray-700">Award-winning e-learning solutions recognized for innovation and effectiveness by Brandon Hall and eLearning Industry</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <CheckCheck className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Proven Track Record</h3>
                            <p className="text-gray-700">500+ successful rapid e-learning implementations across diverse industries in India and globally</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <Server className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Technical Versatility</h3>
                            <p className="text-gray-700">Experience with all major LMS platforms and technical environments common in Indian corporate settings</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <Globe className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Local Understanding</h3>
                            <p className="text-gray-700">Deep knowledge of Indian business practices, compliance requirements, and cultural nuances</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <DynamicFAQ 
                pageSlug="rapid-elearning" 
                title="Frequently Asked Questions (FAQs) about Rapid E-Learning Development"
                className="py-16 bg-white"
            />

            {/* Call To Action Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Ready to Transform Your E-Learning Development?
                        </h2>
                        <p className="text-xl mb-8 text-orange-100">
                            We focus on e-learning solutions so that you can focus on your business. Our Bangalore-based rapid e-learning development services provide the perfect balance of speed, quality, and cost-effectiveness for organizations that need effective training without extended timelines.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Contact Us Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 border border-white text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                                Get a Free Sample
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-lg text-gray-700">
                                Get in touch with our team to discuss how our rapid e-learning development services can help you meet your training objectives.
                            </p>
                        </div>
                        <Contact />
                    </motion.div>
                </div>
            </section>

        </div>
    );
}