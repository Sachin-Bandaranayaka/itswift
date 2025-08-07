import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Swift Solution',
  description: 'Learn about Swift Solution - a leading eLearning company with 13+ years of experience in creating innovative learning solutions for organizations worldwide.',
}

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}