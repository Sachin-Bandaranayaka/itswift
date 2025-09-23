"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Hero from "@/components/hero"
import ValueProposition from "@/components/value-proposition"
import Services from "@/components/services"
import Outsourcing from "@/components/outsourcing"
import Stats from "@/components/stats"
import DynamicFAQ from "@/components/dynamic-faq"
import BrandCarousel from "@/components/brand-carousel"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, TrendingUp, TrendingDown, Clock, Users, DollarSign, Award, Target, Building, BarChart3, ChevronDown, Lightbulb, Phone, Mail } from 'lucide-react'
import DynamicContent from '@/components/dynamic-content'
import Image from "next/image"

const caseStudies = [
  {
    id: 1,
    slug: "swift-solution-lean-training",
    clientKey: "case_study_1_client",
    clientFallback: "Swift Solution",
    logo: "/Logos (3)/Logos/standard-chartered-bank-new-20211713.jpg",
    headerImage: "/IMAGES/case studies/CaseStudy_AutomotiveBattery_Final.jpg",
    titleKey: "case_study_1_title",
    titleFallback: "Lean Training for 2000 Shopfloor Employees",
    challengeKey: "case_study_1_challenge",
    challengeFallback: "Large-scale workforce transformation requiring efficient training delivery",
    solutionKey: "case_study_1_solution",
    solutionFallback: "Comprehensive eLearning platform with interactive modules and assessments",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metricKey: "case_study_1_result_1_metric", metricFallback: "95% completion rate", descriptionKey: "case_study_1_result_1_description", descriptionFallback: "Across all training modules" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metricKey: "case_study_1_result_2_metric", metricFallback: "60% faster delivery", descriptionKey: "case_study_1_result_2_description", descriptionFallback: "Compared to traditional methods" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricKey: "case_study_1_result_3_metric", metricFallback: "40% cost reduction", descriptionKey: "case_study_1_result_3_description", descriptionFallback: "In training delivery costs" }
    ],
    industryKey: "case_study_1_industry",
    industryFallback: "Manufacturing",
    color: "from-blue-500 to-cyan-400",
    detailedContent: {
      snapshot: "Swift Solution successfully transformed lean training delivery for 2000 shopfloor employees, achieving remarkable efficiency gains and cost savings through innovative eLearning solutions.",
      introduction: "In today's competitive manufacturing landscape, implementing lean methodologies across large workforces presents significant challenges. Swift Solution partnered with a leading manufacturing company to revolutionize their lean training approach for 2000 shopfloor employees.",
      challengeDetails: {
        title: "The Challenge",
        content: "The client faced the daunting task of training 2000 shopfloor employees in lean methodologies within a tight timeline. Traditional classroom-based training was proving inefficient, costly, and difficult to scale. Key challenges included:\n\n• Coordinating training schedules across multiple shifts\n• Ensuring consistent training quality across different locations\n• Managing high training costs and resource allocation\n• Tracking progress and competency development\n• Minimizing production downtime during training"
      },
      solutionDetails: {
        title: "Our Solution",
        content: "Swift Solution developed a comprehensive eLearning platform specifically designed for shopfloor environments:\n\n• **Interactive Learning Modules**: Bite-sized, engaging content covering all aspects of lean methodology\n• **Mobile-First Design**: Accessible on tablets and mobile devices for flexible learning\n• **Gamification Elements**: Progress tracking, badges, and leaderboards to boost engagement\n• **Multilingual Support**: Content available in local languages for better comprehension\n• **Offline Capability**: Learning modules accessible without internet connectivity\n• **Real-time Analytics**: Comprehensive tracking and reporting dashboard"
      },
      resultsDetails: {
        title: "Results Achieved",
        content: "The implementation delivered exceptional results that exceeded all expectations:\n\n• **95% Completion Rate**: Significantly higher than traditional training methods\n• **60% Faster Delivery**: Reduced training time from weeks to days\n• **40% Cost Reduction**: Substantial savings in training delivery costs\n• **Improved Knowledge Retention**: 85% retention rate after 3 months\n• **Enhanced Productivity**: 25% improvement in lean implementation metrics\n• **Scalable Solution**: Framework ready for expansion to additional facilities"
      },
      conclusion: {
        title: "Transforming Manufacturing Training",
        content: "This project demonstrates Swift Solution's ability to deliver scalable, effective training solutions that drive real business results. Our innovative approach to lean training has set a new standard for manufacturing education.",
        callToAction: {
          title: "Ready to Transform Your Training?",
          content: "Discover how Swift Solution can revolutionize your workforce development with cutting-edge eLearning solutions.",
          contact: {
            phone: "+91 80 4154 1288",
            email: "info@itswift.com",
            website: "www.itswift.com"
          }
        }
      }
    }
  },
  {
    id: 2,
    slug: "global-edtech-scalable-courseware",
    clientKey: "case_study_2_client",
    clientFallback: "Global EdTech Leader",
    logo: "/Logos (3)/Logos/reliance retail.png",
    headerImage: "/IMAGES/case studies/CaseStudy_EdTech_Inurture.jpg",
    titleKey: "case_study_2_title",
    titleFallback: "Scalable Courseware for Global EdTech Leader",
    challengeKey: "case_study_2_challenge",
    challengeFallback: "Rapidly scaling courseware development without sacrificing quality",
    solutionKey: "case_study_2_solution",
    solutionFallback: "Turnkey course development model with standardized templates and robust QA",
    results: [
      { icon: <Clock className="h-5 w-5 text-green-500" />, metricKey: "case_study_2_result_1_metric", metricFallback: "Faster delivery", descriptionKey: "case_study_2_result_1_description", descriptionFallback: "Of high-quality courses" },
      { icon: <Users className="h-5 w-5 text-orange-500" />, metricKey: "case_study_2_result_2_metric", metricFallback: "Universities enabled", descriptionKey: "case_study_2_result_2_description", descriptionFallback: "To launch programs on schedule" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricKey: "case_study_2_result_3_metric", metricFallback: "Scalable framework", descriptionKey: "case_study_2_result_3_description", descriptionFallback: "For future course creation" }
    ],
    industryKey: "case_study_2_industry",
    industryFallback: "EdTech",
    color: "from-orange-500 to-red-400",
    detailedContent: {
      snapshot: "Swift Solution delivered a scalable courseware development solution for a global EdTech leader, enabling rapid content creation without compromising quality through standardized processes and robust QA frameworks.",
      introduction: "A globally recognized education services provider was facing a classic growth challenge: how to scale content production to meet the demands of a rapidly expanding network of university partners without compromising on quality. The company needed to create large volumes of structured, high-quality courseware across multiple domains, and they needed to do it fast. They turned to Swift Solution to develop a scalable and repeatable course development model that would enable them to meet their ambitious growth targets.",
      challengeDetails: {
        title: "The Challenge: Balancing Speed and Quality in Courseware Development",
        content: "The EdTech leader was under pressure to deliver a diverse range of courseware, including assessments, faculty slides, gamified content, and multimedia lessons, to its university partners. The key challenges were:\n\n• **Scalability**: The company needed to rapidly scale its content development capabilities to meet the demands of its growing network of partners\n• **Consistency**: With multiple SMEs and content developers involved, maintaining consistency in quality and instructional design was a major challenge\n• **Speed**: Strict timelines imposed by universities required a faster turnaround time without compromising on quality\n\n*\"We were caught in a classic Catch-22. We needed to move fast, but we couldn't afford to sacrifice quality. We needed a partner who could help us do both.\"* - Program Director, EdTech Leader"
      },
      solutionDetails: {
        title: "The Solution: A Turnkey Course Development Model",
        content: "Swift Solution developed a turnkey course development model that was designed to be both scalable and quality-driven. Our solution included:\n\n• **Dedicated Project Management**: We appointed a dedicated project manager to oversee communication, escalation, and progress tracking, ensuring that the project stayed on track and on budget\n• **SME Collaboration**: We engaged SMEs across multiple domains to validate and design accurate curricula, ensuring that the courseware was both credible and relevant\n• **Standardized Templates**: We created standardized templates, TOCs, and instructional design guides to maintain consistency and streamline the development process\n• **Robust QA Process**: We deployed a robust quality assurance process that included plagiarism checks and multi-level reviews to ensure that all content met the highest standards of quality\n• **Pilot Testing**: We tested all content with pilot learners to identify areas for improvement before rolling it out to a wider audience\n\n*\"Swift Solution's turnkey model was exactly what we needed. It gave us the scalability and quality control we needed to meet our growth targets.\"* - Program Director, EdTech Leader"
      },
      resultsDetails: {
        title: "The Results: Faster Delivery, Higher Quality, and a Scalable Framework",
        content: "The turnkey course development model delivered significant results for the EdTech leader:\n\n• **Faster Delivery**: The streamlined development process enabled the company to deliver high-quality courses faster, allowing its university partners to launch their programs on schedule\n• **Higher Quality**: The robust QA process ensured that all courseware met the highest standards of quality and academic rigor\n• **Scalable Framework**: The repeatable framework enabled the company to scale its content development capabilities without starting from scratch each time\n• **Improved Efficiency**: Standardized templates and processes reduced development time by 40%\n• **Enhanced Collaboration**: Better coordination between SMEs and content developers improved overall project outcomes\n• **Quality Assurance**: Zero quality-related escalations from university partners post-implementation"
      },
      conclusion: {
        title: "A Partnership for Growth",
        content: "This case study highlights the importance of a strategic partnership in achieving scalable and sustainable growth. By partnering with Swift Solution, the EdTech leader was able to overcome its content development challenges and position itself for long-term success. This project serves as a model for other EdTech companies looking to scale their content production without sacrificing quality.",
        callToAction: {
          title: "Ready to Scale Your Content Development?",
          content: "If you're an EdTech company looking to scale your content development without sacrificing quality, we can help. Contact us today for a free consultation and learn how Swift Solution can help you achieve your growth targets.",
          contact: {
            phone: "+91-80-23215884",
            email: "info@itswift.com",
            website: "https://www.itswift.com/contact-us"
          }
        }
      }
    }
  },
  {
    id: 3,
    slug: "furniture-brand-mobile-first-training",
    clientKey: "case_study_3_client",
    clientFallback: "Furniture Brand",
    logo: "/Logos (3)/Logos/mrf-logo.png",
    headerImage: "/IMAGES/case studies/CaseStudy_Furniture_Final.jpg",
    titleKey: "case_study_3_title",
    titleFallback: "Modernizing Dealer Training with Mobile-First eLearning",
    challengeKey: "case_study_3_challenge",
    challengeFallback: "Fragmented training landscape with inconsistent messaging and high costs",
    solutionKey: "case_study_3_solution",
    solutionFallback: "Mobile-first eLearning program with microlearning videos and multilingual content",
    results: [
      { icon: <TrendingDown className="h-5 w-5 text-green-500" />, metricKey: "case_study_3_result_1_metric", metricFallback: "60% reduction", descriptionKey: "case_study_3_result_1_description", descriptionFallback: "In training costs" },
      { icon: <Users className="h-5 w-5 text-blue-500" />, metricKey: "case_study_3_result_2_metric", metricFallback: "1000+ certified", descriptionKey: "case_study_3_result_2_description", descriptionFallback: "Employees in first year" },
      { icon: <Award className="h-5 w-5 text-purple-500" />, metricKey: "case_study_3_result_3_metric", metricFallback: "Improved consistency", descriptionKey: "case_study_3_result_3_description", descriptionFallback: "In product messaging" }
    ],
    industryKey: "case_study_3_industry",
    industryFallback: "Furniture & Retail",
    color: "from-green-500 to-teal-400",
    detailedContent: {
      snapshot: "Swift Solution transformed a furniture brand's fragmented dealer training with a mobile-first eLearning program, reducing costs by 60% while certifying over 1000 employees and improving consistency across their dealer network.",
      introduction: "A leading furniture brand was struggling with a decentralized training approach that was creating inconsistent messaging, high costs, and low engagement across their vast network of dealers and distributors. They needed a modern, scalable solution that could unify their training landscape while reducing costs and improving engagement. Swift Solution developed a comprehensive mobile-first eLearning program that transformed their dealer training approach.",
      challengeDetails: {
        title: "The Challenge: Unifying a Fragmented Training Landscape",
        content: "The furniture brand's decentralized training approach was creating a number of problems:\n\n• **Inconsistent Messaging**: With no centralized training program, product messaging and sales techniques varied from region to region, leading to a fragmented brand experience for customers\n• **High Costs**: Traditional classroom-based training was expensive, with high costs for instructors, travel, and facilities\n• **Lack of Scalability**: The existing training model was not scalable enough to cover the company's vast network of dealers and distributors\n• **Low Engagement**: The training was not engaging enough to motivate dealers and sales staff to participate\n\n*\"We had a world-class product, but our training was stuck in the past. We needed a solution that was as modern and innovative as our furniture.\"* - L&D Head, Furniture Brand"
      },
      solutionDetails: {
        title: "The Solution: A Mobile-First eLearning Program",
        content: "Swift Solution developed a mobile-first eLearning program that was designed to be engaging, accessible, and scalable. Our solution included:\n\n• **Microlearning Videos**: We developed a series of short, 2-3 minute microlearning videos that were designed to be engaging and easy to consume on a mobile device\n• **Multilingual Content**: We created multilingual modules to accommodate dealers from diverse regions, ensuring that everyone could learn in their preferred language\n• **Centralized LMS**: We deployed a CMS integrated with a cloud LMS to ensure easy access and management of the training content\n• **Assessments and Certifications**: We introduced assessments and certifications to ensure accountability and motivate learners to complete the training\n\n*\"Swift Solution's mobile-first approach was a game-changer for us. It allowed us to reach all of our dealers, regardless of their location, and provide them with the training they needed to succeed.\"* - L&D Head, Furniture Brand"
      },
      resultsDetails: {
        title: "The Results: Reduced Costs, Increased Engagement, and a Certified Workforce",
        content: "The mobile-first eLearning program delivered significant results for the furniture brand:\n\n• **60% Reduction in Training Costs**: The program reduced training costs by 60% compared to traditional classroom-based training\n• **1000+ Certified Employees**: Over 1000 employees were trained and certified in the first year, creating a more knowledgeable and effective sales force\n• **Improved Consistency and Engagement**: The centralized training program improved consistency in product messaging and led to a significant increase in engagement across the dealer network\n• **Enhanced Accessibility**: Mobile-first design enabled training access anytime, anywhere\n• **Scalable Framework**: The solution provided a repeatable model for future training initiatives\n• **Better Analytics**: Comprehensive tracking and reporting capabilities improved training oversight"
      },
      conclusion: {
        title: "A Model for Modern Dealer Training",
        content: "This case study demonstrates the power of mobile-first eLearning to transform dealer training. By leveraging a centralized, multilingual, and engaging eLearning solution, Swift Solution was able to help the furniture brand to reduce costs, increase engagement, and create a more knowledgeable and effective sales force. This project serves as a model for other companies looking to modernize their dealer training programs.",
        callToAction: {
          title: "Ready to Modernize Your Dealer Training?",
          content: "If you're looking to create a centralized, engaging, and effective training program for your dealer network, we can help. Contact us today for a free consultation and learn how Swift Solution can help you achieve your training goals.",
          contact: {
            phone: "+91-80-23215884",
            email: "info@itswift.com",
            website: "https://www.itswift.com/contact-us"
          }
        }
      }
    }
  }
]

