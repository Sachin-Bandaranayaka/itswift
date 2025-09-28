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
import { caseStudiesForDynamicPages } from "@/lib/data/case-studies"

// Use shared case study data
const caseStudies = caseStudiesForDynamicPages

// Helper function to render icons
const renderIcon = (iconName: string, iconColor: string) => {
  const iconProps = { className: `h-5 w-5 ${iconColor}` }
  
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp {...iconProps} />
    case 'Clock':
      return <Clock {...iconProps} />
    case 'Award':
      return <Award {...iconProps} />
    case 'Users':
      return <Users {...iconProps} />
    case 'TrendingDown':
      return <TrendingDown {...iconProps} />
    case 'Building':
      return <Building {...iconProps} />
    case 'Target':
      return <Target {...iconProps} />
    case 'BarChart3':
      return <BarChart3 {...iconProps} />
    case 'Lightbulb':
      return <Lightbulb {...iconProps} />
    default:
      return <Award {...iconProps} />
  }
}

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
                  {renderIcon(result.iconName, result.iconColor)}
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