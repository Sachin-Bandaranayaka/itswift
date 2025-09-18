'use client'

import DynamicContent, { DynamicContentGroup } from '@/components/dynamic-content'

export default function TestContentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Content Management System Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dynamic Content Test</h2>
          <p className="text-gray-600 mb-4">
            This section displays dynamic content from the CMS for the home page:
          </p>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <DynamicContent 
              pageSlug="home" 
              sectionKey="hero_title"
              fallback={<p className="text-gray-500 italic">Loading content...</p>}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Home Page Content</h2>
          <p className="text-gray-600 mb-4">
            This section displays all content sections for the home page:
          </p>
          
          <DynamicContentGroup 
            pageSlug="home"
            fallback={<p className="text-gray-500 italic">Loading all content...</p>}
          />
        </div>
      </div>
    </div>
  )
}