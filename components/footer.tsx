"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Map,
  Twitter,
} from "lucide-react"
import type {
  FooterColumnConfig,
  FooterConfig,
  FooterLinkConfig,
  FooterSocialLinkConfig,
} from "@/types/site-layout"
import { DEFAULT_FOOTER_CONFIG } from "@/lib/config/site-layout"

interface FooterApiResponse {
  success?: boolean
  data?: unknown
}

type SocialPlatform = 'twitter' | 'x' | 'linkedin' | 'instagram' | 'youtube' | 'mail' | 'email'

type SocialIconMap = Record<SocialPlatform, typeof Twitter>

const socialIcons: SocialIconMap = {
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  mail: Mail,
  email: Mail,
}

function sanitizeFooterLink(entry: any): FooterLinkConfig | null {
  if (!entry || typeof entry !== 'object') return null
  if (typeof entry.label !== 'string') return null

  const link: FooterLinkConfig = {
    label: entry.label,
  }

  if (typeof entry.href === 'string') {
    link.href = entry.href
  }

  if (typeof entry.type === 'string') {
    const type = entry.type as FooterLinkConfig['type']
    if (type === 'link' || type === 'button' || type === 'scroll' || type === 'mailto') {
      link.type = type
    }
  }

  if (typeof entry.scrollTarget === 'string') {
    link.scrollTarget = entry.scrollTarget
  }

  if (typeof entry.target === 'string') {
    link.target = entry.target
  }

  return link
}

function sanitizeFooterColumn(entry: any): FooterColumnConfig | null {
  if (!entry || typeof entry !== 'object') return null
  if (typeof entry.title !== 'string' || !Array.isArray(entry.links)) return null

  const links = entry.links
    .map(sanitizeFooterLink)
    .filter((link): link is FooterLinkConfig => Boolean(link))

  if (links.length === 0) return null

  return {
    title: entry.title,
    links,
  }
}

function sanitizeFooterSocialLink(entry: any): FooterSocialLinkConfig | null {
  if (!entry || typeof entry !== 'object') return null
  if (typeof entry.platform !== 'string' || typeof entry.href !== 'string') return null

  const link: FooterSocialLinkConfig = {
    platform: entry.platform,
    href: entry.href,
  }

  if (typeof entry.label === 'string') {
    link.label = entry.label
  }

  return link
}

function mergeFooterConfig(payload: unknown): FooterConfig {
  if (!payload || typeof payload !== 'object') {
    return DEFAULT_FOOTER_CONFIG
  }

  const raw = payload as Partial<FooterConfig>

  const brandLogo = raw.brand?.logo && typeof raw.brand.logo === 'object'
    ? { ...DEFAULT_FOOTER_CONFIG.brand.logo, ...raw.brand.logo }
    : DEFAULT_FOOTER_CONFIG.brand.logo

  const brand = {
    logo: brandLogo,
    tagline: raw.brand?.tagline ?? DEFAULT_FOOTER_CONFIG.brand.tagline,
  }

  const socialLinksCandidate = Array.isArray(raw.socialLinks)
    ? raw.socialLinks
        .map(sanitizeFooterSocialLink)
        .filter((link): link is FooterSocialLinkConfig => Boolean(link))
    : []

  const socialLinks = socialLinksCandidate.length > 0
    ? socialLinksCandidate
    : DEFAULT_FOOTER_CONFIG.socialLinks

  const contact = {
    phone: raw.contact?.phone ?? DEFAULT_FOOTER_CONFIG.contact.phone,
    email: raw.contact?.email ?? DEFAULT_FOOTER_CONFIG.contact.email,
  }

  const columnsCandidate = Array.isArray(raw.columns)
    ? raw.columns
        .map(sanitizeFooterColumn)
        .filter((column): column is FooterColumnConfig => Boolean(column))
    : []

  const columns = columnsCandidate.length > 0
    ? columnsCandidate
    : DEFAULT_FOOTER_CONFIG.columns

  const address = {
    text: raw.address?.text ?? DEFAULT_FOOTER_CONFIG.address.text,
  }

  const legal = {
    copyrightText: raw.legal?.copyrightText ?? DEFAULT_FOOTER_CONFIG.legal.copyrightText,
    autoYear: raw.legal?.autoYear ?? DEFAULT_FOOTER_CONFIG.legal.autoYear,
  }

  return {
    backgroundClass: raw.backgroundClass ?? DEFAULT_FOOTER_CONFIG.backgroundClass,
    brand,
    socialLinks,
    contact,
    columns,
    address,
    legal,
  }
}

