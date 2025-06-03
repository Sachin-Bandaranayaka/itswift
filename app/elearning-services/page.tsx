"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const services = [
    {
        title: "Custom eLearning",
        description: "Tailored eLearning solutions designed to meet your specific business needs and objectives.",
        href: "/elearning-services/custom-elearning",
    },
    {
        title: "Micro Learning",
        description: "Bite-sized learning modules that deliver focused content for maximum retention and engagement.",
        href: "#",
    },
    {
        title: "Convert Flash to HTML",
        description: "Modernize your legacy Flash-based courses by converting them to HTML5 for better compatibility and performance.",
        href: "#",
    },
    {
        title: "Video Based Training",
        description: "Engaging video content that simplifies complex concepts and enhances the learning experience.",
        href: "#",
    },
    {
        title: "ILT to eLearning conversion",
        description: "Transform your instructor-led training materials into interactive digital learning experiences.",
        href: "/elearning-services/ilt-to-elearning",
    },
    {
        title: "Webinar to eLearning conversion",
        description: "Convert your webinars into structured eLearning modules for on-demand access.",
        href: "/elearning-services/webinar-to-elearning",
    },
    {
        title: "Game based eLearning",
        description: "Gamified learning experiences that boost engagement and knowledge retention through interactive challenges.",
        href: "#",
    },
    {
        title: "eLearning translation and localization",
        description: "Adapt your eLearning content for global audiences with professional translation and cultural localization.",
        href: "/elearning-services/translation-localization",
    },
    {
        title: "Rapid eLearning",
        description: "Quick development of eLearning content to meet urgent training needs without compromising quality.",
        href: "/elearning-services/rapid-elearning",
    },
]

export default function ElearningServicesPage() {
    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">E-Learning Services</h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We offer a comprehensive range of e-learning services to help you create engaging, effective, and impactful learning experiences for your audience.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div key={index} className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="p-8">
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {service.description}
                                </p>
                                <Link href={service.href} className="inline-flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                                    Learn more
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2 duration-300" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 