"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import {
  CheckCircle,
  Award,
  BarChart,
  Layers,
  Users,
  Play,
  Gamepad2,
  Smartphone,
  FileCheck,
  Wrench,
  Share2,
  Route,
  TrendingUp,
  Repeat,
  Film,
  Settings,
} from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "micro-learning"

type IconComponent = React.ComponentType<{ className?: string }>

type FeatureConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type ServiceConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
  color: string
}

type StepConfig = {
  step: string
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
  color: string
}

type BulletListConfig = {
  titleKey: string
  titleFallback: string
  items: { key: string; fallback: string }[]
}

const HERO_STATS: FeatureConfig[] = [
  {
    titleKey: "micro_why_feature_1_title",
    titleFallback: "Time-Efficient Learning",
    descriptionKey: "micro_why_feature_1_description",
    descriptionFallback: "2-10 minute modules that fit into any schedule",
  },
  {
    titleKey: "micro_why_feature_2_title",
    titleFallback: "Higher Retention Rates",
    descriptionKey: "micro_why_feature_2_description",
    descriptionFallback: "Up to 80% better knowledge retention",
  },
  {
    titleKey: "micro_why_feature_3_title",
    titleFallback: "Mobile-First Design",
    descriptionKey: "micro_why_feature_3_description",
    descriptionFallback: "Learn anywhere, anytime on any device",
  },
  {
    titleKey: "micro_why_feature_4_title",
    titleFallback: "Just-in-Time Learning",
    descriptionKey: "micro_why_feature_4_description",
    descriptionFallback: "Access relevant content when you need it most",
  },
]

const SERVICES: ServiceConfig[] = [
  {
    titleKey: "micro_services_1_title",
    titleFallback: "Interactive Video Modules",
    descriptionKey: "micro_services_1_description",
    descriptionFallback: "Engaging video content with interactive elements and assessments",
    icon: Play,
    color: "from-blue-500 to-blue-600",
  },
  {
    titleKey: "micro_services_2_title",
    titleFallback: "Gamified Learning Paths",
    descriptionKey: "micro_services_2_description",
    descriptionFallback: "Game-based learning with rewards, badges, and progress tracking",
    icon: Gamepad2,
    color: "from-purple-500 to-purple-600",
  },
  {
    titleKey: "micro_services_3_title",
    titleFallback: "Mobile Learning Apps",
    descriptionKey: "micro_services_3_description",
    descriptionFallback: "Native mobile applications for learning on-the-go",
    icon: Smartphone,
    color: "from-green-500 to-green-600",
  },
  {
    titleKey: "micro_services_4_title",
    titleFallback: "Microlearning Assessments",
    descriptionKey: "micro_services_4_description",
    descriptionFallback: "Quick, focused assessments to reinforce learning objectives",
    icon: FileCheck,
    color: "from-orange-500 to-orange-600",
  },
  {
    titleKey: "micro_services_5_title",
    titleFallback: "Performance Support Tools",
    descriptionKey: "micro_services_5_description",
    descriptionFallback: "Just-in-time resources and job aids for immediate application",
    icon: Wrench,
    color: "from-red-500 to-red-600",
  },
  {
    titleKey: "micro_services_6_title",
    titleFallback: "Social Learning Features",
    descriptionKey: "micro_services_6_description",
    descriptionFallback: "Collaborative learning through discussions and peer interactions",
    icon: Share2,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    titleKey: "micro_services_7_title",
    titleFallback: "Adaptive Learning Paths",
    descriptionKey: "micro_services_7_description",
    descriptionFallback: "Personalized learning journeys based on individual progress",
    icon: Route,
    color: "from-teal-500 to-teal-600",
  },
  {
    titleKey: "micro_services_8_title",
    titleFallback: "Real-time Analytics",
    descriptionKey: "micro_services_8_description",
    descriptionFallback: "Comprehensive insights into learning progress and engagement",
    icon: TrendingUp,
    color: "from-pink-500 to-pink-600",
  },
  {
    titleKey: "micro_services_9_title",
    titleFallback: "Spaced Repetition Systems",
    descriptionKey: "micro_services_9_description",
    descriptionFallback: "Scientifically-backed repetition schedules for better retention",
    icon: Repeat,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    titleKey: "micro_services_10_title",
    titleFallback: "Multimedia Content",
    descriptionKey: "micro_services_10_description",
    descriptionFallback: "Rich media experiences with videos, animations, and audio",
    icon: Film,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    titleKey: "micro_services_11_title",
    titleFallback: "Interactive Simulations",
    descriptionKey: "micro_services_11_description",
    descriptionFallback: "Realistic scenarios and simulations for hands-on practice",
    icon: Settings,
    color: "from-emerald-500 to-emerald-600",
  },
]

