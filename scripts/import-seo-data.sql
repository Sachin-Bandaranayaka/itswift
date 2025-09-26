-- SEO Data Import Script
-- This script imports comprehensive SEO data from the client's CSV
-- Execute this in Supabase SQL Editor

-- First, let's add columns for primary and secondary keywords if they don't exist
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS primary_keywords TEXT,
ADD COLUMN IF NOT EXISTS secondary_keywords TEXT;

-- Create or update pages with SEO data from client's CSV
-- Using INSERT ... ON CONFLICT to handle existing pages

-- 1. eLearning Services
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-services',
    'Comprehensive eLearning Services company in Bangalore | Swift Solution',
    'Explore our full suite of eLearning services—custom courses, microlearning, video training, ILT conversion, webinars, games, localization, rapid development—to build effective training experiences.',
    'Comprehensive eLearning Services company in Bangalore | Swift Solution',
    'Explore our full suite of eLearning services—custom courses, microlearning, video training, ILT conversion, webinars, games, localization, rapid development—to build effective training experiences.',
    'eLearning services, custom eLearning, microlearning, Video training, ILT conversion, game-based learning, translation, rapid e-learning',
    'eLearning services, custom eLearning, microlearning',
    'Video training, ILT conversion, game-based learning, translation, rapid e-learning',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 2. eLearning Solutions
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-solutions',
    'eLearning Solutions for Onboarding, Compliance & Sales | Swift Solution',
    'Discover Swift Solution''s tailored eLearning solutions for onboarding, compliance training, sales enablement, LMS implementation and instructional design to transform workforce performance.',
    'eLearning Solutions for Onboarding, Compliance & Sales | Swift Solution',
    'Discover Swift Solution''s tailored eLearning solutions for onboarding, compliance training, sales enablement, LMS implementation and instructional design to transform workforce performance.',
    'eLearning solutions, onboarding training, compliance training, sales enablement, LMS implementation services, instructional design, corporate training solutions',
    'eLearning solutions, onboarding training, compliance training, sales enablement',
    'LMS implementation services, instructional design, corporate training solutions',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 3. eLearning Consultancy
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-consultancy',
    'E-Learning Consultancy Services & LMS Strategy | Swift Solution',
    'Our experts provide LMS implementation, strategy and learning technology consulting to help you select, optimize and manage platforms like Moodle for effective e-learning programs.',
    'E-Learning Consultancy Services & LMS Strategy | Swift Solution',
    'Our experts provide LMS implementation, strategy and learning technology consulting to help you select, optimize and manage platforms like Moodle for effective e-learning programs.',
    'e-learning consultancy, LMS implementation, learning technology consulting, LMS strategy, moodle implementation services, corporate training consultancy',
    'e-learning consultancy, LMS implementation, learning technology consulting',
    'LMS strategy, moodle implementation services, corporate training consultancy',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 4. AI-Powered Solutions (update existing)
UPDATE pages SET
    title = 'AI-Powered eLearning Solutions| Swift Solution',
    description = 'Partner with Bangalore''s leading AI-powered eLearning company that delivers AI-native custom eLearning and training solutions with agentic workflows for faster, accurate content and measurable impact.',
    meta_title = 'AI-Powered eLearning Solutions| Swift Solution',
    meta_description = 'Partner with Bangalore''s leading AI-powered eLearning company that delivers AI-native custom eLearning and training solutions with agentic workflows for faster, accurate content and measurable impact.',
    meta_keywords = 'AI native eLearning, custom training solutions, elearning company India, AI-powered learning',
    primary_keywords = 'AI native eLearning, custom training solutions',
    secondary_keywords = 'elearning company India, AI-powered learning',
    updated_at = NOW()
WHERE slug = 'ai-powered-solutions';

-- 5. Custom eLearning (update existing)
UPDATE pages SET
    title = 'Custom eLearning Development & Design Services,Bengaluru | Swift Solution',
    description = 'Bespoke modules built to your KPIs—microlearning, scenario-based, video, gamification—validated by AI for accuracy and for higher engagement and faster completion.',
    meta_title = 'Custom eLearning Development & Design Services,Bengaluru | Swift Solution',
    meta_description = 'Bespoke modules built to your KPIs—microlearning, scenario-based, video, gamification—validated by AI for accuracy and for higher engagement and faster completion.',
    meta_keywords = 'custom eLearning development, elearning solutions,Bangalore,India, bespoke training, elearning design services',
    primary_keywords = 'custom eLearning development, elearning solutions,Bangalore,India',
    secondary_keywords = 'bespoke training, elearning design services',
    updated_at = NOW()