export default function Home() {

  // Service schema markup
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI-Powered eLearning Solutions",
    "description": "Custom eLearning content development, AI-powered corporate training, and comprehensive learning management solutions",
    "provider": {
      "@type": "Organization",
      "name": "Swift Solution",
      "url": "https://www.itswift.com"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Bangalore, India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "eLearning Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom eLearning Content Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI-Powered Corporate Training"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Learning Management System Integration"
          }
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main>
      <Hero />
      
      {/* Swift Solution Unique Value Proposition Section - Moved to appear after Hero */}
      <section className="py-20 bg-white relative overflow-hidden">

        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Enhanced title with gradient and better typography */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
                Why Choose Swift Solution
              </span>
            </div>
            
            <DynamicContent 
              sectionKey="unique_value_title" 
              pageSlug="home" 
              fallback="The Swift Solution Unique Value Proposition"
              as="h2"
              className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 leading-tight"
            />
            
            <DynamicContent 
              sectionKey="unique_value_description" 
              pageSlug="home" 
              fallback="We bring together three rarely combined strengths that set us apart in the eLearning industry:"
              as="div"
              className="text-xl md:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed"
            />

            {/* Enhanced cards with orange-focused design and white background */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-orange-100 transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-600">
                    <DynamicContent 
                      sectionKey="domain_expertise_title" 
                      pageSlug="home" 
                      fallback="Domain Expertise"
                      as="span"
                    />
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <DynamicContent 
                      sectionKey="domain_expertise_description" 
                      pageSlug="home" 
                      fallback="30 years of client success and market insight, delivering proven results across industries."
                      as="span"
                    />
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-orange-100 transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-500">
                    <DynamicContent 
                      sectionKey="ai_transformation_title" 
                      pageSlug="home" 
                      fallback="Authentic AI Transformation"
                      as="span"
                    />
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <DynamicContent 
                      sectionKey="ai_transformation_description" 
                      pageSlug="home" 
                      fallback="A two-year journey with measurable results and enterprise adoption, leading the AI revolution in eLearning."
                      as="span"
                    />
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 lg:p-10 shadow-xl border border-orange-100 transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-orange-700">
                    <DynamicContent 
                      sectionKey="ethical_leadership_title" 
                      pageSlug="home" 
                      fallback="Ethical Leadership"
                      as="span"
                    />
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <DynamicContent 
                      sectionKey="ethical_leadership_description" 
                      pageSlug="home" 
                      fallback="Transparent, value-driven practices that build lasting trust and partnerships with our clients."
                      as="span"
                    />
                  </p>
                </div>
              </motion.div>
            </div>
            

          </motion.div>
        </div>
      </section>
      
      <BrandCarousel />
      <ValueProposition />
      <Services />

      {/* Our Comprehensive eLearning Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <DynamicContent 
              sectionKey="services_section_title" 
              pageSlug="home" 
              fallback="Our Comprehensive eLearning Services"
              as="h2"
              className="text-4xl font-bold mb-4 dark:text-white"
            />
            <DynamicContent 
              sectionKey="services_section_description" 
              pageSlug="home" 
              fallback="As a full-service eLearning solution provider in Bangalore, we offer a comprehensive range of services to meet all your corporate training needs."
              as="p"
              className="text-xl text-gray-600 dark:text-gray-300"
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/elearning-services/custom-elearning" className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
              >
                <DynamicContent 
                  sectionKey="service_1_title" 
                  pageSlug="home" 
                  fallback="Bespoke eLearning Content That Drives Results"
                  as="h3"
                  className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400"
                />
                <DynamicContent 
                  sectionKey="service_1_description" 
                  pageSlug="home" 
                  fallback="We specialize in creating high-quality, custom eLearning content that is tailored to your specific needs and objectives. Our team of instructional designers and content developers works closely with you to create engaging and effective learning experiences that deliver measurable results."
                  as="p"
                  className="text-gray-600 dark:text-gray-300 flex-grow"
                />
              </motion.div>
            </Link>

            <Link href="/elearning-services/ai-powered-solutions" className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
              >
                <DynamicContent 
                  sectionKey="service_2_title" 
                  pageSlug="home" 
                  fallback="The Future of Corporate Training is Here"
                  as="h3"
                  className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400"
                />
                <DynamicContent 
                  sectionKey="service_2_description" 
                  pageSlug="home" 
                  fallback="As a visionary AI-enabled eLearning solutions company in Bangalore, we are pioneering the use of artificial intelligence to create personalized, adaptive, and engaging learning experiences. Our AI-powered solutions are designed to optimize learning outcomes and maximize your return on investment."
                  as="p"
                  className="text-gray-600 dark:text-gray-300 flex-grow"
                />
              </motion.div>
            </Link>

            <Link href="/elearning-consultancy/lms-implementation" className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
              >
                <DynamicContent 
                  sectionKey="service_3_title" 
                  pageSlug="home" 
                  fallback="Strategic eLearning Consulting for Maximum Impact"
                  as="h3"
                  className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400"
                />
                <DynamicContent 
                  sectionKey="service_3_description" 
                  pageSlug="home" 
                  fallback="Our expert consultants work with you to develop comprehensive eLearning strategies that align with your business objectives. From needs analysis to implementation planning, we provide the guidance and expertise you need to achieve your training goals and drive organizational success."
                  as="p"
                  className="text-gray-600 dark:text-gray-300 flex-grow"
                />
              </motion.div>
            </Link>

            <Link href="/elearning-services/mobile-learning" className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
              >
                <DynamicContent 
                  sectionKey="service_4_title" 
                  pageSlug="home" 
                  fallback="Learning on the Go, Anytime, Anywhere"
                  as="h3"
                  className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400"
                />
                <DynamicContent 
                  sectionKey="service_4_description" 
                  pageSlug="home" 
                  fallback="We offer mobile learning and microlearning solutions that provide your employees with the flexibility to learn anytime, anywhere, on any device. Our mobile-first approach ensures that your employees can access learning content on the go, making it easier for them to stay up-to-date with the latest training and development."
                  as="p"
                  className="text-gray-600 dark:text-gray-300 flex-grow"
                />
              </motion.div>
            </Link>

            <Link href="/elearning-services/game-based-elearning" className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
              >
                <DynamicContent 
                  sectionKey="service_5_title" 
                  pageSlug="home" 
                  fallback="Engaging and Immersive Learning Experiences"
                  as="h3"
                  className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400"
                />
                <DynamicContent 
                  sectionKey="service_5_description" 
                  pageSlug="home" 
                  fallback="We believe that learning should be an enjoyable and immersive experience. That's why we incorporate gamification, simulations, and interactive content into our eLearning solutions. This not only makes learning more engaging but also improves knowledge retention and application."
                  as="p"
                  className="text-gray-600 dark:text-gray-300 flex-grow"
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      <Outsourcing />
      <Stats />
      <DynamicFAQ pageSlug="homepage" title="Frequently Asked Questions" />

      {/* Case Studies Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <DynamicContent 
              sectionKey="case_studies_title" 
              pageSlug="home" 
              fallback="Client Success Stories"
              as="h2"
              className="text-4xl font-bold mb-4 dark:text-white"
            />
            <DynamicContent 
              sectionKey="case_studies_description" 
              pageSlug="home" 
              fallback="See how leading organizations have transformed their learning and development with our custom solutions"
              as="p"
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            />
          </motion.div>

          <div className="grid gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                {/* Header with image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={study.headerImage}
                    alt={`${study.clientFallback} case study`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white">
                      <span className="text-white/80 text-sm">CLIENT</span>
                      <h3 className="font-bold text-lg">
                        <DynamicContent 
                          sectionKey={study.clientKey} 
                          pageSlug="home" 
                          fallback={study.clientFallback}
                          as="span"
                        />
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">
                    <DynamicContent 
                      sectionKey={study.titleKey} 
                      pageSlug="home" 
                      fallback={study.titleFallback}
                      as="span"
                    />
                  </h3>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">CHALLENGE</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      <DynamicContent 
                        sectionKey={study.challengeKey} 
                        pageSlug="home" 
                        fallback={study.challengeFallback}
                        as="span"
                      />
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">SOLUTION</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      <DynamicContent 
                        sectionKey={study.solutionKey} 
                        pageSlug="home" 
                        fallback={study.solutionFallback}
                        as="span"
                      />
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-3">RESULTS</h4>
                    <div className="space-y-3">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="mr-3 mt-0.5">{result.icon}</div>
                          <div>
                            <span className="font-bold text-lg block dark:text-white">
                              <DynamicContent 
                                sectionKey={result.metricKey} 
                                pageSlug="home" 
                                fallback={result.metricFallback}
                                as="span"
                              />
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              <DynamicContent 
                                sectionKey={result.descriptionKey} 
                                pageSlug="home" 
                                fallback={result.descriptionFallback}
                                as="span"
                              />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center">
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      <DynamicContent 
                        sectionKey={study.industryKey} 
                        pageSlug="home" 
                        fallback={study.industryFallback}
                        as="span"
                      />
                    </span>
                    <div className="flex gap-2">
                      {study.detailedContent && (
                        <Link href={`/case-studies/${study.slug}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Button asChild>
              <Link href="/case-studies">View All Case Studies</Link>
            </Button>
          </motion.div>
        </div>
      </section>



      <Contact />

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              <DynamicContent 
                sectionKey="newsletter_title" 
                pageSlug="home" 
                fallback="Stay Ahead with Expert Insights"
                as="span"
              />
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              <DynamicContent 
                sectionKey="newsletter_description" 
                pageSlug="home" 
                fallback="Get the latest trends, best practices, and exclusive content delivered to your inbox. Join thousands of learning professionals who trust our insights."
                as="span"
              />
            </p>
            
            <div className="flex justify-center">
              <NewsletterSignup
                variant="compact"
                showNameFields={true}
                title="Subscribe to Our Newsletter"
                description="Get weekly insights on eLearning trends, AI in education, and industry best practices"
                placeholder="Enter your email address"
                buttonText="Get Weekly Insights"
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full"
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Weekly expert insights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Industry trends & analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Exclusive case studies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  )
}

