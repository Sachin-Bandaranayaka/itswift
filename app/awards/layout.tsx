import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/awards')
}

export default function AwardsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
