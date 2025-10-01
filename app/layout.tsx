import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { ConditionalLayout } from "@/components/conditional-layout"
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics"
import LinkedInInsight from "@/components/analytics/LinkedInInsight"
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata() {
  return resolveSeoMetadata('/')
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "EducationalOrganization"],
    "name": "Swift Solution Pvt Ltd",
    "alternateName": ["itswift", "Swift Solution Bangalore", "Swift Solution Bengaluru"],
    "description": "Swift Solution delivers AI-powered, custom eLearning programs for enterprises in Bangalore and Bengaluru worldwide. Leading eLearning company with 30+ years of experience in corporate training solutions.",
    "url": "https://www.itswift.com/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.itswift.com/IMAGES/Swift_logo_new.png",
      "width": "200",
      "height": "60"
    },
    "image": "https://www.itswift.com/IMAGES/Swift_logo_new.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-80-2321-5884",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-678-584-1312",
        "contactType": "sales",
        "areaServed": "US",
        "availableLanguage": ["English"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-678-584-1525",
        "contactType": "customer support",
        "areaServed": "US",
        "availableLanguage": ["English"]
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "# 31, 14th Main, Agromore Layout, Atthiguppe Extn (Near To Chandra Layout Water Tank)",
        "addressLocality": "Bangalore",
        "addressRegion": "Karnataka",
        "postalCode": "560040",
        "addressCountry": "IN",
        "alternateName": "Bengaluru"
      },
      {
        "@type": "PostalAddress",
        "name": "Swift Solution Pvt Ltd, USA",
        "streetAddress": "3621 Vinings Slope SE, Suite 4310",
        "addressLocality": "Atlanta",
        "addressRegion": "GA",
        "postalCode": "30339",
        "addressCountry": "US"
      }
    ],
    "sameAs": [
      "https://in.linkedin.com/company/swift-solution-pvt-ltd",
      "https://x.com/itswiftdotcom"
    ],
    "foundingDate": "1994",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 50,
      "maxValue": 200
    },
    "industry": "eLearning and Corporate Training",
    "naics": "611710",
    "keywords": "eLearning, corporate training, AI-powered learning, custom eLearning development, Bangalore, Bengaluru",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "eLearning Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom eLearning Development",
            "description": "Bespoke eLearning modules tailored to your specific business needs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI-Powered Learning Solutions",
            "description": "Cutting-edge AI-driven personalized learning experiences"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Corporate Training Consulting",
            "description": "Strategic eLearning consulting for maximum business impact"
          }
        }
      ]
    },
    "priceRange": "$$"
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID && (
          <LinkedInInsight partnerId={process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID} />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <MicrosoftClarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} />
        )}
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
