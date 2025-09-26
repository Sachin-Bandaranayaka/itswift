"use client"

import React from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import DynamicFAQ from "@/components/dynamic-faq"
import {
  ArrowRight,
  CheckCircle,
  BarChart,
  Users,
  Target,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "custom-elearning"

type IconComponent = React.ComponentType<{ className?: string }>

type StatConfig = {
  valueKey: string
  valueFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type HighlightStatConfig = {
  titleKey: string
  titleFallback: string
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

type IconStatConfig = StatConfig & { icon: IconComponent }

const HERO_STAT_CONFIGS: IconStatConfig[] = [
  {
    valueKey: "custom_hero_stat_1_value",
    valueFallback: "85% Higher",
    descriptionKey: "custom_hero_stat_1_description",
    descriptionFallback: "Completion rates compared to generic training",
    icon: TrendingUp,
  },
  {
    valueKey: "custom_hero_stat_2_value",
    valueFallback: "70% Improvement",
    descriptionKey: "custom_hero_stat_2_description",
    descriptionFallback: "In knowledge retention and application",
    icon: Target,
  },
  {
    valueKey: "custom_hero_stat_3_value",
    valueFallback: "60% Faster",
    descriptionKey: "custom_hero_stat_3_description",
    descriptionFallback: "Time-to-competency for new employees",
    icon: Clock,
  },
  {
    valueKey: "custom_hero_stat_4_value",
    valueFallback: "90% Satisfaction",
    descriptionKey: "custom_hero_stat_4_description",
    descriptionFallback: "Learner satisfaction with relevant, engaging content",
    icon: Users,
  },
]

const BESPOKE_POINT_CONFIGS: BulletConfig[] = [
  {
    labelKey: "custom_bespoke_point_1_title",
    labelFallback: "Industry-Specific Content Creation:",
    descriptionKey: "custom_bespoke_point_1_description",
    descriptionFallback: "Tailored materials for healthcare, finance, manufacturing, IT, retail, and other sectors",
  },
  {
    labelKey: "custom_bespoke_point_2_title",
    labelFallback: "Brand-Aligned Design:",
    descriptionKey: "custom_bespoke_point_2_description",
    descriptionFallback: "Courses that reflect your corporate identity, colors, fonts, and visual style",
  },
  {
    labelKey: "custom_bespoke_point_3_title",
    labelFallback: "Role-Based Learning Paths:",
    descriptionKey: "custom_bespoke_point_3_description",
    descriptionFallback: "Customized training sequences for different job functions and seniority levels",
  },
  {
    labelKey: "custom_bespoke_point_4_title",
    labelFallback: "Scenario-Based Learning:",
    descriptionKey: "custom_bespoke_point_4_description",
    descriptionFallback: "Real workplace situations and challenges specific to your industry",
  },
  {
    labelKey: "custom_bespoke_point_5_title",
    labelFallback: "Custom Assessment Development:",
    descriptionKey: "custom_bespoke_point_5_description",
    descriptionFallback: "Evaluations that measure job-relevant skills and knowledge",
  },
  {
    labelKey: "custom_bespoke_point_6_title",
    labelFallback: "Interactive Simulations:",
    descriptionKey: "custom_bespoke_point_6_description",
    descriptionFallback: "Practice environments that mirror your actual work processes",
  },
]

const BUSINESS_IMPACT_CONFIGS: HighlightStatConfig[] = [
  {
    titleKey: "custom_impact_stat_1_title",
    titleFallback: "85% higher completion rates",
    descriptionKey: "custom_impact_stat_1_description",
    descriptionFallback: "compared to generic training",
    icon: TrendingUp,
  },
  {
    titleKey: "custom_impact_stat_2_title",
    titleFallback: "70% improvement",
    descriptionKey: "custom_impact_stat_2_description",
    descriptionFallback: "in knowledge retention and application",
    icon: Target,
  },
  {
    titleKey: "custom_impact_stat_3_title",
    titleFallback: "60% faster time-to-competency",
    descriptionKey: "custom_impact_stat_3_description",
    descriptionFallback: "for new employees",
    icon: Clock,
  },
  {
    titleKey: "custom_impact_stat_4_title",
    titleFallback: "90% learner satisfaction",
    descriptionKey: "custom_impact_stat_4_description",
    descriptionFallback: "with relevant, engaging content",
    icon: Users,
  },
]

const AI_CAPABILITY_CONFIGS: BulletConfig[] = [
  {
    labelKey: "custom_ai_capability_1_title",
    labelFallback: "Intelligent Content Structuring:",
    descriptionKey: "custom_ai_capability_1_description",
    descriptionFallback: "AI-assisted organization of custom content for optimal learning flow",
  },
  {
    labelKey: "custom_ai_capability_2_title",
    labelFallback: "Automated Quality Assurance:",
    descriptionKey: "custom_ai_capability_2_description",
    descriptionFallback: "AI-powered review of custom content for consistency and accuracy",
  },
  {
    labelKey: "custom_ai_capability_3_title",
    labelFallback: "Personalization Engine:",
    descriptionKey: "custom_ai_capability_3_description",
    descriptionFallback: "AI-driven adaptation of custom courses to individual learning preferences",
  },
  {
    labelKey: "custom_ai_capability_4_title",
    labelFallback: "Smart Assessment Generation:",
    descriptionKey: "custom_ai_capability_4_description",
    descriptionFallback: "AI-assisted creation of relevant questions based on your custom content",
  },
]

const AI_EFFICIENCY_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_ai_efficiency_1",
    fallback: "50% faster custom course development without quality compromise",
  },
  {
    key: "custom_ai_efficiency_2",
    fallback: "95% consistency in content quality across all custom modules",
  },
  {
    key: "custom_ai_efficiency_3",
    fallback: "Real-time optimization based on learner feedback and performance",
  },
  {
    key: "custom_ai_efficiency_4",
    fallback: "Automated compliance checking for industry-specific requirements",
  },
]

const AGILE_PHASE_ONE_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_agile_phase_1_point_1",
    fallback: "Stakeholder Interviews: In-depth discussions with key personnel and subject matter experts",
  },
  {
    key: "custom_agile_phase_1_point_2",
    fallback: "Learner Analysis: Comprehensive assessment of target audience needs and preferences",
  },
  {
    key: "custom_agile_phase_1_point_3",
    fallback: "Content Audit: Review of existing training materials and organizational knowledge",
  },
  {
    key: "custom_agile_phase_1_point_4",
    fallback: "Technical Requirements: Assessment of LMS capabilities and integration needs",
  },
  {
    key: "custom_agile_phase_1_point_5",
    fallback: "Success Metrics Definition: Clear, measurable objectives for training effectiveness",
  },
]

