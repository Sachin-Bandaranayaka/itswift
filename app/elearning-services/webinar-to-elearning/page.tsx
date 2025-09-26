"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
import { usePageContent } from "@/hooks/use-page-content"
import {
    ArrowRight,
    CheckCircle,
    BarChart,
    Layers,
    Users,
    ChevronDown,
    Globe,
    Clock,
    Puzzle,
    Search,
    Bot,
    Settings,
    CheckSquare,
    Server,
    FileText,
    TrendingUp,
    CheckCheck,
    Star
} from "lucide-react"

const PAGE_SLUG = "webinar-to-elearning"

type IconComponent = React.ComponentType<{ className?: string }>

type IntroBulletConfig = {
    highlightKey: string
    highlightFallback: string
    descriptionKey: string
    descriptionFallback: string
}

type GradientCardConfig = {
    icon: IconComponent
    color: string
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
}

type ProcessStepConfig = {
    icon: IconComponent
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
    delay?: number
}

type ChallengeCardConfig = {
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
}

type AiFeatureConfig = ChallengeCardConfig & {
    icon: IconComponent
}

type CaseStudyMetricConfig = {
    icon: IconComponent
    textKey: string
    textFallback: string
}

type CaseStudyConfig = {
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
    metrics: CaseStudyMetricConfig[]
}

type AdvantageCardConfig = {
    icon: IconComponent
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
    delay?: number
}

type FaqItemConfig = {
    questionKey: string
    questionFallback: string
    answerKey: string
    answerFallback: string
}

const INTRO_BULLETS: IntroBulletConfig[] = [
    {
        highlightKey: "webinar_intro_bullet_1_highlight",
        highlightFallback: "Interactive Elements",
        descriptionKey: "webinar_intro_bullet_1_description",
        descriptionFallback: "Engaging activities that maintain learner attention and reinforce key concepts",
    },
    {
        highlightKey: "webinar_intro_bullet_2_highlight",
        highlightFallback: "Knowledge Checks",
        descriptionKey: "webinar_intro_bullet_2_description",
        descriptionFallback: "Strategically placed assessments that verify comprehension and provide feedback",
    },
    {
        highlightKey: "webinar_intro_bullet_3_highlight",
        highlightFallback: "Structural Organization",
        descriptionKey: "webinar_intro_bullet_3_description",
        descriptionFallback: "Clear learning objectives, logical content segmentation, and intuitive navigation",
    },
    {
        highlightKey: "webinar_intro_bullet_4_highlight",
        highlightFallback: "Enhanced Multimedia",
        descriptionKey: "webinar_intro_bullet_4_description",
        descriptionFallback: "Optimized audio, improved visuals, and added supporting graphics or animations",
    },
    {
        highlightKey: "webinar_intro_bullet_5_highlight",
        highlightFallback: "Progress Tracking",
        descriptionKey: "webinar_intro_bullet_5_description",
        descriptionFallback: "LMS integration that captures learner activity, completion, and assessment data",
    },
]

