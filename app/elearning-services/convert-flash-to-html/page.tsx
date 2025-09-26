"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import {
  ArrowRight,
  CheckCircle,
  Award,
  BarChart,
  Layers,
  Users,
  Code,
} from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "convert-flash-to-html"

type IconComponent = React.ComponentType<{ className?: string }>

type FeatureConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type StepConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
}

const WHY_FEATURES: FeatureConfig[] = [
  {
    titleKey: "flash_why_feature_1_title",
    titleFallback: "Pixel-Perfect Conversion",
    descriptionKey: "flash_why_feature_1_description",
    descriptionFallback: "Maintain exact visual design and functionality",
  },
  {
    titleKey: "flash_why_feature_2_title",
    titleFallback: "Mobile Compatibility",
    descriptionKey: "flash_why_feature_2_description",
    descriptionFallback: "Works seamlessly on all devices and browsers",
  },
  {
    titleKey: "flash_why_feature_3_title",
    titleFallback: "SCORM Compliance",
    descriptionKey: "flash_why_feature_3_description",
    descriptionFallback: "Preserve LMS integration and tracking data",
  },
  {
    titleKey: "flash_why_feature_4_title",
    titleFallback: "Accessibility Improvements",
    descriptionKey: "flash_why_feature_4_description",
    descriptionFallback: "WCAG-friendly experiences for all learners",
  },
]

const PROCESS_STEPS: StepConfig[] = [
  {
    titleKey: "flash_process_step_1_title",
    titleFallback: "Content Audit",
    descriptionKey: "flash_process_step_1_description",
    descriptionFallback:
      "We evaluate your Flash assets, identify reusable components, and build a conversion roadmap.",
    icon: Users,
  },
  {
    titleKey: "flash_process_step_2_title",
    titleFallback: "Design Mapping",
    descriptionKey: "flash_process_step_2_description",
    descriptionFallback:
      "Our team recreates visual layouts and interactions with modern, responsive design patterns.",
    icon: Layers,
  },
  {
    titleKey: "flash_process_step_3_title",
    titleFallback: "HTML5 Development",
    descriptionKey: "flash_process_step_3_description",
    descriptionFallback:
      "We rebuild your experience using HTML5, CSS3, and JavaScript while preserving functionality.",
    icon: Code,
  },
  {
    titleKey: "flash_process_step_4_title",
    titleFallback: "Testing & Delivery",
    descriptionKey: "flash_process_step_4_description",
    descriptionFallback:
      "Rigorous multi-device, multi-browser testing ensures flawless delivery to your LMS or site.",
    icon: BarChart,
  },
]

const TECH_BENEFIT_KEYS = [
  "flash_benefits_tech_item_1",
  "flash_benefits_tech_item_2",
  "flash_benefits_tech_item_3",
  "flash_benefits_tech_item_4",
  "flash_benefits_tech_item_5",
  "flash_benefits_tech_item_6",
]

const BUSINESS_BENEFIT_KEYS = [
  "flash_benefits_business_item_1",
  "flash_benefits_business_item_2",
  "flash_benefits_business_item_3",
  "flash_benefits_business_item_4",
  "flash_benefits_business_item_5",
  "flash_benefits_business_item_6",
]

const CONTENT_TYPES: string[] = [
  "Interactive eLearning Courses",
  "Educational Games",
  "Training Simulations",
  "Product Demonstrations",
  "Assessment Tools",
  "Interactive Presentations",
  "Multimedia Tutorials",
  "Virtual Labs",
  "Scenario-Based Learning",
  "Interactive Infographics",
  "Learning Games",
  "Compliance Training",
]

