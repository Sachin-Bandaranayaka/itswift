import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Quote | Swift Solution',
  description: 'Request a quote for our AI-powered eLearning solutions and corporate training services in Bangalore.',
}

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}