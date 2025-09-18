-- Seed data for Content Management System
-- This populates the CMS with existing static content from the website

-- Insert Content Types
INSERT INTO content_types (name, description, schema_definition) VALUES
('hero', 'Hero section content', '{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "subtitle": {"type": "string"},
    "description": {"type": "string"},
    "cta_text": {"type": "string"},
    "cta_link": {"type": "string"},
    "background_video": {"type": "string"},
    "background_image": {"type": "string"}
  }
}'),
('stats', 'Statistics and metrics', '{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "description": {"type": "string"},
    "stats": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "value": {"type": "string"},
          "label": {"type": "string"},
          "description": {"type": "string"}
        }
      }
    }
  }
}'),
('faq', 'Frequently Asked Questions', '{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "categories": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "faqs": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "question": {"type": "string"},
                "answer": {"type": "string"}
              }
            }
          }
        }
      }
    }
  }
}'),
('case_studies', 'Client case studies and success stories', '{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "description": {"type": "string"},
    "studies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "client": {"type": "string"},
          "logo": {"type": "string"},
          "title": {"type": "string"},
          "challenge": {"type": "string"},
          "solution": {"type": "string"},
          "results": {"type": "array"},
          "industry": {"type": "string"},
          "color": {"type": "string"}
        }
      }
    }
  }
}'),
('company_info', 'Company information and about content', '{
  "type": "object",
  "properties": {
    "mission": {"type": "string"},
    "vision": {"type": "string"},
    "values": {"type": "array"},
    "team": {"type": "array"},
    "history": {"type": "string"},
    "achievements": {"type": "array"}
  }
}'),
('services', 'Service offerings and descriptions', '{
  "type": "object",
  "properties": {
    "title": {"type": "string"},
    "description": {"type": "string"},
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "description": {"type": "string"},
          "features": {"type": "array"},
          "icon": {"type": "string"}
        }
      }
    }
  }
}'),
('contact_info', 'Contact information and details', '{
  "type": "object",
  "properties": {
    "address": {"type": "string"},
    "phone": {"type": "string"},
    "email": {"type": "string"},
    "hours": {"type": "string"},
    "social_links": {"type": "object"}
  }
}');

-- Insert Content Sections
INSERT INTO content_sections (name, display_name, description, page_path, section_order, content_type_id) VALUES
('homepage_hero', 'Homepage Hero', 'Main hero section on homepage', '/', 1, (SELECT id FROM content_types WHERE name = 'hero')),
('homepage_stats', 'Homepage Statistics', 'Statistics section on homepage', '/', 2, (SELECT id FROM content_types WHERE name = 'stats')),
('homepage_case_studies', 'Homepage Case Studies', 'Case studies section on homepage', '/', 3, (SELECT id FROM content_types WHERE name = 'case_studies')),
('homepage_faq', 'Homepage FAQ', 'FAQ section on homepage', '/', 4, (SELECT id FROM content_types WHERE name = 'faq')),
('about_company_info', 'About Us - Company Info', 'Company information on about page', '/about-us', 1, (SELECT id FROM content_types WHERE name = 'company_info')),
('services_main', 'Services Overview', 'Main services section', '/services', 1, (SELECT id FROM content_types WHERE name = 'services')),
('contact_info_main', 'Contact Information', 'Main contact information', '/contact', 1, (SELECT id FROM content_types WHERE name = 'contact_info'));

-- Insert Content Items with existing static content

-- Homepage Hero Content
INSERT INTO content_items (section_id, key, title, content, metadata, display_order) VALUES
((SELECT id FROM content_sections WHERE name = 'homepage_hero'), 'main_hero', 'Main Hero Section', '{
  "title": "Top eLearning Company in Bangalore: AI-Powered Corporate Training",
  "subtitle": "",
  "description": "We deliver measurable results and exceptional ROI with our award-winning, AI-driven eLearning solutions.",
  "cta_text": "Get Started Today",
  "cta_link": "#contact",
  "background_video": "/Banner Video V3.mp4",
  "background_image": ""
}', '{
  "seo_title": "Top eLearning Company in Bangalore - AI-Powered Corporate Training",
  "seo_description": "Leading eLearning company in Bangalore delivering AI-powered corporate training solutions with measurable results and exceptional ROI."
}', 1);

