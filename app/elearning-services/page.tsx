"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import DynamicContent from "@/components/dynamic-content"

const services = [
    {
        titleKey: "custom_elearning_title",
        titleFallback: "Custom eLearning",
        descriptionKey: "custom_elearning_description",
        descriptionFallback: "Tailored eLearning solutions designed to meet your specific business needs and objectives.",
        href: "/elearning-services/custom-elearning",
    },
    {
        titleKey: "micro_learning_title",
        titleFallback: "Micro Learning",
        descriptionKey: "micro_learning_description",
        descriptionFallback: "Bite-sized learning modules that deliver focused content for maximum retention and engagement.",
        href: "#",
    },
    {
        titleKey: "flash_to_html_title",
        titleFallback: "Convert Flash to HTML",
        descriptionKey: "flash_to_html_description",
        descriptionFallback: "Modernize your legacy Flash-based courses by converting them to HTML5 for better compatibility and performance.",
        href: "#",
    },
    {
        titleKey: "video_training_title",
        titleFallback: "Video Based Training",
        descriptionKey: "video_training_description",
        descriptionFallback: "Engaging video content that simplifies complex concepts and enhances the learning experience.",
        href: "#",
    },
    {
        titleKey: "ilt_conversion_title",
        titleFallback: "ILT to eLearning conversion",
        descriptionKey: "ilt_conversion_description",
        descriptionFallback: "Transform your instructor-led training materials into interactive digital learning experiences.",
        href: "/elearning-services/ilt-to-elearning",
    },
    {
        titleKey: "webinar_conversion_title",
        titleFallback: "Webinar to eLearning conversion",
        descriptionKey: "webinar_conversion_description",
        descriptionFallback: "Convert your webinars into structured eLearning modules for on-demand access.",
        href: "/elearning-services/webinar-to-elearning",
    },
    {
        titleKey: "game_based_title",
        titleFallback: "Game based eLearning",
        descriptionKey: "game_based_description",
        descriptionFallback: "Gamified learning experiences that boost engagement and knowledge retention through interactive challenges.",
        href: "#",
    },
    {
        titleKey: "translation_localization_title",
        titleFallback: "eLearning translation and localization",
        descriptionKey: "translation_localization_description",
        descriptionFallback: "Adapt your eLearning content for global audiences with professional translation and cultural localization.",
        href: "/elearning-services/translation-localization",
    },
    {
        titleKey: "rapid_elearning_title",
        titleFallback: "Rapid eLearning",
        descriptionKey: "rapid_elearning_description",
        descriptionFallback: "Quick development of eLearning content to meet urgent training needs without compromising quality.",
        href: "/elearning-services/rapid-elearning",
    },
]

export default function ElearningServicesPage() {
    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <DynamicContent 
                        sectionKey="elearning_services_title"
                        pageSlug="elearning-services"
                        as="h1"
                        className="text-4xl font-bold tracking-tight text-gray-900"
                        fallback="E-Learning Services"
                    />
                    <DynamicContent 
                        sectionKey="elearning_services_description"
                        pageSlug="elearning-services"
                        as="p"
                        className="mt-6 text-lg leading-8 text-gray-600"
                        fallback="We offer a comprehensive range of e-learning services to help you create engaging, effective, and impactful learning experiences for your audience."
                    />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div key={index} className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="p-8">
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                                    <DynamicContent 
                                        sectionKey={service.titleKey} 
                                        pageSlug="elearning-services" 
                                        fallback={service.titleFallback} 
                                    />
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    <DynamicContent 
                                        sectionKey={service.descriptionKey} 
                                        pageSlug="elearning-services" 
                                        fallback={service.descriptionFallback} 
                                    />
                                </p>
                                <Link href={service.href} className="inline-flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                                    <DynamicContent 
                                        sectionKey="learn_more_text" 
                                        pageSlug="elearning-services" 
                                        fallback="Learn more" 
                                    />
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