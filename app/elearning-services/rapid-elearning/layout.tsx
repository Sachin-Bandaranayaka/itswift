import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/rapid-elearning')
}

export default function RapidElearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
