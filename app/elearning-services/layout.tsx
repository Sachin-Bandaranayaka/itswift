import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "eLearning Services | Swift Solution",
    description: "Explore our comprehensive eLearning services including custom eLearning, micro learning, and more.",
}

export default function ElearningServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 