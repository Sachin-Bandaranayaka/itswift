import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "AI-Powered Instructional Design Services | Custom eLearning Solutions | Swift Solution",
    description: "Transform corporate training with Swift Solution's AI-powered instructional design services. Personalized learning paths, intelligent assessments & proprietary LLM technology. Boost engagement by 70%. Get started today!",
}

export default function InstructionalDesignLayout({
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