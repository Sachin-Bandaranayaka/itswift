import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Custom E-Learning Content Development in Bangalore | Rapid Authoring Tools | Swift Solution",
    description: "Expert e-learning content development in Bangalore using rapid authoring tools. Create engaging, interactive courses 40% faster without compromising quality. 15+ years experience serving corporate clients. Get a quote today!",
}

export default function RapidElearningLayout({
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