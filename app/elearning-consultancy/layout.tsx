import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-consultancy')
}

export default function ElearningConsultancyLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
