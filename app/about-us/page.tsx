"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import Contact from "@/components/contact"
import ContentRefreshListener from "@/components/content-refresh-listener"
// Removed import of getPageContent as we'll use the public API
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Target, Globe, Lightbulb, Heart, Star, Trophy, Brain, Zap, Shield } from "lucide-react"



interface TeamMember {
    name: string
    role: string
    description: string
    image?: string
}

interface TeamMemberConfig {
    nameKey: string
    nameFallback: string
    roleKey: string
    roleFallback: string
    descriptionKey: string
    descriptionFallback: string
}

interface ValueItem {
    title: string
    description: string
    icon: React.ReactNode
}

interface ValueItemConfig {
    titleKey: string
    titleFallback: string
    descriptionKey: string
    descriptionFallback: string
    icon: React.ReactNode
}

interface FAQItem {
    question: string
    answer: string
}

interface FAQItemConfig {
    questionKey: string
    questionFallback: string
    answerKey: string
    answerFallback: string
}

type MetricItem = {
    value: string
    label: string
}

type MetricConfig = {
    key: string
    valueFallback: string
    labelFallback: string
}

export default function AboutUsPage() {
    const [showTeam, setShowTeam] = useState(false)
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
    const [content, setContent] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)

    const scrollToAIJourney = () => {
        const aiSection = document.getElementById('ai-journey-section')
        if (aiSection) {
            aiSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    const scrollToLeadership = () => {
        const leadershipSection = document.getElementById('leadership-section')
        if (leadershipSection) {
            leadershipSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    const loadContent = async () => {
        try {
            // Add timestamp to prevent caching
            const timestamp = Date.now()
            const response = await fetch(`/api/content?page=about-us&_t=${timestamp}`)
            const data = await response.json()
            
            if (data.success) {
                setContent(data.data.content)
            } else {
                console.error('Error loading page content:', data.error)
            }
        } catch (error) {
            console.error('Error loading page content:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadContent()

        document.title = "Top AI-Powered eLearning Company in Bangalore, India | Swift Solution"

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Learn about Swift Solution, a leading AI-powered eLearning company in Bangalore with 25+ years of experience. Discover our authentic AI transformation, deep domain expertise, and commitment to delivering measurable ROI for clients like Google and Microsoft.')
        } else {
            const meta = document.createElement('meta')
            meta.name = 'description'
            meta.content = 'Learn about Swift Solution, a leading AI-powered eLearning company in Bangalore with 25+ years of experience. Discover our authentic AI transformation, deep domain expertise, and commitment to delivering measurable ROI for clients like Google and Microsoft.'
            document.head.appendChild(meta)
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
            metaKeywords.setAttribute('content', 'about swift solution, top elearning companies in bangalore, ai-powered elearning, corporate training solutions, elearning company india, custom elearning content')
        } else {
            const meta = document.createElement('meta')
            meta.name = 'keywords'
            meta.content = 'about swift solution, top elearning companies in bangalore, ai-powered elearning, corporate training solutions, elearning company india, custom elearning content'
            document.head.appendChild(meta)
        }
    }, [])

    // Helper function to get content with fallback
    const getContent = (key: string, fallback: string) => {
        return content[key] || fallback
    }

    const heroButtons = {
        primary: getContent('about_hero_primary_cta', 'Our AI Journey'),
        secondary: getContent('about_hero_secondary_cta', 'Meet Our Leadership')
    }

    const valueConfigs: ValueItemConfig[] = [
        {
            titleKey: 'about_value_client_centricity_title',
            titleFallback: 'Client-Centricity',
            descriptionKey: 'about_value_client_centricity_description',
            descriptionFallback: 'Your business goals are our priority. We listen, understand, and then design solutions that are perfectly aligned with your needs.',
            icon: <Heart className="h-8 w-8 text-orange-500" />
        },
        {
            titleKey: 'about_value_innovation_title',
            titleFallback: 'Innovation in Learning',
            descriptionKey: 'about_value_innovation_description',
            descriptionFallback: 'We continuously explore new technologies and instructional approaches to make learning more engaging and effective.',
            icon: <Lightbulb className="h-8 w-8 text-orange-500" />
        },
        {
            titleKey: 'about_value_measurable_impact_title',
            titleFallback: 'Measurable Impact',
            descriptionKey: 'about_value_measurable_impact_description',
            descriptionFallback: 'We focus on delivering eLearning solutions that lead to tangible improvements in performance and clear ROI.',
            icon: <BarChart className="h-8 w-8 text-orange-500" />
        },
        {
            titleKey: 'about_value_expertise_title',
            titleFallback: 'Expertise & Experience',
            descriptionKey: 'about_value_expertise_description',
            descriptionFallback: 'Leveraging over 25 years of specialized experience in the eLearning domain, particularly serving clients in Bangalore and across India.',
            icon: <Award className="h-8 w-8 text-orange-500" />
        },
        {
            titleKey: 'about_value_collaboration_title',
            titleFallback: 'Collaborative Partnership',
            descriptionKey: 'about_value_collaboration_description',
            descriptionFallback: 'We believe in working closely with our clients, fostering a partnership built on trust and shared objectives.',
            icon: <Users className="h-8 w-8 text-orange-500" />
        }
    ]

    const teamMemberConfigs: TeamMemberConfig[] = [
        {
            nameKey: 'about_leadership_member_1_name',
            nameFallback: 'Keshavan Belagod',
            roleKey: 'about_leadership_member_1_role',
            roleFallback: 'Co-founder and Director',
            descriptionKey: 'about_leadership_member_1_description',
            descriptionFallback: 'Over 25 years of profound experience in the e-Learning sector. A regular and respected speaker at national e-Learning conferences in India, Keshavan holds an MPhil in e-Learning.'
        },
        {
            nameKey: 'about_leadership_member_2_name',
            nameFallback: 'Madhusudhan Reddy',
            roleKey: 'about_leadership_member_2_role',
            roleFallback: 'Co-founder and Director',
            descriptionKey: 'about_leadership_member_2_description',
            descriptionFallback: 'Technical head of the company with over 20 years of rich experience. Madhusudhan holds an MTech in Computer Science, providing a strong technical foundation for our innovative solutions.'
        },
        {
            nameKey: 'about_leadership_member_3_name',
            nameFallback: 'Manirangan',
            roleKey: 'about_leadership_member_3_role',
            roleFallback: 'Co-founder and Director',
            descriptionKey: 'about_leadership_member_3_description',
            descriptionFallback: 'Over 20 years of experience in e-Learning, application software selling, and IT consulting. Computer Science graduate with an MBA, blending technical knowledge with strategic business acumen.'
        }
    ]

    const faqConfigs: FAQItemConfig[] = [
        {
            questionKey: 'about_faq_1_question',
            questionFallback: 'Why should our business consider outsourcing to eLearning companies in Bangalore?',
            answerKey: 'about_faq_1_answer',
            answerFallback: 'Outsourcing to eLearning companies in Bangalore offers a strategic advantage due to the region\'s vast talent pool of skilled instructional designers, multimedia developers, and project managers. Bangalore, known as India\'s Silicon Valley, is a hub for innovation and technology, ensuring access to cutting-edge eLearning solutions. Moreover, eLearning companies in Bangalore often provide significant cost efficiencies without compromising on quality, delivering world-class custom eLearning content that meets global standards.'
        },
        {
            questionKey: 'about_faq_2_question',
            questionFallback: 'What makes Bangalore a preferred destination for finding top-tier eLearning companies?',
            answerKey: 'about_faq_2_answer',
            answerFallback: 'Bangalore is a preferred destination because it hosts a high concentration of premier educational institutions and a thriving IT and BPO sector, which cultivates a rich ecosystem for eLearning companies. This environment ensures a continuous supply of professionals proficient in the latest eLearning technologies and instructional design methodologies. When you partner with eLearning companies in Bangalore, you tap into this deep expertise and a culture of continuous learning and innovation.'
        },
        {
            questionKey: 'about_faq_3_question',
            questionFallback: 'How do eLearning companies in Bangalore ensure quality and effective communication?',
            answerKey: 'about_faq_3_answer',
            answerFallback: 'Reputable eLearning companies in Bangalore prioritize quality and client communication by adhering to international standards (like ISO certifications) and employing robust project management methodologies (like Agile). Many professionals in Bangalore have excellent English proficiency and experience working with global clients, ensuring smooth collaboration. Furthermore, eLearning companies in Bangalore often leverage modern communication tools and flexible working hours to bridge geographical distances and time zone differences effectively.'
        }
    ]

    const values: ValueItem[] = valueConfigs.map((value) => ({
        title: getContent(value.titleKey, value.titleFallback),
        description: getContent(value.descriptionKey, value.descriptionFallback),
        icon: value.icon
    }))

    const faqs: FAQItem[] = faqConfigs.map((faq) => ({
        question: getContent(faq.questionKey, faq.questionFallback),
        answer: getContent(faq.answerKey, faq.answerFallback)
    }))

    const teamMembers: TeamMember[] = teamMemberConfigs.map((member) => ({
        name: getContent(member.nameKey, member.nameFallback),
        role: getContent(member.roleKey, member.roleFallback),
        description: getContent(member.descriptionKey, member.descriptionFallback)
    }))

    const foundationPillarConfigs = [
        {
            key: 'proven_track_record',
            icon: <Trophy className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-orange-500',
            borderClass: 'border-orange-100',
            titleFallback: 'Proven Track Record',
            descriptionFallback: 'We have successfully delivered over 1,000 projects for more than 200 distinct clients across diverse industries, including global leaders like Google, Microsoft, and Siemens.',
            metricsLayout: 'grid',
            metrics: [
                { key: 'projects', valueFallback: '1,000+', labelFallback: 'Projects' },
                { key: 'clients', valueFallback: '200+', labelFallback: 'Clients' },
                { key: 'years', valueFallback: '25+', labelFallback: 'Years' }
            ] as MetricConfig[]
        },
        {
            key: 'client_relationship_mastery',
            icon: <Users className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-blue-500',
            borderClass: 'border-blue-100',
            titleFallback: 'Client Relationship Mastery',
            descriptionFallback: 'Our philosophy is built on creating long-term value, a stark contrast to the transactional nature of most providers. This is validated by client relationships that span decades and an 80% inquiry-to-order conversion rate sustained over the last 6-7 years.',
            metricsLayout: 'highlight',
            metrics: [
                { key: 'conversion_rate', valueFallback: '80%', labelFallback: 'Inquiry-to-Order Conversion Rate' }
            ] as MetricConfig[]
        },
        {
            key: 'value_based_partnerships',
            icon: <Target className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-green-500',
            borderClass: 'border-green-100',
            titleFallback: 'Value-Based Partnerships',
            descriptionFallback: 'We transform one-time projects into ongoing rate contracts, demonstrating our ability to deliver long-term organizational impact. Our approach focuses on sustainable partnerships rather than transactional relationships.',
            metricsLayout: 'none',
            metrics: [] as MetricConfig[]
        },
        {
            key: 'operational_excellence',
            icon: <BarChart className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-purple-500',
            borderClass: 'border-purple-100',
            titleFallback: 'Operational Excellence',
            descriptionFallback: 'We have achieved consistent growth and operate with zero debt, a testament to our financial discipline. Our lean operational structure allows us to handle significant revenue variations with stable monthly costs, ensuring both competitive advantage and scalability.',
            metricsLayout: 'none',
            metrics: [] as MetricConfig[]
        }
    ]

    const foundationPillars = foundationPillarConfigs.map((pillar) => ({
        key: pillar.key,
        icon: pillar.icon,
        iconWrapperClass: pillar.iconWrapperClass,
        borderClass: pillar.borderClass,
        metricsLayout: pillar.metricsLayout as 'grid' | 'highlight' | 'none',
        title: getContent(`about_foundation_${pillar.key}_title`, pillar.titleFallback),
        description: getContent(`about_foundation_${pillar.key}_description`, pillar.descriptionFallback),
        metrics: pillar.metrics.map((metric) => ({
            value: getContent(`about_foundation_${pillar.key}_metric_${metric.key}_value`, metric.valueFallback),
            label: getContent(`about_foundation_${pillar.key}_metric_${metric.key}_label`, metric.labelFallback)
        })) as MetricItem[]
    }))

    const aiSectionContent = {
        title: getContent('about_ai_section_title', 'Our Edge: An Authentic, Two-Year AI-Powered Transformation'),
        description: getContent('about_ai_section_description', 'We are a pioneer in the authentic implementation of AI within the L&D industry. Our systematic, two-year AI transformation journey is not a theoretical exercise but a practical integration validated by enterprise client acceptance.'),
        philosophyTitle: getContent('about_ai_philosophy_title', 'The Philosophy of Human-AI Collaboration'),
        philosophyDescription: getContent('about_ai_philosophy_description', 'Our approach is centered on human augmentation, not replacement. AI generates, but human experts validate and review, ensuring that we improve efficiency without compromising quality. This model has been critical to gaining enterprise client acceptance for AI-enhanced deliverables.')
    }

    const aiJourneyCardConfigs = [
        {
            key: 'systematic_journey',
            icon: <Brain className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-blue-500',
            wrapperClass: 'bg-gradient-to-br from-blue-50 to-blue-100',
            titleFallback: 'A Systematic Journey',
            descriptionFallback: 'Beginning in April 2023 with the adoption of ChatGPT for scriptwriting, our journey progressed through six distinct phases. This methodical evolution included integrating AI for visual storyboards, optimizing entire project workflows, and strategically selecting AI-enhanced tools.',
            bulletFallbacks: [
                'ChatGPT Integration for Scriptwriting',
                'AI-Enhanced Visual Storyboards',
                'Complete Workflow Optimization'
            ],
            highlightMetric: undefined
        },
        {
            key: 'ecosystem_consolidation',
            icon: <Globe className="h-8 w-8 text-white" />,
            iconWrapperClass: 'bg-green-500',
            wrapperClass: 'bg-gradient-to-br from-green-50 to-green-100',
            titleFallback: 'Ecosystem Consolidation',
            descriptionFallback: 'In 2025, we strategically consolidated our toolset around the Google ecosystem, fully transitioning to Gemini to enhance efficiency and optimize costs. Today, AI is fully integrated into our core processes, including instructional design, storyboards, media planning, scheduling, and client management.',
            bulletFallbacks: [] as string[],
            highlightMetric: {
                valueFallback: '60-70%',
                labelFallback: 'Efficiency Gains in Content Preparation'
            }
        }
    ] as const

    const aiJourneyCards = aiJourneyCardConfigs.map((card) => ({
        key: card.key,
        icon: card.icon,
        iconWrapperClass: card.iconWrapperClass,
        wrapperClass: card.wrapperClass,
        title: getContent(`about_ai_${card.key}_title`, card.titleFallback),
        description: getContent(`about_ai_${card.key}_description`, card.descriptionFallback),
        bullets: card.bulletFallbacks.map((bullet, index) => getContent(`about_ai_${card.key}_bullet_${index + 1}`, bullet)),
        highlightMetric: card.highlightMetric
            ? {
                value: getContent(`about_ai_${card.key}_highlight_value`, card.highlightMetric.valueFallback),
                label: getContent(`about_ai_${card.key}_highlight_label`, card.highlightMetric.labelFallback)
            }
            : null
    }))

    const valuesSection = {
        title: getContent('about_values_section_title', 'What Guides Us: Our Core Values and Unwavering Commitment')
    }

    const faqSection = {
        title: getContent('about_faq_section_title', 'Frequently Asked Questions (FAQs) about eLearning in Bangalore'),
        categoryLabel: getContent('about_faq_category_label', 'ELEARNING IN BANGALORE')
    }

    const leadershipSection = {
        title: getContent('about_leadership_section_title', 'The Minds Behind Swift Solution: Our Leadership Team'),
        description: getContent('about_leadership_section_description', 'Our leadership team brings a wealth of experience and a shared passion for leveraging technology to enhance learning and performance. Their expertise is a key reason why Swift Solution is considered one of the top eLearning companies in Bangalore.')
    }

    const leadershipStatsConfig = [
        { key: 'projects', valueFallback: '1,000+', labelFallback: 'Projects Delivered' },
        { key: 'clients', valueFallback: '200+', labelFallback: 'Distinct Clients' },
        { key: 'conversion_rate', valueFallback: '80%', labelFallback: 'Conversion Rate' },
        { key: 'years_experience', valueFallback: '25+', labelFallback: 'Years Experience' }
    ]

    const leadershipStats = leadershipStatsConfig.map((stat) => ({
        value: getContent(`about_leadership_stat_${stat.key}_value`, stat.valueFallback),
        label: getContent(`about_leadership_stat_${stat.key}_label`, stat.labelFallback)
    }))

    const uvpSection = {
        title: getContent('about_uvp_section_title', 'The Swift Solution Unique Value Proposition: Why We Lead the Market'),
        description: getContent('about_uvp_section_description', 'Our unique value proposition is the convergence of three powerful, rarely combined elements'),
        highlightTitle: getContent('about_uvp_highlight_title', 'Market Leadership Based on Authentic Experience'),
        highlightDescription: getContent('about_uvp_highlight_description', 'Our market leadership is based on authentic experience, not theoretical claims. We offer our clients, partners, and the industry a proven methodology for navigating the future of learning—a future that is efficient, effective, and fundamentally human.')
    }

    const uvpCardConfigs = [
        {
            key: 'deep_domain_expertise',
            icon: <Award className="h-10 w-10 text-white" />,
            iconWrapperClass: 'bg-blue-500',
            wrapperClass: 'bg-gradient-to-br from-blue-50 to-blue-100',
            titleFallback: 'Deep Domain Expertise',
            descriptionFallback: 'Validated by 25 years of client success and deep market insight. Our extensive experience across diverse industries gives us unparalleled understanding of learning challenges.'
        },
        {
            key: 'authentic_ai_transformation',
            icon: <Brain className="h-10 w-10 text-white" />,
            iconWrapperClass: 'bg-green-500',
            wrapperClass: 'bg-gradient-to-br from-green-50 to-green-100',
            titleFallback: 'Authentic AI Transformation',
            descriptionFallback: "Proven by a systematic, two-year implementation with measurable results and enterprise client acceptance. We don't just talk about AI - we live it."
        },
        {
            key: 'unwavering_ethical_leadership',
            icon: <Shield className="h-10 w-10 text-white" />,
            iconWrapperClass: 'bg-purple-500',
            wrapperClass: 'bg-gradient-to-br from-purple-50 to-purple-100',
            titleFallback: 'Unwavering Ethical Leadership',
            descriptionFallback: 'Demonstrated through transparent, value-based practices that build lasting trust and industry credibility. Our zero-debt operation speaks to our financial integrity.'
        }
    ]

    const uvpCards = uvpCardConfigs.map((card) => ({
        key: card.key,
        icon: card.icon,
        iconWrapperClass: card.iconWrapperClass,
        wrapperClass: card.wrapperClass,
        title: getContent(`about_uvp_${card.key}_title`, card.titleFallback),
        description: getContent(`about_uvp_${card.key}_description`, card.descriptionFallback)
    }))

    const finalCtaSection = {
        title: getContent('about_final_cta_title', 'Choose Swift Solution: Your Trusted Partner for AI-Powered eLearning'),
        description: getContent('about_final_cta_description', 'When you partner with Swift Solution, you are choosing one of the top eLearning companies in Bangalore with a proven track record of delivering excellence. We are passionate about helping your organization achieve its full potential through innovative and effective custom eLearning solutions.')
    }



    return (
        <div className="w-full">
            <ContentRefreshListener 
                pageSlug="about-us" 
                onContentUpdate={loadContent}
            />
            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/IMAGES/2.about us/download (2).png"
                        alt="About Swift Solution Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {getContent('about_swift_solution_title', 'About Swift Solution: Pioneering the Future of Corporate Training in Bangalore')}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-4xl mx-auto">
                            {getContent('our_existence_hinges_description', 'Our existence hinges on one simple principle: improving your business performance. We are not just another vendor; we are a strategic partner recognized as one of the top eLearning companies in Bangalore.')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={scrollToAIJourney}
                                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200"
                            >
                                {heroButtons.primary}
                            </button>
                            <button 
                                onClick={scrollToLeadership}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-200"
                            >
                                {heroButtons.secondary}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Foundation Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {getContent('our_foundation_three_title', 'Our Foundation: Three Decades of L&D Mastery and Client Success')}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                {getContent('our_professional_identity_description', 'Our professional identity is built on a fundamental understanding of the Indian L&D ecosystem, which has historically been fragmented and lacking in standardized, systematic approaches. Our journey has been a deliberate effort to build structure, quality, and consistency where it is rare.')}
                            </p>
                        </div>

                        {/* Foundation Pillars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {foundationPillars.map((pillar) => (
                                <div
                                    key={pillar.key}
                                    className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border ${pillar.borderClass}`}
                                >
                                    <div className="flex items-center mb-6">
                                        <div className={`${pillar.iconWrapperClass} p-3 rounded-full`}>
                                            {pillar.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold ml-4 text-gray-900">{pillar.title}</h3>
                                    </div>
                                    <p className={`text-gray-700 leading-relaxed${pillar.metrics.length > 0 ? ' mb-4' : ''}`}>
                                        {pillar.description}
                                    </p>
                                    {pillar.metrics.length > 0 && pillar.metricsLayout === 'grid' && (
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            {pillar.metrics.map((metric) => (
                                                <div key={metric.label}>
                                                    <div className="text-2xl font-bold text-orange-600">{metric.value}</div>
                                                    <div className="text-gray-600 text-sm">{metric.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {pillar.metrics.length > 0 && pillar.metricsLayout === 'highlight' && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            {pillar.metrics.map((metric) => (
                                                <div key={metric.label} className="text-center">
                                                    <div className="text-3xl font-bold text-blue-600">{metric.value}</div>
                                                    <div className="text-blue-700">{metric.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* AI Transformation Section */}
            <section id="ai-journey-section" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {aiSectionContent.title}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                {aiSectionContent.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                            {aiJourneyCards.map((card) => (
                                <div key={card.key}>
                                    <div className={`${card.wrapperClass} rounded-2xl p-8`}>
                                        <div className="flex items-center mb-6">
                                            <div className={`${card.iconWrapperClass} p-3 rounded-full`}>
                                                {card.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold ml-4 text-gray-900">{card.title}</h3>
                                        </div>
                                        <p className={`text-gray-700 leading-relaxed${card.bullets.length > 0 || card.highlightMetric ? ' mb-6' : ''}`}>
                                            {card.description}
                                        </p>
                                        {card.bullets.length > 0 && (
                                            <div className="space-y-3">
                                                {card.bullets.map((bullet) => (
                                                    <div key={bullet} className="flex items-center">
                                                        <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                                                        <span className="text-gray-700">{bullet}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {card.highlightMetric && (
                                            <div className="bg-white rounded-lg p-4">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-green-600 mb-2">{card.highlightMetric.value}</div>
                                                    <div className="text-green-700">{card.highlightMetric.label}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-orange-500 p-3 rounded-full">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ml-4 text-gray-900">{aiSectionContent.philosophyTitle}</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                                    {aiSectionContent.philosophyDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Our Values Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {valuesSection.title}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {values.map((value, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 text-center">
                                    <div className="bg-orange-50 p-4 rounded-full inline-block mb-6">
                                        {value.icon}
                                    </div>
                                    <h4 className="text-xl font-semibold mb-4 text-gray-900">{value.title}</h4>
                                    <p className="text-gray-700 leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-[1fr,2fr] gap-16 max-w-7xl mx-auto">
                        {/* Left side - title */}
                        <div>
                            <h2 className="text-4xl font-bold sticky top-24">
                                {faqSection.title}
                            </h2>
                        </div>

                        {/* Right side - FAQ content */}
                        <div>
                            <div className="mb-12">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                                    {faqSection.categoryLabel}
                                </h3>
                                <div className="space-y-px">
                                    {faqs.map((faq, index) => {
                                        const isItemOpen = expandedFAQ === index;

                                        return (
                                            <div key={index} className="border-t border-gray-200 first:border-t-0">
                                                <button
                                                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                                    className="flex justify-between items-center w-full py-6 text-left"
                                                >
                                                    <span className={`text-lg font-medium ${isItemOpen ? "text-blue-500" : "text-gray-900"}`}>
                                                        {faq.question}
                                                    </span>
                                                    <span className="ml-6 flex-shrink-0">
                                                        {isItemOpen ? (
                                                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                </button>
                                                {isItemOpen && (
                                                    <div className="pb-6">
                                                        <p className="text-gray-600">{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Leadership Team Section */}
            <section id="leadership-section" className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {leadershipSection.title}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                {leadershipSection.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <Users className="h-12 w-12 text-orange-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-3 text-gray-900">{member.name}</h4>
                                    <p className="text-orange-600 font-semibold mb-4 text-lg">{member.role}</p>
                                    <p className="text-gray-700 leading-relaxed">{member.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Company Stats */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
                            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Swift Solution by the Numbers</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                {leadershipStats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                                        <div className="text-gray-700 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Unique Value Proposition Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                {uvpSection.title}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                                {uvpSection.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {uvpCards.map((card) => (
                                <div key={card.key} className={`${card.wrapperClass} rounded-2xl p-8 text-center`}>
                                    <div className={`${card.iconWrapperClass} p-4 rounded-full inline-block mb-6`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{card.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center">
                            <h3 className="text-2xl font-bold mb-4">{uvpSection.highlightTitle}</h3>
                            <p className="text-orange-100 mb-6 max-w-4xl mx-auto text-lg">
                                {uvpSection.highlightDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Final CTA Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                                    {finalCtaSection.title}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6"></div>
                                <p className="text-xl text-gray-600 mb-8">
                                    {finalCtaSection.description}
                                </p>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">

                    <Contact />
                </div>
            </section>
        </div>
    )
}
