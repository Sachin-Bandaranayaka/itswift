"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import { usePageContent } from "@/hooks/use-page-content"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, Play, Video, Camera, Edit, Monitor } from "lucide-react"

const PAGE_SLUG = "video-based-training"

type IconComponent = React.ComponentType<{ className?: string }>

type FeatureConfig = {
    icon: IconComponent
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
}

type GradientCardConfig = FeatureConfig & {
    color: string
}

type ListItemConfig = {
    key: string
    fallback: string
}

const WHY_FEATURES: FeatureConfig[] = [
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_1_title",
        titleFallback: "Professional Production Quality",
        descriptionKey: "video_why_feature_1_description",
        descriptionFallback: "Cinematic quality videos that reflect your brand",
    },
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_2_title",
        titleFallback: "Interactive Elements",
        descriptionKey: "video_why_feature_2_description",
        descriptionFallback: "Engaging interactions that boost retention",
    },
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_3_title",
        titleFallback: "Multi-Device Compatibility",
        descriptionKey: "video_why_feature_3_description",
        descriptionFallback: "Optimized for desktop, tablet, and mobile",
    },
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_4_title",
        titleFallback: "Analytics & Tracking",
        descriptionKey: "video_why_feature_4_description",
        descriptionFallback: "Detailed insights into learner engagement",
    },
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_5_title",
        titleFallback: "Multilingual Support",
        descriptionKey: "video_why_feature_5_description",
        descriptionFallback: "Professional voice-over and subtitles",
    },
    {
        icon: CheckCircle,
        titleKey: "video_why_feature_6_title",
        titleFallback: "LMS Integration",
        descriptionKey: "video_why_feature_6_description",
        descriptionFallback: "Seamless integration with your learning platform",
    },
]

const VIDEO_SERVICE_CARDS: GradientCardConfig[] = [
    {
        icon: Play,
        color: "from-blue-500 to-blue-600",
        titleKey: "video_service_1_title",
        titleFallback: "Instructional Videos",
        descriptionKey: "video_service_1_description",
        descriptionFallback: "Step-by-step tutorials and educational content for skill development",
    },
    {
        icon: Video,
        color: "from-purple-500 to-purple-600",
        titleKey: "video_service_2_title",
        titleFallback: "Product Demonstrations",
        descriptionKey: "video_service_2_description",
        descriptionFallback: "Showcase product features and benefits through engaging video content",
    },
    {
        icon: Monitor,
        color: "from-green-500 to-green-600",
        titleKey: "video_service_3_title",
        titleFallback: "Software Tutorials",
        descriptionKey: "video_service_3_description",
        descriptionFallback: "Interactive software training with screen recordings and walkthroughs",
    },
    {
        icon: CheckCircle,
        color: "from-orange-500 to-orange-600",
        titleKey: "video_service_4_title",
        titleFallback: "Compliance Training",
        descriptionKey: "video_service_4_description",
        descriptionFallback: "Regulatory and policy training videos for organizational compliance",
    },
    {
        icon: Users,
        color: "from-red-500 to-red-600",
        titleKey: "video_service_5_title",
        titleFallback: "Onboarding Videos",
        descriptionKey: "video_service_5_description",
        descriptionFallback: "Welcome new employees with comprehensive orientation videos",
    },
    {
        icon: Award,
        color: "from-indigo-500 to-indigo-600",
        titleKey: "video_service_6_title",
        titleFallback: "Leadership Development",
        descriptionKey: "video_service_6_description",
        descriptionFallback: "Executive and management training through scenario-based videos",
    },
    {
        icon: CheckCircle,
        color: "from-teal-500 to-teal-600",
        titleKey: "video_service_7_title",
        titleFallback: "Safety Training",
        descriptionKey: "video_service_7_description",
        descriptionFallback: "Workplace safety procedures and emergency response training",
    },
    {
        icon: BarChart,
        color: "from-pink-500 to-pink-600",
        titleKey: "video_service_8_title",
        titleFallback: "Sales Training",
        descriptionKey: "video_service_8_description",
        descriptionFallback: "Sales techniques and customer interaction training videos",
    },
    {
        icon: Users,
        color: "from-yellow-500 to-yellow-600",
        titleKey: "video_service_9_title",
        titleFallback: "Customer Service",
        descriptionKey: "video_service_9_description",
        descriptionFallback: "Customer support and service excellence training modules",
    },
    {
        icon: Layers,
        color: "from-cyan-500 to-cyan-600",
        titleKey: "video_service_10_title",
        titleFallback: "Technical Training",
        descriptionKey: "video_service_10_description",
        descriptionFallback: "Complex technical concepts simplified through visual demonstrations",
    },
    {
        icon: Play,
        color: "from-emerald-500 to-emerald-600",
        titleKey: "video_service_11_title",
        titleFallback: "Interactive Scenarios",
        descriptionKey: "video_service_11_description",
        descriptionFallback: "Branching video scenarios for decision-making practice",
    },
    {
        icon: Video,
        color: "from-violet-500 to-violet-600",
        titleKey: "video_service_12_title",
        titleFallback: "Animated Explainers",
        descriptionKey: "video_service_12_description",
        descriptionFallback: "Animated videos that simplify complex concepts and processes",
    },
]