const AGILE_PHASE_TWO_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_agile_phase_2_point_1",
    fallback: "Learning Objective Development: SMART objectives aligned with business goals",
  },
  {
    key: "custom_agile_phase_2_point_2",
    fallback: "Content Structure Design: Logical flow and modular architecture",
  },
  {
    key: "custom_agile_phase_2_point_3",
    fallback: "Assessment Strategy: Custom evaluation methods and success criteria",
  },
  {
    key: "custom_agile_phase_2_point_4",
    fallback: "Interaction Design: Engaging elements specific to your content and audience",
  },
  {
    key: "custom_agile_phase_2_point_5",
    fallback: "Accessibility Planning: Compliance with WCAG guidelines and organizational needs",
  },
]

const AGILE_PHASE_THREE_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_agile_phase_3_point_1",
    fallback: "Rapid Prototyping: Quick iterations based on feedback",
  },
  {
    key: "custom_agile_phase_3_point_2",
    fallback: "Content Development: Custom multimedia and interactive elements",
  },
  {
    key: "custom_agile_phase_3_point_3",
    fallback: "Quality Assurance: Comprehensive testing across devices and platforms",
  },
  {
    key: "custom_agile_phase_3_point_4",
    fallback: "User Acceptance Testing: Stakeholder review and approval",
  },
  {
    key: "custom_agile_phase_3_point_5",
    fallback: "Deployment Support: LMS integration and launch assistance",
  },
  {
    key: "custom_agile_phase_3_point_6",
    fallback: "Post-Launch Optimization: Performance monitoring and improvements",
  },
]

