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