import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "E-Learning Translation and Localization | Swift Solution",
    description: "Transform your E-Learning content for global audiences with our expert translation and localization services.",
}

export default function ElearningTranslationLocalizationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
} 