"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import ChatWidget from "@/components/chat-widget"
import BackToTop from "@/components/back-to-top"
import CookieConsent from "@/components/cookie-consent"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminAuth = pathname.startsWith('/admin/login') || pathname === '/admin/login'

  return (
    <>
      {!isAdminAuth && <Navbar />}
      {children}
      {!isAdminAuth && (
        <>
          <ChatWidget />
          <BackToTop />
          <CookieConsent />
        </>
      )}
    </>
  )
}