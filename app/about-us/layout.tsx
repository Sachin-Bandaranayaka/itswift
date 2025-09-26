import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/about-us')
}

export default function AboutUsLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
