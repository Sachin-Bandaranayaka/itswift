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
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [showDetails, setShowDetails] = useState<number | null>(null)

    const categories = ["All", "Corporate Training", "Compliance", "Sales Training", "Technical Training", "Onboarding"]

    const caseStudies: CaseStudy[] = [
        {
            title: "Global Sales Training Transformation",
            client: "Fortune 500 Technology Company",
            industry: "Technology",
            challenge: "A multinational technology company needed to standardize sales training across 50+ countries while maintaining local relevance and reducing training costs by 40%.",
            solution: "We developed a comprehensive blended learning solution featuring interactive modules, virtual reality product demonstrations, gamified assessments, and localized content in 12 languages.",
            results: [
                "40% reduction in training costs",
                "85% improvement in sales performance metrics",
                "95% completion rate across all regions",
                "60% faster time-to-productivity for new hires"
            ],
            metrics: [
                { label: "Cost Reduction", value: "40%" },
                { label: "Performance Improvement", value: "85%" },
                { label: "Completion Rate", value: "95%" },
                { label: "Time Savings", value: "60%" }
            ],
            tags: ["Sales Training", "Multilingual", "VR", "Gamification"]
        },
        {
            title: "Healthcare Compliance Training Overhaul",
            client: "Leading Healthcare Provider",
            industry: "Healthcare",
            challenge: "A major healthcare network required HIPAA and safety compliance training for 15,000+ employees with strict regulatory requirements and tight deadlines.",
            solution: "We created scenario-based eLearning modules with branching simulations, real-world case studies, and automated compliance tracking integrated with their HRIS system.",
            results: [
                "100% regulatory compliance achieved",
                "50% reduction in training time",
                "90% employee satisfaction scores",
                "Zero compliance violations post-training"
            ],
            metrics: [
                { label: "Compliance Rate", value: "100%" },
                { label: "Time Reduction", value: "50%" },
                { label: "Satisfaction", value: "90%" },
                { label: "Violations", value: "0" }
            ],
            tags: ["Compliance", "Healthcare", "Simulation", "Tracking"]
        },
        {
            title: "Manufacturing Safety Training Revolution",
            client: "Global Manufacturing Corporation",
            industry: "Manufacturing",
            challenge: "A manufacturing giant needed to reduce workplace accidents and improve safety awareness across 200+ facilities worldwide while overcoming language barriers.",
            solution: "We developed immersive VR safety training experiences, mobile-friendly microlearning modules, and AI-powered assessment tools with multilingual support.",
            results: [
                "75% reduction in workplace accidents",
                "92% improvement in safety knowledge retention",
                "80% increase in safety reporting",
                "$2M+ savings in insurance costs"
            ],
            metrics: [
                { label: "Accident Reduction", value: "75%" },
                { label: "Knowledge Retention", value: "92%" },
                { label: "Safety Reporting", value: "80%" },
                { label: "Cost Savings", value: "$2M+" }
            ],
            tags: ["Safety Training", "VR", "Manufacturing", "Mobile"]
        },
        {
            title: "Financial Services Onboarding Excellence",
            client: "Major Investment Bank",
            industry: "Financial Services",
            challenge: "A leading investment bank needed to accelerate new employee onboarding while ensuring comprehensive knowledge of complex financial products and regulations.",
            solution: "We created an adaptive learning platform with personalized learning paths, interactive financial simulations, and social learning features for peer collaboration.",
            results: [
                "65% faster onboarding process",
                "88% improvement in product knowledge scores",
                "95% new hire retention rate",
                "70% increase in early productivity"
            ],
            metrics: [
                { label: "Onboarding Speed", value: "65%" },
                { label: "Knowledge Scores", value: "88%" },
                { label: "Retention Rate", value: "95%" },
                { label: "Productivity", value: "70%" }
            ],
            tags: ["Onboarding", "Financial Services", "Adaptive Learning", "Social Learning"]
        },
        {
            title: "Retail Customer Service Excellence",
            client: "International Retail Chain",
            industry: "Retail",
            challenge: "A global retail chain with 5,000+ stores needed to improve customer service quality and reduce staff turnover while maintaining consistent brand experience.",
            solution: "We developed mobile-first microlearning modules, gamified customer service scenarios, and real-time performance dashboards for managers.",
            results: [
                "45% improvement in customer satisfaction",
                "30% reduction in staff turnover",
                "80% increase in upselling success",
                "25% boost in employee engagement"
            ],
            metrics: [
                { label: "Customer Satisfaction", value: "45%" },
                { label: "Turnover Reduction", value: "30%" },
                { label: "Upselling Success", value: "80%" },
                { label: "Engagement", value: "25%" }
            ],
            tags: ["Customer Service", "Retail", "Mobile Learning", "Gamification"]
        },
        {
            title: "IT Skills Development Program",
            client: "Global Consulting Firm",
            industry: "Consulting",
            challenge: "A major consulting firm needed to upskill 3,000+ consultants in emerging technologies while maintaining billable hour targets and project commitments.",
            solution: "We created just-in-time learning modules, hands-on virtual labs, AI-powered skill assessments, and personalized learning recommendations.",
            results: [
                "90% skill certification achievement",
                "55% increase in project efficiency",
                "40% improvement in client satisfaction",
                "$5M+ increase in revenue from new capabilities"
            ],
            metrics: [
                { label: "Certification Rate", value: "90%" },
                { label: "Efficiency Gain", value: "55%" },
                { label: "Client Satisfaction", value: "40%" },
                { label: "Revenue Impact", value: "$5M+" }
            ],
            tags: ["Technical Training", "IT Skills", "Virtual Labs", "AI Assessment"]
        }
    ]

    const filteredCaseStudies = selectedCategory === "All" 
        ? caseStudies 
        : caseStudies.filter(study => study.tags.some(tag => tag.includes(selectedCategory.replace(" Training", ""))))

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Real results from real clients - discover how we've transformed learning experiences
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                View All Studies
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
                                Download Portfolio
                            </button>
                        </div>
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
                                <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                                <div className="text-gray-700">Projects Delivered</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
                                <div className="text-gray-700">Global Clients</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">1M+</div>
                                <div className="text-gray-700">Learners Trained</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                                <div className="text-gray-700">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Category Filter */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">Filter by Category</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                                            selectedCategory === category
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Case Studies Grid */}
                        <div className="space-y-8">
                            {filteredCaseStudies.map((study, index) => (
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
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Faster Implementation</h3>
                                <p className="text-gray-700">Average 50% reduction in training time across all projects</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Improved Performance</h3>
                                <p className="text-gray-700">Average 70% improvement in learning outcomes and job performance</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">High Satisfaction</h3>
                                <p className="text-gray-700">98% client satisfaction rate with 95% project completion success</p>
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