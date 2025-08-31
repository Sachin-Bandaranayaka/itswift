import { Inter } from "next/font/google"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Panel - Swift Solution",
  description: "Content management and automation dashboard",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </div>
  )
}