const PRODUCTION_STEPS: FeatureConfig[] = [
    {
        icon: Users,
        titleKey: "video_process_step_1_title",
        titleFallback: "Strategy & Planning",
        descriptionKey: "video_process_step_1_description",
        descriptionFallback: "We define objectives, target audience, and create detailed scripts and storyboards.",
    },
    {
        icon: Camera,
        titleKey: "video_process_step_2_title",
        titleFallback: "Pre-Production",
        descriptionKey: "video_process_step_2_description",
        descriptionFallback: "Location scouting, talent casting, equipment setup, and production scheduling.",
    },
    {
        icon: Video,
        titleKey: "video_process_step_3_title",
        titleFallback: "Production & Filming",
        descriptionKey: "video_process_step_3_description",
        descriptionFallback: "Professional filming with high-end equipment and experienced production crew.",
    },
    {
        icon: Edit,
        titleKey: "video_process_step_4_title",
        titleFallback: "Post-Production",
        descriptionKey: "video_process_step_4_description",
        descriptionFallback: "Expert editing, motion graphics, audio enhancement, and interactive element integration.",
    },
]

const LEARNING_BENEFITS: ListItemConfig[] = [
    { key: "video_learning_benefit_1", fallback: "95% retention rate vs 10% for text" },
    { key: "video_learning_benefit_2", fallback: "Visual and auditory learning combined" },
    { key: "video_learning_benefit_3", fallback: "Self-paced learning flexibility" },
    { key: "video_learning_benefit_4", fallback: "Consistent message delivery" },
    { key: "video_learning_benefit_5", fallback: "Complex concepts simplified" },
    { key: "video_learning_benefit_6", fallback: "Emotional connection and engagement" },
]

const BUSINESS_BENEFITS: ListItemConfig[] = [
    { key: "video_business_benefit_1", fallback: "Reduced training costs over time" },
    { key: "video_business_benefit_2", fallback: "Scalable to unlimited learners" },
    { key: "video_business_benefit_3", fallback: "24/7 availability" },
    { key: "video_business_benefit_4", fallback: "Measurable learning analytics" },
    { key: "video_business_benefit_5", fallback: "Professional brand representation" },
    { key: "video_business_benefit_6", fallback: "Global reach with localization" },
]

