import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-solutions')
}

export default function ElearningSolutionsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
