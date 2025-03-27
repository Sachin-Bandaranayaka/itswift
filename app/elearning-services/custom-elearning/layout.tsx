import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Custom E-Learning Solutions | Swift Solution",
    description: "Your custom E-Learning solutions Partner catering to customized eLearning requirements of your company",
}

export default function CustomElearningLayout({
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