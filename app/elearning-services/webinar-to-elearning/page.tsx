"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
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

export default function WebinarToElearningPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ items
    const faqItems = [
        {
            question: "What types of webinars convert best to eLearning?",
            answer: "While virtually any webinar can be converted, the most successful transformations typically come from content-rich presentations, product demonstrations, technical training, and thought leadership sessions. Webinars with clear learning objectives and structured content convert most effectively to eLearning formats."
        },
        {
            question: "How long does the webinar to eLearning conversion process take?",
            answer: "Typical conversion timelines range from 2-6 weeks depending on the complexity and length of the original webinar. Our Bangalore team's 24/7 production capability allows us to deliver even complex projects 40-50% faster than most Western providers. We can also implement phased approaches for urgent training needs."
        },
        {
            question: "Will converted content work in our existing LMS?",
            answer: "Yes, we ensure compatibility with all major learning management systems. Our technical team has extensive experience with Cornerstone, TalentLMS, Moodle, Blackboard, SAP SuccessFactors, and many other platforms, ensuring seamless integration with your existing infrastructure."
        },
        {
            question: "How do you maintain engagement in converted webinar content?",
            answer: "We use a variety of digital strategies to enhance engagement, including interactive elements, knowledge checks, scenario-based activities, gamification, and microlearning principles. Our approach focuses on transforming passive viewing into active learning through strategic interaction points throughout the experience."
        },
        {
            question: "What is the ROI of converting webinars to eLearning?",
            answer: "Organizations typically see ROI within 3-6 months of conversion, with ongoing returns as content continues to be accessed. Value comes from extended content lifespan (typically 18-24 months for converted content vs. 30 days for webinar recordings), expanded audience reach (300-500% more viewers), and measurable learning outcomes that drive business results."
        }
    ];

    // Define benefits
    const benefits = [
        {
            icon: <TrendingUp className="h-12 w-12 text-white" />,
            title: "Maximize ROI from Existing Webinar Content",
            description: "Webinars require significant investment in preparation, promotion, and delivery, yet their value typically diminishes rapidly after the live event. Our conversion services help you extract maximum value from this investment by transforming one-time events into permanent learning assets that continue generating returns indefinitely.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <FileText className="h-12 w-12 text-white" />,
            title: "Create Evergreen Training Assets from One-Time Events",
            description: "Live webinars are ephemeral by nature, with content that may quickly become outdated or forgotten. Our conversion process transforms these temporary events into evergreen training resources that can be updated, expanded, and leveraged as cornerstone content in your knowledge management strategy.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <Users className="h-12 w-12 text-white" />,
            title: "Expand Audience Reach Beyond Live Attendees",
            description: "Even successful webinars typically reach only a fraction of your potential audience due to scheduling conflicts, time zone differences, and limited promotion. Converting webinars to on-demand eLearning modules allows you to reach the 60-80% of your target audience who couldn't attend the original live event.",
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            icon: <Puzzle className="h-12 w-12 text-white" />,
            title: "Enhance Learning with Interactive Elements",
            description: "Live webinars offer limited interaction opportunities and no ability to pause for reflection or review complex concepts. Our conversion process integrates interactive elements, knowledge checks, and supplementary resources that enhance learning effectiveness beyond what's possible in a live streaming format.",
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            icon: <BarChart className="h-12 w-12 text-white" />,
            title: "Track Engagement and Completion with Advanced Analytics",
            description: "Traditional webinar platforms offer basic attendance and duration metrics but limited insight into actual engagement and knowledge transfer. Our converted eLearning modules include comprehensive tracking capabilities that measure specific learning outcomes, completion rates, and knowledge retention.",
            bgColor: "from-orange-500 to-orange-600"
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/6.Webinar to elearning conversion/download (1).png" 
                        alt="Webinar to eLearning Conversion Background" 
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
                            Transform Your Webinars into Engaging On-Demand eLearning Experiences
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Are you sitting on a goldmine of valuable webinar content that's only been viewed once? Our team specializes in transforming your existing webinars into interactive, engaging eLearning modules that extend the lifespan and impact of your virtual events.
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
                                What Is Webinar to eLearning Conversion?
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Webinar to eLearning conversion is the strategic process of transforming live or recorded webinar content into structured, interactive eLearning modules that can be accessed on-demand through learning management systems.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                This transformation enhances the original content by adding:
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Interactive Elements:</strong> Engaging activities that maintain learner attention and reinforce key concepts</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Knowledge Checks:</strong> Strategically placed assessments that verify comprehension and provide feedback</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Structural Organization:</strong> Clear learning objectives, logical content segmentation, and intuitive navigation</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Enhanced Multimedia:</strong> Optimized audio, improved visuals, and added supporting graphics or animations</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Progress Tracking:</strong> LMS integration that captures learner activity, completion, and assessment data</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <Image
                                    src="/IMAGES/webinar to elearning conversion.jpg"
                                    alt="Webinar to eLearning Conversion Process"
                                    width={600}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
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
                            Why Convert Webinars to eLearning Modules?
                        </h2>
                        <p className="text-lg text-gray-700">
                            Transform temporary virtual events into lasting educational assets that continue to deliver value long after the live session ends.
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
                            Our Proven Webinar to eLearning Conversion Process
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our team has developed a systematic, proven approach to webinar conversion that maximizes the educational value of your existing content.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        {/* Process Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">1</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <Search className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Comprehensive Content Analysis</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        We begin by thoroughly analyzing your webinar recording, identifying key learning points, natural content breaks, engagement opportunities, and areas requiring enhancement or clarification. This analysis forms the foundation for an effective transformation strategy.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">2</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <Layers className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Instructional Design Blueprint</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        Our instructional designers create a detailed blueprint that restructures your webinar content for optimal digital learning, incorporating adult learning principles, microlearning concepts, and engagement strategies that maintain attention throughout the experience.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 3 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">3</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Content Segmentation and Enhancement</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        We break down lengthy webinar sessions into logical, digestible modules with clear learning objectives. Our team enhances the original content with additional context, examples, and supporting materials that improve comprehension and retention.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 4 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">4</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <Puzzle className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Interactive Element Development</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        Our specialized development team creates knowledge checks, interactive scenarios, clickable elements, and other engagement points that replace the live interaction of the original webinar and maintain learner attention throughout the experience.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 5 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">5</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <Settings className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Multimedia Optimization</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        We enhance audio quality, improve visual elements, add professional animations or graphics where beneficial, and ensure all multimedia components are optimized for various devices and bandwidth conditions.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 6 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col md:flex-row items-start mb-12 relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">6</div>
                                <div className="hidden md:block w-1 h-full bg-orange-200 absolute top-12 bottom-0 left-6"></div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <CheckSquare className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Assessment and Reinforcement Integration</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        We design effective assessment strategies that evaluate knowledge transfer and provide meaningful feedback to learners. These assessments verify comprehension and reinforce key learning points from the webinar content.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Process Step 7 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col md:flex-row items-start relative"
                        >
                            <div className="md:w-16 md:mr-6 flex-shrink-0 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl">7</div>
                            </div>
                            <div className="md:flex-1 pt-3 md:pt-0">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-3">
                                            <Server className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">Technical Implementation and Testing</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        Our technical team ensures your converted content functions flawlessly across all required platforms and devices. Rigorous testing verifies functionality, usability, and learning effectiveness before deployment.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Challenges Section */}
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
                            Common Challenges Solved by Our Webinar to eLearning Conversion Services
                        </h2>
                        <p className="text-lg text-gray-700">
                            We address the key limitations of traditional webinar content to create truly effective learning experiences.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Challenge 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900">Struggling to get long-term value from webinars?</h3>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-white to-orange-50">
                                <p className="text-gray-700">
                                    Our conversion process transforms temporary webinar events into permanent learning assets that continue generating value indefinitely. This approach typically delivers 5-10x more views and engagement compared to simply posting the webinar recording.
                                </p>
                            </div>
                        </motion.div>

                        {/* Challenge 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900">Need to provide training to those who missed live events?</h3>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-white to-orange-50">
                                <p className="text-gray-700">
                                    Our converted eLearning modules allow learners to access critical information at their convenience, eliminating the scheduling conflicts and time zone challenges that limit live webinar attendance. This typically expands your reach by 300-500%.
                                </p>
                            </div>
                        </motion.div>

                        {/* Challenge 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900">Want to create a consistent learning experience?</h3>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-white to-orange-50">
                                <p className="text-gray-700">
                                    Live webinars can vary significantly in quality and effectiveness based on presenter performance, technical issues, and audience dynamics. Our conversion process standardizes the experience, ensuring consistent quality and learning outcomes for all users.
                                </p>
                            </div>
                        </motion.div>

                        {/* Challenge 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900">Looking to measure learning outcomes from webinar content?</h3>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-white to-orange-50">
                                <p className="text-gray-700">
                                    Our converted modules include comprehensive tracking and assessment capabilities that provide detailed insights into engagement, completion, and knowledge transfer—metrics that are impossible to capture accurately with traditional webinar recordings.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            How AI Is Revolutionizing Webinar to eLearning Conversion
                        </h2>
                        <p className="text-lg text-gray-700">
                            The integration of artificial intelligence has transformed the webinar conversion process, making it faster, more effective, and more personalized.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center">
                                <Bot className="h-8 w-8 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">AI-Powered Content Extraction and Analysis</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">
                                    Our AI tools analyze your webinar recordings to automatically identify key topics, learning points, and natural content breaks. This analysis accelerates the conversion process by extracting and organizing content elements while identifying areas that need enhancement.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center">
                                <FileText className="h-8 w-8 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Automated Transcription and Caption Generation</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">
                                    AI-powered transcription tools create accurate text versions of your webinar content, which we then optimize for readability and learning. These transcriptions serve as the foundation for searchable content, captions, and text-based learning resources.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center">
                                <Puzzle className="h-8 w-8 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Intelligent Interactive Element Suggestions</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">
                                    Our AI systems analyze your webinar content and suggest optimal points for interactive elements, knowledge checks, and supplementary resources based on content complexity, natural pauses, and learning principles.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center">
                                <Users className="h-8 w-8 text-white mr-3" />
                                <h3 className="text-xl font-semibold text-white">Personalized Learning Path Creation</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">
                                    AI enables us to create adaptive learning paths that personalize the experience based on individual learner roles, prior knowledge, and performance. These adaptive elements ensure each learner receives the most relevant content for their specific needs.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
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
                            Real Results from Our Webinar to eLearning Conversion Projects
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our clients have achieved remarkable outcomes by transforming their webinar content into engaging eLearning experiences.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Case Study 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full"
                        >
                            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <h3 className="text-xl font-semibold">Global Technology Corporation</h3>
                            </div>
                            <div className="p-6 flex-grow">
                                <p className="text-gray-700 mb-4">
                                    Converted a series of 12 product webinars into an interactive eLearning library, increasing total viewing time by 470% and improving product adoption rates by 28% among customers who completed the modules.
                                </p>
                                <div className="flex items-center mt-4">
                                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">470% increase in viewing time</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <CheckCheck className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">28% improvement in product adoption</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Case Study 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full"
                        >
                            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <h3 className="text-xl font-semibold">Financial Services Provider</h3>
                            </div>
                            <div className="p-6 flex-grow">
                                <p className="text-gray-700 mb-4">
                                    Transformed quarterly compliance update webinars into structured eLearning modules with verification assessments, achieving 100% completion rates among required staff compared to 62% live attendance for previous webinars.
                                </p>
                                <div className="flex items-center mt-4">
                                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">100% compliance completion rate</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <CheckCheck className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">38% increase in training coverage</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Case Study 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full"
                        >
                            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <h3 className="text-xl font-semibold">Healthcare Organization</h3>
                            </div>
                            <div className="p-6 flex-grow">
                                <p className="text-gray-700 mb-4">
                                    Converted clinical procedure webinars into interactive training modules with simulations and assessments, reducing training time by 35% while improving competency assessment scores by 24%.
                                </p>
                                <div className="flex items-center mt-4">
                                    <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">35% reduction in training time</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Star className="h-5 w-5 text-orange-500 mr-2" />
                                    <span className="text-gray-900 font-medium">24% higher competency scores</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Swift Solution for Your Webinar to eLearning Conversion Needs?
                        </h2>
                        <p className="text-lg text-gray-700">
                            With specialized expertise in digital learning transformation, our team brings unique advantages to your webinar conversion projects.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Advantage 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Global Expertise with Local Value</h3>
                            <p className="text-gray-700">
                                Our location allows us to offer world-class conversion services at competitive rates compared to US or European providers, typically delivering 30-40% cost savings without compromising quality.
                            </p>
                        </motion.div>

                        {/* Advantage 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Rapid Delivery Capability</h3>
                            <p className="text-gray-700">
                                Our large, specialized team and 24/7 production capability allow us to deliver conversion projects 40-50% faster than most Western providers, helping you quickly capitalize on your webinar content.
                            </p>
                        </motion.div>

                        {/* Advantage 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Layers className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Instructional Design Excellence</h3>
                            <p className="text-gray-700">
                                Our team includes certified instructional designers with specific expertise in transforming presentation-based content into effective digital learning experiences that drive measurable outcomes.
                            </p>
                        </motion.div>

                        {/* Advantage 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Settings className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Technical Versatility</h3>
                            <p className="text-gray-700">
                                Our developers are certified in all major eLearning authoring tools (Articulate, Captivate, Lectora) and have deep experience with global LMS platforms, ensuring seamless implementation regardless of your technical environment.
                            </p>
                        </motion.div>

                        {/* Advantage 5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">SEO Optimization</h3>
                            <p className="text-gray-700">
                                We incorporate search engine optimization strategies throughout the conversion process, ensuring your transformed content ranks highly for relevant keywords and drives organic traffic to your learning resources.
                            </p>
                        </motion.div>

                        {/* Advantage 6 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <CheckCheck className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">Comprehensive Service Offering</h3>
                            <p className="text-gray-700">
                                We provide end-to-end services from initial analysis through deployment and evaluation, eliminating the need to coordinate multiple vendors for your conversion project.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-8 max-w-6xl mx-auto">
                        {/* Left Column - Sticky Title */}
                        <div className="md:sticky md:top-8 md:self-start">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Get answers to common questions about our webinar conversion services.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Column - FAQ Items */}
                        <div className="space-y-0">
                            <div className="bg-orange-50 p-6 rounded-t-lg border-b border-orange-200">
                                <h3 className="text-xl font-semibold text-orange-800 mb-2">
                                    WEBINAR TO ELEARNING CONVERSION
                                </h3>
                            </div>
                            
                            {faqItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border-b border-gray-200 last:border-b-0"
                                >
                                    <div
                                        className="cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                                            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                                        </div>
                                        {openFaq === index && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Ready to Transform Your Webinar Library?
                        </h2>
                        <p className="text-xl mb-8">
                            Contact us today to discuss how our webinar to eLearning conversion services can help you extend content lifespan, expand audience reach, and generate measurable learning outcomes from your virtual events.
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200 text-lg"
                        >
                            Get Started Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <Contact />
            </section>
        </div>
    )
}