"use client"

import Link from "next/link"
import Hero from "@/components/hero"
import ValueProposition from "@/components/value-proposition"
import Services from "@/components/services"
import Outsourcing from "@/components/outsourcing"
import FAQ from "@/components/faq"
import BrandCarousel from "@/components/brand-carousel"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { TrendingUp, Award, Clock, Users } from "lucide-react"

const caseStudies = [
  {
    id: 1,
    client: "Global Financial Services",
    logo: "/Logos (3)/Logos/standard-chartered-bank-new-20211713.jpg",
    title: "Transforming Compliance Training with Microlearning",
    challenge: "Needed to train 5,000+ employees on new regulations within 3 months",
    solution: "Custom compliance microlearning modules with interactive assessments",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metric: "97% completion rate", description: "Up from 68% with previous training" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metric: "89% knowledge retention", description: "Measured after 60 days" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metric: "45% less time spent", description: "Compared to traditional methods" }
    ],
    industry: "Finance",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    client: "National Retail Chain",
    logo: "/Logos (3)/Logos/reliance retail.png",
    title: "Onboarding Excellence Through Gamified Learning",
    challenge: "High turnover rates and inconsistent customer service quality",
    solution: "Gamified onboarding program with realistic retail scenarios",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metric: "32% reduction", description: "In new employee turnover" },
      { icon: <Users className="h-5 w-5 text-orange-500" />, metric: "12,000+ employees", description: "Successfully onboarded" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metric: "28% increase", description: "In customer satisfaction scores" }
    ],
    industry: "Retail",
    color: "from-orange-500 to-red-400"
  },
  {
    id: 3,
    client: "Manufacturing Leader",
    logo: "/Logos (3)/Logos/mrf-logo.png",
    title: "Safety Training Reimagined with VR Simulation",
    challenge: "High-risk environment requiring effective safety training",
    solution: "VR-based safety simulations with real-time feedback",
    results: [
      { icon: <TrendingUp className="h-5 w-5 text-green-500" />, metric: "76% reduction", description: "In workplace incidents" },
      { icon: <Clock className="h-5 w-5 text-purple-500" />, metric: "40% faster", description: "Training completion time" },
      { icon: <Award className="h-5 w-5 text-blue-500" />, metric: "ROI of 327%", description: "Within first 12 months" }
    ],
    industry: "Manufacturing",
    color: "from-green-500 to-teal-400"
  }
]

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandCarousel />
      <ValueProposition />
      <Services />
      <Outsourcing />
      <FAQ />

      {/* Case Studies Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Client Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how leading organizations have transformed their learning and development with our custom solutions
            </p>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-3 max-w-6xl mx-auto">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
              >
                {/* Header with gradient & logo */}
                <div className={`p-6 bg-gradient-to-r ${study.color} flex items-center`}>
                  <div className="w-16 h-16 relative bg-white rounded-lg shadow-md flex-shrink-0 p-2">
                    <Image
                      src={study.logo}
                      alt={study.client}
                      fill
                      className="object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="ml-4 text-white">
                    <span className="text-white/80 text-sm">CLIENT</span>
                    <h3 className="font-bold text-lg">{study.client}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-4">{study.title}</h3>

                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">CHALLENGE</h4>
                    <p className="text-gray-700">{study.challenge}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">SOLUTION</h4>
                    <p className="text-gray-700">{study.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">RESULTS</h4>
                    <div className="space-y-3">
                      {study.results.map((result, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="mr-3 mt-0.5">{result.icon}</div>
                          <div>
                            <span className="font-bold text-lg block">{result.metric}</span>
                            <span className="text-gray-600 text-sm">{result.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {study.industry}
                    </span>
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/case-studies/${study.id}`}>View Details</Link>
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

      <Contact />
      <Footer />
    </main>
  )
}

