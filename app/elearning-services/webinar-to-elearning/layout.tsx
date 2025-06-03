import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Webinar to eLearning Conversion Services | Swift Solution",
    description: "Transform your webinars into engaging on-demand eLearning experiences. Maximize ROI from existing webinar content and create evergreen training assets.",
}

export default function WebinarToElearningLayout({
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