const BENEFIT_CARDS: GradientCardConfig[] = [
    {
        icon: TrendingUp,
        color: "from-orange-500 to-orange-600",
        titleKey: "webinar_benefit_1_title",
        titleFallback: "Maximize ROI from Existing Webinar Content",
        descriptionKey: "webinar_benefit_1_description",
        descriptionFallback: "Webinars require significant investment in preparation, promotion, and delivery, yet their value typically diminishes rapidly after the live event. Our conversion services help you extract maximum value from this investment by transforming one-time events into permanent learning assets that continue generating returns indefinitely.",
    },
    {
        icon: FileText,
        color: "from-orange-400 to-orange-500",
        titleKey: "webinar_benefit_2_title",
        titleFallback: "Create Evergreen Training Assets from One-Time Events",
        descriptionKey: "webinar_benefit_2_description",
        descriptionFallback: "Live webinars are ephemeral by nature, with content that may quickly become outdated or forgotten. Our conversion process transforms these temporary events into evergreen training resources that can be updated, expanded, and leveraged as cornerstone content in your knowledge management strategy.",
    },
    {
        icon: Users,
        color: "from-orange-500 to-orange-600",
        titleKey: "webinar_benefit_3_title",
        titleFallback: "Expand Audience Reach Beyond Live Attendees",
        descriptionKey: "webinar_benefit_3_description",
        descriptionFallback: "Even successful webinars typically reach only a fraction of your potential audience due to scheduling conflicts, time zone differences, and limited promotion. Converting webinars to on-demand eLearning modules allows you to reach the 60-80% of your target audience who couldn't attend the original live event.",
    },
    {
        icon: Puzzle,
        color: "from-orange-400 to-orange-500",
        titleKey: "webinar_benefit_4_title",
        titleFallback: "Enhance Learning with Interactive Elements",
        descriptionKey: "webinar_benefit_4_description",
        descriptionFallback: "Live webinars offer limited interaction opportunities and no ability to pause for reflection or review complex concepts. Our conversion process integrates interactive elements, knowledge checks, and supplementary resources that enhance learning effectiveness beyond what's possible in a live streaming format.",
    },
    {
        icon: BarChart,
        color: "from-orange-500 to-orange-600",
        titleKey: "webinar_benefit_5_title",
        titleFallback: "Track Engagement and Completion with Advanced Analytics",
        descriptionKey: "webinar_benefit_5_description",
        descriptionFallback: "Traditional webinar platforms offer basic attendance and duration metrics but limited insight into actual engagement and knowledge transfer. Our converted eLearning modules include comprehensive tracking capabilities that measure specific learning outcomes, completion rates, and knowledge retention.",
    },
]

const PROCESS_STEPS: ProcessStepConfig[] = [
    {
        icon: Search,
        titleKey: "webinar_process_step_1_title",
        titleFallback: "Comprehensive Content Analysis",
        descriptionKey: "webinar_process_step_1_description",
        descriptionFallback: "We begin by thoroughly analyzing your webinar recording, identifying key learning points, natural content breaks, engagement opportunities, and areas requiring enhancement or clarification. This analysis forms the foundation for an effective transformation strategy.",
        delay: 0,
    },
    {
        icon: Layers,
        titleKey: "webinar_process_step_2_title",
        titleFallback: "Instructional Design Blueprint",
        descriptionKey: "webinar_process_step_2_description",
        descriptionFallback: "Our instructional designers create a detailed blueprint that restructures your webinar content for optimal digital learning, incorporating adult learning principles, microlearning concepts, and engagement strategies that maintain attention throughout the experience.",
        delay: 0.1,
    },
    {
        icon: FileText,
        titleKey: "webinar_process_step_3_title",
        titleFallback: "Content Segmentation and Enhancement",
        descriptionKey: "webinar_process_step_3_description",
        descriptionFallback: "We break down lengthy webinar sessions into logical, digestible modules with clear learning objectives. Our team enhances the original content with additional context, examples, and supporting materials that improve comprehension and retention.",
        delay: 0.2,
    },
    {
        icon: Puzzle,
        titleKey: "webinar_process_step_4_title",
        titleFallback: "Interactive Element Development",
        descriptionKey: "webinar_process_step_4_description",
        descriptionFallback: "Our specialized development team creates knowledge checks, interactive scenarios, clickable elements, and other engagement points that replace the live interaction of the original webinar and maintain learner attention throughout the experience.",
        delay: 0.3,
    },
    {
        icon: Settings,
        titleKey: "webinar_process_step_5_title",
        titleFallback: "Multimedia Optimization",
        descriptionKey: "webinar_process_step_5_description",
        descriptionFallback: "We enhance audio quality, improve visual elements, add professional animations or graphics where beneficial, and ensure all multimedia components are optimized for various devices and bandwidth conditions.",
        delay: 0.4,
    },
    {
        icon: CheckSquare,
        titleKey: "webinar_process_step_6_title",
        titleFallback: "Assessment and Reinforcement Integration",
        descriptionKey: "webinar_process_step_6_description",
        descriptionFallback: "We design effective assessment strategies that evaluate knowledge transfer and provide meaningful feedback to learners. These assessments verify comprehension and reinforce key learning points from the webinar content.",
        delay: 0.5,
    },
    {
        icon: Server,
        titleKey: "webinar_process_step_7_title",
        titleFallback: "Technical Implementation and Testing",
        descriptionKey: "webinar_process_step_7_description",
        descriptionFallback: "Our technical team ensures your converted content functions flawlessly across all required platforms and devices. Rigorous testing verifies compatibility, performance, and tracking before deployment.",
        delay: 0.6,
    },
]