function formatCopyright(legal: FooterConfig['legal']) {
  const yearPrefix = legal.autoYear ? `${new Date().getFullYear()} ` : ''
  return `© ${yearPrefix}${legal.copyrightText}`
}

function resolveSocialIcon(platform: string) {
  const key = platform.toLowerCase() as SocialPlatform
  return socialIcons[key] ?? Twitter
}

function handleFooterLinkClick(link: FooterLinkConfig) {
  if (link.type === 'scroll' && link.scrollTarget) {
    const target = document.getElementById(link.scrollTarget)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return true
  }
  return false
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG)

  useEffect(() => {
    let isActive = true

    async function loadConfig() {
      try {
        const response = await fetch('/api/layout/footer', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload: FooterApiResponse = await response.json()
        if (!payload || typeof payload !== 'object' || !('data' in payload)) {
          return
        }

        const merged = mergeFooterConfig(payload.data)
        if (isActive) {
          setConfig(merged)
        }
      } catch (error) {
        console.error('Failed to load footer configuration, using defaults:', error)
      }
    }

    void loadConfig()
    return () => {
      isActive = false
    }
  }, [])

  const backgroundClass = useMemo(
    () => config.backgroundClass ?? DEFAULT_FOOTER_CONFIG.backgroundClass,
    [config.backgroundClass],
  )

  const addressLines = useMemo(
    () => config.address.text.split('\n').filter(Boolean),
    [config.address.text],
  )

  return (
    <footer className={backgroundClass}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <Image
              src={config.brand.logo.src}
              alt={config.brand.logo.alt}
              width={config.brand.logo.width ?? DEFAULT_FOOTER_CONFIG.brand.logo.width ?? 300}
              height={config.brand.logo.height ?? DEFAULT_FOOTER_CONFIG.brand.logo.height ?? 100}
              className="w-auto h-20 mb-8"
            />

            <div className="flex space-x-4 mb-8">
              {config.socialLinks.map((social) => {
                const Icon = resolveSocialIcon(social.platform)
                return (
                  <Link
                    key={`${social.platform}-${social.href}`}
                    href={social.href}
                    className="hover:opacity-80 transition-opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label ?? social.platform}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </Link>
                )
              })}
            </div>

            <div className="text-white text-sm space-y-2">
              {config.contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <p>{config.contact.phone}</p>
                </div>
              )}
              {config.contact.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <p>{config.contact.email}</p>
                </div>
              )}
            </div>
          </div>

          {config.columns.map((column) => (
            <div key={column.title} className="md:col-span-3">
              <h3 className="text-lg font-bold mb-6">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => {
                  const isScroll = link.type === 'scroll'
                  const href = link.type === 'mailto'
                    ? `mailto:${link.href ?? config.contact.email ?? ''}`
                    : link.href ?? '#'

                  if (isScroll) {
                    return (
                      <li key={`${column.title}-${link.label}`}>
                        <button
                          onClick={() => handleFooterLinkClick(link)}
                          className="text-white hover:underline text-sm text-left"
                        >
                          {link.label}
                        </button>
                      </li>
                    )
                  }

                  return (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={href}
                        className="text-white hover:underline text-sm"
                        target={link.target}
                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                        onClick={link.type === 'button' ? () => handleFooterLinkClick(link) : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-sm border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-start mb-4 md:mb-0 text-left">
            <Map className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              {addressLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <p className="text-sm opacity-80">{formatCopyright(config.legal)}</p>
        </div>
      </div>
    </footer>
  )
}
