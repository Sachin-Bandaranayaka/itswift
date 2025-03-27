import React from "react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "eLearning Services | Swift Solution",
    description: "Explore our comprehensive eLearning services including custom eLearning, micro learning, and more.",
}

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
        href: "#",
    },
    {
        title: "Webinar to eLearning conversion",
        description: "Convert your webinars into structured eLearning modules for on-demand access.",
        href: "#",
    },
    {
        title: "Game based eLearning",
        description: "Gamified learning experiences that boost engagement and knowledge retention through interactive challenges.",
        href: "#",
    },
    {
        title: "eLearning translation and localization",
        description: "Adapt your eLearning content for global audiences with professional translation and cultural localization.",
        href: "#",
    },
    {
        title: "Rapid eLearning",
        description: "Quick development of eLearning content to meet urgent training needs without compromising quality.",
        href: "#",
    },
]

export default function ElearningServicesPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                eLearning Services
            </h1>
            <p className="text-xl mb-12 max-w-3xl">
                Our comprehensive eLearning services are designed to help organizations create engaging, effective, and impactful learning experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Link
                        key={index}
                        href={service.href}
                        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{service.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                        <span className="text-primary font-medium">Learn more →</span>
                    </Link>
                ))}
            </div>
        </div>
    )
} 