export default function VideoBasedTrainingPage() {
    const { getContent } = usePageContent(PAGE_SLUG)

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/IMAGES/video based learning.jpg"
                        alt="Video-Based Training Solutions"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {getContent("video_hero_title", "Video-Based Training Solutions")}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            {getContent(
                                "video_hero_subtitle",
                                "Engaging video training that captivates learners and drives real results"
                            )}
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    const contentSection = document.getElementById('main-content');
                                    contentSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                            >
                                {getContent("video_hero_cta", "Get Started")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section id="main-content" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                            {getContent(
                                "video_intro_heading",
                                "Transform Learning with Professional Video Training"
                            )}
                        </h2>

                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-gray-700 mb-6">
                                {getContent(
                                    "video_intro_paragraph_1",
                                    "Video-based training has become the gold standard for corporate learning, offering unparalleled engagement and knowledge retention. Swift Solution creates professional, high-impact video training content that transforms complex concepts into compelling visual narratives that learners actually want to watch and remember."
                                )}
                            </p>

                            <p className="text-gray-700 mb-6">
                                {getContent(
                                    "video_intro_paragraph_2",
                                    "Our comprehensive video training solutions combine cinematic production quality with instructional design expertise. From concept to delivery, we handle every aspect of video training development, ensuring your content not only looks professional but delivers measurable learning outcomes."
                                )}
                            </p>
                        </div>

                        {/* Why Choose Our Video Training */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                                {getContent(
                                    "video_why_section_heading",
                                    "Why Choose Our Video-Based Training?"
                                )}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {WHY_FEATURES.map((feature) => {
                                    const Icon = feature.icon
                                    return (
                                        <div key={feature.titleKey} className="flex items-start space-x-3">
                                            <Icon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    {getContent(feature.titleKey, feature.titleFallback)}
                                                </h4>
                                                <p className="text-gray-700">
                                                    {getContent(feature.descriptionKey, feature.descriptionFallback)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <DynamicFAQ
                            sectionId="faq"
                            pageSlug="video-based-training"
                            title={getContent(
                                "video_faq_title",
                                "Frequently Asked Questions (FAQs) about Video-Based Training"
                            )}
                        />

                        {/* Video Training Types */}
                        <div className="mb-16">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                                    {getContent(
                                        "video_services_section_heading",
                                        "Video Training Solutions We Offer"
                                    )}
                                </h3>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    {getContent(
                                        "video_services_section_description",
                                        "Comprehensive video training solutions designed to engage learners and deliver measurable results"
                                    )}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {VIDEO_SERVICE_CARDS.map((service) => {
                                    const Icon = service.icon
                                    return (
                                        <div key={service.titleKey} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                        <div className="p-6">
                                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                    <Icon className="h-6 w-6" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                                    {getContent(service.titleKey, service.titleFallback)}
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                    {getContent(service.descriptionKey, service.descriptionFallback)}
                                            </p>
                                        </div>
                                            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Production Process */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
                                {getContent(
                                    "video_process_section_heading",
                                    "Our Video Production Process"
                                )}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {PRODUCTION_STEPS.map((step) => {
                                    const Icon = step.icon
                                    return (
                                        <div key={step.titleKey} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                            <div className="bg-orange-50 p-3 rounded-full inline-block mb-4">
                                                <Icon className="h-8 w-8 text-orange-500" />
                                            </div>
                                            <h4 className="text-xl font-semibold mb-3 text-gray-900">
                                                {getContent(step.titleKey, step.titleFallback)}
                                            </h4>
                                            <p className="text-gray-700">
                                                {getContent(step.descriptionKey, step.descriptionFallback)}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Video Training Benefits */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
                                {getContent(
                                    "video_benefits_section_heading",
                                    "Benefits of Video-Based Training"
                                )}
                            </h3>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">
                                            {getContent(
                                                "video_learning_benefits_heading",
                                                "Learning Benefits"
                                            )}
                                        </h4>
                                        <ul className="space-y-2 text-gray-700">
                                            {LEARNING_BENEFITS.map((item) => (
                                                <li key={item.key}>
                                                    • {getContent(item.key, item.fallback)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 text-gray-900">
                                            {getContent(
                                                "video_business_benefits_heading",
                                                "Business Benefits"
                                            )}
                                        </h4>
                                        <ul className="space-y-2 text-gray-700">
                                            {BUSINESS_BENEFITS.map((item) => (
                                                <li key={item.key}>
                                                    • {getContent(item.key, item.fallback)}
                                                </li>
                                            ))}
                                        </ul>
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
                            {getContent("video_contact_heading", "Ready to Create Compelling Video Training?")}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {getContent(
                                "video_contact_description",
                                "Contact our video production experts to discuss your training video needs."
                            )}
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}
