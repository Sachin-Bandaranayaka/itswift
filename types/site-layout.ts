export interface HeaderLogoConfig {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export interface HeaderMenuItemConfig {
  title: string
  href: string
  submenu?: HeaderMenuItemConfig[]
  external?: boolean
}

export interface HeaderCtaConfig {
  label: string
  href?: string
  scrollTarget?: string
}

export interface HeaderConfig {
  logo: HeaderLogoConfig
  menuItems: HeaderMenuItemConfig[]
  cta?: HeaderCtaConfig
  showThemeToggle?: boolean
}

export interface FooterSocialLinkConfig {
  platform: string
  href: string
  label?: string
}

export interface FooterContactConfig {
  phone?: string
  email?: string
}

export interface FooterLinkConfig {
  label: string
  href?: string
  type?: 'link' | 'button' | 'scroll' | 'mailto'
  scrollTarget?: string
  target?: string
}

export interface FooterColumnConfig {
  title: string
  links: FooterLinkConfig[]
}

export interface FooterBrandConfig {
  logo: HeaderLogoConfig
  tagline?: string
}

export interface FooterAddressConfig {
  text: string
}

export interface FooterLegalConfig {
  copyrightText: string
  autoYear?: boolean
}

export interface FooterConfig {
  backgroundClass?: string
  brand: FooterBrandConfig
  socialLinks: FooterSocialLinkConfig[]
  contact: FooterContactConfig
  columns: FooterColumnConfig[]
  address: FooterAddressConfig
  legal: FooterLegalConfig
}

export interface SiteLayoutConfig {
  header: HeaderConfig
  footer: FooterConfig
}
