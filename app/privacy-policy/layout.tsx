import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Swift Solution Pvt Ltd',
  description: 'Privacy Policy for Swift Solution Pvt Ltd - Learn how we collect, use, and protect your personal information in compliance with DPDP Act 2023, GDPR, and CCPA.',
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}