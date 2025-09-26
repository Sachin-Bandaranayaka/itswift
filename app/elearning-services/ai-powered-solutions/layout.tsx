import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/ai-powered-solutions')
}

export default function AIPoweredSolutionsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
