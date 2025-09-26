import type { ReactNode } from "react"
import { resolveSeoMetadata } from "@/lib/services/seo-metadata"

export async function generateMetadata() {
  return resolveSeoMetadata('/elearning-consultancy/instructional-design')
}

export default function InstructionalDesignLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
