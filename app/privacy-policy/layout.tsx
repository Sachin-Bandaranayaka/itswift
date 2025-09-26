import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/privacy-policy')
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
