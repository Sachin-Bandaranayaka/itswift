import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flash to HTML5 Conversion | Swift Solution',
  description: 'Professional Flash to HTML5 conversion services. Modernize your legacy Flash content with seamless HTML5 migration that maintains functionality and enhances accessibility.',
}

export default function ConvertFlashToHtmlLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}