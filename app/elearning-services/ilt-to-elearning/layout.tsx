import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/ilt-to-elearning')
}

export default function IltToElearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
