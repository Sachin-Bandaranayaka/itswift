"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface CaseStudy {
  titleFallback: string
  clientFallback: string
  industryFallback: string
  detailedContent?: {
    snapshot?: string
    introduction?: string
    challengeDetails?: {
      title?: string
      content?: string
    }
    solutionDetails?: {
      title?: string
      content?: string
    }
    resultsDetails?: {
      title?: string
      content?: string
    }
    conclusion?: {
      title?: string
      content?: string
    }
  }
  results: Array<{
    metricFallback: string
    descriptionFallback: string
  }>
}

interface PDFGeneratorProps {
  caseStudy: CaseStudy
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export default function PDFGenerator({ caseStudy, className, size }: PDFGeneratorProps) {
  const generatePDF = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${caseStudy.titleFallback} - Case Study</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333; 
          }
          .header { 
            border-bottom: 3px solid #ea580c; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .title { 
            color: #ea580c; 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
          .client { 
            font-size: 18px; 
            color: #666; 
            margin-bottom: 5px; 
          }
          .industry { 
            font-size: 16px; 
            color: #888; 
          }
          .section { 
            margin: 25px 0; 
          }
          .section-title { 
            color: #ea580c; 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            border-left: 4px solid #ea580c; 
            padding-left: 10px; 
          }
          .snapshot { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            font-style: italic; 
            margin: 20px 0; 
          }
          .results { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
          }
          .result { 
            background: #ea580c; 
            color: white; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center; 
          }
          .result-metric { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 5px; 
          }
          .result-description { 
            font-size: 14px; 
          }
          .content { 
            white-space: pre-line; 
            margin: 15px 0; 
          }
          .contact-info { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 30px; 
          }
          .contact-title { 
            color: #ea580c; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${caseStudy.titleFallback}</div>
          <div class="client">Client: ${caseStudy.clientFallback}</div>
          <div class="industry">Industry: ${caseStudy.industryFallback}</div>
        </div>

        <div class="snapshot">
          ${caseStudy.detailedContent?.snapshot || ''}
        </div>

        <div class="section">
          <div class="section-title">Project Overview</div>
          <div class="content">${caseStudy.detailedContent?.introduction || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">${caseStudy.detailedContent?.challengeDetails?.title || 'Challenge'}</div>
          <div class="content">${caseStudy.detailedContent?.challengeDetails?.content || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">${caseStudy.detailedContent?.solutionDetails?.title || 'Solution'}</div>
          <div class="content">${caseStudy.detailedContent?.solutionDetails?.content || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">${caseStudy.detailedContent?.resultsDetails?.title || 'Results'}</div>
          <div class="content">${caseStudy.detailedContent?.resultsDetails?.content || ''}</div>
          
          <div class="results">
            ${caseStudy.results.map(result => `
              <div class="result">
                <div class="result-metric">${result.metricFallback}</div>
                <div class="result-description">${result.descriptionFallback}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">${caseStudy.detailedContent?.conclusion?.title || 'Conclusion'}</div>
          <div class="content">${caseStudy.detailedContent?.conclusion?.content || ''}</div>
        </div>

        <div class="contact-info">
          <div class="contact-title">${caseStudy.detailedContent?.conclusion?.callToAction?.title || 'Contact Information'}</div>
          <p>${caseStudy.detailedContent?.conclusion?.callToAction?.content || 'For more information about this case study or to discuss your training needs, please contact Swift Solution.'}</p>
          <p><strong>Phone:</strong> ${caseStudy.detailedContent?.conclusion?.callToAction?.contact?.phone || '+91-080-23215884'}</p>
          <p><strong>Email:</strong> ${caseStudy.detailedContent?.conclusion?.callToAction?.contact?.email || 'swiftsol@itswift.com'}</p>
          <p><strong>Website:</strong> ${caseStudy.detailedContent?.conclusion?.callToAction?.contact?.website || 'https://www.itswift.com/contact'}</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <Button onClick={generatePDF} className={className} size={size}>
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  )
}