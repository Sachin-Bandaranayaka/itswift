import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/video-based-training')
}

export default function VideoBasedTrainingLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
