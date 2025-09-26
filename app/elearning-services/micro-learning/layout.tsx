import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/micro-learning')
}

export default function MicroLearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
