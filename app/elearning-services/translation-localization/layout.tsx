import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-services/translation-localization')
}

export default function TranslationLocalizationLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
