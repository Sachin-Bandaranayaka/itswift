"use client"

import Link from "next/link"
import Hero from "@/components/hero"
import ValueProposition from "@/components/value-proposition"
import Services from "@/components/services"
import Outsourcing from "@/components/outsourcing"
import Stats from "@/components/stats"
import FAQ from "@/components/faq"
import BrandCarousel from "@/components/brand-carousel"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { TrendingUp, Award, Clock, Users, CheckCircle } from "lucide-react"
import DynamicContent from "@/components/dynamic-content"

const caseStudies = [
  {
    id: 1,
    clientKey: "case_study_1_client",
    clientFallback: "Global Financial Services",
    logo: "/Logos (3)/Logos/standard-chartered-bank-new-20211713.jpg",
    titleKey: "case_study_1_title",
    titleFallback: "Transforming Compliance Training with Microlearning",
    challengeKey: "case_study_1_challenge",
    challengeFallback: "Needed to train 5,000+ employees on new regulations within 3 months",
    solutionKey: "case_study_1_solution",
    solutionFallback: "Custom compliance microlearning modules with interactive assessments",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metricKey: "case_study_1_result_1_metric", metricFallback: "97% completion rate", descriptionKey: "case_study_1_result_1_description", descriptionFallback: "Up from 68% with previous training" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricKey: "case_study_1_result_2_metric", metricFallback: "89% knowledge retention", descriptionKey: "case_study_1_result_2_description", descriptionFallback: "Measured after 60 days" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metricKey: "case_study_1_result_3_metric", metricFallback: "45% less time spent", descriptionKey: "case_study_1_result_3_description", descriptionFallback: "Compared to traditional methods" }
    ],
    industryKey: "case_study_1_industry",
    industryFallback: "Finance",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    clientKey: "case_study_2_client",
    clientFallback: "National Retail Chain",
    logo: "/Logos (3)/Logos/reliance retail.png",
    titleKey: "case_study_2_title",
    titleFallback: "Onboarding Excellence Through Gamified Learning",
    challengeKey: "case_study_2_challenge",
    challengeFallback: "High turnover rates and inconsistent customer service quality",
    solutionKey: "case_study_2_solution",
    solutionFallback: "Gamified onboarding program with realistic retail scenarios",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metricKey: "case_study_2_result_1_metric", metricFallback: "32% reduction", descriptionKey: "case_study_2_result_1_description", descriptionFallback: "In new employee turnover" },
      { icon: <Users className="h-5 w-5 text-orange-500" />, metricKey: "case_study_2_result_2_metric", metricFallback: "12,000+ employees", descriptionKey: "case_study_2_result_2_description", descriptionFallback: "Successfully onboarded" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricKey: "case_study_2_result_3_metric", metricFallback: "28% increase", descriptionKey: "case_study_2_result_3_description", descriptionFallback: "In customer satisfaction scores" }
    ],
    industryKey: "case_study_2_industry",
    industryFallback: "Retail",
    color: "from-orange-500 to-red-400"
  },
  {
    id: 3,
    clientKey: "case_study_3_client",
    clientFallback: "Manufacturing Leader",
    logo: "/Logos (3)/Logos/mrf-logo.png",
    titleKey: "case_study_3_title",
    titleFallback: "Safety Training Reimagined with VR Simulation",
    challengeKey: "case_study_3_challenge",
    challengeFallback: "High-risk environment requiring effective safety training",
    solutionKey: "case_study_3_solution",
    solutionFallback: "VR-based safety simulations with real-time feedback",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metricKey: "case_study_3_result_1_metric", metricFallback: "76% reduction", descriptionKey: "case_study_3_result_1_description", descriptionFallback: "In workplace incidents" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metricKey: "case_study_3_result_2_metric", metricFallback: "40% faster", descriptionKey: "case_study_3_result_2_description", descriptionFallback: "Training completion time" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metricKey: "case_study_3_result_3_metric", metricFallback: "ROI of 327%", descriptionKey: "case_study_3_result_3_description", descriptionFallback: "Within first 12 months" }
    ],
    industryKey: "case_study_3_industry",
    industryFallback: "Manufacturing",
    color: "from-green-500 to-teal-400"
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
      "url": "https://swiftsolution.com"
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
      <FAQ />

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
                {/* Header with gradient */}
                <div className={`p-6 bg-gradient-to-r ${study.color}`}>
                  <div className="text-white">
                    <span className="text-white/80 text-sm">CLIENT</span>
                    <h3 className="font-bold text-lg">
                      <DynamicContent 
                        sectionKey={study.clientKey} 
                        pageSlug="home" 
                        fallback={study.clientFallback}
                      />
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">
                    <DynamicContent 
                      sectionKey={study.titleKey} 
                      pageSlug="home" 
                      fallback={study.titleFallback}
                    />
                  </h3>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">CHALLENGE</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      <DynamicContent 
                        sectionKey={study.challengeKey} 
                        pageSlug="home" 
                        fallback={study.challengeFallback}
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
                              />
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              <DynamicContent 
                                sectionKey={result.descriptionKey} 
                                pageSlug="home" 
                                fallback={result.descriptionFallback}
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
                      />
                    </span>
                    <Button variant="outline" asChild size="sm">
                      <Link href="/case-studies">View Details</Link>
                    </Button>
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

      {/* Unique Value Proposition Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <DynamicContent 
              sectionKey="unique_value_title" 
              pageSlug="home" 
              fallback="The Swift Solution Unique Value Proposition"
              as="h2"
              className="text-4xl font-bold mb-8 dark:text-white"
            />
            <DynamicContent 
              sectionKey="unique_value_description" 
              pageSlug="home" 
              fallback="We bring together three rarely combined strengths:"
              as="div"
              className="text-xl text-gray-700 dark:text-gray-300 mb-12"
            />

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                  <DynamicContent 
                    sectionKey="domain_expertise_title" 
                    pageSlug="home" 
                    fallback="Domain Expertise"
                  />
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <DynamicContent 
                    sectionKey="domain_expertise_description" 
                    pageSlug="home" 
                    fallback="30 years of client success and market insight."
                  />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                  <DynamicContent 
                    sectionKey="ai_transformation_title" 
                    pageSlug="home" 
                    fallback="Authentic AI Transformation"
                  />
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <DynamicContent 
                    sectionKey="ai_transformation_description" 
                    pageSlug="home" 
                    fallback="A two-year journey with measurable results and enterprise adoption."
                  />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                  <DynamicContent 
                    sectionKey="ethical_leadership_title" 
                    pageSlug="home" 
                    fallback="Ethical Leadership"
                  />
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <DynamicContent 
                    sectionKey="ethical_leadership_description" 
                    pageSlug="home" 
                    fallback="Transparent, value-driven practices that build lasting trust."
                  />
                </p>
              </motion.div>
            </div>
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
              />
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              <DynamicContent 
                sectionKey="newsletter_description" 
                pageSlug="home" 
                fallback="Get the latest trends, best practices, and exclusive content delivered to your inbox. Join thousands of learning professionals who trust our insights."
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

