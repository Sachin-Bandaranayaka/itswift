import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "ILT to eLearning Conversion Services in Bangalore | Global Training Solutions | Swift Solution",
    description: "Transform instructor-led training into engaging digital learning experiences. Scale your training globally with our Bangalore-based conversion services. 15+ years experience serving US, Europe & Middle East markets.",
}

export default function IltToElearningLayout({
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