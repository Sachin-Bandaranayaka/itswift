"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import {
  ArrowRight,
  CheckCircle,
  Award,
  Users,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "ai-powered-solutions"

type IconComponent = React.ComponentType<{ className?: string }>

type HeroStatConfig = {
  valueKey: string
  valueFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
}

type BulletConfig = {
  labelKey: string
  labelFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type SimpleBulletConfig = {
  key: string
  fallback: string
}

type CardConfig = {
  icon: IconComponent
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  subheadingKey: string
  subheadingFallback: string
  bullets: SimpleBulletConfig[]
}

type JourneyPointConfig = {
  labelKey: string
  labelFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
}

type HighlightPointConfig = JourneyPointConfig

const HERO_STATS: HeroStatConfig[] = [
  {
    valueKey: "ai_hero_stat_1_value",
    valueFallback: "3x",
    descriptionKey: "ai_hero_stat_1_description",
    descriptionFallback: "Increase in learner engagement with AI-personalized content",
    icon: Target,
  },
  {
    valueKey: "ai_hero_stat_2_value",
    valueFallback: "65%",
    descriptionKey: "ai_hero_stat_2_description",
    descriptionFallback: "Reduction in content development time using generative AI",
    icon: TrendingUp,
  },
  {
    valueKey: "ai_hero_stat_3_value",
    valueFallback: "90%",
    descriptionKey: "ai_hero_stat_3_description",
    descriptionFallback: "Learner satisfaction score across AI-driven learning journeys",
    icon: Users,
  },
]

const VISION_POINTS: BulletConfig[] = [
  {
    labelKey: "ai_intro_point_1_title",
    labelFallback: "From Push to Pull:",
    descriptionKey: "ai_intro_point_1_description",
    descriptionFallback:
      "We recognize that traditional, push-based learning models are inadequate for the modern workforce. Our focus is on developing pull-based, personalized, and just-in-time learning solutions that meet the preferences of today's learners, including Gen Z.",
  },
  {
    labelKey: "ai_intro_point_2_title",
    labelFallback: "An Industry Bridge-Builder:",
    descriptionKey: "ai_intro_point_2_description",
    descriptionFallback:
      "We are uniquely positioned to bridge the gap between traditional L&D expertise and cutting-edge AI capabilities. We preserve valuable industry knowledge while integrating technology to create superior, human-centric solutions.",
  },
  {
    labelKey: "ai_intro_point_3_title",
    labelFallback: "Responsible Transformation:",
    descriptionKey: "ai_intro_point_3_description",
    descriptionFallback:
      "Our integration of AI with ethical practices provides a model for responsible innovation. We demonstrate how technology can enhance human capabilities and address market needs without causing technological displacement.",
  },
]

const AI_SOLUTION_CARDS: CardConfig[] = [
  {
    icon: Target,
    titleKey: "ai_solution_personalized_title",
    titleFallback: "Hyper-Personalized Learning Paths",
    descriptionKey: "ai_solution_personalized_description",
    descriptionFallback:
      "Our AI engine analyzes individual learner data—including performance, job role, and career aspirations—to create truly personalized learning paths. This ensures that every employee receives the right training at the right time, maximizing engagement and knowledge retention.",
    subheadingKey: "ai_solution_personalized_subheading",
    subheadingFallback: "We leverage:",
    bullets: [
      {
        key: "ai_solution_personalized_bullet_1",
        fallback: "Adaptive Learning Algorithms: To adjust content difficulty and sequence in real-time",
      },
      {
        key: "ai_solution_personalized_bullet_2",
        fallback: "Skills Gap Analysis: To identify and address individual and team-level competency gaps",
      },
      {
        key: "ai_solution_personalized_bullet_3",
        fallback: "Career Pathing: To align learning with long-term career goals",
      },
    ],
  },
  {
    icon: Lightbulb,
    titleKey: "ai_solution_generative_title",
    titleFallback: "Generative AI: Accelerating Content Creation",
    descriptionKey: "ai_solution_generative_description",
    descriptionFallback:
      "Swift Solution utilizes state-of-the-art generative AI models to revolutionize content creation. This allows us to develop high-quality, customized training materials at an unprecedented speed, reducing development time and costs without compromising on quality.",
    subheadingKey: "ai_solution_generative_subheading",
    subheadingFallback: "Our generative AI capabilities include:",
    bullets: [
      {
        key: "ai_solution_generative_bullet_1",
        fallback: "Automated Course Creation: Generating entire courses from your existing documents",
      },
      {
        key: "ai_solution_generative_bullet_2",
        fallback: "Dynamic Content Updates: Automatically updating content to reflect latest trends",
      },
      {
        key: "ai_solution_generative_bullet_3",
        fallback: "Realistic Simulations: Creating immersive, branching scenarios for hands-on learning",
      },
      {
        key: "ai_solution_generative_bullet_4",
        fallback: "Multilingual Content Generation: Instantly translating and localizing content",
      },
    ],
  },
  {
    icon: Users,
    titleKey: "ai_solution_tutoring_title",
    titleFallback: "Intelligent Tutoring Systems",
    descriptionKey: "ai_solution_tutoring_description",
    descriptionFallback:
      "Our intelligent tutoring systems provide learners with instant, personalized feedback and support, acting as a 24/7 learning coach. This ensures that employees can get the help they need exactly when they need it, improving comprehension and confidence.",
    subheadingKey: "ai_solution_tutoring_subheading",
    subheadingFallback: "Key features include:",
    bullets: [
      {
        key: "ai_solution_tutoring_bullet_1",
        fallback: "Real-Time Feedback: Providing immediate, constructive feedback on assessments",
      },
      {
        key: "ai_solution_tutoring_bullet_2",
        fallback: "Personalized Recommendations: Suggesting relevant resources and learning materials",
      },
      {
        key: "ai_solution_tutoring_bullet_3",
        fallback: "Socratic Dialogue: Engaging learners in a conversational manner to deepen understanding",
      },
    ],
  },
  {
    icon: TrendingUp,
    titleKey: "ai_solution_analytics_title",
    titleFallback: "Predictive Analytics for L&D Strategy",
    descriptionKey: "ai_solution_analytics_description",
    descriptionFallback:
      "Move from reactive to proactive training with our powerful predictive analytics engine. We analyze learning data to identify trends, predict future needs, and provide actionable insights that inform your L&D strategy.",
    subheadingKey: "ai_solution_analytics_subheading",
    subheadingFallback: "Our predictive analytics capabilities enable you to:",
    bullets: [
      {
        key: "ai_solution_analytics_bullet_1",
        fallback: "Identify At-Risk Learners: Proactively intervene to support struggling employees",
      },
      {
        key: "ai_solution_analytics_bullet_2",
        fallback: "Forecast Future Skills Gaps: Align your training programs with future business needs",
      },
      {
        key: "ai_solution_analytics_bullet_3",
        fallback: "Optimize Training ROI: Make data-driven decisions to maximize training budget impact",
      },
    ],
  },
]

const JOURNEY_POINTS: JourneyPointConfig[] = [
  {
    labelKey: "ai_edge_journey_point_1_title",
    labelFallback: "A Systematic Journey:",
    descriptionKey: "ai_edge_journey_point_1_description",
    descriptionFallback:
      "Beginning in April 2023 with the adoption of ChatGPT for scriptwriting, our journey progressed through six distinct phases.",
    icon: Zap,
  },
  {
    labelKey: "ai_edge_journey_point_2_title",
    labelFallback: "Ecosystem Consolidation:",
    descriptionKey: "ai_edge_journey_point_2_description",
    descriptionFallback:
      "In 2025, we strategically consolidated our toolset around the Google ecosystem, fully transitioning to Gemini to enhance efficiency and optimize costs.",
    icon: Zap,
  },
  {
    labelKey: "ai_edge_journey_point_3_title",
    labelFallback: "Comprehensive Integration:",
    descriptionKey: "ai_edge_journey_point_3_description",
    descriptionFallback:
      "Today, AI is fully integrated into our core processes, including instructional design, storyboards, media planning, scheduling, and client management.",
    icon: Zap,
  },
]

const PHILOSOPHY_POINTS: HighlightPointConfig[] = [
  {
    labelKey: "ai_edge_philosophy_point_1_title",
    labelFallback: "Human-AI Collaboration:",
    descriptionKey: "ai_edge_philosophy_point_1_description",
    descriptionFallback:
      "Our approach is centered on human augmentation, not replacement. AI generates, but human experts validate and review.",
    icon: Award,
  },
  {
    labelKey: "ai_edge_philosophy_point_2_title",
    labelFallback: "Measurable Results:",
    descriptionKey: "ai_edge_philosophy_point_2_description",
    descriptionFallback:
      "This transformation has led to 60-70% efficiency gains in content preparation while maintaining or improving service quality.",
    icon: Award,
  },
]

export default function AIPoweredSolutionsPage() {
  const { getContent } = usePageContent(PAGE_SLUG)

  const heroContent = {
    title: getContent(
      "ai_hero_title",
      "AI-Powered eLearning Solutions: Revolutionizing Corporate Training in Bangalore",
    ),
    description: getContent(
      "ai_hero_description",
      "We are not just an eLearning company; we are your strategic partner in building a future-ready workforce. Our AI-powered solutions deliver personalized, adaptive, and engaging learning experiences that drive unprecedented growth and ROI.",
    ),
    primaryCta: getContent("ai_hero_primary_cta", "Schedule a Free AI Solutions Demo"),
    secondaryCta: getContent("ai_hero_secondary_cta", "Explore AI Solutions"),
    imageAlt: getContent("ai_hero_image_alt", "AI-Powered eLearning Solutions"),
  }

  const introSection = {
    heading: getContent(
      "ai_intro_heading",
      "Embrace the Future of Learning with the Top AI-Enabled eLearning Company in Bangalore",
    ),
    visionTitle: getContent(
      "ai_intro_vision_title",
      "Our Vision: Leading the Evolution of Learning",
    ),
    visionDescription: getContent(
      "ai_intro_vision_description",
      "Our strategy is shaped by a deep understanding of market dynamics and a clear vision for the future of learning.",
    ),
    highlightTitle: getContent(
      "ai_intro_highlight_title",
      "AI-Powered Learning Revolution",
    ),
    highlightDescription: getContent(
      "ai_intro_highlight_description",
      "As a pioneering AI-enabled eLearning solutions company in Bangalore, Swift Solution is leading the charge, moving beyond traditional, one-size-fits-all training to deliver intelligent, personalized, and highly effective learning experiences.",
    ),
  }

  const heroStats = HERO_STATS.map((stat) => ({
    value: getContent(stat.valueKey, stat.valueFallback),
    description: getContent(stat.descriptionKey, stat.descriptionFallback),
    icon: stat.icon,
  }))

  const visionPoints = VISION_POINTS.map((point) => ({
    label: getContent(point.labelKey, point.labelFallback),
    description: getContent(point.descriptionKey, point.descriptionFallback),
  }))

  const aiSolutionsSection = {
    heading: getContent(
      "ai_solutions_heading",
      "Our AI-Powered eLearning Solutions: A Deep Dive",
    ),
    description: getContent(
      "ai_solutions_description",
      "Discover our specific AI-powered offerings, showcasing our technical expertise and the tangible benefits for your business.",
    ),
  }

  const aiSolutionCards = AI_SOLUTION_CARDS.map((card) => ({
    icon: card.icon,
    title: getContent(card.titleKey, card.titleFallback),
    description: getContent(card.descriptionKey, card.descriptionFallback),
    subheading: getContent(card.subheadingKey, card.subheadingFallback),
    bullets: card.bullets.map((bullet) => getContent(bullet.key, bullet.fallback)),
  }))

  const aiEdgeSection = {
    heading: getContent(
      "ai_edge_heading",
      "The Undisputed Leader in AI-Powered eLearning in Bangalore",
    ),
    subheading: getContent(
      "ai_edge_subheading",
      "Our Edge: Authentic AI-Powered Transformation",
    ),
    description: getContent(
      "ai_edge_description",
      "We are a pioneer in the authentic implementation of AI within the L&D industry. Our systematic, two-year AI transformation journey is not a theoretical exercise, but a practical integration validated by enterprise client acceptance.",
    ),
    journeyTitle: getContent("ai_edge_journey_title", "Our Journey"),
    philosophyTitle: getContent(
      "ai_edge_philosophy_title",
      "Our Philosophy & Results",
    ),
  }

  const journeyPoints = JOURNEY_POINTS.map((point) => ({
    title: getContent(point.labelKey, point.labelFallback),
    description: getContent(point.descriptionKey, point.descriptionFallback),
    icon: point.icon,
  }))

  const philosophyPoints = PHILOSOPHY_POINTS.map((point) => ({
    title: getContent(point.labelKey, point.labelFallback),
    description: getContent(point.descriptionKey, point.descriptionFallback),
    icon: point.icon,
  }))

  const faqTitle = getContent(
    "ai_faq_title",
    "Your Questions About AI in eLearning, Answered",
  )

  const ctaSection = {
    heading: getContent(
      "ai_cta_heading",
      "Ready to Build a Smarter Workforce? Let's Talk.",
    ),
    description: getContent(
      "ai_cta_description",
      "Partner with the leading AI-enabled eLearning solutions company in Bangalore and unlock the full potential of your workforce. Contact us today for a free demo and discover how our AI-powered solutions can transform your corporate training and drive unprecedented business growth.",
    ),
    buttonLabel: getContent("ai_cta_button", "Get Free Demo"),
  }

  const heroStatDisplay = heroStats.filter((stat) => stat.value)

  return (
    <div className="w-full">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ai powered elearning solutions.jpg"
            alt={heroContent.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl mb-8 text-blue-100">{heroContent.description}</p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
              >
                {heroContent.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="#ai-solutions"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200"
              >
                {heroContent.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {heroStatDisplay.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroStatDisplay.map((stat) => (
                <div
                  key={stat.value}
                  className="bg-blue-50 rounded-xl p-6 text-center shadow-sm"
                >
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-blue-900/80 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              {introSection.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                {introSection.visionTitle}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {introSection.visionDescription}
              </p>
              <ul className="space-y-4">
                {visionPoints.map((point) => (
                  <li key={point.label} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>{point.label}</strong> {point.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <Brain className="h-16 w-16 text-blue-200 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-center">
                  {introSection.highlightTitle}
                </h3>
                <p className="text-center text-blue-100">
                  {introSection.highlightDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-solutions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {aiSolutionsSection.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {aiSolutionsSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {aiSolutionCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <card.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-700 mb-4">{card.description}</p>
                <h4 className="font-semibold mb-2 text-gray-900">
                  {card.subheading}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {aiEdgeSection.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {aiEdgeSection.subheading}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6">
              {aiEdgeSection.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {aiEdgeSection.journeyTitle}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {journeyPoints.map((point) => (
                    <li key={point.title} className="flex items-start">
                      <point.icon className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>{point.title}</strong> {point.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {aiEdgeSection.philosophyTitle}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {philosophyPoints.map((point) => (
                    <li key={point.title} className="flex items-start">
                      <point.icon className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>{point.title}</strong> {point.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DynamicFAQ sectionId="faq" pageSlug={PAGE_SLUG} title={faqTitle} />

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{ctaSection.heading}</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {ctaSection.description}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const contactSection = document.getElementById("contact")
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              {ctaSection.buttonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <Contact />
      </section>
    </div>
  )
}
