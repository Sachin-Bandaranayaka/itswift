import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/contact')
}

export default function ContactLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