const CHALLENGE_CARDS: ChallengeCardConfig[] = [
    {
        titleKey: "webinar_challenge_1_title",
        titleFallback: "Struggling to get long-term value from webinars?",
        descriptionKey: "webinar_challenge_1_description",
        descriptionFallback: "Our conversion process transforms temporary webinar events into permanent learning assets that continue generating value indefinitely. This approach typically delivers 5-10x more views and engagement compared to simply posting the webinar recording.",
    },
    {
        titleKey: "webinar_challenge_2_title",
        titleFallback: "Need to provide training to those who missed live events?",
        descriptionKey: "webinar_challenge_2_description",
        descriptionFallback: "Our converted eLearning modules allow learners to access critical information at their convenience, eliminating the scheduling conflicts and time zone challenges that limit live webinar attendance. This typically expands your reach by 300-500%.",
    },
    {
        titleKey: "webinar_challenge_3_title",
        titleFallback: "Want to create a consistent learning experience?",
        descriptionKey: "webinar_challenge_3_description",
        descriptionFallback: "Live webinars can vary significantly in quality and effectiveness based on presenter performance, technical issues, and audience dynamics. Our conversion process standardizes the experience, ensuring consistent quality and learning outcomes for all users.",
    },
    {
        titleKey: "webinar_challenge_4_title",
        titleFallback: "Looking to measure learning outcomes from webinar content?",
        descriptionKey: "webinar_challenge_4_description",
        descriptionFallback: "Our converted modules include comprehensive tracking and assessment capabilities that provide detailed insights into engagement, completion, and knowledge transfer—metrics that are impossible to capture accurately with traditional webinar recordings.",
    },
]

const AI_FEATURES: AiFeatureConfig[] = [
    {
        icon: Bot,
        titleKey: "webinar_ai_feature_1_title",
        titleFallback: "AI-Powered Content Extraction and Analysis",
        descriptionKey: "webinar_ai_feature_1_description",
        descriptionFallback: "Our AI tools analyze your webinar recordings to automatically identify key topics, learning points, and natural content breaks. This analysis accelerates the conversion process by extracting and organizing content elements while identifying areas that need enhancement.",
    },
    {
        icon: FileText,
        titleKey: "webinar_ai_feature_2_title",
        titleFallback: "Automated Transcription and Caption Generation",
        descriptionKey: "webinar_ai_feature_2_description",
        descriptionFallback: "AI-powered transcription tools create accurate text versions of your webinar content, which we then optimize for readability and learning. These transcriptions serve as the foundation for searchable content, captions, and text-based learning resources.",
    },
    {
        icon: Puzzle,
        titleKey: "webinar_ai_feature_3_title",
        titleFallback: "Intelligent Interactive Element Suggestions",
        descriptionKey: "webinar_ai_feature_3_description",
        descriptionFallback: "Our AI systems analyze your webinar content and suggest optimal points for interactive elements, knowledge checks, and supplementary resources based on content complexity, natural pauses, and learning principles.",
    },
    {
        icon: Users,
        titleKey: "webinar_ai_feature_4_title",
        titleFallback: "Personalized Learning Path Creation",
        descriptionKey: "webinar_ai_feature_4_description",
        descriptionFallback: "AI enables us to create adaptive learning paths that personalize the experience based on individual learner roles, prior knowledge, and performance. These adaptive elements ensure each learner receives the most relevant content for their specific needs.",
    },
]

