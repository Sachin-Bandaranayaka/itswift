import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/custom-elearning')
}

export default function CustomElearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