const AGILE_DESIGN_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_agile_design_point_1",
    fallback: "Narrative-Driven Learning: Custom storytelling that reflects your organizational culture",
  },
  {
    key: "custom_agile_design_point_2",
    fallback: "Gamification Integration: Achievement systems and challenges tailored to your audience",
  },
  {
    key: "custom_agile_design_point_3",
    fallback: "Social Learning Features: Collaborative elements that encourage peer interaction",
  },
  {
    key: "custom_agile_design_point_4",
    fallback: "Microlearning Integration: Bite-sized modules that fit into busy work schedules",
  },
  {
    key: "custom_agile_design_point_5",
    fallback: "Mobile-First Design: Responsive courses optimized for all devices",
  },
]

const LMS_COMPATIBILITY_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_lms_point_1",
    fallback: "Enterprise LMS Platforms: Moodle, Blackboard, Canvas, Cornerstone OnDemand, Workday Learning",
  },
  {
    key: "custom_lms_point_2",
    fallback: "Corporate Systems: SAP SuccessFactors, Oracle Learning Cloud, Adobe Captivate Prime",
  },
  {
    key: "custom_lms_point_3",
    fallback: "Cloud-Based Solutions: TalentLMS, Docebo, LearnUpon, Absorb LMS",
  },
  {
    key: "custom_lms_point_4",
    fallback: "Custom LMS Development: Bespoke learning management system creation and integration",
  },
]

const TECH_STANDARD_CONFIGS: SimpleBulletConfig[] = [
  {
    key: "custom_tech_standard_1",
    fallback: "SCORM 1.2 and 2004: Full compliance for tracking and reporting",
  },
  {
    key: "custom_tech_standard_2",
    fallback: "xAPI (Tin Can API): Advanced learning analytics and experience tracking",
  },
  {
    key: "custom_tech_standard_3",
    fallback: "AICC Compliance: Legacy system integration and compatibility",
  },
  {
    key: "custom_tech_standard_4",
    fallback: "HTML5 Development: Modern, responsive, and mobile-optimized courses",
  },
  {
    key: "custom_tech_standard_5",
    fallback: "Section 508/WCAG 2.1 AA: Complete accessibility compliance",
  },
  {
    key: "custom_tech_standard_6",
    fallback: "GDPR Compliance: Data privacy and protection standards",
  },
]

const ANALYTICS_CONFIGS: BulletConfig[] = [
  {
    labelKey: "custom_analytics_point_1_title",
    labelFallback: "Learner Progress Tracking:",
    descriptionKey: "custom_analytics_point_1_description",
    descriptionFallback: "Detailed monitoring of individual and group progress",
  },
  {
    labelKey: "custom_analytics_point_2_title",
    labelFallback: "Engagement Analytics:",
    descriptionKey: "custom_analytics_point_2_description",
    descriptionFallback: "Time spent, interaction rates, and participation metrics",
  },
  {
    labelKey: "custom_analytics_point_3_title",
    labelFallback: "Performance Assessment:",
    descriptionKey: "custom_analytics_point_3_description",
    descriptionFallback: "Skill development tracking and competency measurement",
  },
  {
    labelKey: "custom_analytics_point_4_title",
    labelFallback: "Completion Analytics:",
    descriptionKey: "custom_analytics_point_4_description",
    descriptionFallback: "Course completion rates and dropout analysis",
  },
  {
    labelKey: "custom_analytics_point_5_title",
    labelFallback: "Knowledge Retention:",
    descriptionKey: "custom_analytics_point_5_description",
    descriptionFallback: "Long-term retention testing and reinforcement recommendations",
  },
]

const CONSULTATION_BULLET_CONFIGS: BulletConfig[] = [
  {
    labelKey: "custom_consultation_point_1_title",
    labelFallback: "Comprehensive Training Needs Assessment:",
    descriptionKey: "custom_consultation_point_1_description",
    descriptionFallback: "Analysis of your current training challenges and opportunities",
  },
  {
    labelKey: "custom_consultation_point_2_title",
    labelFallback: "Custom Solution Design:",
    descriptionKey: "custom_consultation_point_2_description",
    descriptionFallback: "Preliminary design of a tailored e-learning solution for your organization",
  },
  {
    labelKey: "custom_consultation_point_3_title",
    labelFallback: "ROI Projection:",
    descriptionKey: "custom_consultation_point_3_description",
    descriptionFallback: "Detailed analysis of potential return on investment and business impact",
  },
  {
    labelKey: "custom_consultation_point_4_title",
    labelFallback: "Implementation Roadmap:",
    descriptionKey: "custom_consultation_point_4_description",
    descriptionFallback: "Step-by-step plan for successful custom e-learning deployment",
  },
  {
    labelKey: "custom_consultation_point_5_title",
    labelFallback: "Competitive Analysis:",
    descriptionKey: "custom_consultation_point_5_description",
    descriptionFallback: "How custom e-learning can give you an advantage in your industry",
  },
  {
    labelKey: "custom_consultation_point_6_title",
    labelFallback: "Technology Recommendations:",
    descriptionKey: "custom_consultation_point_6_description",
    descriptionFallback: "Optimal platforms and tools for your specific requirements",
  },
]

