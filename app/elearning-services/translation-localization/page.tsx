"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
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
    Laptop,
    Stethoscope,
    Factory,
    Building,
    Store,
    HardHat,
    Brain,
    Upload,
    ListChecks,
    ThumbsDown,
    Timer,
    Languages,
    BarChart2,
    BadgeCheck,
    ChevronRight,
    FileQuestion,
    Plus,
    Minus
} from "lucide-react"

export default function TranslationLocalizationPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ items
    const faqItems = [
        {
            question: "What types of e-learning content can be translated and localized?",
            answer: "We can translate and localize virtually any type of e-learning content, including SCORM packages, HTML5 courses, video-based training, virtual reality simulations, mobile learning apps, assessments, and interactive scenarios. Our technical team has experience with all major authoring tools and formats."
        },
        {
            question: "How does AI improve the translation and localization process?",
            answer: "AI significantly accelerates the translation process through neural machine translation, automates content extraction and reconstruction, provides quality assurance checks, identifies cultural adaptation needs, and maintains terminology consistency. This reduces timelines by 50-70% while maintaining high quality through human refinement of AI outputs."
        },
        {
            question: "Will translated content work in our existing LMS?",
            answer: "Yes, we ensure all translated content functions properly in your learning management system. Our technical team tests all language versions to verify proper character display, assessment functionality, tracking, and reporting. We have experience with all major LMS platforms and can provide integration support."
        },
        {
            question: "How do you handle cultural nuances in e-learning translation?",
            answer: "Our localization specialists adapt content to reflect local cultural norms, business practices, and learning preferences. This includes modifying examples, scenarios, humor, graphics, and references to ensure cultural relevance and appropriateness. We also adapt assessment approaches to align with regional educational expectations."
        },
        {
            question: "What languages do you support for e-learning translation?",
            answer: "We support over 50 languages, including all major European, Asian, Middle Eastern, and African languages. Our specialized e-learning linguists are native speakers with subject matter expertise in relevant industries, ensuring accurate translation of even complex technical content."
        }
    ];

    // Define benefits
    const benefits = [
        {
            icon: <Globe className="h-12 w-12 text-white" />,
            title: "Reach Global Audiences with Culturally Relevant Content",
            description: "Generic translation tools can't capture the cultural nuances essential for effective learning. Our specialized e-learning localization ensures your content resonates with learners in each target market by adapting examples, scenarios, and cultural references that drive engagement and knowledge retention.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <Award className="h-12 w-12 text-white" />,
            title: "Maintain Instructional Effectiveness Across Languages",
            description: "Preserving instructional design principles during translation requires specialized expertise. Our team ensures learning objectives, assessment validity, and instructional flow remain intact regardless of language, maintaining the pedagogical effectiveness of your training materials.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <ShieldCheck className="h-12 w-12 text-white" />,
            title: "Ensure Regulatory Compliance in Multiple Regions",
            description: "Different regions have varying compliance requirements for training content. Our localization specialists ensure your e-learning materials meet local regulations, legal standards, and certification requirements in each target market, reducing compliance risks.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <Zap className="h-12 w-12 text-white" />,
            title: "Accelerate Global Deployment with AI-Powered Translation",
            description: "Our AI-enhanced translation workflow reduces traditional translation timelines by up to 60%, allowing you to deploy multilingual training simultaneously across regions rather than in staggered releases. This ensures consistent messaging and timely knowledge transfer across your global organization.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <Puzzle className="h-12 w-12 text-white" />,
            title: "Preserve Interactive Elements and Assessments",
            description: "Interactive elements often break during traditional translation processes. Our technical localization ensures all interactive components, assessments, branching scenarios, and gamification elements function perfectly in every language version, preserving the engaging experience of your original content.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <Clock className="h-12 w-12 text-white" />,
            title: "Ongoing Maintenance and Updates",
            description: "When your original content changes, our translation memory system allows for efficient updates to all language versions, ensuring your multilingual content remains synchronized and up-to-date without starting from scratch each time.",
            bgColor: "from-orange-400 to-orange-500"
        }
    ];

    // Define process steps
    const processSteps = [
        {
            number: 1,
            icon: <Search className="h-8 w-8 text-white" />,
            title: "Content Analysis & Preparation",
            description: "We analyze your e-learning content to identify translation challenges, cultural elements requiring adaptation, and technical components needing special handling. Our AI-powered content extraction tools automatically identify and separate translatable text from code and formatting, preserving the structure of your course."
        },
        {
            number: 2,
            icon: <Database className="h-8 w-8 text-white" />,
            title: "Translation Memory Creation",
            description: "We establish a custom translation memory and terminology database specific to your organization, industry, and training content. This ensures consistency across all current and future translations while preserving your brand voice and technical terminology."
        },
        {
            number: 3,
            icon: <Bot className="h-8 w-8 text-white" />,
            title: "AI-Powered Initial Translation",
            description: "Our neural machine translation engines, specifically trained for e-learning content, generate the initial translation draft, reducing manual translation time by up to 70%. These specialized AI models understand instructional design patterns and e-learning-specific terminology."
        },
        {
            number: 4,
            icon: <User className="h-8 w-8 text-white" />,
            title: "Human Expert Refinement",
            description: "Professional linguists with subject matter expertise review and refine the machine translation output, ensuring perfect accuracy, natural language flow, and appropriate cultural adaptation. This human touch ensures nuances that machines alone cannot achieve, resulting in culturally appropriate and pedagogically sound content."
        },
        {
            number: 5,
            icon: <Settings className="h-8 w-8 text-white" />,
            title: "Technical Reconstruction & Testing",
            description: "Our technical team rebuilds interactive elements, reintegrates multimedia components, and ensures all functionality works flawlessly in the localized versions. Automated testing tools identify potential issues before final delivery, ensuring a seamless user experience across languages."
        },
        {
            number: 6,
            icon: <CheckSquare className="h-8 w-8 text-white" />,
            title: "Quality Assurance & Validation",
            description: "Comprehensive quality checks verify linguistic accuracy, cultural appropriateness, technical functionality, and instructional effectiveness across all language versions. AI-powered QA tools automatically flag inconsistencies and potential errors, ensuring a polished final product."
        },
        {
            number: 7,
            icon: <Server className="h-8 w-8 text-white" />,
            title: "LMS Integration & Deployment Support",
            description: "We provide technical support for implementing multilingual content in your learning management system, ensuring proper functionality, tracking, and reporting across all language versions. Our team works with all major LMS platforms to ensure a smooth transition to your multilingual training environment."
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-24">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Transform Your E-Learning Content for Global Audiences
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Expert translation and localization services to make your training content culturally relevant and linguistically accurate
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#process" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Introduction Section */}
            <section id="introduction" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                What Is E-Learning Translation and Localization?
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                E-learning translation and localization is the comprehensive process of adapting educational content for different languages, cultures, and regions while preserving the instructional effectiveness of the original material.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                This goes far beyond simple text translation to include:
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Translation:</strong> Converting text content into target languages with perfect linguistic accuracy</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Localization:</strong> Adapting cultural references, examples, and scenarios to resonate with local audiences</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Technical Adaptation:</strong> Modifying interactive elements, assessments, and navigation to function properly in translated versions</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Multimedia Transformation:</strong> Adapting audio, video, graphics, and other media elements for cultural appropriateness</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Compliance Alignment:</strong> Ensuring content meets regional regulatory and legal requirements</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>LMS Integration:</strong> Testing and validating functionality across learning management systems in multiple languages</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                {/* Replace with actual image */}
                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                    <Globe className="h-24 w-24 text-orange-500 opacity-50" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Professional E-Learning Translation and Localization Services?
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our AI-enhanced approach combines advanced machine translation technology with human expertise to deliver multilingual e-learning solutions that maintain engagement, effectiveness, and impact.
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
            <section id="process" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our AI-Powered E-Learning Translation and Localization Process
                        </h2>
                        <p className="text-lg text-gray-700">
                            We've developed a streamlined, technology-enhanced process that delivers exceptional quality while reducing traditional timelines.
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col md:flex-row items-start relative"
                            >
                                <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">{step.number}</div>
                                    {index < processSteps.length - 1 && (
                                        <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                                    )}
                                </div>
                                <div className="md:flex-1 pt-3 md:pt-0">
                                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                                        </div>
                                        <p className="text-gray-700">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-700">
                            Get answers to common questions about e-learning translation and localization services
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="mb-4"
                            >
                                <div
                                    className={`cursor-pointer border ${openFaq === index ? 'border-orange-500 bg-orange-50 rounded-t-lg' : 'border-gray-200 bg-white rounded-lg'} p-4 transition-colors duration-300`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                                        <button className="text-orange-500">
                                            {openFaq === index ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {openFaq === index && (
                                    <div className="border border-t-0 border-orange-500 rounded-b-lg p-4 bg-white">
                                        <p className="text-gray-700">{item.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
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