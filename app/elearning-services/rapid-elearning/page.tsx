"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Award,
  BarChart,
  Layers,
  Users,
  Globe,
  Clock,
  Zap,
  Settings,
  FileText,
  Puzzle,
  Gamepad2,
  Smartphone,
  Share2,
  Route,
  TrendingUp,
  Repeat,
  Film,
  Server,
  User,
  Star,
  CheckCheck,
  ShieldCheck,
} from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "rapid-elearning"

type IconComponent = React.ComponentType<{ className?: string }>

type BenefitConfig = {
  icon: IconComponent
  bg: string
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type ToolConfig = {
  nameKey: string
  nameFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
}

type ChallengeConfig = {
  questionKey: string
  questionFallback: string
  answerKey: string
  answerFallback: string
  icon: IconComponent
}

type ProcessStepConfig = {
  step: string
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type WhyCardConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  icon: IconComponent
}

type FeatureListConfig = {
  titleKey: string
  titleFallback: string
  items: { key: string; fallback: string }[]
}

const BENEFITS: BenefitConfig[] = [
  {
    icon: Clock,
    bg: "from-orange-500 to-orange-600",
    titleKey: "rapid_benefit_1_title",
    titleFallback: "Accelerated Development Timeline",
    descriptionKey: "rapid_benefit_1_description",
    descriptionFallback:
      "Traditional custom e-learning can take months to develop. Our Bangalore-based rapid authoring approach reduces development time by 40-60%, allowing you to deploy critical training within weeks or even days depending on complexity.",
  },
  {
    icon: BarChart,
    bg: "from-orange-400 to-orange-500",
    titleKey: "rapid_benefit_2_title",
    titleFallback: "Cost-Effective Solution for Indian Businesses",
    descriptionKey: "rapid_benefit_2_description",
    descriptionFallback:
      "Rapid e-learning development typically costs 30-50% less than fully customized courses while maintaining high quality standards. This makes professional e-learning accessible for organizations with limited training budgets, providing exceptional value for Indian companies.",
  },
  {
    icon: CheckCheck,
    bg: "from-orange-500 to-orange-600",
    titleKey: "rapid_benefit_3_title",
    titleFallback: "Consistent Quality and Engagement",
    descriptionKey: "rapid_benefit_3_description",
    descriptionFallback:
      "Our rapid authoring tools include built-in interactive elements, assessment templates, and engagement features that ensure learner participation and knowledge retention without extensive custom programming. We maintain global quality standards while understanding local learning preferences.",
  },
  {
    icon: Zap,
    bg: "from-orange-400 to-orange-500",
    titleKey: "rapid_benefit_4_title",
    titleFallback: "Responsive Design for India's Mobile-First Workforce",
    descriptionKey: "rapid_benefit_4_description",
    descriptionFallback:
      "All our rapid e-learning content is automatically optimized for seamless performance across desktops, tablets, and mobile devices, ensuring your learners can access training anywhere, anytime—essential in India's mobile-first environment where over 70% of digital learning happens on smartphones.",
  },
  {
    icon: Settings,
    bg: "from-orange-500 to-orange-600",
    titleKey: "rapid_benefit_5_title",
    titleFallback: "Easy Updates and Maintenance",
    descriptionKey: "rapid_benefit_5_description",
    descriptionFallback:
      "When policies change or content needs updating, rapid authoring tools allow for quick modifications without rebuilding entire courses, saving you time and resources in the long run. This is particularly valuable for compliance training that must adapt to changing regulations.",
  },
]

const TOOLS: ToolConfig[] = [
  {
    nameKey: "rapid_tool_1_name",
    nameFallback: "Articulate 360 Suite",
    descriptionKey: "rapid_tool_1_description",
    descriptionFallback: "For highly interactive, scenario-based learning with advanced interactions",
    icon: Award,
  },
  {
    nameKey: "rapid_tool_2_name",
    nameFallback: "Adobe Captivate",
    descriptionKey: "rapid_tool_2_description",
    descriptionFallback: "For software simulation, complex interactions, and responsive design",
    icon: Puzzle,
  },
  {
    nameKey: "rapid_tool_3_name",
    nameFallback: "Lectora Inspire",
    descriptionKey: "rapid_tool_3_description",
    descriptionFallback: "For accessibility-compliant and text-heavy content with multilingual support",
    icon: FileText,
  },
  {
    nameKey: "rapid_tool_4_name",
    nameFallback: "iSpring Suite",
    descriptionKey: "rapid_tool_4_description",
    descriptionFallback: "For PowerPoint-based rapid conversion with minimal learning curve",
    icon: Layers,
  },
  {
    nameKey: "rapid_tool_5_name",
    nameFallback: "Elucidat",
    descriptionKey: "rapid_tool_5_description",
    descriptionFallback: "For collaborative, cloud-based development across distributed teams",
    icon: Users,
  },
  {
    nameKey: "rapid_tool_6_name",
    nameFallback: "Rise 360",
    descriptionKey: "rapid_tool_6_description",
    descriptionFallback: "For responsive, mobile-first learning experiences optimized for smartphones",
    icon: Smartphone,
  },
]

const CHALLENGES: ChallengeConfig[] = [
  {
    questionKey: "rapid_challenge_1_question",
    questionFallback: "Are you worried about meeting tight training deadlines?",
    answerKey: "rapid_challenge_1_answer",
    answerFallback:
      "Our Bangalore-based rapid development approach can reduce typical e-learning production timelines by up to 60%, helping you meet even the most challenging deadlines without sacrificing quality.",
    icon: Clock,
  },
  {
    questionKey: "rapid_challenge_2_question",
    questionFallback: "Concerned about managing costs while maintaining quality?",
    answerKey: "rapid_challenge_2_answer",
    answerFallback:
      "Rapid authoring reduces development costs significantly while leveraging reusable components and templates to maintain engaging learning experiences.",
    icon: BarChart,
  },
  {
    questionKey: "rapid_challenge_3_question",
    questionFallback: "Need to update content quickly for compliance?",
    answerKey: "rapid_challenge_3_answer",
    answerFallback:
      "Our rapid authoring workflow allows you to update modules in hours instead of weeks, keeping compliance training current and accurate.",
    icon: ShieldCheck,
  },
  {
    questionKey: "rapid_challenge_4_question",
    questionFallback: "Struggling to engage hybrid or remote teams?",
    answerKey: "rapid_challenge_4_answer",
    answerFallback:
      "We design mobile-ready, interactive micro-learning experiences that keep remote learners connected and motivated.",
    icon: Globe,
  },
]

const PROCESS_STEPS: ProcessStepConfig[] = [
  {
    step: "01",
    titleKey: "rapid_process_step_1_title",
    titleFallback: "Discovery & Analysis",
    descriptionKey: "rapid_process_step_1_description",
    descriptionFallback:
      "We identify your specific learning objectives, audience needs, and technical requirements within the first 48 hours, with special attention to Indian corporate training contexts.",
  },
  {
    step: "02",
    titleKey: "rapid_process_step_2_title",
    titleFallback: "Content Strategy",
    descriptionKey: "rapid_process_step_2_description",
    descriptionFallback:
      "Our instructional designers create an optimized content structure that maximizes engagement while ensuring all learning objectives are met, incorporating cultural nuances when needed.",
  },
  {
    step: "03",
    titleKey: "rapid_process_step_3_title",
    titleFallback: "Rapid Prototyping",
    descriptionKey: "rapid_process_step_3_description",
    descriptionFallback:
      "We develop a functional prototype using our rapid authoring tools within 3-5 business days for your review and feedback, allowing for early course correction.",
  },
  {
    step: "04",
    titleKey: "rapid_process_step_4_title",
    titleFallback: "Accelerated Development",
    descriptionKey: "rapid_process_step_4_description",
    descriptionFallback:
      "Our team leverages pre-built templates, interaction models, and assessment frameworks to expedite the development process while maintaining quality.",
  },
  {
    step: "05",
    titleKey: "rapid_process_step_5_title",
    titleFallback: "Quality Assurance",
    descriptionKey: "rapid_process_step_5_description",
    descriptionFallback:
      "Every course undergoes comprehensive testing for functionality, accessibility, and instructional effectiveness across multiple devices and platforms.",
  },
  {
    step: "06",
    titleKey: "rapid_process_step_6_title",
    titleFallback: "Deployment Support",
    descriptionKey: "rapid_process_step_6_description",
    descriptionFallback:
      "We ensure smooth implementation on your learning management system (LMS) or provide hosting solutions if needed, with technical support from our Bangalore office.",
  },
]

const WHY_CARDS: WhyCardConfig[] = [
  {
    titleKey: "rapid_why_card_1_title",
    titleFallback: "Certified Experts",
    descriptionKey: "rapid_why_card_1_description",
    descriptionFallback:
      "Our developers hold advanced certifications in all major rapid authoring tools with regular skill upgrades.",
    icon: Award,
  },
  {
    titleKey: "rapid_why_card_2_title",
    titleFallback: "Instructional Design Excellence",
    descriptionKey: "rapid_why_card_2_description",
    descriptionFallback:
      "Degreed instructional designers with 10+ years average experience in Indian corporate training contexts.",
    icon: User,
  },
  {
    titleKey: "rapid_why_card_3_title",
    titleFallback: "Industry Recognition",
    descriptionKey: "rapid_why_card_3_description",
    descriptionFallback:
      "Award-winning e-learning solutions recognized for innovation and effectiveness by Brandon Hall and eLearning Industry.",
    icon: Star,
  },
  {
    titleKey: "rapid_why_card_4_title",
    titleFallback: "Proven Track Record",
    descriptionKey: "rapid_why_card_4_description",
    descriptionFallback: "500+ successful rapid e-learning implementations across diverse industries in India and globally.",
    icon: CheckCheck,
  },
  {
    titleKey: "rapid_why_card_5_title",
    titleFallback: "Technical Versatility",
    descriptionKey: "rapid_why_card_5_description",
    descriptionFallback:
      "Experience with all major LMS platforms and technical environments common in Indian corporate settings.",
    icon: Server,
  },
  {
    titleKey: "rapid_why_card_6_title",
    titleFallback: "Local Understanding",
    descriptionKey: "rapid_why_card_6_description",
    descriptionFallback:
      "Deep knowledge of Indian business practices, compliance requirements, and cultural nuances.",
    icon: Globe,
  },
]

const MULTILINGUAL_LIST: FeatureListConfig = {
  titleKey: "rapid_multilingual_title",
  titleFallback: "Multilingual Support for Indian and Global Audiences",
  items: [
    {
      key: "rapid_multilingual_item_1",
      fallback: "Content development in all major Indian languages including Hindi, Tamil, Telugu, Kannada, Bengali, and more",
    },
    {
      key: "rapid_multilingual_item_2",
      fallback: "Culturally appropriate localization, not just translation",
    },
    {
      key: "rapid_multilingual_item_3",
      fallback: "Single-source development for efficient multilingual deployment",
    },
    {
      key: "rapid_multilingual_item_4",
      fallback: "Voice-over services with native speakers",
    },
    {
      key: "rapid_multilingual_item_5",
      fallback: "Cultural adaptation of examples, scenarios, and visuals",
    },
  ],
}

const MULTILINGUAL_SECTION = {
  headingKey: "rapid_multilingual_heading",
  headingFallback: "Multilingual Support for Indian and Global Audiences",
  descriptionKey: "rapid_multilingual_description",
  descriptionFallback:
    "We offer comprehensive multilingual e-learning development to support India's diverse linguistic landscape:",
  imageAltKey: "rapid_multilingual_image_alt",
  imageAltFallback: "Multilingual E-Learning Development",
  labelKey: "rapid_multilingual_label",
  labelFallback: "Multilingual Solutions",
}

const CTA = {
  headingKey: "rapid_cta_heading",
  headingFallback: "Ready to Transform Your E-Learning Development?",
  descriptionKey: "rapid_cta_description",
  descriptionFallback:
    "We focus on e-learning solutions so that you can focus on your business. Our rapid e-learning development services provide the perfect balance of speed, quality, and cost-effectiveness.",
  primaryLabelKey: "rapid_cta_primary_label",
  primaryLabelFallback: "Contact Us Today",
  secondaryLabelKey: "rapid_cta_secondary_label",
  secondaryLabelFallback: "Get a Free Sample",
  secondaryHrefKey: "rapid_cta_secondary_href",
  secondaryHrefFallback: "#",
}

export default function RapidElearningPage() {
  const { getContent } = usePageContent(PAGE_SLUG)

  const hero = {
    title: getContent(
      "rapid_hero_title",
      "Custom E-Learning Content Development Using Rapid Authoring Tools in Bangalore",
    ),
    description: getContent(
      "rapid_hero_description",
      "Transform Your Training with Fast, Flexible, and Effective E-Learning Solutions from India's Leading Rapid Development Experts",
    ),
    secondaryDescription: getContent(
      "rapid_hero_secondary_description",
      "Are you struggling to deploy high-quality e-learning content within tight deadlines? Based in Bangalore, our expert team specializes in custom e-learning content development using rapid authoring tools that deliver engaging, interactive learning experiences without compromising quality or extending timelines.",
    ),
  }

  const benefitsHeading = getContent(
    "rapid_benefits_heading",
    "Why Choose Rapid Authoring Tools for Your E-Learning Content?",
  )
  const benefitsDescription = getContent(
    "rapid_benefits_description",
    "Our rapid development approach delivers high-quality training solutions in a fraction of the time and cost of traditional methods.",
  )

  const processIntro = {
    heading: getContent(
      "rapid_process_heading",
      "Our Rapid E-Learning Development Process",
    ),
    description: getContent(
      "rapid_process_description",
      "We've refined our rapid e-learning development methodology to deliver maximum value while minimizing development time.",
    ),
  }

  const multilingualList = MULTILINGUAL_LIST.items.map((item) =>
    getContent(item.key, item.fallback),
  )

  const multilingualSection = {
    heading: getContent(
      MULTILINGUAL_SECTION.headingKey,
      MULTILINGUAL_SECTION.headingFallback,
    ),
    description: getContent(
      MULTILINGUAL_SECTION.descriptionKey,
      MULTILINGUAL_SECTION.descriptionFallback,
    ),
    imageAlt: getContent(
      MULTILINGUAL_SECTION.imageAltKey,
      MULTILINGUAL_SECTION.imageAltFallback,
    ),
    label: getContent(
      MULTILINGUAL_SECTION.labelKey,
      MULTILINGUAL_SECTION.labelFallback,
    ),
  }

  const challengesHeading = getContent(
    "rapid_challenges_heading",
    "Common Challenges Solved by Rapid E-Learning",
  )
  const challengesDescription = getContent(
    "rapid_challenges_description",
    "Our rapid development approach addresses the most common obstacles faced by organizations implementing e-learning programs.",
  )

  const whySection = {
    heading: getContent(
      "rapid_why_heading",
      "Why Choose Swift Solution in Bangalore for Your Rapid E-Learning Development?",
    ),
    description: getContent(
      "rapid_why_description",
      "With over 20 years of specialized experience in e-learning content development in India, our team brings unmatched expertise to your training challenges.",
    ),
  }

  const ctaSection = {
    heading: getContent(CTA.headingKey, CTA.headingFallback),
    description: getContent(CTA.descriptionKey, CTA.descriptionFallback),
    primaryLabel: getContent(CTA.primaryLabelKey, CTA.primaryLabelFallback),
    secondaryLabel: getContent(CTA.secondaryLabelKey, CTA.secondaryLabelFallback),
    secondaryHref: getContent(CTA.secondaryHrefKey, CTA.secondaryHrefFallback),
  }

  const contactSection = {
    heading: getContent("rapid_contact_heading", "Contact Us"),
    description: getContent(
      "rapid_contact_description",
      "Get in touch with our team to discuss how our rapid e-learning development services can help you meet your training objectives.",
    ),
  }

  const benefits = BENEFITS.map((benefit) => ({
    icon: benefit.icon,
    bg: benefit.bg,
    title: getContent(benefit.titleKey, benefit.titleFallback),
    description: getContent(benefit.descriptionKey, benefit.descriptionFallback),
  }))

  const tools = TOOLS.map((tool) => ({
    name: getContent(tool.nameKey, tool.nameFallback),
    description: getContent(tool.descriptionKey, tool.descriptionFallback),
    icon: tool.icon,
  }))

  const challenges = CHALLENGES.map((challenge) => ({
    question: getContent(challenge.questionKey, challenge.questionFallback),
    answer: getContent(challenge.answerKey, challenge.answerFallback),
    icon: challenge.icon,
  }))

  const processSteps = PROCESS_STEPS.map((step) => ({
    step: step.step,
    title: getContent(step.titleKey, step.titleFallback),
    description: getContent(step.descriptionKey, step.descriptionFallback),
  }))

  const whyCards = WHY_CARDS.map((card) => ({
    title: getContent(card.titleKey, card.titleFallback),
    description: getContent(card.descriptionKey, card.descriptionFallback),
    icon: card.icon,
  }))

  const faqTitle = getContent(
    "rapid_faq_title",
    "Frequently Asked Questions (FAQs) about Rapid E-Learning Development",
  )

  return (
    <div className="w-full">
      <section className="relative text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMAGES/8.Rapid elearning/download (1).png"
            alt={getContent(
              "rapid_hero_image_alt",
              "Rapid eLearning Development Background",
            )}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl mb-8 text-orange-100">{hero.description}</p>
            <p className="text-lg mb-8 text-orange-100">
              {hero.secondaryDescription}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200"
              >
                {getContent("rapid_hero_primary_cta", "Get Started")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#benefits"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200"
              >
                {getContent("rapid_hero_secondary_cta", "Learn More")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="benefits" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb 12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {benefitsHeading}
            </h2>
            <p className="text-lg text-gray-700">{benefitsDescription}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div
                  className={`p-6 bg-gradient-to-r ${benefit.bg} flex items-center justify-center`}
                >
                  <benefit.icon className="h-12 w-12 text-white" />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {processIntro.heading}
            </h2>
            <p className="text-lg text-gray-700">{processIntro.description}</p>
          </motion.div>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-lg text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-700">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {getContent(
                "rapid_tools_heading",
                "Tools We Use for Rapid E-Learning Development",
              )}
            </h2>
            <p className="text-lg text-gray-700">
              {getContent(
                "rapid_tools_description",
                "Our expertise spans the industry’s leading rapid authoring platforms, enabling us to match the right tool with your training needs.",
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <tool.icon className="h-10 w-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {tool.name}
                </h3>
                <p className="text-gray-700">{tool.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-gray-700 max-w-3xl mx-auto">
              {getContent(
                "rapid_tools_footer",
                "We select the optimal tool based on your specific learning objectives, technical requirements, and deployment environment. Our team holds official certifications in all major platforms, ensuring expert implementation.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {multilingualSection.heading}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {multilingualSection.description}
              </p>
              <ul className="space-y-3 text-gray-700">
                {multilingualList.map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <Image
                  src="/IMAGES/8.Rapid elearning/download (4).png"
                  alt={multilingualSection.imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {multilingualSection.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="challenges" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {challengesHeading}
            </h2>
            <p className="text-lg text-gray-700">{challengesDescription}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.question}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <challenge.icon className="h-12 w-12 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {challenge.question}
                    </h3>
                    <p className="text-gray-700">{challenge.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {whySection.heading}
            </h2>
            <p className="text-lg text-gray-700">{whySection.description}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whyCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <card.icon className="h-10 w-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-700">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DynamicFAQ sectionId="faq" pageSlug={PAGE_SLUG} title={faqTitle} className="py-16 bg-white" />

      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">{ctaSection.heading}</h2>
            <p className="text-xl mb-8 text-orange-100">
              {ctaSection.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200"
              >
                {ctaSection.primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href={ctaSection.secondaryHref || "#"}
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 border border-white text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
              >
                {ctaSection.secondaryLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {contactSection.heading}
              </h2>
              <p className="text-lg text-gray-700">
                {contactSection.description}
              </p>
            </div>
            <Contact />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
