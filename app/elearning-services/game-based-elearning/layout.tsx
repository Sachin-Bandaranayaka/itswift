import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/game-based-elearning')
}

export default function GameBasedElearningLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
