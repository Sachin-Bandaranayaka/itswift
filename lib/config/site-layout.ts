import type {
  FooterConfig,
  HeaderConfig,
} from '@/types/site-layout'

export const HEADER_SECTION_KEY = 'site_header_config'
export const FOOTER_SECTION_KEY = 'site_footer_config'
export const LAYOUT_PAGE_SLUG = '__site_layout__'
export const LAYOUT_PAGE_TITLE = 'Site Layout Settings'
export const LAYOUT_PAGE_DESCRIPTION = 'System page used to store global header and footer configuration.'

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  logo: {
    src: '/IMAGES/Swift_logo_new copy.svg',
    alt: 'Swift Solution - Growth thru Creativity',
    width: 360,
    height: 120,
  },
  menuItems: [
    {
      title: 'eLearning Services',
      href: '#',
      submenu: [
        { title: 'AI-Powered eLearning Solutions', href: '/elearning-services/ai-powered-solutions' },
        { title: 'Custom eLearning', href: '/elearning-services/custom-elearning' },
        { title: 'Micro Learning', href: '/elearning-services/micro-learning' },
        { title: 'Video Based Training', href: '/elearning-services/video-based-training' },
        { title: 'ILT to eLearning conversion', href: '/elearning-services/ilt-to-elearning' },
        { title: 'Webinar to eLearning conversion', href: '/elearning-services/webinar-to-elearning' },
        { title: 'Game based eLearning', href: '/elearning-services/game-based-elearning' },
        { title: 'eLearning translation and localization', href: '/elearning-services/translation-localization' },
        { title: 'Rapid eLearning', href: '/elearning-services/rapid-elearning' },
      ],
    },
    {
      title: 'eLearning Solutions',
      href: '#',
      submenu: [
        { title: 'Onboarding', href: '/elearning-solutions/on-boarding' },
        { title: 'Compliance', href: '/elearning-solutions/compliance' },
        { title: 'Sales enablement', href: '/elearning-solutions/sales-enablement' },
      ],
    },
    {
      title: 'eLearning Consultancy',
      href: '#',
      submenu: [
        { title: 'LMS implementation', href: '/elearning-consultancy/lms-implementation' },
        { title: 'Instructional design services', href: '/elearning-consultancy/instructional-design' },
      ],
    },
    {
      title: 'Our profile',
      href: '#',
      submenu: [
        { title: 'About Us', href: '/about-us' },
        { title: 'Case studies', href: '/case-studies' },
      ],
    },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact Us', href: '/contact' },
  ],
  cta: {
    label: 'Get quote',
    scrollTarget: 'contact',
  },
  showThemeToggle: true,
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  backgroundClass: 'bg-gradient-to-r from-[#FF6B38] via-[#e05a79] to-[#9d4edd] text-white py-16 dark:from-[#CC5630] dark:via-[#b34861] dark:to-[#7d3eb1]',
  brand: {
    logo: {
      src: '/IMAGES/Swift_logo_new copy.svg',
      alt: 'Swift Solution',
      width: 300,
      height: 100,
    },
    tagline: 'Swift Solution',
  },
  socialLinks: [
    { platform: 'twitter', href: 'https://x.com/itswiftdotcom', label: 'Twitter/X' },
    { platform: 'linkedin', href: 'https://in.linkedin.com/company/swift-solution-pvt-ltd', label: 'LinkedIn' },
    { platform: 'youtube', href: 'https://www.youtube.com/@swiftsolutionpvtltd', label: 'YouTube' },
  ],
  contact: {
    phone: '080-23215884',
    email: 'swiftsol@itswift.com',
  },
  columns: [
    {
      title: 'eLearning Services',
      links: [
        { label: 'AI-Powered eLearning Solutions', href: '/elearning-services/ai-powered-solutions' },
        { label: 'Custom eLearning', href: '/elearning-services/custom-elearning' },
        { label: 'Micro Learning', href: '/elearning-services/micro-learning' },
        { label: 'Video Based Training', href: '/elearning-services/video-based-training' },
        { label: 'ILT to eLearning Conversion', href: '/elearning-services/ilt-to-elearning' },
        { label: 'Webinar to eLearning Conversion', href: '/elearning-services/webinar-to-elearning' },
        { label: 'Game Based eLearning', href: '/elearning-services/game-based-elearning' },
        { label: 'eLearning Translation & Localization', href: '/elearning-services/translation-localization' },
        { label: 'Rapid eLearning', href: '/elearning-services/rapid-elearning' },
      ],
    },
    {
      title: 'eLearning Solutions',
      links: [
        { label: 'On-Boarding', href: '/elearning-solutions/on-boarding' },
        { label: 'Compliance', href: '/elearning-solutions/compliance' },
        { label: 'Sales Enablement', href: '/elearning-solutions/sales-enablement' },
        { label: 'LMS Implementation', href: '/elearning-consultancy/lms-implementation' },
        { label: 'Instructional Design', href: '/elearning-consultancy/instructional-design' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Awards', href: '/awards' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact Us', href: 'mailto:swiftsol@itswift.com', type: 'mailto' },
        { label: 'Get a Quote', type: 'scroll', scrollTarget: 'contact' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
  ],
  address: {
    text: '# 31, 14th Main, Agromore Layout, Atthiguppe Extn, (Near to Chandra Layout Water Tank), Vijaynagar, Bangalore - 560 040 Karnataka',
  },
  legal: {
    copyrightText: 'Swift Solution. All rights reserved.',
    autoYear: true,
  },
}
