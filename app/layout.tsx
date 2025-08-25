import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ChatWidget from "@/components/chat-widget"
import BackToTop from "@/components/back-to-top"
import CookieConsent from "@/components/cookie-consent"
import { Navbar } from "@/components/navbar"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Top eLearning Company in Bangalore for AI-Powered Corporate Training | Swift Solution",
  description:
    "Boost your workforce performance with the top eLearning company in Bangalore. Swift Solution delivers AI-powered, custom eLearning solutions for corporate training. Get a free demo!",
  keywords: "eLearning company Bangalore, AI-powered corporate training, custom eLearning solutions, corporate training Bangalore, eLearning development",
  authors: [{ name: "Swift Solution" }],
  creator: "Swift Solution",
  publisher: "Swift Solution",
  alternates: {
    canonical: "https://swiftsolution.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://swiftsolution.com",
    siteName: "Swift Solution",
    title: "Top eLearning Company in Bangalore for AI-Powered Corporate Training | Swift Solution",
    description: "Boost your workforce performance with the top eLearning company in Bangalore. Swift Solution delivers AI-powered, custom eLearning solutions for corporate training. Get a free demo!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Swift Solution - AI-Powered eLearning Company in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top eLearning Company in Bangalore for AI-Powered Corporate Training | Swift Solution",
    description: "Boost your workforce performance with the top eLearning company in Bangalore. Swift Solution delivers AI-powered, custom eLearning solutions for corporate training. Get a free demo!",
    images: ["/og-image.jpg"],
    creator: "@SwiftSolution",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Swift Solution",
    "description": "Top eLearning Company in Bangalore for AI-Powered Corporate Training",
    "url": "https://swiftsolution.com",
    "logo": "https://swiftsolution.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-80-1234-5678",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/swift-solution",
      "https://twitter.com/SwiftSolution"
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
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <ChatWidget />
          <BackToTop />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}