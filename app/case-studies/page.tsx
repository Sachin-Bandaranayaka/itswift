"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Building, TrendingUp, Clock, Target, Star, ExternalLink } from "lucide-react"

interface CaseStudy {
    title: string
    client: string
    industry: string
    challenge: string
    solution: string
    results: string[]
    metrics: {
        label: string
        value: string
    }[]
    tags: string[]
}

export default function CaseStudiesPage() {
    const [showDetails, setShowDetails] = useState<number | null>(null)

    const caseStudies: CaseStudy[] = [
        {
            title: "Oil Rig Training with 3D BOP Simulations",
            client: "Leading Oil & Gas Company",
            industry: "Oil & Gas",
            challenge: "Conventional classroom training could not replicate the rig environment or show internal BOP components. Technicians found it difficult to visualize complex subsystems, making it harder to apply theoretical knowledge in practice.",
            solution: "Collaborated with SMEs to design detailed learning objectives aligned to real-world rig operations. Developed 3D animations and simulations of BOP units and subsystems with cross-sectional visualizations to explain internal mechanics. Integrated troubleshooting scenarios for hands-on learning.",
            results: [
                "Reduced training duration from 2 weeks to 1 week",
                "50% improvement in comprehension of complex BOP operations",
                "Improved productivity and reduced safety risks",
                "Enhanced visualization of complex subsystems"
            ],
            metrics: [
                { label: "Training Time", value: "50%" },
                { label: "Comprehension", value: "50%" },
                { label: "Safety Risks", value: "Reduced" },
                { label: "Productivity", value: "Improved" }
            ],
            tags: ["Safety Training", "3D Simulation", "Oil & Gas", "Technical Training"]
        },
        {
            title: "Scalable Courseware for Global EdTech Leader",
            client: "Global Education Services Provider",
            industry: "Education Technology",
            challenge: "Rapid expansion required creating large volumes of structured, high-quality content across multiple domains. Scaling content development without losing consistency was challenging, with strict university timelines requiring faster turnaround without compromising quality.",
            solution: "Appointed dedicated project managers and engaged SMEs across domains. Created standardized templates, TOCs, and instructional design guides. Deployed robust quality assurance process including plagiarism checks and multi-level reviews. Tested content with pilot learners before rollout.",
            results: [
                "Delivered high-quality courses faster while ensuring academic rigor",
                "Enabled universities to launch programs on schedule without delays",
                "Established scalable, repeatable framework for future course creation",
                "Maintained consistency across multiple domains"
            ],
            metrics: [
                { label: "Quality", value: "High" },
                { label: "Delivery Speed", value: "Faster" },
                { label: "Schedule", value: "On Time" },
                { label: "Scalability", value: "Achieved" }
            ],
            tags: ["Content Development", "EdTech", "Quality Assurance", "Scalability"]
        },
        {
            title: "Centralized Dealer Training for Furniture Brand",
            client: "India's Top Furniture & Mattress Company",
            industry: "Furniture & Retail",
            challenge: "Dealer training was fragmented across regions, leading to inconsistency in product messaging. Traditional training was expensive, time-consuming, and lacked scalability needed to cover thousands of partners. Required multilingual, mobile-friendly, and motivating eLearning solution.",
            solution: "Partnered with L&D teams to identify dealer-specific training needs. Developed microlearning videos (2–3 minutes each) to encourage regular engagement. Designed multilingual modules and deployed CMS integrated with cloud LMS. Introduced assessments and certifications for accountability.",
            results: [
                "1000+ employees trained and certified within first year",
                "Reduced training costs by 60% compared to traditional methods",
                "Improved consistency and engagement across dealer networks",
                "Enhanced mobile accessibility for flexible learning"
            ],
            metrics: [
                { label: "Employees Trained", value: "1000+" },
                { label: "Cost Reduction", value: "60%" },
                { label: "Consistency", value: "Improved" },
                { label: "Engagement", value: "Enhanced" }
            ],
            tags: ["Dealer Training", "Microlearning", "Multilingual", "Mobile Learning"]
        },
        {
            title: "Global Online Music & Dance Learning Platform",
            client: "Bharatanatyam & Carnatic Vocal Training Platform",
            industry: "Arts & Culture Education",
            challenge: "Making quality Bharatanatyam and Carnatic vocal training accessible worldwide while maintaining cultural authenticity. Platform needed to combine live teacher-student interaction with recorded lessons, support global streaming, and respect traditional guru-shishya learning methods.",
            solution: "Developed custom Moodle LMS integrated with APIs for live sessions using WebEx and Skype. Created over 400 hours of eLearning content including 250+ hours of high-quality videos. Built scalable video streaming infrastructure and designed CMS for independent content management.",
            results: [
                "Established world's leading online music and dance eLearning platform",
                "Secured VC funding for rapid growth and expansion",
                "Gained adoption from learners in multiple countries",
                "Successfully bridged cultural and geographic gaps"
            ],
            metrics: [
                { label: "Content Hours", value: "400+" },
                { label: "Video Content", value: "250+" },
                { label: "Global Reach", value: "Multi-Country" },
                { label: "Funding", value: "VC Secured" }
            ],
            tags: ["Arts Education", "Cultural Learning", "Live Streaming", "Global Platform"]
        },
        {
            title: "Scalable Induction Training for Global Bank",
            client: "Global Banking Operations Division",
            industry: "Banking & Financial Services",
            challenge: "Existing classroom-based induction was slow, expensive, and difficult to scale for rapidly expanding teams in HR, finance, IT, and customer support. Rising transaction volumes increased urgency to onboard new employees faster while maintaining training quality.",
            solution: "Mapped over 300 processes with SMEs and built interactive simulations for critical workflows. Developed explainer videos to simplify complex systems. Created gamified assessments and real-time scenarios. Adopted blended model combining eLearning with reduced classroom sessions.",
            results: [
                "Reduced induction timelines by 30%",
                "Improved complaint resolution and service quality",
                "Delivered higher ROI per trained employee",
                "Successfully scaled across multiple departments"
            ],
            metrics: [
                { label: "Timeline Reduction", value: "30%" },
                { label: "Process Mapping", value: "300+" },
                { label: "Service Quality", value: "Improved" },
                { label: "ROI", value: "Higher" }
            ],
            tags: ["Banking", "Induction Training", "Process Simulation", "Blended Learning"]
        },
        {
            title: "Lean Training for 2000 Shopfloor Employees",
            client: "India's Largest Automotive Battery Manufacturer",
            industry: "Automotive Manufacturing",
            challenge: "Training over 2000 shopfloor workers (mostly first-generation industrial employees) in lean manufacturing principles across multiple plants. Traditional classroom training was logistically unmanageable with limited qualified faculty, risking inconsistent delivery and productivity loss.",
            solution: "Collaborated with Lean experts to design highly visual, scenario-based content. Created structured modules under 10 minutes each for first-time learners. Incorporated simulations and videos demonstrating lean principles. Deployed through cloud-hosted LMS with pre-tests, quizzes, and certifications.",
            results: [
                "Trained over 200 employees in first 4 weeks, scaling to 2000",
                "Achieved 50% reduction in training costs vs classroom training",
                "Improved worker engagement through interactive, modular content",
                "Ensured measurable outcomes through assessments and certification"
            ],
            metrics: [
                { label: "Initial Training", value: "200+" },
                { label: "Cost Reduction", value: "50%" },
                { label: "Target Scale", value: "2000" },
                { label: "Engagement", value: "Improved" }
            ],
            tags: ["Manufacturing", "Lean Training", "Shopfloor", "Microlearning"]
        },
        {
            title: "Digitized Training for Asia's Largest Bank",
            client: "Asia's Largest Bank",
            industry: "Banking & Financial Services",
            challenge: "Traditional classroom-heavy training model struggled to keep pace with business demands for 240,000+ employees across thousands of branches. Geographically dispersed workforce had diverse learning needs, with costly, time-consuming, and inconsistent classroom training creating skill gaps.",
            solution: "Developed SCORM/AICC compliant HTML5 courses compatible with multiple platforms. Created bite-sized mobile nuggets for anytime, anywhere access. Adopted gamification strategies to enhance motivation. Designed modules covering banking operations, HR, technology, and compliance optimized for multiple devices.",
            results: [
                "Scaled training to 240,000+ employees nationwide",
                "Reduced dependency on physical training academies",
                "Improved accessibility and learner engagement with mobile-first content",
                "Enhanced consistency across all regions and branches"
            ],
            metrics: [
                { label: "Employees Reached", value: "240K+" },
                { label: "Mobile Access", value: "Enabled" },
                { label: "Academy Dependency", value: "Reduced" },
                { label: "Engagement", value: "Enhanced" }
            ],
            tags: ["Banking", "Mobile Learning", "Gamification", "Large Scale"]
        }
    ]



    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                {/* Banner Image */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url("/IMAGES/elearning case studies.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Real results from real clients - discover how we've transformed learning experiences
                        </p>
                    </div>
                </div>
            </section>

            {/* Overview Stats */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                            Our Impact Across Industries
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">240K+</div>
                                <div className="text-gray-700">Employees Trained</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">400+</div>
                                <div className="text-gray-700">Hours of Content</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
                                <div className="text-gray-700">Average Cost Reduction</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
                                <div className="text-gray-700">Training Time Reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Case Studies Grid */}
                        <div className="space-y-8">
                            {caseStudies.map((study, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {study.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{study.title}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <Building className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Client:</span>
                                                </div>
                                                <p className="text-gray-700 mb-4">{study.client}</p>
                                                
                                                <div className="flex items-center mb-2">
                                                    <Layers className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Industry:</span>
                                                </div>
                                                <p className="text-gray-700">{study.industry}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                {study.metrics.map((metric, metricIndex) => (
                                                    <div key={metricIndex} className="text-center bg-orange-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-orange-600">{metric.value}</div>
                                                        <div className="text-sm text-gray-700">{metric.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <Target className="h-5 w-5 text-orange-500 mr-2" />
                                                Challenge
                                            </h4>
                                            <p className="text-gray-700">{study.challenge}</p>
                                        </div>
                                        
                                        {showDetails === index && (
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                        <Layers className="h-5 w-5 text-orange-500 mr-2" />
                                                        Solution
                                                    </h4>
                                                    <p className="text-gray-700">{study.solution}</p>
                                                </div>
                                                
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                        <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                                        Results Achieved
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {study.results.map((result, resultIndex) => (
                                                            <div key={resultIndex} className="flex items-center space-x-2">
                                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                                <span className="text-gray-700">{result}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={() => setShowDetails(showDetails === index ? null : index)}
                                                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                            >
                                                <span>{showDetails === index ? 'Hide Details' : 'View Details'}</span>
                                                <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${showDetails === index ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                                                <span>Download PDF</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">
                            Consistent Results Across All Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Faster Training Delivery</h3>
                                <p className="text-gray-700">Reduced training duration from 2 weeks to 1 week with improved comprehension</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Massive Scale Achievement</h3>
                                <p className="text-gray-700">Successfully trained 240,000+ employees across global operations</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cost Optimization</h3>
                                <p className="text-gray-700">Average 50-60% reduction in training costs while improving quality</p>
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
                            Ready to Create Your Success Story?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Let's discuss how we can help you achieve similar results for your organization.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}