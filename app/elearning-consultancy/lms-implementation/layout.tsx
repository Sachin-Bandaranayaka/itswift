import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Best Moodle LMS Implementation & Support Services in Bangalore | Swift Solution",
    description: "Transform your corporate training with Swift Solution's expert Moodle LMS implementation services in Bangalore. Customization, migration, hosting & dedicated support staff. Get started today!",
}

export default function LMSImplementationLayout({
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