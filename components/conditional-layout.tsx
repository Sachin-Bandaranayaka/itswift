"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import ChatWidget from "@/components/chat-widget"
import BackToTop from "@/components/back-to-top"
import CookieConsent from "@/components/cookie-consent"
import Footer from "@/components/footer"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminAuth = pathname.startsWith('/admin/login') || pathname === '/admin/login'
  const isAdminPage = pathname.startsWith('/admin')
  const isHomepage = pathname === '/'

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && !isHomepage && (
        <>
          {/* Newsletter Signup Section - Only show on non-homepage */}
          <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-4xl font-bold mb-4 text-white">Stay Ahead with Expert Insights</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Get the latest trends, best practices, and exclusive content delivered to your inbox. 
                  Join thousands of learning professionals who trust our insights.
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

          {/* Footer - Only show on non-homepage */}
          <Footer />
        </>
      )}
      {!isAdminPage && (
        <>
          <ChatWidget />
          <BackToTop />
          <CookieConsent />
        </>
      )}
    </>
  )
}