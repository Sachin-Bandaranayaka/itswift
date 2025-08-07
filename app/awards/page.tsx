"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Trophy, Star, Medal, Crown, Calendar, ExternalLink, Lightbulb } from "lucide-react"

interface AwardItem {
    title: string
    organization: string
    year: string
    category: string
    description: string
    significance: string
    icon: React.ReactNode
}

interface Recognition {
    title: string
    description: string
    year: string
    type: string
}

export default function AwardsPage() {
    const [selectedYear, setSelectedYear] = useState("All")
    const [showDetails, setShowDetails] = useState<number | null>(null)

    const years = ["All", "2023", "2022", "2021", "2020", "2019"]

    const awards: AwardItem[] = [
        {
            title: "Excellence in eLearning Innovation",
            organization: "eLearning Industry Awards",
            year: "2023",
            category: "Innovation",
            description: "Recognized for groundbreaking use of AI and VR technologies in corporate training solutions.",
            significance: "This award acknowledges our pioneering work in integrating artificial intelligence and virtual reality to create immersive learning experiences that have set new industry standards.",
            icon: <Crown className="h-8 w-8 text-yellow-500" />
        },
        {
            title: "Best Learning Technology Solution",
            organization: "Training Industry Awards",
            year: "2023",
            category: "Technology",
            description: "Awarded for our adaptive learning platform that personalizes training content based on individual learning patterns.",
            significance: "Recognition of our cutting-edge adaptive learning technology that has revolutionized how organizations approach personalized training and development.",
            icon: <Trophy className="h-8 w-8 text-gold-500" />
        },
        {
            title: "Corporate Learning Excellence Award",
            organization: "Chief Learning Officer Magazine",
            year: "2022",
            category: "Excellence",
            description: "Honored for outstanding contribution to corporate learning and development across multiple industries.",
            significance: "This prestigious award recognizes our consistent delivery of high-quality learning solutions that have transformed training programs for Fortune 500 companies worldwide.",
            icon: <Star className="h-8 w-8 text-blue-500" />
        },
        {
            title: "Innovation in Compliance Training",
            organization: "Compliance Training Association",
            year: "2022",
            category: "Compliance",
            description: "Recognized for developing innovative compliance training solutions that achieve 100% regulatory adherence.",
            significance: "Acknowledgment of our expertise in creating engaging compliance training that not only meets regulatory requirements but also achieves exceptional learner engagement and retention.",
            icon: <Medal className="h-8 w-8 text-green-500" />
        },
        {
            title: "Best Mobile Learning Solution",
            organization: "Mobile Learning Awards",
            year: "2021",
            category: "Mobile",
            description: "Awarded for our comprehensive mobile-first learning platform that enables seamless learning across devices.",
            significance: "Recognition of our forward-thinking approach to mobile learning, creating solutions that allow learners to access training anytime, anywhere, on any device.",
            icon: <Award className="h-8 w-8 text-purple-500" />
        },
        {
            title: "Excellence in Instructional Design",
            organization: "Association for Talent Development",
            year: "2021",
            category: "Design",
            description: "Honored for exceptional instructional design methodologies that maximize learning effectiveness.",
            significance: "This award validates our commitment to evidence-based instructional design principles and our ability to create learning experiences that drive real behavioral change.",
            icon: <Trophy className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Global Training Excellence",
            organization: "International Training Awards",
            year: "2020",
            category: "Global",
            description: "Recognized for delivering world-class training solutions across multiple countries and cultures.",
            significance: "Acknowledgment of our global expertise and ability to create culturally sensitive, locally relevant training programs that maintain consistency across international markets.",
            icon: <Crown className="h-8 w-8 text-red-500" />
        },
        {
            title: "Innovation in Video-Based Learning",
            organization: "Video Learning Awards",
            year: "2020",
            category: "Video",
            description: "Awarded for creating engaging and effective video-based training content with interactive elements.",
            significance: "Recognition of our expertise in video production and interactive media, creating training content that achieves cinema-quality production with educational effectiveness.",
            icon: <Star className="h-8 w-8 text-indigo-500" />
        },
        {
            title: "Best Learning Analytics Platform",
            organization: "Learning Analytics Awards",
            year: "2019",
            category: "Analytics",
            description: "Recognized for developing comprehensive learning analytics that provide actionable insights for training optimization.",
            significance: "This award highlights our data-driven approach to learning, providing organizations with detailed insights that enable continuous improvement of training programs.",
            icon: <Medal className="h-8 w-8 text-teal-500" />
        }
    ]

    const recognitions: Recognition[] = [
        {
            title: "ISO 9001:2015 Quality Management Certification",
            description: "Certified for maintaining the highest standards in quality management systems.",
            year: "2023",
            type: "Certification"
        },
        {
            title: "Top 20 eLearning Companies to Watch",
            description: "Listed among the most innovative and promising eLearning companies globally.",
            year: "2023",
            type: "Industry Recognition"
        },
        {
            title: "Preferred Learning Partner - Fortune 500",
            description: "Recognized as a preferred learning partner by multiple Fortune 500 companies.",
            year: "2022",
            type: "Partnership"
        },
        {
            title: "Client Choice Award",
            description: "98% client satisfaction rate and 95% client retention rate.",
            year: "2022",
            type: "Client Recognition"
        }
    ]

    const filteredAwards = selectedYear === "All" 
        ? awards 
        : awards.filter(award => award.year === selectedYear)

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Awards & Recognition
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Celebrating excellence in eLearning innovation and client success
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                View All Awards
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
                                Download Certificates
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Awards Overview */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                            Recognition Highlights
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Trophy className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
                                <div className="text-gray-700">Industry Awards</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                                <div className="text-gray-700">Years Consecutive</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Medal className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                                <div className="text-gray-700">Client Satisfaction</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Crown className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-orange-600 mb-2">Top 20</div>
                                <div className="text-gray-700">Global Ranking</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Awards Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Year Filter */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">Filter by Year</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                                            selectedYear === year
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Awards Grid */}
                        <div className="space-y-6">
                            {filteredAwards.map((award, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-orange-50 p-3 rounded-full">
                                                    {award.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{award.title}</h3>
                                                    <div className="flex items-center space-x-4 text-gray-600">
                                                        <span className="flex items-center">
                                                            <Award className="h-4 w-4 mr-1" />
                                                            {award.organization}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {award.year}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {award.category}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-700 mb-4">{award.description}</p>
                                        
                                        {showDetails === index && (
                                            <div className="bg-orange-50 rounded-lg p-6 mb-4">
                                                <h4 className="font-semibold text-gray-900 mb-2">Award Significance</h4>
                                                <p className="text-gray-700">{award.significance}</p>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => setShowDetails(showDetails === index ? null : index)}
                                                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                            >
                                                <span>{showDetails === index ? 'Hide Details' : 'Learn More'}</span>
                                                <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${showDetails === index ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <button className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200">
                                                <span>View Certificate</span>
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

            {/* Other Recognition */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                            Additional Recognition & Certifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recognitions.map((recognition, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">{recognition.title}</h3>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {recognition.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3">{recognition.description}</p>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{recognition.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Leadership */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">
                            Industry Leadership & Innovation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
                                <Lightbulb className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovation Pioneer</h3>
                                <p className="text-gray-700">Leading the industry in AI, VR, and adaptive learning technologies</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Thought Leadership</h3>
                                <p className="text-gray-700">Regular speakers at major industry conferences and events</p>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                                <BarChart className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Proven Results</h3>
                                <p className="text-gray-700">Consistent delivery of measurable learning outcomes and ROI</p>
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
                            Partner with an Award-Winning Team
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Experience the excellence that has earned us industry recognition. Let's create your next award-winning learning solution.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}