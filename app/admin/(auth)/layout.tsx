import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Login - Swift Solution",
  description: "Admin panel login",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      {children}
    </div>
  )
}