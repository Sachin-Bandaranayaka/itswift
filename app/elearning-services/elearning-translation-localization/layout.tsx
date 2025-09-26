import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/elearning-translation-localization')
}

export default function ElearningTranslationLocalizationLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