WHERE slug = 'custom-elearning';

-- 6. Micro-Learning (update existing)
UPDATE pages SET
    title = 'Microlearning Solutions: Bite-Size Training Modules | Swift Solution',
    description = 'Deliver just-in-time learning with mobile-friendly microlearning modules—AI-curated for retention, engagement and measurable results.',
    meta_title = 'Microlearning Solutions: Bite-Size Training Modules | Swift Solution',
    meta_description = 'Deliver just-in-time learning with mobile-friendly microlearning modules—AI-curated for retention, engagement and measurable results.',
    meta_keywords = 'microlearning solutions, byte sized modules, Bengaluru,India, mobile learning, micro modules, just-in-time learning, retention improvement',
    primary_keywords = 'microlearning solutions, byte sized modules, Bengaluru,India',
    secondary_keywords = 'mobile learning, micro modules, just-in-time learning, retention improvement',
    updated_at = NOW()
WHERE slug = 'micro-learning';

-- 7. Video-Based Training (update existing)
UPDATE pages SET
    title = 'Video-Based Training Solutions | Swift Solution',
    description = 'Engage learners with interactive videos, animation and scenario-based storytelling—AI-assisted scripting and multi-language voiceovers.',
    meta_title = 'Video-Based Training Solutions | Swift Solution',
    meta_description = 'Engage learners with interactive videos, animation and scenario-based storytelling—AI-assisted scripting and multi-language voiceovers.',
    meta_keywords = 'elearning Video Solutions, Video based training, corporate video learning, interactive training videos, multilingual training, compliance videos',
    primary_keywords = 'elearning Video Solutions, Video based training',
    secondary_keywords = 'corporate video learning, interactive training videos, multilingual training, compliance videos',
    updated_at = NOW()
WHERE slug = 'video-based-training';

-- 8. ILT to eLearning (update existing)
UPDATE pages SET
    title = 'ILT & VILT to eLearning Conversion Services | Swift Solution',
    description = 'Convert instructor-led and virtual training into engaging eLearning—storyboards, media assets, and assessments ready for LMS deployment.',
    meta_title = 'ILT & VILT to eLearning Conversion Services | Swift Solution',
    meta_description = 'Convert instructor-led and virtual training into engaging eLearning—storyboards, media assets, and assessments ready for LMS deployment.',
    meta_keywords = 'ILT to eLearning conversion, VILT conversion, training digitization',
    primary_keywords = 'ILT to eLearning conversion',
    secondary_keywords = 'VILT conversion, training digitization',
    updated_at = NOW()
WHERE slug = 'ilt-to-elearning';

-- 9. Webinar to eLearning (update existing)
UPDATE pages SET
    title = 'Webinar & Event Recordings conversion to eLearning Modules | Swift Solution',
    description = 'Repurpose webinars into interactive eLearning—segment, script, animate and localize content for consistent, on-demand learning.',
    meta_title = 'Webinar & Event Recordings conversion to eLearning Modules | Swift Solution',
    meta_description = 'Repurpose webinars into interactive eLearning—segment, script, animate and localize content for consistent, on-demand learning.',
    meta_keywords = 'webinar to eLearning conversion, event recordings conversion, webinar repurposing',
    primary_keywords = 'webinar to eLearning conversion',
    secondary_keywords = 'event recordings conversion, webinar repurposing',
    updated_at = NOW()
WHERE slug = 'webinar-to-elearning';

-- 10. Game-Based eLearning (update existing)
UPDATE pages SET
    title = 'Game-Based eLearning Solutions | Engaging & Interactive e-Learning Games| Swift Solution',
    description = 'Level up learning with gamified modules—storylines, challenges, points and leaderboards that drive engagement and retention.',
    meta_title = 'Game-Based eLearning Solutions | Engaging & Interactive e-Learning Games| Swift Solution',
    meta_description = 'Level up learning with gamified modules—storylines, challenges, points and leaderboards that drive engagement and retention.',
    meta_keywords = 'game-based eLearning, gamification learning, serious games',
    primary_keywords = 'game-based eLearning',
    secondary_keywords = 'gamification learning, serious games',
    updated_at = NOW()
WHERE slug = 'game-based-elearning';

