import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Lightbulb, Target, Building, BarChart3, TrendingUp, Clock, Award, TrendingDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Contact from "@/components/contact"
import type { Metadata } from "next"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"
import PDFGenerator from "./pdf-generator"

// Case studies data (same as homepage)
const caseStudies = [
  {
    id: 1,
    slug: "swift-solution-lean-training",
    clientFallback: "Swift Solution",
    logo: "/Logos (3)/Logos/standard-chartered-bank-new-20211713.jpg",
    headerImage: "/IMAGES/case studies/CaseStudy_AutomotiveBattery_Final.jpg",
    titleFallback: "Lean Training for 2000 Shopfloor Employees",
    challengeFallback: "Large-scale workforce transformation requiring efficient training delivery",
    solutionFallback: "Comprehensive eLearning platform with interactive modules and assessments",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metricFallback: "95% completion rate", descriptionFallback: "Across all training modules" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metricFallback: "60% faster delivery", descriptionFallback: "Compared to traditional methods" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricFallback: "40% cost reduction", descriptionFallback: "In training delivery costs" }
    ],
    industryFallback: "Manufacturing",
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
    clientFallback: "Global EdTech Leader",
    logo: "/Logos (3)/Logos/reliance retail.png",
    headerImage: "/IMAGES/case studies/CaseStudy_EdTech_Inurture.jpg",
    titleFallback: "Scalable Courseware for Global EdTech Leader",
    challengeFallback: "Rapidly scaling courseware development without sacrificing quality",
    solutionFallback: "Turnkey course development model with standardized templates and robust QA",
    results: [
      { icon: <Clock className="h-5 w-5 text-green-500" />, metricFallback: "Faster delivery", descriptionFallback: "Of high-quality courses" },
      { icon: <Users className="h-5 w-5 text-orange-500" />, metricFallback: "Universities enabled", descriptionFallback: "To launch programs on schedule" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricFallback: "Scalable framework", descriptionFallback: "For future course creation" }
    ],
    industryFallback: "EdTech",
    detailedContent: {
      snapshot: "Swift Solution delivered a scalable courseware development solution for a global EdTech leader, enabling rapid content creation without compromising quality through standardized processes and robust QA frameworks.",
      introduction: "A globally recognized education services provider was facing a classic growth challenge: how to scale content production to meet the demands of a rapidly expanding network of university partners without compromising on quality. The company needed to create large volumes of structured, high-quality courseware across multiple domains, and they needed to do it fast. They turned to Swift Solution to develop a scalable and repeatable course development model that would enable them to meet their ambitious growth targets.",
      challengeDetails: {
        title: "The Challenge: Balancing Speed and Quality in Courseware Development",
        content: "The EdTech leader was under pressure to deliver a diverse range of courseware, including assessments, faculty slides, gamified content, and multimedia lessons, to its university partners. The key challenges were:\n\n• **Scalability**: The company needed to rapidly scale its content development capabilities to meet the demands of its growing network of partners\n• **Consistency**: With multiple SMEs and content developers involved, maintaining consistency in quality and instructional design was a major challenge\n• **Speed**: Strict timelines imposed by universities required a faster turnaround time without compromising on quality"
      },
      solutionDetails: {
        title: "The Solution: A Turnkey Course Development Model",
        content: "Swift Solution developed a turnkey course development model that was designed to be both scalable and quality-driven. Our solution included:\n\n• **Dedicated Project Management**: We appointed a dedicated project manager to oversee communication, escalation, and progress tracking\n• **SME Collaboration**: We engaged SMEs across multiple domains to validate and design accurate curricula\n• **Standardized Templates**: We created standardized templates, TOCs, and instructional design guides\n• **Robust QA Process**: We deployed a robust quality assurance process that included plagiarism checks and multi-level reviews\n• **Pilot Testing**: We tested all content with pilot learners to identify areas for improvement"
      },
      resultsDetails: {
        title: "The Results: Faster Delivery, Higher Quality, and a Scalable Framework",
        content: "The turnkey course development model delivered significant results for the EdTech leader:\n\n• **Faster Delivery**: The streamlined development process enabled faster course delivery\n• **Higher Quality**: The robust QA process ensured all courseware met the highest standards\n• **Scalable Framework**: The repeatable framework enabled scaling without starting from scratch\n• **Improved Efficiency**: Standardized templates and processes reduced development time by 40%\n• **Enhanced Collaboration**: Better coordination between SMEs and content developers\n• **Quality Assurance**: Zero quality-related escalations from university partners"
      },
      conclusion: {
        title: "A Partnership for Growth",
        content: "This case study highlights the importance of a strategic partnership in achieving scalable and sustainable growth. By partnering with Swift Solution, the EdTech leader was able to overcome its content development challenges and position itself for long-term success.",
        callToAction: {
          title: "Ready to Scale Your Content Development?",
          content: "If you're an EdTech company looking to scale your content development without sacrificing quality, we can help. Contact us today for a free consultation.",
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
    clientFallback: "Furniture Brand",
    logo: "/Logos (3)/Logos/mrf-logo.png",
    headerImage: "/IMAGES/case studies/CaseStudy_Furniture_Final.jpg",
    titleFallback: "Modernizing Dealer Training with Mobile-First eLearning",
    challengeFallback: "Fragmented training landscape with inconsistent messaging and high costs",
    solutionFallback: "Mobile-first eLearning program with microlearning videos and multilingual content",
    results: [
      { icon: <TrendingDown className="h-5 w-5 text-green-500" />, metricFallback: "60% reduction", descriptionFallback: "In training costs" },
      { icon: <Users className="h-5 w-5 text-blue-500" />, metricFallback: "1000+ certified", descriptionFallback: "Employees in first year" },
      { icon: <Award className="h-5 w-5 text-purple-500" />, metricFallback: "Improved consistency", descriptionFallback: "In product messaging" }
    ],
    industryFallback: "Furniture & Retail",
    detailedContent: {
      snapshot: "Swift Solution transformed a furniture brand's fragmented dealer training with a mobile-first eLearning program, reducing costs by 60% while certifying over 1000 employees and improving consistency across their dealer network.",
      introduction: "A leading furniture brand was struggling with a decentralized training approach that was creating inconsistent messaging, high costs, and low engagement across their vast network of dealers and distributors. They needed a modern, scalable solution that could unify their training landscape while reducing costs and improving engagement.",
      challengeDetails: {
        title: "The Challenge: Unifying a Fragmented Training Landscape",
        content: "The furniture brand's decentralized training approach was creating a number of problems:\n\n• **Inconsistent Messaging**: With no centralized training program, product messaging and sales techniques varied from region to region\n• **High Costs**: Traditional classroom-based training was expensive, with high costs for instructors, travel, and facilities\n• **Lack of Scalability**: The existing training model was not scalable enough to cover the company's vast network of dealers\n• **Low Engagement**: The training was not engaging enough to motivate dealers and sales staff to participate"
      },
      solutionDetails: {
        title: "The Solution: A Mobile-First eLearning Program",
        content: "Swift Solution developed a comprehensive mobile-first eLearning program that addressed all of the client's challenges:\n\n• **Mobile-First Design**: All content was designed to be consumed on mobile devices, making it accessible to dealers and sales staff wherever they were\n• **Microlearning Videos**: Short, engaging videos that could be consumed in bite-sized chunks\n• **Multilingual Content**: Content available in multiple languages to serve the diverse dealer network\n• **Gamification**: Interactive elements and progress tracking to boost engagement\n• **Certification Program**: Formal certification process to ensure competency and motivation"
      },
      resultsDetails: {
        title: "The Results: Cost Reduction and Improved Consistency",
        content: "The mobile-first eLearning program delivered impressive results:\n\n• **60% Cost Reduction**: Significant savings in training delivery costs\n• **1000+ Certified Employees**: Over 1000 employees certified in the first year\n• **Improved Consistency**: Standardized messaging across all dealer locations\n• **Higher Engagement**: 85% completion rate for training modules\n• **Scalable Solution**: Framework ready for expansion to new markets\n• **Better Performance**: 30% improvement in sales performance metrics"
      },
      conclusion: {
        title: "Modernizing Training for the Digital Age",
        content: "This project demonstrates how modern eLearning solutions can transform traditional training approaches, delivering better results at lower costs while improving consistency and engagement across distributed teams.",
        callToAction: {
          title: "Ready to Modernize Your Training?",
          content: "Discover how Swift Solution can help you transform your training programs with mobile-first eLearning solutions that deliver real business results.",
          contact: {
            phone: "+91 80 4154 1288",
            email: "info@itswift.com",
            website: "www.itswift.com"
          }
        }
      }
    }
  }
]

interface CaseStudyPageProps {
  params: {
    slug: string
  }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = caseStudies.find(study => study.slug === params.slug)

  if (!caseStudy) {
    notFound()
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={caseStudy.headerImage}
          alt={`${caseStudy.clientFallback} case study`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {caseStudy.titleFallback}
            </h1>
            <p className="text-xl mb-6">
              Client: {caseStudy.clientFallback} | Industry: {caseStudy.industryFallback}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href="/case-studies">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Case Studies
                </Link>
              </Button>
              <PDFGenerator caseStudy={caseStudy} className="bg-orange-600 hover:bg-orange-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Snapshot */}
          {caseStudy.detailedContent?.snapshot && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg mb-12">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic text-center">
                {caseStudy.detailedContent.snapshot}
              </p>
            </div>
          )}

          {/* Results Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-3">
                  {result.icon}
                </div>
                <div className="font-bold text-xl mb-2 dark:text-white">
                  {result.metricFallback}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {result.descriptionFallback}
                </div>
              </div>
            ))}
          </div>

          {/* Introduction */}
          {caseStudy.detailedContent?.introduction && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
              <h2 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="h-6 w-6 text-blue-500 mr-3" />
                Project Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {caseStudy.detailedContent.introduction}
              </p>
            </div>
          )}

          {/* Challenge Details */}
          {caseStudy.detailedContent?.challengeDetails && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
              <h2 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-6 w-6 text-red-500 mr-3" />
                {caseStudy.detailedContent.challengeDetails.title}
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {caseStudy.detailedContent.challengeDetails.content}
              </div>
            </div>
          )}

          {/* Solution Details */}
          {caseStudy.detailedContent?.solutionDetails && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
              <h2 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4 flex items-center">
                <Building className="h-6 w-6 text-green-500 mr-3" />
                {caseStudy.detailedContent.solutionDetails.title}
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {caseStudy.detailedContent.solutionDetails.content}
              </div>
            </div>
          )}

          {/* Results Details */}
          {caseStudy.detailedContent?.resultsDetails && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
              <h2 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-6 w-6 text-purple-500 mr-3" />
                {caseStudy.detailedContent.resultsDetails.title}
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {caseStudy.detailedContent.resultsDetails.content}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {caseStudy.detailedContent?.conclusion && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-8 rounded-lg mb-8">
              <h2 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4">
                {caseStudy.detailedContent.conclusion.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {caseStudy.detailedContent.conclusion.content}
              </p>
              
              {caseStudy.detailedContent.conclusion.callToAction && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3">
                    {caseStudy.detailedContent.conclusion.callToAction.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {caseStudy.detailedContent.conclusion.callToAction.content}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      📞 {caseStudy.detailedContent.conclusion.callToAction.contact.phone}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ✉️ {caseStudy.detailedContent.conclusion.callToAction.contact.email}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      🌐 {caseStudy.detailedContent.conclusion.callToAction.contact.website}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Download PDF Button */}
          <div className="text-center">
            <PDFGenerator caseStudy={caseStudy} size="lg" className="bg-orange-600 hover:bg-orange-700" />
          </div>
        </div>
      </div>

      <Contact />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const caseStudy = caseStudies.find(study => study.slug === params.slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.'
    }
  }

  const title = caseStudy.titleFallback
  const description = caseStudy.detailedContent?.snapshot || caseStudy.challengeFallback || undefined

  return resolveSeoMetadata(`/case-studies/${params.slug}`, {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  })
}