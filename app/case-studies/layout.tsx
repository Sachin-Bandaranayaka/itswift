import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies | Swift Solution',
  description: 'Explore our successful eLearning projects and client success stories. See real results from Fortune 500 companies and organizations worldwide.',
}

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}