const DEVELOPMENT_STEPS: StepConfig[] = [
  {
    step: "01",
    titleKey: "micro_process_step_1_title",
    titleFallback: "Content Analysis",
    descriptionKey: "micro_process_step_1_description",
    descriptionFallback:
      "We analyze your existing content and identify optimal micro-learning opportunities.",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    titleKey: "micro_process_step_2_title",
    titleFallback: "Module Design",
    descriptionKey: "micro_process_step_2_description",
    descriptionFallback:
      "Each module is designed with clear objectives and engaging interactive elements.",
    icon: Layers,
    color: "from-purple-500 to-purple-600",
  },
  {
    step: "03",
    titleKey: "micro_process_step_3_title",
    titleFallback: "Development & Testing",
    descriptionKey: "micro_process_step_3_description",
    descriptionFallback:
      "We develop and rigorously test each module for optimal user experience.",
    icon: Award,
    color: "from-green-500 to-green-600",
  },
  {
    step: "04",
    titleKey: "micro_process_step_4_title",
    titleFallback: "Deployment & Analytics",
    descriptionKey: "micro_process_step_4_description",
    descriptionFallback:
      "Seamless deployment with comprehensive analytics and performance tracking.",
    icon: BarChart,
    color: "from-orange-500 to-orange-600",
  },
]

const BENEFIT_LISTS: BulletListConfig[] = [
  {
    titleKey: "micro_benefits_learners_title",
    titleFallback: "For Learners",
    items: [
      { key: "micro_benefits_learners_item_1", fallback: "Flexible learning that fits busy schedules" },
      { key: "micro_benefits_learners_item_2", fallback: "Improved knowledge retention and recall" },
      { key: "micro_benefits_learners_item_3", fallback: "Immediate application of learned skills" },
      { key: "micro_benefits_learners_item_4", fallback: "Reduced cognitive overload" },
      { key: "micro_benefits_learners_item_5", fallback: "Enhanced engagement and motivation" },
    ],
  },
  {
    titleKey: "micro_benefits_org_title",
    titleFallback: "For Organizations",
    items: [
      { key: "micro_benefits_org_item_1", fallback: "Reduced training costs and time" },
      { key: "micro_benefits_org_item_2", fallback: "Higher completion rates" },
      { key: "micro_benefits_org_item_3", fallback: "Faster skill development" },
      { key: "micro_benefits_org_item_4", fallback: "Better ROI on training investments" },
      { key: "micro_benefits_org_item_5", fallback: "Scalable learning solutions" },
    ],
  },
]

