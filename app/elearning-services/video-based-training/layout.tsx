import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video-Based Training Solutions | Swift Solution',
  description: 'Professional video-based training solutions that engage learners and drive results. Expert video production, interactive content, and comprehensive training programs.',
}

export default function VideoBasedTrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}