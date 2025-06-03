import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Best Online Compliance Training Courses in Bangalore | Swift Solution",
    description: "Transform your corporate compliance strategy with Swift Solution's customized online compliance training courses in Bangalore. Engaging, scalable solutions that ensure regulatory adherence while boosting employee engagement.",
}

export default function ComplianceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
} 