import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/quote')
}

export default function QuoteLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
