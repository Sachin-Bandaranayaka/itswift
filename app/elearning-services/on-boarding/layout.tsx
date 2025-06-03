import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Best Online Onboarding & Induction Training Solutions in Bangalore | Swift Solution",
    description: "Transform your employee onboarding process with Swift Solution's customized online induction training courses in Bangalore. Engaging, scalable solutions that reduce onboarding time by 50% while boosting employee retention.",
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
} 