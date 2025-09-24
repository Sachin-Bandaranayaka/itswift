import { config as loadEnv } from 'dotenv'
import { getSupabaseAdmin } from '@/lib/supabase'

// Load environment variables from .env.local first (if present), then fallback to .env
loadEnv({ path: '.env.local', override: false })
loadEnv()

type PageSeed = {
  slug: string
  title: string
  description: string
  sections: Array<{
    key: string
    content: string
    contentHtml?: string
    displayOrder?: number
  }>
}

const pages: PageSeed[] = [
  {
    slug: 'home',
    title: 'Swift Solution | AI-Powered eLearning Company in Bangalore',
    description: 'Discover Swift Solution, a leading eLearning company in Bangalore delivering AI-enabled corporate training, custom content, and measurable ROI.',
    sections: [
      {
        key: 'hero_title',
        content: 'Top eLearning Company in Bangalore: AI-Powered Corporate Training'
      },
      {
        key: 'hero_subtitle',
        content: 'We deliver measurable results and exceptional ROI with our award-winning, AI-driven eLearning solutions.'
      },
      {
        key: 'cta_button',
        content: 'Get a Free AI Training Consultation'
      },
      {
        key: 'value_proposition_title',
        content: 'Your Trusted eLearning Solutions Provider in Bangalore for Over 20+ Years'
      },
      {
        key: 'value_proposition_subtitle',
        content: 'Driving Business Growth with Custom eLearning Content'
      },
      {
        key: 'value_proposition_description',
        content: `Swift Solution Pvt Ltd has led India's Learning & Development industry for 20+ years. Shaping India's L&D industry for 20+ years. Not just a vendor — a partner in transformation. Blending deep expertise with AI-driven innovation. Rooted in ethics, built on lasting client trust. Leading the next evolution of Learning & Development.

As a leading eLearning company in Bangalore, our team of learning experts combine deep instructional design expertise with cutting-edge technology to create engaging and effective learning experiences that deliver measurable results.

Our Unwavering Commitment to Quality and Innovation

Our core values of client-centricity, innovation, and measurable impact are the pillars of our success. We continuously explore new technologies and instructional design methodologies to ensure that our solutions are at the forefront of the industry. This commitment to excellence is what sets us apart from other eLearning companies in Bangalore.`
      },
      {
        key: 'unique_value_title',
        content: 'The Swift Solution Unique Value Proposition'
      },
      {
        key: 'unique_value_description',
        content: 'We bring together three rarely combined strengths that set us apart in the eLearning industry:'
      },
      {
        key: 'domain_expertise_title',
        content: 'Domain Expertise'
      },
      {
        key: 'domain_expertise_description',
        content: '30 years of client success and market insight, delivering proven results across industries.'
      },
      {
        key: 'ai_transformation_title',
        content: 'Authentic AI Transformation'
      },
      {
        key: 'ai_transformation_description',
        content: 'A two-year journey with measurable results and enterprise adoption, leading the AI revolution in eLearning.'
      },
      {
        key: 'ethical_leadership_title',
        content: 'Ethical Leadership'
      },
      {
        key: 'ethical_leadership_description',
        content: 'Transparent, value-driven practices that build lasting trust and partnerships with our clients.'
      },
      {
        key: 'services_section_title',
        content: 'Our Comprehensive eLearning Services'
      },
      {
        key: 'services_section_description',
        content: 'As a full-service eLearning solution provider in Bangalore, we offer a comprehensive range of services to meet all your corporate training needs.'
      },
      {
        key: 'service_1_title',
        content: 'Bespoke eLearning Content That Drives Results'
      },
      {
        key: 'service_1_description',
        content: 'We specialize in creating high-quality, custom eLearning content that is tailored to your specific needs and objectives. Our team of instructional designers and content developers works closely with you to create engaging and effective learning experiences that deliver measurable results.'
      },
      {
        key: 'service_2_title',
        content: 'The Future of Corporate Training is Here'
      },
      {
        key: 'service_2_description',
        content: 'As a visionary AI-enabled eLearning solutions company in Bangalore, we are pioneering the use of artificial intelligence to create personalized, adaptive, and engaging learning experiences. Our AI-powered solutions are designed to optimize learning outcomes and maximize your return on investment.'
      },
      {
        key: 'service_3_title',
        content: 'Strategic eLearning Consulting for Maximum Impact'
      },
      {
        key: 'service_3_description',
        content: 'Our expert consultants work with you to develop comprehensive eLearning strategies that align with your business objectives. From needs analysis to implementation planning, we provide the guidance and expertise you need to achieve your training goals and drive organizational success.'
      },
      {
        key: 'service_4_title',
        content: 'Learning on the Go, Anytime, Anywhere'
      },
      {
        key: 'service_4_description',
        content: 'We offer mobile learning and microlearning solutions that provide your employees with the flexibility to learn anytime, anywhere, on any device. Our mobile-first approach ensures that your employees can access learning content on the go, making it easier for them to stay up-to-date with the latest training and development.'
      },
      {
        key: 'service_5_title',
        content: 'Engaging and Immersive Learning Experiences'
      },
      {
        key: 'service_5_description',
        content: 'We believe that learning should be an enjoyable and immersive experience. That\'s why we incorporate gamification, simulations, and interactive content into our eLearning solutions. This not only makes learning more engaging but also improves knowledge retention and application.'
      },
      {
        key: 'services_title',
        content: 'Why Swift Solution is the Best eLearning Company in Bangalore'
      },
      {
        key: 'services_description',
        content: 'Choosing the right eLearning partner is a critical decision for any organization. Here\'s why Swift Solution is the undisputed choice for businesses seeking the best eLearning company in Bangalore.'
      },
      {
        key: 'service_6_title',
        content: 'Gamification and Interactive Content That Engages and Inspires'
      },
      {
        key: 'service_6_description',
        content: 'We believe that learning should be an enjoyable and immersive experience. That\'s why we incorporate gamification, simulations, and interactive content into our eLearning solutions. This not only makes learning more engaging but also improves knowledge retention and application.'
      },
      {
        key: 'case_studies_title',
        content: 'Client Success Stories'
      },
      {
        key: 'case_studies_description',
        content: 'See how leading organizations have transformed their learning and development with our custom solutions.'
      },
      {
        key: 'case_study_1_client',
        content: 'Swift Solution'
      },
      {
        key: 'case_study_1_title',
        content: 'Lean Training for 2000 Shopfloor Employees'
      },
      {
        key: 'case_study_1_challenge',
        content: 'Large-scale workforce transformation requiring efficient training delivery.'
      },
      {
        key: 'case_study_1_solution',
        content: 'Comprehensive eLearning platform with interactive modules and assessments.'
      },
      {
        key: 'case_study_1_result_1_metric',
        content: '95% completion rate'
      },
      {
        key: 'case_study_1_result_1_description',
        content: 'Across all training modules.'
      },
      {
        key: 'case_study_1_result_2_metric',
        content: '60% faster delivery'
      },
      {
        key: 'case_study_1_result_2_description',
        content: 'Compared to traditional methods.'
      },
      {
        key: 'case_study_1_result_3_metric',
        content: '40% cost reduction'
      },
      {
        key: 'case_study_1_result_3_description',
        content: 'In training delivery costs.'
      },
      {
        key: 'case_study_1_industry',
        content: 'Manufacturing'
      },
      {
        key: 'case_study_2_client',
        content: 'Global EdTech Leader'
      },
      {
        key: 'case_study_2_title',
        content: 'Scalable Courseware for Global EdTech Leader'
      },
      {
        key: 'case_study_2_challenge',
        content: 'Rapidly scaling courseware development without sacrificing quality.'
      },
      {
        key: 'case_study_2_solution',
        content: 'Turnkey course development model with standardized templates and robust QA.'
      },
      {
        key: 'case_study_2_result_1_metric',
        content: 'Faster delivery'
      },
      {
        key: 'case_study_2_result_1_description',
        content: 'Of high-quality courses.'
      },
      {
        key: 'case_study_2_result_2_metric',
        content: 'Universities enabled'
      },
      {
        key: 'case_study_2_result_2_description',
        content: 'To launch programs on schedule.'
      },
      {
        key: 'case_study_2_result_3_metric',
        content: 'Scalable framework'
      },
      {
        key: 'case_study_2_result_3_description',
        content: 'For future course creation.'
      },
      {
        key: 'case_study_2_industry',
        content: 'EdTech'
      },
      {
        key: 'case_study_3_client',
        content: 'Furniture Brand'
      },
      {
        key: 'case_study_3_title',
        content: 'Modernizing Dealer Training with Mobile-First eLearning'
      },
      {
        key: 'case_study_3_challenge',
        content: 'Fragmented training landscape with inconsistent messaging and high costs.'
      },
      {
        key: 'case_study_3_solution',
        content: 'Mobile-first eLearning program with microlearning videos and multilingual content.'
      },
      {
        key: 'case_study_3_result_1_metric',
        content: '60% reduction'
      },
      {
        key: 'case_study_3_result_1_description',
        content: 'In training costs.'
      },
      {
        key: 'case_study_3_result_2_metric',
        content: '1000+ certified'
      },
      {
        key: 'case_study_3_result_2_description',
        content: 'Employees in first year.'
      },
      {
        key: 'case_study_3_result_3_metric',
        content: 'Improved consistency'
      },
      {
        key: 'case_study_3_result_3_description',
        content: 'In product messaging.'
      },
      {
        key: 'case_study_3_industry',
        content: 'Furniture & Retail'
      },
      {
        key: 'newsletter_title',
        content: 'Stay Ahead with Expert Insights'
      },
      {
        key: 'newsletter_description',
        content: 'Get the latest trends, best practices, and exclusive content delivered to your inbox. Join thousands of learning professionals who trust our insights.'
      }
    ]
  },
  {
    slug: 'about-us',
    title: 'Top AI-Powered eLearning Company in Bangalore, India | Swift Solution',
    description: 'Learn about Swift Solution, a leading AI-powered eLearning company in Bangalore with 25+ years of experience. Discover our authentic AI transformation, deep domain expertise, and commitment to delivering measurable ROI for clients like Google and Microsoft.',
    sections: [
      {
        key: 'about_swift_solution_title',
        content: 'About Swift Solution: Pioneering the Future of Corporate Training in Bangalore'
      },
      {
        key: 'our_existence_hinges_description',
        content: 'Our existence hinges on one simple principle: improving your business performance. We are not just another vendor; we are a strategic partner recognized as one of the top eLearning companies in Bangalore.'
      },
      {
        key: 'our_foundation_three_title',
        content: 'Our Foundation: Three Decades of L&D Mastery and Client Success'
      },
      {
        key: 'our_professional_identity_description',
        content: 'Our professional identity is built on a fundamental understanding of the Indian L&D ecosystem, which has historically been fragmented and lacking in standardized, systematic approaches. Our journey has been a deliberate effort to build structure, quality, and consistency where it is rare.'
      }
    ]
  },
  {
    slug: 'elearning-services',
    title: 'E-Learning Services | Swift Solution',
    description: 'We offer a comprehensive range of e-learning services to help you create engaging, effective, and impactful learning experiences for your audience.',
    sections: [
      {
        key: 'elearning_services_title',
        content: 'E-Learning Services'
      },
      {
        key: 'elearning_services_description',
        content: 'We offer a comprehensive range of e-learning services to help you create engaging, effective, and impactful learning experiences for your audience.'
      },
      {
        key: 'custom_elearning_title',
        content: 'Custom eLearning'
      },
      {
        key: 'custom_elearning_description',
        content: 'Tailored eLearning solutions designed to meet your specific business needs and objectives.'
      },
      {
        key: 'micro_learning_title',
        content: 'Micro Learning'
      },
      {
        key: 'micro_learning_description',
        content: 'Bite-sized learning modules that deliver focused content for maximum retention and engagement.'
      },
      {
        key: 'flash_to_html_title',
        content: 'Convert Flash to HTML'
      },
      {
        key: 'flash_to_html_description',
        content: 'Modernize your legacy Flash-based courses by converting them to HTML5 for better compatibility and performance.'
      },
      {
        key: 'video_training_title',
        content: 'Video Based Training'
      },
      {
        key: 'video_training_description',
        content: 'Engaging video content that simplifies complex concepts and enhances the learning experience.'
      },
      {
        key: 'ilt_conversion_title',
        content: 'ILT to eLearning conversion'
      },
      {
        key: 'ilt_conversion_description',
        content: 'Transform your instructor-led training materials into interactive digital learning experiences.'
      },
      {
        key: 'webinar_conversion_title',
        content: 'Webinar to eLearning conversion'
      },
      {
        key: 'webinar_conversion_description',
        content: 'Convert your webinars into structured eLearning modules for on-demand access.'
      },
      {
        key: 'game_based_title',
        content: 'Game based eLearning'
      },
      {
        key: 'game_based_description',
        content: 'Gamified learning experiences that boost engagement and knowledge retention through interactive challenges.'
      },
      {
        key: 'translation_localization_title',
        content: 'eLearning translation and localization'
      },
      {
        key: 'translation_localization_description',
        content: 'Adapt your eLearning content for global audiences with professional translation and cultural localization.'
      },
      {
        key: 'rapid_elearning_title',
        content: 'Rapid eLearning'
      },
      {
        key: 'rapid_elearning_description',
        content: 'Quick development of eLearning content to meet urgent training needs without compromising quality.'
      },
      {
        key: 'learn_more_text',
        content: 'Learn more'
      }
    ]
  },
  {
    slug: 'contact',
    title: 'Contact Swift Solution | AI-Powered eLearning Company in Bangalore',
    description: 'Ready to transform your corporate training? Get in touch with Bangalore\'s leading eLearning company for a free consultation.',
    sections: [
      {
        key: 'contact_hero_title',
        content: 'Contact Swift Solution'
      },
      {
        key: 'contact_hero_description',
        content: 'Ready to transform your corporate training? Get in touch with Bangalore\'s leading eLearning company for a free consultation.'
      },
      {
        key: 'contact_form_title',
        content: 'Get a Free Consultation'
      },
      {
        key: 'contact_form_description',
        content: 'Fill out the form below and our team will get back to you within 24 hours to discuss your eLearning needs.'
      },
      {
        key: 'first_name_label',
        content: 'First Name *'
      },
      {
        key: 'last_name_label',
        content: 'Last Name'
      },
      {
        key: 'email_label',
        content: 'Email Address *'
      },
      {
        key: 'phone_label',
        content: 'Phone Number'
      },
      {
        key: 'company_label',
        content: 'Company'
      },
      {
        key: 'message_label',
        content: 'Message *'
      },
      {
        key: 'sending_button',
        content: 'Sending...'
      },
      {
        key: 'send_message_button',
        content: 'Send Message'
      },
      {
        key: 'success_title',
        content: 'Thank You!'
      },
      {
        key: 'success_message',
        content: 'Your message has been sent successfully. Our team will get back to you within 24 hours.'
      },
      {
        key: 'send_another_button',
        content: 'Send Another Message'
      },
      {
        key: 'contact_info_title',
        content: 'Contact Information'
      },
      {
        key: 'india_office_title',
        content: 'India Office'
      },
      {
        key: 'usa_partner_title',
        content: 'USA Partner'
      },
      {
        key: 'business_hours_title',
        content: 'Business Hours'
      },
      {
        key: 'weekday_hours',
        content: 'Monday - Friday: 9:00 AM - 6:00 PM IST'
      },
      {
        key: 'saturday_hours',
        content: 'Saturday: 10:00 AM - 2:00 PM IST'
      },
      {
        key: 'sunday_hours',
        content: 'Sunday: Closed'
      }
    ]
  }
]

