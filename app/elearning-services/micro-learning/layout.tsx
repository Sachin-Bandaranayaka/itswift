import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Micro-Learning Solutions | Swift Solution',
  description: 'Transform your training with bite-sized learning modules that deliver maximum impact in minimum time. Expert micro-learning development services.',
}

export default function MicroLearningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}