-- Homepage Stats Content
INSERT INTO content_items (section_id, key, title, content, metadata, display_order) VALUES
((SELECT id FROM content_sections WHERE name = 'homepage_stats'), 'main_stats', 'Company Statistics', '{
  "title": "Our Track Record Speaks for Itself",
  "description": "Delivering measurable results and exceptional ROI for over two decades",
  "stats": [
    {
      "value": "1,000+",
      "label": "Projects Completed",
      "description": "Successfully delivered projects across industries"
    },
    {
      "value": "200+",
      "label": "Clients across Industries",
      "description": "Trusted by leading companies worldwide"
    },
    {
      "value": "30%",
      "label": "ROI Guaranteed",
      "description": "Minimum return on investment for our clients"
    },
    {
      "value": "20+",
      "label": "Years of Experience",
      "description": "Two decades of eLearning expertise"
    }
  ]
}', '{}', 1);

-- Homepage Case Studies Content
INSERT INTO content_items (section_id, key, title, content, metadata, display_order) VALUES
((SELECT id FROM content_sections WHERE name = 'homepage_case_studies'), 'featured_case_studies', 'Featured Case Studies', '{
  "title": "Success Stories That Speak Volumes",
  "description": "Real results from real clients across diverse industries",
  "studies": [
    {
      "id": 1,
      "client": "Global Financial Services",
      "logo": "/Logos (3)/Logos/standard-chartered-bank-new-20211713.jpg",
      "title": "Transforming Compliance Training with Microlearning",
      "challenge": "Needed to train 5,000+ employees on new regulations within 3 months",
      "solution": "Custom compliance microlearning modules with interactive assessments",
      "results": [
        {
          "icon": "TrendingUp",
          "metric": "97% completion rate",
          "description": "Up from 68% with previous training",
          "color": "text-green-500"
        },
        {
          "icon": "Award",
          "metric": "89% knowledge retention",
          "description": "Measured after 60 days",
          "color": "text-blue-500"
        },
        {
          "icon": "Clock",
          "metric": "45% less time spent",
          "description": "Compared to traditional methods",
          "color": "text-purple-500"
        }
      ],
      "industry": "Finance",
      "color": "from-blue-500 to-cyan-400"
    },
    {
      "id": 2,
      "client": "National Retail Chain",
      "logo": "/Logos (3)/Logos/reliance retail.png",
      "title": "Onboarding Excellence Through Gamified Learning",
      "challenge": "High turnover rates and inconsistent customer service quality",
      "solution": "Gamified onboarding program with realistic retail scenarios",
      "results": [
        {
          "icon": "TrendingUp",
          "metric": "32% reduction",
          "description": "In new employee turnover",
          "color": "text-green-500"
        },
        {
          "icon": "Users",
          "metric": "12,000+ employees",
          "description": "Successfully onboarded",
          "color": "text-orange-500"
        },
        {
          "icon": "Award",
          "metric": "28% increase",
          "description": "In customer satisfaction scores",
          "color": "text-blue-500"
        }
      ],
      "industry": "Retail",
      "color": "from-orange-500 to-red-400"
    },
    {
      "id": 3,
      "client": "Manufacturing Leader",
      "logo": "/Logos (3)/Logos/mrf-logo.png",
      "title": "Safety Training Reimagined with VR Simulation",
      "challenge": "High-risk environment requiring effective safety training",
      "solution": "VR-based safety simulations with real-time feedback",
      "results": [
        {
          "icon": "TrendingUp",
          "metric": "76% reduction",
          "description": "In workplace incidents",
          "color": "text-green-500"
        },
        {
          "icon": "Clock",
          "metric": "40% faster",
          "description": "Training completion time",
          "color": "text-purple-500"
        },
        {
          "icon": "Award",
          "metric": "ROI of 327%",
          "description": "Within first 12 months",
          "color": "text-blue-500"
        }
      ],
      "industry": "Manufacturing",
      "color": "from-green-500 to-teal-400"
    }
  ]
}', '{}', 1);

