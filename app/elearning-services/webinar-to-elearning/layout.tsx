import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/webinar-to-elearning')
}

export default function WebinarToElearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
