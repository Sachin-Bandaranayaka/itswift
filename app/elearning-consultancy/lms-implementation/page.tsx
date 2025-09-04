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
                    <p className="text-gray-700 mb-4">
                        The timeline for Moodle LMS implementation varies based on complexity, customization requirements, and integration needs. A standard implementation typically takes 4-6 weeks, while more complex projects with extensive customization may require 8-12 weeks. Our agile implementation methodology ensures the fastest possible deployment without compromising quality or functionality.
                    </p>
                </>
            )
        },
        {
            question: "Can you migrate our existing courses and user data from another LMS?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Absolutely. Our LMS migration services include comprehensive data transfer from virtually any learning platform to Moodle. We carefully map and migrate courses, user accounts, completion records, and other essential data to ensure continuity in your training programs. Our migration specialists have successfully completed transitions from platforms like Blackboard, Canvas, TalentLMS, and proprietary systems.
                    </p>
                </>
            )
        },
        {
            question: "How do you ensure our Moodle LMS implementation is secure?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Security is paramount in our implementation process. We implement multiple layers of protection, including secure server configurations, encrypted data transmission, regular security updates, and role-based access controls. We also conduct security audits and vulnerability assessments to identify and address potential risks before they can be exploited.
                    </p>
                </>
            )
        },
        {
            question: "What kind of support do you provide after implementation?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        We offer comprehensive post-implementation support through our outsourced LMS support staff services. This includes technical maintenance, user support, content updates, system monitoring, and strategic guidance. Our support packages can be tailored to your specific needs, from basic technical assistance to full LMS administration and management.
                    </p>
                </>
            )
        },
        {
            question: "Can you customize the Moodle interface to match our brand?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Yes, custom theme development is a core component of our implementation services. We create Moodle themes that perfectly align with your organizational branding, incorporating your logo, color scheme, typography, and other visual elements. This customization creates a seamless experience that reinforces your brand identity throughout the learning journey.
                    </p>
                </>
            )
        },
        {
            question: "How does Moodle LMS implementation improve training ROI?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
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

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Comprehensive Moodle LMS Implementation Services for Modern Organizations
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Transform your corporate training with expert implementation that delivers results
                            </p>
                        </div>

                        {/* Key Challenge Highlight */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-12 border-l-4 border-orange-500">
                            <div className="flex items-start">
                                <div className="bg-orange-100 rounded-full p-3 mr-6 flex-shrink-0">
                                    <CheckCircle className="h-8 w-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">The Modern Training Challenge</h3>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        In today's rapidly evolving corporate landscape, implementing an effective Learning Management System (LMS) is no longer optional—it's <span className="font-semibold text-orange-600">essential for organizations committed to employee development and training excellence</span>. Traditional training approaches often struggle with scalability, consistency, and engagement, leading to poor knowledge retention and wasted resources.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Solution Highlight */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                            <div>
                                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <Award className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    At Swift Solution, we're transforming corporate training through <span className="font-semibold text-orange-600">expert Moodle LMS implementation services in Bangalore</span> that deliver powerful, customized learning experiences.
                                </p>
                                <div className="flex items-center text-orange-600">
                                    <ArrowRight className="h-5 w-5 mr-2" />
                                    <span className="font-medium">Proven expertise in Bangalore</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">What Sets Us Apart</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Deep technical expertise</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Instructional design knowledge</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">Customized learning experiences</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Our Approach */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="bg-orange-500 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                                        <Layers className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Beyond Software Installation</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        We understand that successful LMS implementation isn't just about software installation—it's about <span className="text-orange-300 font-medium">creating a learning ecosystem that aligns perfectly with your organizational goals and culture</span>.
                                    </p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                                    <h4 className="text-lg font-semibold mb-4 text-orange-300">Our Impact</h4>
                                    <p className="text-gray-200">
                                        Through our comprehensive Moodle LMS implementation services, we help businesses across Bangalore and beyond deploy learning platforms that <span className="font-semibold">drive real engagement while accelerating workforce development</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Professional Implementation Matters */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">Common DIY Implementation Challenges</h3>
                                <ul className="space-y-4 w-full max-w-md">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Technical complexities that delay deployment</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Poor configuration leading to underutilized features</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Inconsistent user experiences across devices</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Inadequate integration with existing systems</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Limited customization and branding options</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Insufficient security measures for training data</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Lack of scalability for growing training needs</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Why Professional Moodle LMS Implementation Matters
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    Many organizations attempt DIY LMS implementation only to encounter significant challenges that compromise their training effectiveness.
                                </p>
                                <p className="text-lg text-gray-700 mb-6">
                                    Swift Solution addresses these challenges through our expert Moodle LMS implementation services in Bangalore. We transform standard Moodle installations into powerful, customized learning platforms that perfectly align with your organizational requirements and technical environment.
                                </p>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Our Approach to Moodle LMS Implementation Excellence
                                </h3>
                                <p className="text-lg text-gray-700">
                                    Using proven methodologies and best practices, we can efficiently implement, customize, and optimize your Moodle LMS to meet your specific organizational needs. Our implementation process is meticulously designed to minimize disruption while maximizing adoption, ensuring your new learning platform delivers the expected return on investment from day one.
                                </p>
                            </div>
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
            <section id="faq" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            FAQ: Moodle LMS Implementation Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our Moodle LMS implementation services
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div key={index} className="mb-4">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className={`flex justify-between items-center w-full p-5 text-left rounded-lg ${openFaqIndex === index ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'} border`}
                                >
                                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                    <span>
                                        {openFaqIndex === index ? (
                                            <ChevronDown className="h-5 w-5 text-orange-500 transform rotate-180 transition-transform duration-200" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-orange-500 transition-transform duration-200" />
                                        )}
                                    </span>
                                </button>
                                {openFaqIndex === index && (
                                    <div className="p-5 border border-t-0 border-orange-200 bg-orange-50 rounded-b-lg">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            Partner with Swift Solution for Moodle LMS Implementation Excellence
                        </h2>
                        <p className="text-lg mb-8 text-orange-100">
                            Don't settle for generic LMS implementations that fail to address your unique organizational needs. Partner with Swift Solution, one of the leading Moodle LMS implementation service providers in Bangalore, to develop a powerful, customized learning platform that transforms your training capabilities and accelerates workforce development.
                        </p>
                        <p className="text-lg mb-8 text-orange-100">
                            Our team of certified Moodle specialists, instructional designers, and support professionals is ready to help you create an LMS implementation that not only meets your current requirements but also provides the flexibility and scalability to support your future growth.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <a href="http://localhost:3000/#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Contact Us Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <Contact />
        </div>
    );
} 