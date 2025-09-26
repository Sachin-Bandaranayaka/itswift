import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/convert-flash-to-html')
}

export default function ConvertFlashToHtmlLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