const CASE_STUDIES: CaseStudyConfig[] = [
    {
        titleKey: "webinar_case_study_1_title",
        titleFallback: "Global Technology Corporation",
        descriptionKey: "webinar_case_study_1_description",
        descriptionFallback: "Converted a series of 12 product webinars into an interactive eLearning library, increasing total viewing time by 470% and improving product adoption rates by 28% among customers who completed the modules.",
        metrics: [
            {
                icon: TrendingUp,
                textKey: "webinar_case_study_1_metric_1",
                textFallback: "470% increase in viewing time",
            },
            {
                icon: CheckCheck,
                textKey: "webinar_case_study_1_metric_2",
                textFallback: "28% improvement in product adoption",
            },
        ],
    },
    {
        titleKey: "webinar_case_study_2_title",
        titleFallback: "Financial Services Provider",
        descriptionKey: "webinar_case_study_2_description",
        descriptionFallback: "Transformed quarterly compliance update webinars into structured eLearning modules with verification assessments, achieving 100% completion rates among required staff compared to 62% live attendance for previous webinars.",
        metrics: [
            {
                icon: TrendingUp,
                textKey: "webinar_case_study_2_metric_1",
                textFallback: "100% compliance completion rate",
            },
            {
                icon: CheckCheck,
                textKey: "webinar_case_study_2_metric_2",
                textFallback: "38% increase in training coverage",
            },
        ],
    },
    {
        titleKey: "webinar_case_study_3_title",
        titleFallback: "Healthcare Organization",
        descriptionKey: "webinar_case_study_3_description",
        descriptionFallback: "Converted clinical procedure webinars into interactive training modules with simulations and assessments, reducing training time by 35% while improving competency assessment scores by 24%.",
        metrics: [
            {
                icon: TrendingUp,
                textKey: "webinar_case_study_3_metric_1",
                textFallback: "35% reduction in training time",
            },
            {
                icon: Star,
                textKey: "webinar_case_study_3_metric_2",
                textFallback: "24% higher competency scores",
            },
        ],
    },
]

const ADVANTAGE_CARDS: AdvantageCardConfig[] = [
    {
        icon: Globe,
        titleKey: "webinar_advantage_1_title",
        titleFallback: "Global Expertise with Local Value",
        descriptionKey: "webinar_advantage_1_description",
        descriptionFallback: "Our location allows us to offer world-class conversion services at competitive rates compared to US or European providers, typically delivering 30-40% cost savings without compromising quality.",
        delay: 0,
    },
    {
        icon: Clock,
        titleKey: "webinar_advantage_2_title",
        titleFallback: "Rapid Delivery Capability",
        descriptionKey: "webinar_advantage_2_description",
        descriptionFallback: "Our large, specialized team and 24/7 production capability allow us to deliver conversion projects 40-50% faster than most Western providers, helping you quickly capitalize on your webinar content.",
        delay: 0.1,
    },
    {
        icon: Layers,
        titleKey: "webinar_advantage_3_title",
        titleFallback: "Instructional Design Excellence",
        descriptionKey: "webinar_advantage_3_description",
        descriptionFallback: "Our team includes certified instructional designers with specific expertise in transforming presentation-based content into effective digital learning experiences that drive measurable outcomes.",
        delay: 0.2,
    },
    {
        icon: Settings,
        titleKey: "webinar_advantage_4_title",
        titleFallback: "Technical Versatility",
        descriptionKey: "webinar_advantage_4_description",
        descriptionFallback: "Our developers are certified in all major eLearning authoring tools (Articulate, Captivate, Lectora) and have deep experience with global LMS platforms, ensuring seamless implementation regardless of your technical environment.",
        delay: 0.3,
    },
    {
        icon: Search,
        titleKey: "webinar_advantage_5_title",
        titleFallback: "SEO Optimization",
        descriptionKey: "webinar_advantage_5_description",
        descriptionFallback: "We incorporate search engine optimization strategies throughout the conversion process, ensuring your transformed content ranks highly for relevant keywords and drives organic traffic to your learning resources.",
        delay: 0.4,
    },
    {
        icon: CheckCheck,
        titleKey: "webinar_advantage_6_title",
        titleFallback: "Comprehensive Service Offering",
        descriptionKey: "webinar_advantage_6_description",
        descriptionFallback: "We provide end-to-end services from initial analysis through deployment and evaluation, eliminating the need to coordinate multiple vendors for your conversion project.",
        delay: 0.5,
    },
]