async function main() {
  const supabase = getSupabaseAdmin()

  const insertedPages = new Map<string, string>()

  for (const page of pages) {
    const { data, error } = await supabase
      .from('pages')
      .upsert(
        {
          slug: page.slug,
          title: page.title,
          description: page.description,
          is_active: true
        },
        { onConflict: 'slug' }
      )
      .select('id, slug')
      .single()

    if (error || !data) {
      throw new Error(`Failed to upsert page ${page.slug}: ${error?.message}`)
    }

    insertedPages.set(page.slug, data.id)
  }

  for (const page of pages) {
    const pageId = insertedPages.get(page.slug)
    if (!pageId) {
      throw new Error(`Missing page id for ${page.slug}`)
    }

    for (const [index, section] of page.sections.entries()) {
      const { error } = await supabase
        .from('page_content_sections')
        .upsert(
          {
            page_id: pageId,
            section_key: section.key,
            section_type: section.contentHtml ? 'html' : 'text',
            content: section.content,
            content_html: section.contentHtml,
            display_order: section.displayOrder ?? index + 1,
            is_active: true
          },
          { onConflict: 'page_id,section_key' }
        )

      if (error) {
        throw new Error(`Failed to upsert section ${section.key} on page ${page.slug}: ${error.message}`)
      }
    }
  }

  console.log('Seed completed successfully!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