export default function ConvertFlashToHtmlPage() {
  const { getContent } = usePageContent(PAGE_SLUG)

  const hero = {
    title: getContent("flash_hero_title", "Flash to HTML5 Conversion"),
    description: getContent(
      "flash_hero_description",
      "Modernize your legacy Flash content with seamless HTML5 conversion services",
    ),
    primaryCta: getContent("flash_hero_primary_cta", "Get Started"),
    secondaryCta: getContent("flash_hero_secondary_cta", "Learn More"),
    imageAlt: getContent(
      "flash_hero_image_alt",
      "Flash to HTML5 Conversion Background",
    ),
  }

  const intro = {
    heading: getContent(
      "flash_intro_heading",
      "Future-Proof Your eLearning Content",
    ),
    paragraphOne: getContent(
      "flash_intro_paragraph_1",
      "With Adobe Flash officially discontinued and no longer supported by modern browsers, organizations worldwide face the challenge of converting their valuable Flash-based eLearning content to modern, accessible formats. Swift Solution specializes in seamless Flash to HTML5 conversion that preserves your content's functionality while enhancing its accessibility and performance.",
    ),
    paragraphTwo: getContent(
      "flash_intro_paragraph_2",
      "Our expert team uses cutting-edge HTML5, CSS3, and JavaScript technologies to recreate your Flash content with pixel-perfect accuracy. We ensure that all animations, interactions, and multimedia elements are preserved while making your content mobile-friendly and future-proof.",
    ),
    whyTitle: getContent(
      "flash_why_title",
      "Why Choose Our Flash to HTML5 Conversion?",
    ),
  }

  const whyFeatures = WHY_FEATURES.map((feature) => ({
    title: getContent(feature.titleKey, feature.titleFallback),
    description: getContent(feature.descriptionKey, feature.descriptionFallback),
  }))

  const processSteps = PROCESS_STEPS.map((step) => ({
    title: getContent(step.titleKey, step.titleFallback),
    description: getContent(step.descriptionKey, step.descriptionFallback),
    icon: step.icon,
  }))

  const contentTypes = CONTENT_TYPES.map((item, index) =>
    getContent(`flash_content_type_${index + 1}`, item),
  )

  const faqTitle = getContent("flash_faq_title", "Frequently Asked Questions")

  const benefits = {
    heading: getContent("flash_benefits_heading", "Benefits of HTML5 Conversion"),
    techTitle: getContent("flash_benefits_tech_title", "Technical Benefits"),
    businessTitle: getContent("flash_benefits_business_title", "Business Benefits"),
  }

  const techBenefits = TECH_BENEFIT_KEYS.map((key, index) =>
    getContent(key, [
      "Cross-browser compatibility",
      "Mobile and tablet support",
      "Faster loading times",
      "Better security",
      "SEO-friendly content",
      "Accessibility compliance",
    ][index] ?? ""),
  )

  const businessBenefits = BUSINESS_BENEFIT_KEYS.map((key, index) =>
    getContent(key, [
      "Protect your content investment",
      "Reach mobile learners",
      "Reduce maintenance costs",
      "Improve user experience",
      "Future-proof your training",
      "Maintain SCORM compliance",
    ][index] ?? ""),
  )

  const contactSection = {
    heading: getContent(
      "flash_contact_heading",
      "Ready to Convert Your Flash Content?",
    ),
    description: getContent(
      "flash_contact_description",
      "Contact our conversion experts to discuss your Flash to HTML5 migration needs.",
    ),
  }

  return (
    <div className="w-full">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMAGES/3.custom learning/download (3).png"
            alt={hero.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl mx-auto text-center"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const contactSectionEl = document.getElementById("contact")
                  contactSectionEl?.scrollIntoView({ behavior: "smooth" })
                }}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
              >
                {hero.primaryCta}
                <span className="sr-only"> request conversion consultation</span>
              </button>
              <button
                onClick={() => {
                  const main = document.getElementById("main-content")
                  main?.scrollIntoView({ behavior: "smooth" })
                }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
              >
                {hero.secondaryCta}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {processSteps.map((step) => (
                <div
                  key={step.title}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-orange-50 p-3 rounded-full inline-block mb-4">
                    <step.icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h4>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
                {getContent("flash_content_types_heading", "Content Types We Convert")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contentTypes.map((type) => (
                  <div
                    key={type}
                    className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
                {benefits.heading}
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">
                      {benefits.techTitle}
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {techBenefits.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">
                      {benefits.businessTitle}
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {businessBenefits.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DynamicFAQ sectionId="faq" pageSlug={PAGE_SLUG} title={faqTitle} />

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