-- 11. Translation & Localization (update existing)
UPDATE pages SET
    title = 'eLearning Translation & Localization Services | Swift Solution',
    description = 'Expand globally with multi-lingual eLearning—AI-powered translation, voiceover and cultural adaptation across 50+ languages.',
    meta_title = 'eLearning Translation & Localization Services | Swift Solution',
    meta_description = 'Expand globally with multi-lingual eLearning—AI-powered translation, voiceover and cultural adaptation across 50+ languages.',
    meta_keywords = 'e-learning translation and localization, multilingual e-learning, bangalore,India, localization for training, multi-language eLearning',
    primary_keywords = 'e-learning translation and localization, multilingual e-learning, bangalore,India',
    secondary_keywords = 'localization for training, multi-language eLearning',
    updated_at = NOW()
WHERE slug = 'translation-localization';

-- 12. Rapid eLearning (update existing)
UPDATE pages SET
    title = 'Rapid eLearning Development with Authoring Tools | Swift Solution',
    description = 'Fast-track your course production using rapid authoring tools—AI-assisted templates, SCORM compliance and quick turnaround.',
    meta_title = 'Rapid eLearning Development with Authoring Tools | Swift Solution',
    meta_description = 'Fast-track your course production using rapid authoring tools—AI-assisted templates, SCORM compliance and quick turnaround.',
    meta_keywords = 'rapid eLearning development, authoring tools eLearning, quick course creation',
    primary_keywords = 'rapid eLearning development',
    secondary_keywords = 'authoring tools eLearning, quick course creation',
    updated_at = NOW()
WHERE slug = 'rapid-elearning';