export default function MicroLearningPage() {
  const { getContent } = usePageContent(PAGE_SLUG)

  const hero = {
    title: getContent("micro_hero_title", "Micro-Learning Solutions"),
    description: getContent(
      "micro_hero_description",
      "Bite-sized learning modules that deliver maximum impact in minimum time",
    ),
    buttonLabel: getContent("micro_hero_button", "Learn More"),
  }

  const intro = {
    heading: getContent("micro_intro_heading", "Transform Learning with Micro-Learning"),
    paragraphOne: getContent(
      "micro_intro_paragraph_1",
      "In today's fast-paced business environment, traditional lengthy training sessions are becoming obsolete. Swift Solution's micro-learning approach delivers targeted, bite-sized content that fits seamlessly into your employees' busy schedules while maximizing learning effectiveness.",
    ),
    paragraphTwo: getContent(
      "micro_intro_paragraph_2",
      "Our micro-learning modules are designed based on cognitive science principles, ensuring optimal knowledge retention and immediate application. Each module focuses on a single learning objective, making complex topics digestible and actionable.",
    ),
    whyTitle: getContent("micro_why_title", "Why Choose Our Micro-Learning?"),
  }

  const whyFeatures = HERO_STATS.map((feature) => ({
    title: getContent(feature.titleKey, feature.titleFallback),
    description: getContent(feature.descriptionKey, feature.descriptionFallback),
  }))

  const services = SERVICES.map((service) => ({
    title: getContent(service.titleKey, service.titleFallback),
    description: getContent(service.descriptionKey, service.descriptionFallback),
    icon: service.icon,
    color: service.color,
  }))

  const process = {
    heading: getContent("micro_process_heading", "Development Process"),
    description: getContent(
      "micro_process_description",
      "Our proven 4-step methodology ensures successful micro-learning implementation",
    ),
  }

  const steps = DEVELOPMENT_STEPS.map((step) => ({
    step: step.step,
    title: getContent(step.titleKey, step.titleFallback),
    description: getContent(step.descriptionKey, step.descriptionFallback),
    icon: step.icon,
    color: step.color,
  }))

  const servicesSection = {
    heading: getContent("micro_services_heading", "Our Micro-Learning Services"),
    description: getContent(
      "micro_services_description",
      "Comprehensive solutions designed to deliver engaging and effective micro-learning experiences",
    ),
  }

  const benefitsSection = {
    heading: getContent("micro_benefits_heading", "Benefits of Micro-Learning"),
  }

  const benefitLists = BENEFIT_LISTS.map((list) => ({
    title: getContent(list.titleKey, list.titleFallback),
    items: list.items.map((item) => getContent(item.key, item.fallback)),
  }))

  const faqTitle = getContent(
    "micro_faq_title",
    "Frequently Asked Questions (FAQs) about Micro-Learning",
  )

  const contactSection = {
    heading: getContent("micro_contact_heading", "Ready to Transform Your Training?"),
    description: getContent(
      "micro_contact_description",
      "Get in touch with our micro-learning experts to discuss your training needs.",
    ),
  }

  return (
    <div className="w-full">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMAGES/4. micro learning/download (1).png"
            alt={getContent(
              "micro_hero_image_alt",
              "Micro-Learning Solutions Background",
            )}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl mx-auto text-center"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">{hero.description}</p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const mainContent = document.getElementById("main-content")
                  mainContent?.scrollIntoView({ behavior: "smooth" })
                }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
              >
                {hero.buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="main-content" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              {intro.heading}
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 mb-6">{intro.paragraphOne}</p>
              <p className="text-gray-700 mb-6">{intro.paragraphTwo}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                {intro.whyTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DynamicFAQ
              pageSlug={PAGE_SLUG}
              title={faqTitle}
              className="mb-16"
            />

            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                  {servicesSection.heading}
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {servicesSection.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <service.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <div
                      className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">
                  {process.heading}
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {process.description}
                </p>
              </div>
              <div className="relative">
                <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {steps.map((step) => (
                    <div key={step.title} className="relative group">
                      <div
                        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {step.step}
                      </div>
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 pt-12 border border-gray-100 group-hover:-translate-y-2">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white mb-6 group-hover:scale-105 transition-transform duration-300`}
                        >
                          <step.icon className="h-8 w-8" />
                        </div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-gray-700 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
                {benefitsSection.heading}
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {benefitLists.map((list) => (
                    <div key={list.title}>
                      <h4 className="text-xl font-semibold mb-4 text-gray-900">
                        {list.title}
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        {list.items.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {contactSection.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {contactSection.description}
            </p>
          </div>
          <Contact />
        </div>
      </section>
    </div>
  )
}