const FAQ_ITEMS: FaqItemConfig[] = [
    {
        questionKey: "webinar_faq_item_1_question",
        questionFallback: "What types of webinars convert best to eLearning?",
        answerKey: "webinar_faq_item_1_answer",
        answerFallback: "While virtually any webinar can be converted, the most successful transformations typically come from content-rich presentations, product demonstrations, technical training, and thought leadership sessions. Webinars with clear learning objectives and structured content convert most effectively to eLearning formats.",
    },
    {
        questionKey: "webinar_faq_item_2_question",
        questionFallback: "How long does the webinar to eLearning conversion process take?",
        answerKey: "webinar_faq_item_2_answer",
        answerFallback: "Typical conversion timelines range from 2-6 weeks depending on the complexity and length of the original webinar. Our Bangalore team's 24/7 production capability allows us to deliver even complex projects 40-50% faster than most Western providers. We can also implement phased approaches for urgent training needs.",
    },
    {
        questionKey: "webinar_faq_item_3_question",
        questionFallback: "Will converted content work in our existing LMS?",
        answerKey: "webinar_faq_item_3_answer",
        answerFallback: "Yes, we ensure compatibility with all major learning management systems. Our technical team has extensive experience with Cornerstone, TalentLMS, Moodle, Blackboard, SAP SuccessFactors, and many other platforms, ensuring seamless integration with your existing infrastructure.",
    },
    {
        questionKey: "webinar_faq_item_4_question",
        questionFallback: "How do you maintain engagement in converted webinar content?",
        answerKey: "webinar_faq_item_4_answer",
        answerFallback: "We use a variety of digital strategies to enhance engagement, including interactive elements, knowledge checks, scenario-based activities, gamification, and microlearning principles. Our approach focuses on transforming passive viewing into active learning through strategic interaction points throughout the experience.",
    },
    {
        questionKey: "webinar_faq_item_5_question",
        questionFallback: "What is the ROI of converting webinars to eLearning?",
        answerKey: "webinar_faq_item_5_answer",
        answerFallback: "Organizations typically see ROI within 3-6 months of conversion, with ongoing returns as content continues to be accessed. Value comes from extended content lifespan (typically 18-24 months for converted content vs. 30 days for webinar recordings), expanded audience reach (300-500% more viewers), and measurable learning outcomes that drive business results.",
    },
]

