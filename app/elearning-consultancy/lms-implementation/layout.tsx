import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-consultancy/lms-implementation')
}

export default function LMSImplementationLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
