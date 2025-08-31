"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SessionTimeoutWarning } from "@/components/admin/session-timeout-warning"
import type React from "react"

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Check if current route is an auth route (login, forgot-password, reset-password)
  const isAuthRoute = pathname?.includes('/admin/login') || 
                     pathname?.includes('/admin/forgot-password') || 
                     pathname?.includes('/admin/reset-password')

  // For auth routes, render children without admin layout
  if (isAuthRoute) {
    return <>{children}</>
  }

  // For regular admin routes, render with full admin layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <SessionTimeoutWarning />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}