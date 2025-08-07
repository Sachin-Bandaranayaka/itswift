"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Target, Globe, Lightbulb, Heart, Star, Trophy } from "lucide-react"

interface TeamMember {
    name: string
    role: string
    description: string
    image?: string
}

interface Value {
    title: string
    description: string
    icon: React.ReactNode
}

export default function AboutUsPage() {
    const [showTeam, setShowTeam] = useState(false)

    const teamMembers: TeamMember[] = [
        {
            name: "John Smith",
            role: "CEO & Founder",
            description: "20+ years of experience in eLearning and corporate training solutions."
        },
        {
            name: "Sarah Johnson",
            role: "Head of Instructional Design",
            description: "Expert in learning psychology and curriculum development."
        },
        {
            name: "Michael Chen",
            role: "Technical Director",
            description: "Leading our technology innovation and platform development."
        },
        {
            name: "Emily Davis",
            role: "Creative Director",
            description: "Bringing visual excellence to every learning experience."
        }
    ]

    const values: Value[] = [
        {
            title: "Innovation",
            description: "We continuously explore new technologies and methodologies to create cutting-edge learning solutions.",
            icon: <Lightbulb className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Quality",
            description: "Every project undergoes rigorous quality assurance to ensure exceptional learning outcomes.",
            icon: <Star className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Partnership",
            description: "We work closely with our clients as true partners in their learning and development journey.",
            icon: <Heart className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Excellence",
            description: "We strive for excellence in every aspect of our work, from design to delivery.",
            icon: <Trophy className="h-8 w-8 text-orange-500" />
        }
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/2.about us/download (2).png" 
                        alt="About Swift Solution Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About Swift Solution
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Transforming learning experiences through innovation, creativity, and expertise
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
                                Our Story
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200">
                                Meet Our Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                            Our Story
                        </h2>
                        
                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-gray-700 mb-6">
                                Founded in 2010, Swift Solution emerged from a simple yet powerful vision: to revolutionize 
                                how organizations approach learning and development. What started as a small team of passionate 
                                educators and technologists has grown into a leading provider of innovative eLearning solutions 
                                trusted by companies worldwide.
                            </p>
                            
                            <p className="text-gray-700 mb-6">
                                Over the years, we've had the privilege of working with Fortune 500 companies, government 
                                agencies, educational institutions, and growing businesses across diverse industries. Our 
                                commitment to excellence and innovation has earned us recognition as a premier partner for 
                                organizations seeking to transform their training and development initiatives.
                            </p>
                            
                            <p className="text-gray-700 mb-6">
                                Today, Swift Solution stands at the forefront of the eLearning industry, combining cutting-edge 
                                technology with proven instructional design methodologies to create learning experiences that 
                                engage, educate, and inspire learners around the globe.
                            </p>
                        </div>

                        {/* Mission & Vision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="bg-orange-500 p-3 rounded-full inline-block mb-4">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h3>
                                <p className="text-gray-700">
                                    To empower organizations with innovative learning solutions that drive performance, 
                                    engagement, and growth. We believe that effective learning is the foundation of 
                                    organizational success and individual development.
                                </p>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8">
                                <div className="bg-blue-500 p-3 rounded-full inline-block mb-4">
                                    <Globe className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Vision</h3>
                                <p className="text-gray-700">
                                    To be the global leader in transformative learning experiences, setting new standards 
                                    for innovation, quality, and impact in the eLearning industry while making learning 
                                    accessible and engaging for everyone.
                                </p>
                            </div>
                        </div>

                        {/* Our Values */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Our Core Values</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {values.map((value, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center">
                                        <div className="bg-orange-50 p-3 rounded-full inline-block mb-4">
                                            {value.icon}
                                        </div>
                                        <h4 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h4>
                                        <p className="text-gray-700">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Company Stats */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Swift Solution by the Numbers</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                                    <div className="text-gray-700">Projects Completed</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
                                    <div className="text-gray-700">Happy Clients</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">1M+</div>
                                    <div className="text-gray-700">Learners Trained</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-orange-600 mb-2">13+</div>
                                    <div className="text-gray-700">Years of Excellence</div>
                                </div>
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-semibold text-gray-900">Meet Our Leadership Team</h3>
                                <button
                                    onClick={() => setShowTeam(!showTeam)}
                                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                >
                                    <span>{showTeam ? 'Hide' : 'Show'} Team</span>
                                    <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${showTeam ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            
                            {showTeam && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center">
                                            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Users className="h-10 w-10 text-orange-500" />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-2 text-gray-900">{member.name}</h4>
                                            <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                                            <p className="text-gray-700 text-sm">{member.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Why Choose Us */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Why Organizations Choose Swift Solution</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Proven Track Record</h4>
                                        <p className="text-gray-700">13+ years of delivering successful eLearning solutions</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Expert Team</h4>
                                        <p className="text-gray-700">Certified instructional designers and technology specialists</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Cutting-Edge Technology</h4>
                                        <p className="text-gray-700">Latest tools and platforms for immersive learning</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                                        <p className="text-gray-700">Serving clients across multiple countries and industries</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Customized Solutions</h4>
                                        <p className="text-gray-700">Tailored approaches for unique business requirements</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Ongoing Support</h4>
                                        <p className="text-gray-700">Comprehensive support throughout the project lifecycle</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications & Awards */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Certifications & Recognition</h3>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div>
                                        <Award className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                        <h4 className="font-semibold text-gray-900 mb-2">ISO 9001:2015 Certified</h4>
                                        <p className="text-gray-700">Quality management systems</p>
                                    </div>
                                    <div>
                                        <Trophy className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                        <h4 className="font-semibold text-gray-900 mb-2">eLearning Excellence Awards</h4>
                                        <p className="text-gray-700">Multiple industry recognitions</p>
                                    </div>
                                    <div>
                                        <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                        <h4 className="font-semibold text-gray-900 mb-2">Client Satisfaction</h4>
                                        <p className="text-gray-700">98% client retention rate</p>
                                    </div>
                                </div>
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
                            Ready to Partner with Us?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Let's discuss how Swift Solution can help transform your learning and development initiatives.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}