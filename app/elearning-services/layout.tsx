import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services')
}

export default function ElearningServicesLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
