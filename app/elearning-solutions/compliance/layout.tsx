import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-solutions/compliance')
}

export default function ComplianceLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
