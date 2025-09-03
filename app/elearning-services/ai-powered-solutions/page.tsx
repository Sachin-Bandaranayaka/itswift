"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Brain, Zap, Target, TrendingUp, Lightbulb, Shield } from "lucide-react"

export default function AIPoweredSolutionsPage() {
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    // FAQ items
    const faqItems = [
        {
            question: "What is generative AI, and how is it used in corporate training?",
            icon: <Brain className="h-6 w-6 text-orange-600" />,
            answer: (
                <p className="text-gray-700">
                    Generative AI is a type of artificial intelligence that can create new content, such as text, images, and video. In corporate training, it is used to automate course creation, generate realistic simulations, and create personalized learning materials, significantly reducing development time and costs while enhancing the quality and relevance of the content.
                </p>
            )
        },
        {
            question: "How does personalized learning improve employee performance?",
            icon: <Target className="h-6 w-6 text-orange-600" />,
            answer: (
                <p className="text-gray-700">
                    Personalized learning improves employee performance by tailoring the learning experience to individual needs, preferences, and skill levels. This leads to higher engagement, better knowledge retention, and more effective application of skills on the job. By focusing on individual needs, personalized learning ensures that every employee receives the right training at the right time, maximizing their potential.
                </p>
            )
        },
        {
            question: "Is AI-powered eLearning expensive to implement?",
            icon: <BarChart className="h-6 w-6 text-orange-600" />,
            answer: (
                <p className="text-gray-700">
                    While there is an initial investment, AI-powered eLearning often proves to be more cost-effective in the long run. The automation of content creation, the optimization of learning paths, and the ability to identify and address skills gaps proactively can lead to significant cost savings and a higher return on investment compared to traditional training methods.
                </p>
            )
        },
        {
            question: "How do you ensure the security and privacy of our data?",
            icon: <Shield className="h-6 w-6 text-orange-600" />,
            answer: (
                <p className="text-gray-700">
                    At Swift Solution, we adhere to the highest standards of data security and privacy. We have a robust ethical AI framework in place and comply with all relevant data protection regulations. Your data is used solely for the purpose of enhancing the learning experience and is never shared with third parties.
                </p>
            )
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            AI-Powered eLearning Solutions: Revolutionizing Corporate Training in Bangalore
                        </h1>
                        <p className="text-xl mb-8 text-blue-100">
                            We are not just an eLearning company; we are your strategic partner in building a future-ready workforce. Our AI-powered solutions deliver personalized, adaptive, and engaging learning experiences that drive unprecedented growth and ROI.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="/#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                                Schedule a Free AI Solutions Demo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#ai-solutions" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Explore AI Solutions
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Embrace the Future of Learning with the Top AI-Enabled eLearning Company in Bangalore
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Our Vision: Leading the Evolution of Learning</h3>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    Our strategy is shaped by a deep understanding of market dynamics and a clear vision for the future of learning.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>From Push to Pull:</strong> We recognize that traditional, push-based learning models are inadequate for the modern workforce. Our focus is on developing pull-based, personalized, and just-in-time learning solutions that meet the preferences of today's learners, including Gen Z.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>An Industry Bridge-Builder:</strong> We are uniquely positioned to bridge the gap between traditional L&D expertise and cutting-edge AI capabilities. We preserve valuable industry knowledge while integrating technology to create superior, human-centric solutions.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Responsible Transformation:</strong> Our integration of AI with ethical practices provides a model for responsible innovation. We demonstrate how technology can enhance human capabilities and address market needs without causing technological displacement.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <Brain className="h-16 w-16 text-blue-200 mb-6" />
                                <h3 className="text-2xl font-bold mb-4 text-center">AI-Powered Learning Revolution</h3>
                                <p className="text-center text-blue-100">
                                    As a pioneering AI-enabled eLearning solutions company in Bangalore, Swift Solution is leading the charge, moving beyond traditional, one-size-fits-all training to deliver intelligent, personalized, and highly effective learning experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Solutions Section */}
            <section id="ai-solutions" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our AI-Powered eLearning Solutions: A Deep Dive
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Discover our specific AI-powered offerings, showcasing our technical expertise and the tangible benefits for your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Personalized Learning Paths */}
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                                <Target className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Hyper-Personalized Learning Paths</h3>
                            <p className="text-gray-700 mb-4">
                                Our AI engine analyzes individual learner data—including performance, job role, and career aspirations—to create truly personalized learning paths. This ensures that every employee receives the right training at the right time, maximizing engagement and knowledge retention.
                            </p>
                            <h4 className="font-semibold mb-2 text-gray-900">We leverage:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                    Adaptive Learning Algorithms: To adjust content difficulty and sequence in real-time
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                    Skills Gap Analysis: To identify and address individual and team-level competency gaps
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                    Career Pathing: To align learning with long-term career goals
                                </li>
                            </ul>
                        </div>

                        {/* Generative AI for Content Creation */}
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                                <Lightbulb className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Generative AI: Accelerating Content Creation</h3>
                            <p className="text-gray-700 mb-4">
                                Swift Solution utilizes state-of-the-art generative AI models to revolutionize content creation. This allows us to develop high-quality, customized training materials at an unprecedented speed, reducing development time and costs without compromising on quality.
                            </p>
                            <h4 className="font-semibold mb-2 text-gray-900">Our generative AI capabilities include:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                    Automated Course Creation: Generating entire courses from your existing documents
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                    Dynamic Content Updates: Automatically updating content to reflect latest trends
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                    Realistic Simulations: Creating immersive, branching scenarios for hands-on learning
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                                    Multilingual Content Generation: Instantly translating and localizing content
                                </li>
                            </ul>
                        </div>

                        {/* Intelligent Tutoring */}
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Intelligent Tutoring Systems</h3>
                            <p className="text-gray-700 mb-4">
                                Our intelligent tutoring systems provide learners with instant, personalized feedback and support, acting as a 24/7 learning coach. This ensures that employees can get the help they need exactly when they need it, improving comprehension and confidence.
                            </p>
                            <h4 className="font-semibold mb-2 text-gray-900">Key features include:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Real-Time Feedback: Providing immediate, constructive feedback on assessments
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Personalized Recommendations: Suggesting relevant resources and learning materials
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Socratic Dialogue: Engaging learners in a conversational manner to deepen understanding
                                </li>
                            </ul>
                        </div>

                        {/* Predictive Analytics */}
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-orange-100 p-3 rounded-full inline-block mb-4">
                                <TrendingUp className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Predictive Analytics for L&D Strategy</h3>
                            <p className="text-gray-700 mb-4">
                                Move from reactive to proactive training with our powerful predictive analytics engine. We analyze learning data to identify trends, predict future needs, and provide actionable insights that inform your L&D strategy.
                            </p>
                            <h4 className="font-semibold mb-2 text-gray-900">Our predictive analytics capabilities enable you to:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                                    Identify At-Risk Learners: Proactively intervene to support struggling employees
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                                    Forecast Future Skills Gaps: Align your training programs with future business needs
                                </li>
                                <li className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                                    Optimize Training ROI: Make data-driven decisions to maximize training budget impact
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Swift Solution AI Edge Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            The Undisputed Leader in AI-Powered eLearning in Bangalore
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our Edge: Authentic AI-Powered Transformation
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
                        <p className="text-lg text-gray-700 mb-6">
                            We are a pioneer in the authentic implementation of AI within the L&D industry. Our systematic, two-year AI transformation journey is not a theoretical exercise, but a practical integration validated by enterprise client acceptance.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Journey</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <Zap className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>A Systematic Journey:</strong> Beginning in April 2023 with the adoption of ChatGPT for scriptwriting, our journey progressed through six distinct phases.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <Zap className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Ecosystem Consolidation:</strong> In 2025, we strategically consolidated our toolset around the Google ecosystem, fully transitioning to Gemini to enhance efficiency and optimize costs.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <Zap className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Comprehensive Integration:</strong> Today, AI is fully integrated into our core processes, including instructional design, storyboards, media planning, scheduling, and client management.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">Our Philosophy & Results</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <Award className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Human-AI Collaboration:</strong> Our approach is centered on human augmentation, not replacement. AI generates, but human experts validate and review.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <Award className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Measurable Results:</strong> This transformation has led to 60-70% efficiency gains in content preparation while maintaining or improving service quality.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Your Questions About AI in eLearning, Answered
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our AI-powered eLearning solutions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {faqItems.slice(0, showAllFaqs ? faqItems.length : 2).map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-orange-100 p-2 rounded-full mr-4">
                                            {faq.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className="prose prose-orange max-w-none">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAllFaqs(!showAllFaqs)}
                            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
                        >
                            {showAllFaqs ? "Show Less" : "View All FAQs"}
                            <ArrowRight className={`ml-2 h-4 w-4 ${showAllFaqs ? "rotate-90" : ""}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Build a Smarter Workforce? Let's Talk.
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
                        Partner with the leading AI-enabled eLearning solutions company in Bangalore and unlock the full potential of your workforce. Contact us today for a free demo and discover how our AI-powered solutions can transform your corporate training and drive unprecedented business growth.
                    </p>
                    <div className="flex justify-center">
                        <a href="/#contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                            Get Free Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <Contact />
        </div>
    )
}