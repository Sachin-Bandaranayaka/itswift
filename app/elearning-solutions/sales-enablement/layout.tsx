import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sales Enablement eLearning Solutions | Swift Solution",
    description: "Transform your sales performance with custom eLearning solutions for sales enablement. Empower your teams with engaging, interactive training.",
}

export default function SalesEnablementLayout({
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