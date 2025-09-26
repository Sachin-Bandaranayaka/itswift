"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Gamepad2,
  Trophy,
  Users,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  Zap,
  Brain,
  Play,
  Puzzle,
  Film,
  Share2,
  Route,
  TrendingUp,
  Repeat,
  Award,
  Server,
  User,
  Star,
} from "lucide-react"
import Contact from "@/components/contact"
import { usePageContent } from "@/hooks/use-page-content"

const PAGE_SLUG = "game-based-elearning"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type IconComponent = React.ComponentType<{ className?: string }>

type StatConfig = {
  valueKey: string
  valueFallback: string
  labelKey: string
  labelFallback: string
  color: string
}

type BenefitConfig = {
  icon: IconComponent
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type GameTypeConfig = {
  icon: IconComponent
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
  featureKeys: string[]
  featureFallbacks: string[]
}

type FeatureConfig = {
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type ProcessStepConfig = {
  step: string
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type WhyCardConfig = {
  icon: IconComponent
  titleKey: string
  titleFallback: string
  descriptionKey: string
  descriptionFallback: string
}

type FAQConfig = {
  questionKey: string
  questionFallback: string
  answerKey: string
  answerFallback: string
}

const STATS: StatConfig[] = [
  {
    valueKey: "game_hero_stat_1_value",
    valueFallback: "90%",
    labelKey: "game_hero_stat_1_label",
    labelFallback: "Higher Engagement",
    color: "text-purple-600",
  },
  {
    valueKey: "game_hero_stat_2_value",
    valueFallback: "75%",
    labelKey: "game_hero_stat_2_label",
    labelFallback: "Better Retention",
    color: "text-pink-600",
  },
  {
    valueKey: "game_hero_stat_3_value",
    valueFallback: "60%",
    labelKey: "game_hero_stat_3_label",
    labelFallback: "Faster Learning",
    color: "text-blue-600",
  },
  {
    valueKey: "game_hero_stat_4_value",
    valueFallback: "85%",
    labelKey: "game_hero_stat_4_label",
    labelFallback: "Completion Rate",
    color: "text-green-600",
  },
]

const BENEFITS: BenefitConfig[] = [
  {
    icon: Trophy,
    titleKey: "game_benefit_1_title",
    titleFallback: "90% Higher Engagement",
    descriptionKey: "game_benefit_1_description",
    descriptionFallback:
      "Game-based learning increases learner engagement by up to 90% compared to traditional methods.",
  },
  {
    icon: Brain,
    titleKey: "game_benefit_2_title",
    titleFallback: "Better Retention",
    descriptionKey: "game_benefit_2_description",
    descriptionFallback:
      "Interactive gaming elements improve knowledge retention rates by 75% through active participation.",
  },
  {
    icon: Target,
    titleKey: "game_benefit_3_title",
    titleFallback: "Immediate Feedback",
    descriptionKey: "game_benefit_3_description",
    descriptionFallback:
      "Real-time feedback and scoring systems help learners understand their progress instantly.",
  },
  {
    icon: Users,
    titleKey: "game_benefit_4_title",
    titleFallback: "Social Learning",
    descriptionKey: "game_benefit_4_description",
    descriptionFallback:
      "Multiplayer features and leaderboards foster collaboration and healthy competition.",
  },
]

const GAME_TYPES: GameTypeConfig[] = [
  {
    icon: Play,
    titleKey: "game_type_1_title",
    titleFallback: "Simulation Games",
    descriptionKey: "game_type_1_description",
    descriptionFallback:
      "Realistic scenarios that allow learners to practice skills in a safe, virtual environment.",
    featureKeys: [
      "game_type_1_feature_1",
      "game_type_1_feature_2",
      "game_type_1_feature_3",
      "game_type_1_feature_4",
    ],
    featureFallbacks: [
      "Risk-free practice",
      "Real-world scenarios",
      "Decision-making skills",
      "Consequence learning",
    ],
  },
  {
    icon: Lightbulb,
    titleKey: "game_type_2_title",
    titleFallback: "Quiz & Trivia Games",
    descriptionKey: "game_type_2_description",
    descriptionFallback:
      "Interactive knowledge testing with competitive elements and immediate feedback.",
    featureKeys: [
      "game_type_2_feature_1",
      "game_type_2_feature_2",
      "game_type_2_feature_3",
      "game_type_2_feature_4",
    ],
    featureFallbacks: [
      "Knowledge assessment",
      "Competitive scoring",
      "Instant feedback",
      "Progress tracking",
    ],
  },
  {
    icon: BookOpen,
    titleKey: "game_type_3_title",
    titleFallback: "Adventure & Story Games",
    descriptionKey: "game_type_3_description",
    descriptionFallback:
      "Narrative-driven learning experiences that immerse learners in engaging storylines.",
    featureKeys: [
      "game_type_3_feature_1",
      "game_type_3_feature_2",
      "game_type_3_feature_3",
      "game_type_3_feature_4",
    ],
    featureFallbacks: [
      "Immersive storytelling",
      "Character development",
      "Progressive challenges",
      "Emotional engagement",
    ],
  },
  {
    icon: Target,
    titleKey: "game_type_4_title",
    titleFallback: "Puzzle & Strategy Games",
    descriptionKey: "game_type_4_description",
    descriptionFallback:
      "Problem-solving challenges that develop critical thinking and analytical skills.",
    featureKeys: [
      "game_type_4_feature_1",
      "game_type_4_feature_2",
      "game_type_4_feature_3",
      "game_type_4_feature_4",
    ],
    featureFallbacks: [
      "Critical thinking",
      "Problem solving",
      "Strategic planning",
      "Logic development",
    ],
  },
]

const FEATURES: FeatureConfig[] = [
  {
    titleKey: "game_feature_1_title",
    titleFallback: "Leaderboards & Achievements",
    descriptionKey: "game_feature_1_description",
    descriptionFallback:
      "Motivate learners with competitive elements and recognition systems.",
  },
  {
    titleKey: "game_feature_2_title",
    titleFallback: "Progress Tracking",
    descriptionKey: "game_feature_2_description",
    descriptionFallback:
      "Detailed analytics and progress monitoring for learners and administrators.",
  },
  {
    titleKey: "game_feature_3_title",
    titleFallback: "Adaptive Difficulty",
    descriptionKey: "game_feature_3_description",
    descriptionFallback:
      "Dynamic difficulty adjustment based on learner performance and skill level.",
  },
  {
    titleKey: "game_feature_4_title",
    titleFallback: "Multi-Platform Support",
    descriptionKey: "game_feature_4_description",
    descriptionFallback:
      "Games that work seamlessly across desktop, tablet, and mobile devices.",
  },
  {
    titleKey: "game_feature_5_title",
    titleFallback: "Social Features",
    descriptionKey: "game_feature_5_description",
    descriptionFallback:
      "Team challenges, collaboration tools, and social sharing capabilities.",
  },
  {
    titleKey: "game_feature_6_title",
    titleFallback: "Customizable Avatars",
    descriptionKey: "game_feature_6_description",
    descriptionFallback:
      "Personalization options that increase learner investment and engagement.",
  },
]

const PROCESS_STEPS: ProcessStepConfig[] = [
  {
    step: "01",
    titleKey: "game_process_step_1_title",
    titleFallback: "Learning Objectives Analysis",
    descriptionKey: "game_process_step_1_description",
    descriptionFallback:
      "We identify your training goals and determine the best gaming mechanics to achieve them.",
  },
  {
    step: "02",
    titleKey: "game_process_step_2_title",
    titleFallback: "Game Design & Mechanics",
    descriptionKey: "game_process_step_2_description",
    descriptionFallback:
      "Our designers create engaging game mechanics that align with your learning objectives.",
  },
  {
    step: "03",
    titleKey: "game_process_step_3_title",
    titleFallback: "Content Integration",
    descriptionKey: "game_process_step_3_description",
    descriptionFallback:
      "We seamlessly integrate your training content into the game framework for maximum impact.",
  },
  {
    step: "04",
    titleKey: "game_process_step_4_title",
    titleFallback: "Interactive Development",
    descriptionKey: "game_process_step_4_description",
    descriptionFallback: "Our developers build the game using cutting-edge technology and UX principles.",
  },
  {
    step: "05",
    titleKey: "game_process_step_5_title",
    titleFallback: "Testing & Optimization",
    descriptionKey: "game_process_step_5_description",
    descriptionFallback:
      "We thoroughly test the game and optimize based on user feedback and performance data.",
  },
]

const WHY_CARDS: WhyCardConfig[] = [
  {
    icon: Award,
    titleKey: "game_why_card_1_title",
    titleFallback: "Certified Experts",
    descriptionKey: "game_why_card_1_description",
    descriptionFallback:
      "Certified game designers and instructional specialists with years of experience.",
  },
  {
    icon: User,
    titleKey: "game_why_card_2_title",
    titleFallback: "Instructional Design Excellence",
    descriptionKey: "game_why_card_2_description",
    descriptionFallback:
      "Instructional designers create gameplay that aligns with measurable learning outcomes.",
  },
  {
    icon: Star,
    titleKey: "game_why_card_3_title",
    titleFallback: "Proven Impact",
    descriptionKey: "game_why_card_3_description",
    descriptionFallback:
      "Award-winning projects recognized for innovation, engagement, and effectiveness.",
  },
]

const FAQS: FAQConfig[] = [
  {
    questionKey: "game_faq_1_question",
    questionFallback: "How effective is game-based learning compared to traditional methods?",
    answerKey: "game_faq_1_answer",
    answerFallback:
      "Studies show game-based learning can increase engagement by up to 90% and improve retention by 75%.",
  },
  {
    questionKey: "game_faq_2_question",
    questionFallback: "What types of training content work best with game-based learning?",
    answerKey: "game_faq_2_answer",
    answerFallback:
      "Compliance, soft skills, product knowledge, safety training, and scenario-based content all benefit from game mechanics.",
  },
  {
    questionKey: "game_faq_3_question",
    questionFallback: "Can your games integrate with our existing LMS?",
    answerKey: "game_faq_3_answer",
    answerFallback:
      "Yes—our games support SCORM, xAPI (Tin Can), and other standards for LMS integration.",
  },
  {
    questionKey: "game_faq_4_question",
    questionFallback: "How do you measure learning outcomes in games?",
    answerKey: "game_faq_4_answer",
    answerFallback:
      "We track learner decisions, time on tasks, assessment scores, and post-game performance to measure outcomes.",
  },
  {
    questionKey: "game_faq_5_question",
    questionFallback: "What is the typical development timeline?",
    answerKey: "game_faq_5_answer",
    answerFallback:
      "Timeline varies by complexity, but most projects complete in 8-16 weeks including design, development, and testing.",
  },
]

export default function GameBasedElearningPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const { getContent } = usePageContent(PAGE_SLUG)

  const hero = {
    title: getContent(
      "game_hero_title",
      "Game-Based",
    ),
    subtitle: getContent(
      "game_hero_subtitle",
      "eLearning Solutions",
    ),
    description: getContent(
      "game_hero_description",
      "Transform learning into an engaging adventure with interactive games that boost retention and motivation",
    ),
  }

  const intro = {
    heading: getContent(
      "game_intro_heading",
      "Level Up Your Learning Experience",
    ),
    description: getContent(
      "game_intro_description",
      "Game-based learning combines the power of gaming with educational content to create immersive, engaging experiences that drive real learning outcomes.",
    ),
  }

  const whyWorks = {
    heading: getContent(
      "game_why_heading",
      "Why Game-Based Learning Works",
    ),
    points: [
      {
        icon: Zap,
        title: getContent(
          "game_why_point_1_title",
          "Intrinsic Motivation",
        ),
        description: getContent(
          "game_why_point_1_description",
          "Games tap into natural human desires for achievement, competition, and mastery.",
        ),
      },
      {
        icon: Brain,
        title: getContent(
          "game_why_point_2_title",
          "Active Learning",
        ),
        description: getContent(
          "game_why_point_2_description",
          "Interactive gameplay requires active participation, improving knowledge retention.",
        ),
      },
      {
        icon: Target,
        title: getContent(
          "game_why_point_3_title",
          "Safe Practice",
        ),
        description: getContent(
          "game_why_point_3_description",
          "Virtual environments allow learners to practice skills without real-world consequences.",
        ),
      },
      {
        icon: Trophy,
        title: getContent(
          "game_why_point_4_title",
          "Immediate Feedback",
        ),
        description: getContent(
          "game_why_point_4_description",
          "Real-time scoring and feedback help learners adjust and improve quickly.",
        ),
      },
    ],
    statHeading: getContent(
      "game_stats_heading",
      "Learning Impact",
    ),
  }

  const stats = STATS.map((stat) => ({
    value: getContent(stat.valueKey, stat.valueFallback),
    label: getContent(stat.labelKey, stat.labelFallback),
    color: stat.color,
  }))

  const benefits = BENEFITS.map((benefit) => ({
    icon: benefit.icon,
    title: getContent(benefit.titleKey, benefit.titleFallback),
    description: getContent(benefit.descriptionKey, benefit.descriptionFallback),
  }))

  const gameTypes = GAME_TYPES.map((type) => ({
    icon: type.icon,
    title: getContent(type.titleKey, type.titleFallback),
    description: getContent(type.descriptionKey, type.descriptionFallback),
    features: type.featureKeys.map((key, index) =>
      getContent(key, type.featureFallbacks[index] ?? ""),
    ),
  }))

  const features = FEATURES.map((feature) => ({
    title: getContent(feature.titleKey, feature.titleFallback),
    description: getContent(feature.descriptionKey, feature.descriptionFallback),
  }))

  const process = PROCESS_STEPS.map((step) => ({
    step: step.step,
    title: getContent(step.titleKey, step.titleFallback),
    description: getContent(step.descriptionKey, step.descriptionFallback),
  }))

  const faqHeading = getContent(
    "game_faq_heading",
    "Frequently Asked Questions (FAQs) about Game-Based Learning",
  )

  const whyCards = WHY_CARDS.map((card) => ({
    icon: card.icon,
    title: getContent(card.titleKey, card.titleFallback),
    description: getContent(card.descriptionKey, card.descriptionFallback),
  }))

  const faqs = FAQS.map((faq) => ({
    question: getContent(faq.questionKey, faq.questionFallback),
    answer: getContent(faq.answerKey, faq.answerFallback),
  }))

  const heroStatHeading = getContent(
    "game_stats_section_heading",
    "Learning Impact",
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/IMAGES/3.custom learning/download (3).png"
            alt={getContent(
              "game_hero_image_alt",
              "Game-Based Learning Background",
            )}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {hero.title}
              <span className="block text-yellow-400">{hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
            <div className="flex justify-center">
              <motion.a
                href="#contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getContent("game_hero_cta", "Get Started")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7ώ