-- 13. Employee Onboarding (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-solutions/on-boarding',
    'Employee Onboarding eLearning Solutions | Swift Solution',
    'Accelerate new-hire readiness with structured onboarding modules—policies, culture, systems training—personalized by AI.',
    'Employee Onboarding eLearning Solutions | Swift Solution',
    'Accelerate new-hire readiness with structured onboarding modules—policies, culture, systems training—personalized by AI.',
    'employee onboarding eLearning, new hire training, onboarding solutions, employee induction training, pre-boarding programs, role-specific training',
    'employee onboarding eLearning',
    'new hire training, onboarding solutions, employee induction training, pre-boarding programs, role-specific training',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 14. Compliance Training (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-solutions/compliance',
    'Online Compliance Training Courses : Multi-Lingual & Audit-Ready | Swift Solution',
    'Deliver dynamic, interactive compliance training that meets regulatory requirements—risk assessment, anti-bribery, sexual harassment prevention—and transforms mandatory training into engaging learning.',
    'Online Compliance Training Courses : Multi-Lingual & Audit-Ready | Swift Solution',
    'Deliver dynamic, interactive compliance training that meets regulatory requirements—risk assessment, anti-bribery, sexual harassment prevention—and transforms mandatory training into engaging learning.',
    'compliance training programs, regulatory training, audit-ready eLearning',
    'compliance training programs',
    'regulatory training, audit-ready eLearning',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 15. Sales Enablement (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-solutions/sales-enablement',
    'Sales Enablement & Product Training eLearning | Swift Solution',
    'Equip sales teams with product knowledge, pitch skills and microlearning modules—AI-driven personalization and analytics.',
    'Sales Enablement & Product Training eLearning | Swift Solution',
    'Equip sales teams with product knowledge, pitch skills and microlearning modules—AI-driven personalization and analytics.',
    'sales enablement eLearning, sales enablement e-learning, product knowledge training, sales process training, CRM training',
    'sales enablement eLearning',
    'sales enablement e-learning, product knowledge training, sales process training, CRM training',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 16. LMS Implementation (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-consultancy/lms-implementation',
    'LMS Implementation & Integration Services | Swift Solution',
    'Deploy and customize LMS with our certified implementation team—installation, theme development, plugin integration, migration, hosting, training and support for a seamless learning platform.',
    'LMS Implementation & Integration Services | Swift Solution',
    'Deploy and customize LMS with our certified implementation team—installation, theme development, plugin integration, migration, hosting, training and support for a seamless learning platform.',
    'LMS implementation services, LMS integration, learning management system setup',
    'LMS implementation services',
    'LMS integration, learning management system setup',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 17. Instructional Design (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'elearning-consultancy/instructional-design',
    'Instructional Design Consulting, Professional eLearning Design| Swift Solution',
    'Expert instructional design services—learner analysis, curriculum design, storyboards and prototyping for high-impact learning.',
    'Instructional Design Consulting, Professional eLearning Design| Swift Solution',
    'Expert instructional design services—learner analysis, curriculum design, storyboards and prototyping for high-impact learning.',
    'instructional design consulting, eLearning storyboarding, curriculum design, learner-centered design, interactive learning, assessment design',
    'instructional design consulting',
    'eLearning storyboarding, curriculum design, learner-centered design, interactive learning, assessment design',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 18. About Us (update existing)
UPDATE pages SET
    title = 'Top elearning company based out of Bangalore,India',
    description = 'Learn about Swift Solution''s 25+ years of leadership in AI-powered e-learning—our journey, values, leadership team and how our domain expertise, AI transformation and ethical practices set us apart in Bangalore.',
    meta_title = 'Top elearning company based out of Bangalore,India',
    meta_description = 'Learn about Swift Solution''s 25+ years of leadership in AI-powered e-learning—our journey, values, leadership team and how our domain expertise, AI transformation and ethical practices set us apart in Bangalore.',
    meta_keywords = 'about Swift Solution, AI-powered corporate training, e-learning company history, leadership team, corporate training Bangalore, company values',
    primary_keywords = 'about Swift Solution, AI-powered corporate training',
    secondary_keywords = 'e-learning company history, leadership team, corporate training Bangalore, company values',
    updated_at = NOW()
WHERE slug = 'about-us';

-- 19. Contact (update existing)
UPDATE pages SET
    title = 'Contact Swift Solution for Custom eLearning solutions,Bengaluru,India',
    description = 'Get in touch for a free consultation on your eLearning project—custom design, AI integration and support.',
    meta_title = 'Contact Swift Solution for Custom eLearning solutions,Bengaluru,India',
    meta_description = 'Get in touch for a free consultation on your eLearning project—custom design, AI integration and support.',
    meta_keywords = 'Swift Solution, training consultation, AI eLearning consultation, corporate training contact',
    primary_keywords = 'Swift Solution, training consultation, AI eLearning consultation, corporate training contact',
    secondary_keywords = 'Swift Solution, training consultation, AI eLearning consultation, corporate training contact',
    updated_at = NOW()
WHERE slug = 'contact';

-- 20. Case Studies (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'case-studies',
    'eLearning Case Studies & Success Stories | Swift Solution',
    'Explore real client case studies showcasing improved performance, cost savings and engagement through AI-powered eLearning.',
    'eLearning Case Studies & Success Stories | Swift Solution',
    'Explore real client case studies showcasing improved performance, cost savings and engagement through AI-powered eLearning.',
    'elearning case studies, success stories, client results',
    'elearning case studies',
    'success stories, client results',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- 21. Blog (new page)
INSERT INTO pages (slug, title, description, meta_title, meta_description, meta_keywords, primary_keywords, secondary_keywords, is_active, created_at, updated_at)
VALUES (
    'blog',
    'Insights & Blog: eLearning Trends & Best Practices | Swift Solution',
    'Stay updated with articles on AI in learning, instructional design, microlearning, compliance, and more.',
    'Insights & Blog: eLearning Trends & Best Practices | Swift Solution',
    'Stay updated with articles on AI in learning, instructional design, microlearning, compliance, and more.',
    'elearning blog, corporate training tips, microlearning insights, video training tips, compliance learning blog',
    'elearning blog',
    'corporate training tips, microlearning insights, video training tips, compliance learning blog',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (slug) 
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    meta_keywords = EXCLUDED.meta_keywords,
    primary_keywords = EXCLUDED.primary_keywords,
    secondary_keywords = EXCLUDED.secondary_keywords,
    updated_at = NOW();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug_seo ON pages(slug) WHERE meta_title IS NOT NULL;

-- Verification query to check the import
SELECT 
    COUNT(*) as total_pages,
    COUNT(CASE WHEN meta_title IS NOT NULL THEN 1 END) as pages_with_meta_title,
    COUNT(CASE WHEN meta_description IS NOT NULL THEN 1 END) as pages_with_meta_description,
    COUNT(CASE WHEN meta_keywords IS NOT NULL THEN 1 END) as pages_with_meta_keywords,
    COUNT(CASE WHEN primary_keywords IS NOT NULL THEN 1 END) as pages_with_primary_keywords,
    COUNT(CASE WHEN secondary_keywords IS NOT NULL THEN 1 END) as pages_with_secondary_keywords
FROM pages;