import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-solutions/sales-enablement')
}

export default function SalesEnablementLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