export default function WebinarToElearningPage() {
    const { getContent } = usePageContent(PAGE_SLUG);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const introBullets = INTRO_BULLETS.map((bullet) => ({
        highlight: getContent(bullet.highlightKey, bullet.highlightFallback),
        description: getContent(bullet.descriptionKey, bullet.descriptionFallback),
    }));

    const benefits = BENEFIT_CARDS.map((card) => ({
        icon: card.icon,
        bgColor: card.color,
        title: getContent(card.titleKey, card.titleFallback),
        description: getContent(card.descriptionKey, card.descriptionFallback),
    }));

    const processSteps = PROCESS_STEPS.map((step, index) => ({
        icon: step.icon,
        title: getContent(step.titleKey, step.titleFallback),
        description: getContent(step.descriptionKey, step.descriptionFallback),
        delay: step.delay ?? 0,
        number: index + 1,
        showConnector: index < PROCESS_STEPS.length - 1,
    }));

    const challengeCards = CHALLENGE_CARDS.map((card) => ({
        title: getContent(card.titleKey, card.titleFallback),
        description: getContent(card.descriptionKey, card.descriptionFallback),
    }));

    const aiFeatures = AI_FEATURES.map((feature) => ({
        icon: feature.icon,
        title: getContent(feature.titleKey, feature.titleFallback),
        description: getContent(feature.descriptionKey, feature.descriptionFallback),
    }));

    const caseStudies = CASE_STUDIES.map((study) => ({
        title: getContent(study.titleKey, study.titleFallback),
        description: getContent(study.descriptionKey, study.descriptionFallback),
        metrics: study.metrics.map((metric) => ({
            icon: metric.icon,
            text: getContent(metric.textKey, metric.textFallback),
        })),
    }));

    const advantageCards = ADVANTAGE_CARDS.map((card) => ({
        icon: card.icon,
        title: getContent(card.titleKey, card.titleFallback),
        description: getContent(card.descriptionKey, card.descriptionFallback),
        delay: card.delay ?? 0,
    }));

    const faqItems = FAQ_ITEMS.map((item) => ({
        question: getContent(item.questionKey, item.questionFallback),
        answer: getContent(item.answerKey, item.answerFallback),
    }));

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <Image 
                        src="/IMAGES/6.Webinar to elearning conversion/download (1).png" 
                        alt="Webinar to eLearning Conversion Background" 
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {getContent(
                                "webinar_hero_title",
                                "Transform Your Webinars into Engaging On-Demand eLearning Experiences"
                            )}
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            {getContent(
                                "webinar_hero_description",
                                "Are you sitting on a goldmine of valuable webinar content that's only been viewed once? Our team specializes in transforming your existing webinars into interactive, engaging eLearning modules that extend the lifespan and impact of your virtual events."
                            )}
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                {getContent("webinar_hero_primary_cta", "Get Started")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#process" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                {getContent("webinar_hero_secondary_cta", "Learn More")}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Introduction Section */}
            <section id="introduction" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                {getContent(
                                    "webinar_intro_heading",
                                    "What Is Webinar to eLearning Conversion?"
                                )}
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                {getContent(
                                    "webinar_intro_paragraph_1",
                                    "Webinar to eLearning conversion is the strategic process of transforming live or recorded webinar content into structured, interactive eLearning modules that can be accessed on-demand through learning management systems."
                                )}
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                {getContent(
                                    "webinar_intro_paragraph_2",
                                    "This transformation enhances the original content by adding:"
                                )}
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                {introBullets.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong>{item.highlight}:</strong> {item.description}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative rounded-xl overflow-hidden shadow-xl">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                <Image
                                    src="/IMAGES/webinar to elearning conversion.jpg"
                                    alt="Webinar to eLearning Conversion Process"
                                    width={600}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            {getContent(
                                "webinar_benefits_heading",
                                "Why Convert Webinars to eLearning Modules?"
                            )}
                        </h2>
                        <p className="text-lg text-gray-700">
                            {getContent(
                                "webinar_benefits_description",
                                "Transform temporary virtual events into lasting educational assets that continue to deliver value long after the live session ends."
                            )}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {advantageCards.map((card, index) => {
                            const AdvantageIcon = card.icon
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: card.delay }}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                        <AdvantageIcon className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{card.title}</h3>
                                    <p className="text-gray-700">{card.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-8 max-w-6xl mx-auto">
                        {/* Left Column - Sticky Title */}
                        <div className="md:sticky md:top-8 md:self-start">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    {getContent(
                                        "webinar_faq_heading",
                                        "Frequently Asked Questions"
                                    )}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {getContent(
                                        "webinar_faq_description",
                                        "Get answers to common questions about our webinar conversion services."
                                    )}
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Column - FAQ Items */}
                        <div className="space-y-0">
                            <div className="bg-orange-50 p-6 rounded-t-lg border-b border-orange-200">
                                <h3 className="text-xl font-semibold text-orange-800 mb-2">
                                    {getContent("webinar_faq_badge", "WEBINAR TO ELEARNING CONVERSION")}
                                </h3>
                            </div>
                            
                            {faqItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border-b border-gray-200 last:border-b-0"
                                >
                                    <div
                                        className="cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                                            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                                        </div>
                                        {openFaq === index && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            {getContent(
                                "webinar_cta_heading",
                                "Ready to Transform Your Webinar Library?"
                            )}
                        </h2>
                        <p className="text-xl mb-8">
                            {getContent(
                                "webinar_cta_description",
                                "Contact us today to discuss how our webinar to eLearning conversion services can help you extend content lifespan, expand audience reach, and generate measurable learning outcomes from your virtual events."
                            )}
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200 text-lg"
                        >
                            {getContent("webinar_cta_button_label", "Get Started Today")}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <Contact />
            </section>
        </div>
    )
}
