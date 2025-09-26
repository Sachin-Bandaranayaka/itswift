import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-solutions/on-boarding')
}

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