-- Homepage FAQ Content
INSERT INTO content_items (section_id, key, title, content, metadata, display_order) VALUES
((SELECT id FROM content_sections WHERE name = 'homepage_faq'), 'main_faq', 'Frequently Asked Questions', '{
  "title": "Frequently Asked Questions",
  "categories": [
    {
      "title": "ELEARNING IN BANGALORE",
      "faqs": [
        {
          "question": "What are the benefits of partnering with an eLearning company in Bangalore?",
          "answer": "Bangalore is a global hub for technology and innovation, offering access to a vast pool of talent and resources. Partnering with an eLearning company in Bangalore gives you access to cutting-edge solutions, cost-effective services, and a culture of excellence. Swift Solution, as the top eLearning company in Bangalore, combines local expertise with global standards to deliver exceptional results."
        },
        {
          "question": "How does Swift Solution''s AI-enabled approach differ from other eLearning providers?",
          "answer": "Our AI-enabled approach goes beyond simple automation. We use AI to create personalized learning paths, provide real-time feedback, and generate data-driven insights to continuously improve learning outcomes. This allows us to deliver a truly adaptive and engaging learning experience that is tailored to the unique needs of each learner."
        },
        {
          "question": "Why is Swift Solution considered the best eLearning company in Bangalore?",
          "answer": "Our 20+ years of experience, our impressive client portfolio (including Google, Microsoft, and Siemens), our commitment to innovation, and our focus on delivering measurable results are just a few of the reasons why we are considered the best eLearning company in Bangalore. But don''t just take our word for it - our client testimonials and case studies speak for themselves."
        }
      ]
    }
  ]
}', '{}', 1);

-- Contact Information Content
INSERT INTO content_items (section_id, key, title, content, metadata, display_order) VALUES
((SELECT id FROM content_sections WHERE name = 'contact_info_main'), 'main_contact', 'Contact Information', '{
  "address": "Bangalore, Karnataka, India",
  "phone": "+91-XXXXXXXXXX",
  "email": "info@swiftsolution.com",
  "hours": "Monday - Friday: 9:00 AM - 6:00 PM",
  "social_links": {
    "linkedin": "https://linkedin.com/company/swift-solution",
    "twitter": "https://twitter.com/swiftsolution",
    "facebook": "https://facebook.com/swiftsolution"
  }
}', '{}', 1);

-- Insert SEO Settings for main pages
INSERT INTO seo_settings (page_path, title, description, keywords, og_title, og_description, robots) VALUES
('/', 'Top eLearning Company in Bangalore - AI-Powered Corporate Training | Swift Solution', 'Leading eLearning company in Bangalore delivering AI-powered corporate training solutions with measurable results and exceptional ROI. 20+ years experience.', ARRAY['elearning bangalore', 'corporate training', 'ai powered learning', 'swift solution', 'bangalore training company'], 'Top eLearning Company in Bangalore - Swift Solution', 'AI-powered corporate training solutions with measurable results and exceptional ROI', 'index,follow'),
('/about-us', 'About Swift Solution - Leading eLearning Company in Bangalore', 'Learn about Swift Solution, Bangalore''s premier eLearning company with 20+ years of experience in AI-powered corporate training solutions.', ARRAY['about swift solution', 'elearning company bangalore', 'corporate training experts'], 'About Swift Solution - eLearning Experts', 'Leading eLearning company in Bangalore with 20+ years of experience', 'index,follow'),
('/contact', 'Contact Swift Solution - Get Your eLearning Quote Today', 'Contact Swift Solution for your corporate training needs. Get a free consultation and quote for AI-powered eLearning solutions in Bangalore.', ARRAY['contact swift solution', 'elearning quote', 'corporate training consultation'], 'Contact Swift Solution', 'Get your free eLearning consultation and quote today', 'index,follow'),
('/services', 'eLearning Services - Corporate Training Solutions | Swift Solution', 'Comprehensive eLearning services including AI-powered training, microlearning, VR simulations, and custom course development in Bangalore.', ARRAY['elearning services', 'corporate training services', 'ai training solutions'], 'eLearning Services - Swift Solution', 'Comprehensive corporate training and eLearning services', 'index,follow');