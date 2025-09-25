import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { ConditionalLayout } from "@/components/conditional-layout"
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics"
import LinkedInInsight from "@/components/analytics/LinkedInInsight"
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity"
import { resolveSeoMetadataFromHeaders } from "@/lib/services/seo-metadata"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata() {
  return resolveSeoMetadataFromHeaders()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "itswift",
    "description": "itswift delivers AI-powered, custom eLearning programs for enterprises in Bangalore and worldwide.",
    "url": "https://www.itswift.com/",
    "logo": "https://www.itswift.com/IMAGES/Swift_logo_new.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+918023215884",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+16785841312",
        "contactType": "sales",
        "areaServed": "US",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+16785841525",
        "contactType": "support",
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
        "addressCountry": "IN"
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
      "https://www.linkedin.com/company/swift-solution",
      "https://twitter.com/ITSwift"
    ],
    "foundingDate": "1994",
    "numberOfEmployees": "50-200",
    "industry": "eLearning and Corporate Training"
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
