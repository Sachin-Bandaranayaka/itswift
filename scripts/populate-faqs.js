#!/usr/bin/env node

// Script to populate FAQ database with sample data
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleFAQs = [
  // Rapid E-learning FAQs
  {
    question: "What is rapid e-learning?",
    answer: "Rapid e-learning is a methodology for creating online training content quickly and efficiently using streamlined development processes and tools.",
    page_slug: "rapid-elearning",
    category: "general",
    display_order: 1
  },
  {
    question: "How long does it take to create a rapid e-learning course?",
    answer: "Typically, rapid e-learning courses can be developed in 2-4 weeks, compared to traditional e-learning which may take 3-6 months.",
    page_slug: "rapid-elearning",
    category: "development",
    display_order: 2
  },
  {
    question: "What tools are used for rapid e-learning development?",
    answer: "Common tools include Articulate Storyline, Adobe Captivate, Lectora, and various authoring tools that support rapid content creation.",
    page_slug: "rapid-elearning",
    category: "tools",
    display_order: 3
  },
  {
    question: "Is rapid e-learning effective for complex topics?",
    answer: "Yes, when properly designed, rapid e-learning can be very effective for complex topics by breaking them down into digestible modules and using interactive elements.",
    page_slug: "rapid-elearning",
    category: "effectiveness",
    display_order: 4
  },
  
  // Micro-learning FAQs
  {
    question: "What is micro-learning?",
    answer: "Micro-learning is an educational approach that delivers content in small, focused chunks that can be consumed quickly, typically in 3-5 minutes.",
    page_slug: "micro-learning",
    category: "general",
    display_order: 1
  },
  {
    question: "How does micro-learning improve retention?",
    answer: "Micro-learning improves retention by reducing cognitive load, allowing for spaced repetition, and fitting into busy schedules for just-in-time learning.",
    page_slug: "micro-learning",
    category: "benefits",
    display_order: 2
  },
  {
    question: "What are the best formats for micro-learning?",
    answer: "Effective micro-learning formats include short videos, infographics, interactive quizzes, flashcards, and bite-sized text modules.",
    page_slug: "micro-learning",
    category: "formats",
    display_order: 3
  },
  {
    question: "Can micro-learning replace traditional training?",
    answer: "Micro-learning works best as part of a blended approach, complementing traditional training rather than completely replacing it.",
    page_slug: "micro-learning",
    category: "implementation",
    display_order: 4
  }
]

async function populateFAQs() {
  try {
    console.log('Starting FAQ population...')
    
    // Check if table exists by trying to select from it
    const { data: existingFAQs, error: selectError } = await supabase
      .from('faqs')
      .select('id')
      .limit(1)
    
    if (selectError) {
      console.error('Error accessing FAQs table:', selectError.message)
      console.log('The FAQs table may not exist. Please run the migration first.')
      process.exit(1)
    }
    
    // Clear existing FAQs for these pages
    const { error: deleteError } = await supabase
      .from('faqs')
      .delete()
      .in('page_slug', ['rapid-elearning', 'micro-learning'])
    
    if (deleteError) {
      console.error('Error clearing existing FAQs:', deleteError.message)
    } else {
      console.log('Cleared existing FAQs for rapid-elearning and micro-learning pages')
    }
    
    // Insert new FAQs
    const { data, error } = await supabase
      .from('faqs')
      .insert(sampleFAQs)
      .select()
    
    if (error) {
      console.error('Error inserting FAQs:', error.message)
      process.exit(1)
    }
    
    console.log(`Successfully inserted ${data.length} FAQs`)
    console.log('FAQ population completed!')
    
    // Show summary
    const { data: rapidFAQs } = await supabase
      .from('faqs')
      .select('*')
      .eq('page_slug', 'rapid-elearning')
      .order('display_order')
    
    const { data: microFAQs } = await supabase
      .from('faqs')
      .select('*')
      .eq('page_slug', 'micro-learning')
      .order('display_order')
    
    console.log(`\nSummary:`)
    console.log(`- Rapid E-learning FAQs: ${rapidFAQs?.length || 0}`)
    console.log(`- Micro-learning FAQs: ${microFAQs?.length || 0}`)
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

populateFAQs()