"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Building, TrendingUp, Clock, Target, Star, ExternalLink, Phone, Mail } from "lucide-react"
import { caseStudies, type CaseStudy } from "@/lib/data/case-studies"

export default function CaseStudiesPage() {
    
    const router = useRouter()
    
    // Utility function to format text with asterisk markdown
    const formatText = (text: string) => {
        return text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    }

    const generatePDF = (study: CaseStudy, index: number) => {
        // Create a new window with the case study content
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${study.title} - Case Study</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
                    .header { border-bottom: 3px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
                    .title { color: #ea580c; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .client { font-size: 18px; color: #666; margin-bottom: 5px; }
                    .industry { font-size: 16px; color: #888; }
                    .section { margin: 25px 0; }
                    .section-title { color: #ea580c; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #ea580c; padding-left: 10px; }
                    .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .metric { background: #f97316; color: white; padding: 15px; border-radius: 8px; text-align: center; }
                    .metric-value { font-size: 24px; font-weight: bold; }
                    .metric-label { font-size: 14px; opacity: 0.9; }
                    .results { margin: 15px 0; }
                    .result-item { margin: 8px 0; padding-left: 20px; position: relative; }
                    .result-item:before { content: "✓"; position: absolute; left: 0; color: #16a34a; font-weight: bold; }
                    .tags { margin: 20px 0; }
                    .tag { background: #fed7aa; color: #ea580c; padding: 5px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; display: inline-block; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">${study.title}</div>
                    <div class="client">Client: ${study.client}</div>
                    <div class="industry">Industry: ${study.industry}</div>
                </div>
                
                <div class="tags">
                    ${study.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>

                <div class="metrics">
                    ${study.metrics.map(metric => `
                        <div class="metric">
                            <div class="metric-value">${metric.value}</div>
                            <div class="metric-label">${metric.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <div class="section-title">Challenge</div>
                    <p>${formatText(study.challenge)}</p>
                </div>

                <div class="section">
                    <div class="section-title">Solution</div>
                    <p>${formatText(study.solution)}</p>
                </div>

                <div class="section">
                    <div class="section-title">Results Achieved</div>
                    <div class="results">
                        ${study.results.map(result => `<div class="result-item">${formatText(result)}</div>`).join('')}
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        }
                    }
                </script>
            </body>
            </html>
        `

        printWindow.document.write(htmlContent)
        printWindow.document.close()
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                {/* Banner Image */}
                <div 
                    className="absolute inset-0 z-0 opacity-30"
                    suppressHydrationWarning
                    style={{
                        backgroundImage: 'url("/IMAGES/elearning case studies.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Real results from real clients - discover how we've transformed learning experiences
                        </p>
                    </div>
                </div>
            </section>

            {/* Overview Stats */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                            Our Impact Across Industries
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">240K+</div>
                                <div className="text-gray-700">Employees Trained</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">400+</div>
                                <div className="text-gray-700">Hours of Content</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
                                <div className="text-gray-700">Average Cost Reduction</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
                                <div className="text-gray-700">Training Time Reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Case Studies Grid */}
                        <div className="space-y-8">
                            {caseStudies.map((study, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {study.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{study.title}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <Building className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Client:</span>
                                                </div>
                                                <p className="text-gray-700 mb-4">{study.client}</p>
                                                
                                                <div className="flex items-center mb-2">
                                                    <Layers className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Industry:</span>
                                                </div>
                                                <p className="text-gray-700">{study.industry}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                {study.metrics.map((metric, metricIndex) => (
                                                    <div key={metricIndex} className="text-center bg-orange-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-orange-600">{metric.value}</div>
                                                        <div className="text-sm text-gray-700">{metric.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <Target className="h-5 w-5 text-orange-500 mr-2" />
                                                Challenge
                                            </h4>
                                            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatText(study.challenge) }}></p>
                                        </div>
                                        
                
                                        
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={() => router.push(`/case-studies/${study.slug}`)}
                                                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight className="h-5 w-5" />
                                            </button>
                                            
                                            <button 
                                                onClick={() => generatePDF(study, index)}
                                                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                                            >
                                                <span>Download PDF</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">
                            Consistent Results Across All Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Faster Training Delivery</h3>
                                <p className="text-gray-700">Reduced training duration from 2 weeks to 1 week with improved comprehension</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Massive Scale Achievement</h3>
                                <p className="text-gray-700">Successfully trained 240,000+ employees across global operations</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cost Optimization</h3>
                                <p className="text-gray-700">Average 50-60% reduction in training costs while improving quality</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Ready to Create Your Success Story?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Let's discuss how we can help you achieve similar results for your organization.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}