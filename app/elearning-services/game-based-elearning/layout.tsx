import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Game-Based eLearning Solutions | Swift Solution',
  description: 'Transform learning with engaging game-based eLearning solutions. Increase engagement, retention, and knowledge transfer through interactive gaming experiences.',
};

export default function GameBasedElearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}