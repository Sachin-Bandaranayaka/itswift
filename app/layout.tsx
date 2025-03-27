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
  title: "Custom E-Learning Development & Corporate Training Solutions | Swift Solution India",
  description:
    "Swift Solution delivers 25 years of excellence in custom e-learning development, rapid eLearning, and microlearning solutions. Transform your corporate learning programs with our expert team.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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



import './globals.css'