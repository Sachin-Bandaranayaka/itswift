"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, Target, Zap, Shield, TrendingUp, Clock } from "lucide-react"

// Metadata needs to be moved to a separate layout file or removed from client components
// export const metadata: Metadata = {
//   title: "Custom E-Learning Development Services Bangalore | Bespoke Corporate Training Solutions | Swift Solution",
//   description: "Leading custom e-learning development company in Bangalore offering bespoke corporate training solutions, industry-specific course development, and AI-enhanced personalized learning experiences. 20+ years expertise.",
// }

export default function CustomElearningPage() {
    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/IMAGES/3.custom learning/download (1).png"
                        alt="Custom E-Learning Development Services Bangalore"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Leading Custom E-Learning Development Company in Bangalore
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Swift Solution Pvt Ltd stands as Bangalore's premier custom e-learning development company, delivering bespoke corporate training solutions that align perfectly with your organization's specific goals, culture, and industry requirements. With over 20 years of expertise in the learning and development industry.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#consultation" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Free Consultation
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Our Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Custom E-Learning Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Why Choose Custom E-Learning Over Off-the-Shelf Solutions?
                        </h2>
                        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                            Unlike generic, one-size-fits-all training programs, our custom e-learning development services create learning experiences that reflect your company's unique challenges, processes, and objectives. Every course is built from the ground up to address your specific training needs, ensuring maximum relevance, engagement, and knowledge retention.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <div className="text-center">
                            <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                                <TrendingUp className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">85% Higher</h3>
                            <p className="text-gray-600">Completion rates compared to generic training</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                                <Target className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">70% Improvement</h3>
                            <p className="text-gray-600">In knowledge retention and application</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">60% Faster</h3>
                            <p className="text-gray-600">Time-to-competency for new employees</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                                <Users className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">90% Satisfaction</h3>
                            <p className="text-gray-600">Learner satisfaction with relevant, engaging content</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Services Section */}
            <section id="services" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Comprehensive Custom E-Learning Development Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                            Our comprehensive suite of custom e-learning development services covers every aspect of creating tailored training solutions that drive business results and learner engagement.
                        </p>
                    </div>

                    {/* Bespoke Course Development */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-gray-900">
                            Bespoke Course Development and Content Creation
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h4 className="text-xl font-semibold mb-4 text-gray-900">
                                    Fully Customized Learning Experiences Built Around Your Business
                                </h4>
                                <p className="text-gray-700 mb-6">
                                    Our custom course development process begins with a deep understanding of your organization's training objectives, learner profiles, and business goals. We create entirely original content that reflects your company's processes, terminology, case studies, and real-world scenarios.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Industry-Specific Content Creation:</strong>
                                            <span className="text-gray-700"> Tailored materials for healthcare, finance, manufacturing, IT, retail, and other sectors</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Brand-Aligned Design:</strong>
                                            <span className="text-gray-700"> Courses that reflect your corporate identity, colors, fonts, and visual style</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Role-Based Learning Paths:</strong>
                                            <span className="text-gray-700"> Customized training sequences for different job functions and seniority levels</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Scenario-Based Learning:</strong>
                                            <span className="text-gray-700"> Real workplace situations and challenges specific to your industry</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Custom Assessment Development:</strong>
                                            <span className="text-gray-700"> Evaluations that measure job-relevant skills and knowledge</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-gray-900">Interactive Simulations:</strong>
                                            <span className="text-gray-700"> Practice environments that mirror your actual work processes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white">
                                <h4 className="text-xl font-bold mb-6">Business Impact</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="bg-white/20 p-2 rounded-full mr-4">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">85% higher completion rates</div>
                                            <div className="text-orange-100 text-sm">compared to generic training</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-white/20 p-2 rounded-full mr-4">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">70% improvement</div>
                                            <div className="text-orange-100 text-sm">in knowledge retention and application</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-white/20 p-2 rounded-full mr-4">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">60% faster time-to-competency</div>
                                            <div className="text-orange-100 text-sm">for new employees</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-white/20 p-2 rounded-full mr-4">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">90% learner satisfaction</div>
                                            <div className="text-orange-100 text-sm">with relevant, engaging content</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI-Enhanced Development */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-gray-900">
                            AI-Enhanced Custom Development Process
                        </h3>
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h4 className="text-xl font-semibold mb-4 text-gray-900">
                                Accelerating Customization Without Compromising Quality
                            </h4>
                            <p className="text-gray-700 mb-6">
                                While our focus remains on creating truly customized learning experiences, we leverage artificial intelligence to enhance our development process, reduce timelines, and improve content quality—all while maintaining the personal touch that makes custom e-learning effective.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h5 className="font-semibold mb-4 text-gray-900">AI-Enhanced Capabilities:</h5>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <Zap className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                                            <span><strong>Intelligent Content Structuring:</strong> AI-assisted organization of custom content for optimal learning flow</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Zap className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                                            <span><strong>Automated Quality Assurance:</strong> AI-powered review of custom content for consistency and accuracy</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Zap className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                                            <span><strong>Personalization Engine:</strong> AI-driven adaptation of custom courses to individual learning preferences</span>
                                        </li>
                                        <li className="flex items-start">
                                            <Zap className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                                            <span><strong>Smart Assessment Generation:</strong> AI-assisted creation of relevant questions based on your custom content</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-4 text-gray-900">Development Efficiency:</h5>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <span>50% faster custom course development without quality compromise</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <span>95% consistency in content quality across all custom modules</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <span>Real-time optimization based on learner feedback and performance</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <span>Automated compliance checking for industry-specific requirements</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industry-Specific Solutions */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-gray-900">
                            Industry-Specific Custom E-Learning Solutions
                        </h3>
                        <p className="text-lg text-gray-600 mb-8 text-center">
                            Specialized Expertise Across Key Industries
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Healthcare */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-gray-900">Healthcare Custom E-Learning Development</h4>
                                <p className="text-gray-600 mb-4">Specialized Medical and Healthcare Training Solutions</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Clinical Skills Training: Custom simulations for medical procedures and patient care</li>
                                    <li>• Compliance Training: HIPAA, Joint Commission, and regulatory requirement courses</li>
                                    <li>• Medical Device Training: Custom modules for specific equipment and technologies</li>
                                    <li>• Continuing Education: Accredited custom courses for professional development</li>
                                    <li>• Patient Safety Protocols: Organization-specific safety procedures and guidelines</li>
                                    <li>• Pharmaceutical Training: Custom drug information and interaction courses</li>
                                </ul>
                            </div>

                            {/* Financial Services */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                                    <BarChart className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-gray-900">Financial Services Custom Training</h4>
                                <p className="text-gray-600 mb-4">Comprehensive Financial Industry Learning Solutions</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Regulatory Compliance: Custom courses for SEC, FINRA, and international regulations</li>
                                    <li>• Product Training: Detailed modules on your specific financial products and services</li>
                                    <li>• Risk Management: Custom scenarios based on your organization's risk profile</li>
                                    <li>• Customer Service Excellence: Training tailored to your client base and service standards</li>
                                    <li>• Sales Training: Custom methodologies for your financial products and target markets</li>
                                    <li>• Anti-Money Laundering: Organization-specific AML procedures and case studies</li>
                                </ul>
                            </div>

                            {/* Manufacturing */}
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="bg-orange-100 p-3 rounded-full inline-block mb-4">
                                    <Layers className="h-8 w-8 text-orange-600" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-gray-900">Manufacturing and Industrial Training</h4>
                                <p className="text-gray-600 mb-4">Custom Safety and Operational Excellence Programs</p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Safety Protocol Training: Custom safety procedures specific to your facilities and equipment</li>
                                    <li>• Equipment Operation: Detailed training on your specific machinery and processes</li>
                                    <li>• Quality Control: Custom quality standards and inspection procedures</li>
                                    <li>• Lean Manufacturing: Implementation of lean principles in your specific context</li>
                                    <li>• Environmental Compliance: Training on regulations specific to your operations</li>
                                    <li>• Maintenance Procedures: Custom preventive and corrective maintenance protocols</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advanced Development Methodologies */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Advanced Custom Development Methodologies
                        </h2>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                            Our proven methodologies ensure efficient, high-quality custom e-learning development that meets your specific requirements and timeline.
                        </p>
                    </div>

                    {/* Agile Development Process */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-gray-900">
                            Agile Custom E-Learning Development Process
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h4 className="text-xl font-semibold mb-4 text-gray-900">
                                Rapid, Iterative Development for Faster Time-to-Market
                            </h4>
                            <p className="text-gray-700 mb-8">
                                Our agile approach to custom e-learning development ensures faster delivery while maintaining high customization quality. This methodology allows for continuous feedback and refinement throughout the development process.
                            </p>

                            <h5 className="text-lg font-semibold mb-6 text-gray-900">6-Phase Agile Development Process:</h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h6 className="font-semibold text-orange-600 mb-2">Phase 1: Discovery and Requirements Analysis (Week 1-2)</h6>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• Stakeholder Interviews: In-depth discussions with key personnel and subject matter experts</li>
                                            <li>• Learner Analysis: Comprehensive assessment of target audience needs and preferences</li>
                                            <li>• Content Audit: Review of existing training materials and organizational knowledge</li>
                                            <li>• Technical Requirements: Assessment of LMS capabilities and integration needs</li>
                                            <li>• Success Metrics Definition: Clear, measurable objectives for training effectiveness</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h6 className="font-semibold text-orange-600 mb-2">Phase 2: Instructional Design and Content Architecture (Week 2-3)</h6>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• Learning Objective Development: SMART objectives aligned with business goals</li>
                                            <li>• Content Structure Design: Logical flow and modular architecture</li>
                                            <li>• Assessment Strategy: Custom evaluation methods and success criteria</li>
                                            <li>• Interaction Design: Engaging elements specific to your content and audience</li>
                                            <li>• Accessibility Planning: Compliance with WCAG guidelines and organizational needs</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h6 className="font-semibold text-orange-600 mb-2">Phase 3-6: Development, Testing & Deployment</h6>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• Rapid Prototyping: Quick iterations based on feedback</li>
                                            <li>• Content Development: Custom multimedia and interactive elements</li>
                                            <li>• Quality Assurance: Comprehensive testing across devices and platforms</li>
                                            <li>• User Acceptance Testing: Stakeholder review and approval</li>
                                            <li>• Deployment Support: LMS integration and launch assistance</li>
                                            <li>• Post-Launch Optimization: Performance monitoring and improvements</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h6 className="font-semibold text-orange-600 mb-2">Custom Learning Experience Design</h6>
                                        <p className="text-sm text-gray-700 mb-3">Creating Engaging, Effective Learning Journeys</p>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• Narrative-Driven Learning: Custom storytelling that reflects your organizational culture</li>
                                            <li>• Gamification Integration: Achievement systems and challenges tailored to your audience</li>
                                            <li>• Social Learning Features: Collaborative elements that encourage peer interaction</li>
                                            <li>• Microlearning Integration: Bite-sized modules that fit into busy work schedules</li>
                                            <li>• Mobile-First Design: Responsive courses optimized for all devices</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Integration */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Technology Integration and Technical Excellence
                        </h2>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                            Our technical expertise ensures seamless integration with your existing systems and future-proof solutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* LMS Integration */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">
                                Advanced LMS Integration and Compatibility
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Seamless Integration with Your Learning Infrastructure
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">LMS Compatibility:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Enterprise LMS Platforms: Moodle, Blackboard, Canvas, Cornerstone OnDemand, Workday Learning</li>
                                        <li>• Corporate Systems: SAP SuccessFactors, Oracle Learning Cloud, Adobe Captivate Prime</li>
                                        <li>• Cloud-Based Solutions: TalentLMS, Docebo, LearnUpon, Absorb LMS</li>
                                        <li>• Custom LMS Development: Bespoke learning management system creation and integration</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Technical Standards and Compliance:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• SCORM 1.2 and 2004: Full compliance for tracking and reporting</li>
                                        <li>• xAPI (Tin Can API): Advanced learning analytics and experience tracking</li>
                                        <li>• AICC Compliance: Legacy system integration and compatibility</li>
                                        <li>• HTML5 Development: Modern, responsive, and mobile-optimized courses</li>
                                        <li>• Section 508/WCAG 2.1 AA: Complete accessibility compliance</li>
                                        <li>• GDPR Compliance: Data privacy and protection standards</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">
                                Analytics and Performance Measurement
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Data-Driven Insights for Continuous Improvement
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <BarChart className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">Learner Progress Tracking:</strong>
                                        <span className="text-gray-700"> Detailed monitoring of individual and group progress</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <TrendingUp className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">Engagement Analytics:</strong>
                                        <span className="text-gray-700"> Time spent, interaction rates, and participation metrics</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Target className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">Performance Assessment:</strong>
                                        <span className="text-gray-700"> Skill development tracking and competency measurement</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">Completion Analytics:</strong>
                                        <span className="text-gray-700"> Course completion rates and dropout analysis</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Users className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">Knowledge Retention:</strong>
                                        <span className="text-gray-700"> Long-term retention testing and reinforcement recommendations</span>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Award className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong className="text-gray-900">ROI Measurement:</strong>
                                        <span className="text-gray-700"> Business impact analysis and return on investment calculations</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Consultation Section */}
            <section id="consultation" className="py-16 bg-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold mb-6">
                            Free Custom E-Learning Consultation
                        </h3>
                        <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                            Discover How Custom E-Learning Can Transform Your Training Programs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h4 className="text-2xl font-semibold mb-6">What You'll Receive in Your Free Consultation:</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Comprehensive Training Needs Assessment:</strong>
                                        <span className="text-orange-100"> Analysis of your current training challenges and opportunities</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Custom Solution Design:</strong>
                                        <span className="text-orange-100"> Preliminary design of a tailored e-learning solution for your organization</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>ROI Projection:</strong>
                                        <span className="text-orange-100"> Detailed analysis of potential return on investment and business impact</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Implementation Roadmap:</strong>
                                        <span className="text-orange-100"> Step-by-step plan for successful custom e-learning deployment</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Competitive Analysis:</strong>
                                        <span className="text-orange-100"> How custom e-learning can give you an advantage in your industry</span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Technology Recommendations:</strong>
                                        <span className="text-orange-100"> Optimal platforms and tools for your specific requirements</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                                <h4 className="text-2xl font-bold mb-4">Ready to Transform Your Training?</h4>
                                <p className="text-orange-100 mb-6">
                                    Contact Swift Solution Pvt Ltd today for your free custom e-learning consultation and discover how we can help you achieve your training objectives.
                                </p>
                                <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                    Schedule Free Consultation
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <DynamicFAQ
                sectionId="faq"
                pageSlug="custom-elearning"
                title="Frequently Asked Questions (FAQs) about Custom eLearning"
            />

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <Contact />
                </div>
            </section>
        </div>
    )
}
