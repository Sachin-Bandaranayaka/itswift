'use client'

import HeroDynamic from '@/components/hero-dynamic'

export default function TestHeroPage() {
  return (
    <div className="min-h-screen">
      <HeroDynamic />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Enhanced Hero Component Test
          </h2>
          <p className="text-gray-600 mb-4">
            This page tests the enhanced hero component that integrates dynamic content 
            from the CMS while maintaining the original video background and animations.
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Features Tested:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Dynamic content loading from CMS</li>
              <li>Video background functionality</li>
              <li>Loading states and error handling</li>
              <li>Responsive design</li>
              <li>Smooth animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}