export default function CustomElearningPage() {
  const { getContent } = usePageContent(PAGE_SLUG)

  const heroContent = {
    title: getContent(
      "custom_hero_title",
      "Leading Custom E-Learning Development Company in Bangalore",
    ),
    description: getContent(
      "custom_hero_description",
      "Swift Solution Pvt Ltd stands as Bangalore's premier custom e-learning development company, delivering bespoke corporate training solutions that align perfectly with your organization's specific goals, culture, and industry requirements. With over 20 years of expertise in the learning and development industry.",
    ),
    primaryCta: getContent("custom_hero_primary_cta", "Free Consultation"),
    secondaryCta: getContent("custom_hero_secondary_cta", "Our Services"),
  }

  const heroStats = HERO_STAT_CONFIGS.map((stat) => ({
    value: getContent(stat.valueKey, stat.valueFallback),
    description: getContent(stat.descriptionKey, stat.descriptionFallback),
  }))

  const whySection = {
    title: getContent(
      "custom_why_title",
      "Why Choose Custom E-Learning Over Off-the-Shelf Solutions?",
    ),
    description: getContent(
      "custom_why_description",
      "Unlike generic, one-size-fits-all training programs, our custom e-learning development services create learning experiences that reflect your company's unique challenges, processes, and objectives. Every course is built from the ground up to address your specific training needs, ensuring maximum relevance, engagement, and knowledge retention.",
    ),
    servicesIntro: getContent(
      "custom_services_intro",
      "Our comprehensive suite of custom e-learning development services covers every aspect of creating tailored training solutions that drive business results and learner engagement.",
    ),
  }

  const bespokeSection = {
    heading: getContent(
      "custom_bespoke_heading",
      "Bespoke Course Development and Content Creation",
    ),
    subheading: getContent(
      "custom_bespoke_subheading",
      "Fully Customized Learning Experiences Built Around Your Business",
    ),
    description: getContent(
      "custom_bespoke_description",
      "Our custom course development process begins with a deep understanding of your organization's training objectives, learner profiles, and business goals. We create entirely original content that reflects your company's processes, terminology, case studies, and real-world scenarios.",
    ),
    impactTitle: getContent(
      "custom_bespoke_impact_title",
      "Business Impact",
    ),
  }

  const bespokePoints = BESPOKE_POINT_CONFIGS.map((point) => ({
    label: getContent(point.labelKey, point.labelFallback),
    description: getContent(point.descriptionKey, point.descriptionFallback),
  }))

  const businessImpactStats = BUSINESS_IMPACT_CONFIGS.map((stat) => ({
    title: getContent(stat.titleKey, stat.titleFallback),
    description: getContent(stat.descriptionKey, stat.descriptionFallback),
    icon: stat.icon,
  }))

  const aiSection = {
    heading: getContent(
      "custom_ai_section_heading",
      "AI-Enhanced Custom Development Process",
    ),
    subheading: getContent(
      "custom_ai_section_subheading",
      "Accelerating Customization Without Compromising Quality",
    ),
    description: getContent(
      "custom_ai_section_description",
      "While our focus remains on creating truly customized learning experiences, we leverage artificial intelligence to enhance our development process, reduce timelines, and improve content quality—all while maintaining the personal touch that makes custom e-learning effective.",
    ),
    capabilitiesTitle: getContent(
      "custom_ai_capabilities_title",
      "AI-Enhanced Capabilities:",
    ),
    efficiencyTitle: getContent(
      "custom_ai_efficiency_title",
      "Development Efficiency:",
    ),
  }

  const aiCapabilities = AI_CAPABILITY_CONFIGS.map((item) => ({
    label: getContent(item.labelKey, item.labelFallback),
    description: getContent(item.descriptionKey, item.descriptionFallback),
  }))

  const aiEfficiency = AI_EFFICIENCY_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )

  const agileSection = {
    heading: getContent(
      "custom_agile_heading",
      "Agile Custom E-Learning Development Process",
    ),
    subheading: getContent(
      "custom_agile_subheading",
      "Rapid, Iterative Development for Faster Time-to-Market",
    ),
    description: getContent(
      "custom_agile_description",
      "Our agile approach to custom e-learning development ensures faster delivery while maintaining high customization quality. This methodology allows for continuous feedback and refinement throughout the development process.",
    ),
    phasesTitle: getContent(
      "custom_agile_phases_title",
      "6-Phase Agile Development Process:",
    ),
    phaseOneTitle: getContent(
      "custom_agile_phase_1_title",
      "Phase 1: Discovery and Requirements Analysis (Week 1-2)",
    ),
    phaseTwoTitle: getContent(
      "custom_agile_phase_2_title",
      "Phase 2: Instructional Design and Content Architecture (Week 2-3)",
    ),
    phaseThreeTitle: getContent(
      "custom_agile_phase_3_title",
      "Phase 3-6: Development, Testing & Deployment",
    ),
    designTitle: getContent(
      "custom_agile_design_title",
      "Custom Learning Experience Design",
    ),
    designSubtitle: getContent(
      "custom_agile_design_subtitle",
      "Creating Engaging, Effective Learning Journeys",
    ),
  }

  const agilePhaseOne = AGILE_PHASE_ONE_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )
  const agilePhaseTwo = AGILE_PHASE_TWO_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )
  const agilePhaseThree = AGILE_PHASE_THREE_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )
  const agileDesignPoints = AGILE_DESIGN_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )

  const technologySection = {
    heading: getContent(
      "custom_tech_heading",
      "Technology Integration and Technical Excellence",
    ),
    description: getContent(
      "custom_tech_description",
      "Our technical expertise ensures seamless integration with your existing systems and future-proof solutions.",
    ),
    lmsHeading: getContent(
      "custom_tech_lms_heading",
      "Advanced LMS Integration and Compatibility",
    ),
    lmsSubheading: getContent(
      "custom_tech_lms_subheading",
      "Seamless Integration with Your Learning Infrastructure",
    ),
    lmsCompatibilityTitle: getContent(
      "custom_tech_lms_compatibility_title",
      "LMS Compatibility:",
    ),
    lmsStandardsTitle: getContent(
      "custom_tech_standards_title",
      "Technical Standards and Compliance:",
    ),
    analyticsHeading: getContent(
      "custom_tech_analytics_heading",
      "Analytics and Performance Measurement",
    ),
    analyticsSubheading: getContent(
      "custom_tech_analytics_subheading",
      "Data-Driven Insights for Continuous Improvement",
    ),
  }

  const lmsCompatibility = LMS_COMPATIBILITY_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )
  const techStandards = TECH_STANDARD_CONFIGS.map((item) =>
    getContent(item.key, item.fallback),
  )

  const analyticsPoints = ANALYTICS_CONFIGS.map((item) => ({
    label: getContent(item.labelKey, item.labelFallback),
    description: getContent(item.descriptionKey, item.descriptionFallback),
    icon: item.icon,
  }))

  const consultationSection = {
    heading: getContent(
      "custom_consultation_heading",
      "What You'll Receive in Your Free Consultation:",
    ),
    title: getContent(
      "custom_consultation_title",
      "Ready to Transform Your Training?",
    ),
    description: getContent(
      "custom_consultation_description",
      "Contact Swift Solution Pvt Ltd today for your free custom e-learning consultation and discover how we can help you achieve your training objectives.",
    ),
    ctaLabel: getContent(
      "custom_consultation_cta",
      "Schedule Free Consultation",
    ),
  }

  const consultationBullets = CONSULTATION_BULLET_CONFIGS.map((item) => ({
    label: getContent(item.labelKey, item.labelFallback),
    description: getContent(item.descriptionKey, item.descriptionFallback),
  }))

  const faqTitle = getContent(
    "custom_faq_title",
    "Frequently Asked Questions (FAQs) about Custom eLearning",
  )

  return (
    <div className="w-full">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMAGES/3.custom learning/download (1).png"
            alt={getContent(
              "custom_hero_image_alt",
              "Custom E-Learning Development Services Bangalore",
            )}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              {heroContent.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="#consultation"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200"
              >
                {heroContent.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200"
              >
                {heroContent.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              {whySection.title}
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              {whySection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {heroStats.map((stat) => (
              <div key={stat.value} className="text-center">
                <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                  <stat.icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>

          <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center mb-16">
            {whySection.servicesIntro}
          </p>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              {bespokeSection.heading}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-gray-900">
                  {bespokeSection.subheading}
                </h4>
                <p className="text-gray-700 mb-6">
                  {bespokeSection.description}
                </p>

                <div className="space-y-4">
                  {bespokePoints.map((point) => (
                    <div key={point.label} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-gray-900">{point.label}</strong>
                        <span className="text-gray-700"> {point.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white">
                <h4 className="text-xl font-bold mb-6">{bespokeSection.impactTitle}</h4>
                <div className="space-y-4">
                  {businessImpactStats.map((stat) => (
                    <div key={stat.title} className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-full mr-4">
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-semibold">{stat.title}</div>
                        <div className="text-orange-100 text-sm">{stat.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              {aiSection.heading}
            </h3>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                {aiSection.subheading}
              </h4>
              <p className="text-gray-700 mb-6">{aiSection.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold mb-4 text-gray-900">
                    {aiSection.capabilitiesTitle}
                  </h5>
                  <ul className="space-y-2 text-gray-700">
                    {aiCapabilities.map((item) => (
                      <li key={item.label} className="flex items-start">
                        <Zap className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-1" />
                        <span>
                          <strong>{item.label}</strong> {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-4 text-gray-900">
                    {aiSection.efficiencyTitle}
                  </h5>
                  <ul className="space-y-2 text-gray-700">
                    {aiEfficiency.map((item) => (
                      <li key={item} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              {agileSection.heading}
            </h3>
            <div className="bg-gray-50 rounded-xl p-8">
              <h4 className="text-xl font-semibold mb-4 text-gray-900">
                {agileSection.subheading}
              </h4>
              <p className="text-gray-700 mb-8">{agileSection.description}</p>

              <h5 className="text-lg font-semibold mb-6 text-gray-900">
                {agileSection.phasesTitle}
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h6 className="font-semibold text-orange-600 mb-2">
                      {agileSection.phaseOneTitle}
                    </h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {agilePhaseOne.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h6 className="font-semibold text-orange-600 mb-2">
                      {agileSection.phaseTwoTitle}
                    </h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {agilePhaseTwo.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h6 className="font-semibold text-orange-600 mb-2">
                      {agileSection.phaseThreeTitle}
                    </h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {agilePhaseThree.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h6 className="font-semibold text-orange-600 mb-2">
                      {agileSection.designTitle}
                    </h6>
                    <p className="text-sm text-gray-700 mb-3">
                      {agileSection.designSubtitle}
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {agileDesignPoints.map((item) => (
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

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              {technologySection.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {technologySection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {technologySection.lmsHeading}
              </h3>
              <p className="text-gray-700 mb-6">
                {technologySection.lmsSubheading}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {technologySection.lmsCompatibilityTitle}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {lmsCompatibility.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {technologySection.lmsStandardsTitle}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {techStandards.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {technologySection.analyticsHeading}
              </h3>
              <p className="text-gray-700 mb-6">
                {technologySection.analyticsSubheading}
              </p>

              <div className="space-y-4">
                {analyticsPoints.map((point) => (
                  <div key={point.label} className="flex items-start">
                    <point.icon className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-900">{point.label}</strong>
                      <span className="text-gray-700"> {point.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white" id="consultation">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-semibold mb-6">
                {consultationSection.heading}
              </h4>
              <ul className="space-y-4">
                {consultationBullets.map((item) => (
                  <li key={item.label} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>{item.label}</strong>
                      <span className="text-orange-100"> {item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h4 className="text-2xl font-bold mb-4">
                  {consultationSection.title}
                </h4>
                <p className="text-orange-100 mb-6">
                  {consultationSection.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                >
                  {consultationSection.ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DynamicFAQ
        sectionId="faq"
        pageSlug={PAGE_SLUG}
        title={faqTitle}
      />

      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Contact />
        </div>
      </section>
    </div>
  )
}
