"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { HeaderConfig, HeaderMenuItemConfig } from "@/types/site-layout"
import { DEFAULT_HEADER_CONFIG } from "@/lib/config/site-layout"

interface HeaderApiResponse {
  success?: boolean
  data?: unknown
}

function sanitizeMenuItem(item: any): HeaderMenuItemConfig | null {
  if (!item || typeof item !== "object") return null
  if (typeof item.title !== "string" || typeof item.href !== "string") return null

  const sanitized: HeaderMenuItemConfig = {
    title: item.title,
    href: item.href,
  }

  if (Array.isArray(item.submenu)) {
    const children = item.submenu
      .map(sanitizeMenuItem)
      .filter((child: HeaderMenuItemConfig | null): child is HeaderMenuItemConfig => Boolean(child))

    if (children.length > 0) {
      sanitized.submenu = children
    }
  }

  if (typeof item.external === "boolean") {
    sanitized.external = item.external
  }

  return sanitized
}

function mergeHeaderConfig(payload: unknown): HeaderConfig {
  if (!payload || typeof payload !== "object") {
    return DEFAULT_HEADER_CONFIG
  }

  const raw = payload as Partial<HeaderConfig>
  const logo = raw.logo && typeof raw.logo === "object"
    ? { ...DEFAULT_HEADER_CONFIG.logo, ...raw.logo }
    : DEFAULT_HEADER_CONFIG.logo

  const menuItemsCandidate = Array.isArray(raw.menuItems)
    ? raw.menuItems
        .map(sanitizeMenuItem)
        .filter((item): item is HeaderMenuItemConfig => Boolean(item))
    : []

  const menuItems = menuItemsCandidate.length > 0
    ? menuItemsCandidate
    : DEFAULT_HEADER_CONFIG.menuItems

  const cta = raw.cta && typeof raw.cta === "object" && typeof raw.cta.label === "string"
    ? { ...DEFAULT_HEADER_CONFIG.cta, ...raw.cta }
    : DEFAULT_HEADER_CONFIG.cta

  const showThemeToggle = raw.showThemeToggle ?? DEFAULT_HEADER_CONFIG.showThemeToggle

  return {
    logo,
    menuItems,
    cta,
    showThemeToggle,
  }
}

function getLinkProps(item: HeaderMenuItemConfig) {
  if (item.external) {
    return {
      target: "_blank",
      rel: "noopener noreferrer",
    }
  }

  return {}
}

export default function Navbar() {
  const [config, setConfig] = useState<HeaderConfig>(DEFAULT_HEADER_CONFIG)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadConfig() {
      try {
        const response = await fetch('/api/layout/header', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload: HeaderApiResponse = await response.json()
        if (!payload || typeof payload !== 'object' || !('data' in payload)) {
          return
        }

        const merged = mergeHeaderConfig(payload.data)
        if (isActive) {
          setConfig(merged)
        }
      } catch (error) {
        console.error('Failed to load header configuration, using defaults:', error)
      }
    }

    void loadConfig()
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenMobileSubmenu(null)
  }

  const handleCta = () => {
    const cta = config.cta ?? DEFAULT_HEADER_CONFIG.cta
    if (!cta) return

    if (cta.scrollTarget) {
      const targetElement = document.getElementById(cta.scrollTarget)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    if (cta.href) {
      const isExternal = /^(https?:)?\/\//.test(cta.href)
      if (isExternal) {
        window.open(cta.href, '_blank', 'noopener')
      } else {
        window.location.assign(cta.href)
      }
    }
  }

  const ctaLabel = config.cta?.label || DEFAULT_HEADER_CONFIG.cta?.label || 'Get quote'

  const headerClasses = useMemo(
    () =>
      `sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent'
      }`,
    [isScrolled],
  )

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-28">
          <Link href="/" className="flex-shrink-0 relative z-50" aria-label="Go to homepage">
            <Image
              src={config.logo.src}
              alt={config.logo.alt}
              width={config.logo.width ?? DEFAULT_HEADER_CONFIG.logo.width ?? 360}
              height={config.logo.height ?? DEFAULT_HEADER_CONFIG.logo.height ?? 120}
              className={config.logo.className ?? 'w-auto h-24'}
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {config.menuItems.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="relative"
                onMouseEnter={() => setOpenMenu(index)}
                onMouseLeave={() => setOpenMenu(null)}
              >
{item.submenu ? (
                  <button
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] transition-colors duration-200 text-sm cursor-default"
                  >
                    {item.title}
                    <ChevronDown className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] transition-colors duration-200 text-sm"
                    {...getLinkProps(item)}
                  >
                    {item.title}
                  </Link>
                )}

                <AnimatePresence>
                  {item.submenu && openMenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg py-2"
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={`${subItem.title}-${subIndex}`}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] hover:bg-gray-50 dark:hover:bg-gray-700"
                          {...getLinkProps(subItem)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={handleCta}
              className="inline-flex items-center px-4 py-2 border-2 border-primary text-primary rounded-full text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200 whitespace-nowrap"
            >
              {ctaLabel}
            </button>
            {(config.showThemeToggle ?? true) && <ThemeToggle />}
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            {(config.showThemeToggle ?? true) && <ThemeToggle />}
            <button
              onClick={toggleMobileMenu}
              className="p-2 relative z-50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/20 lg:hidden z-40"
                  onClick={closeMobileMenu}
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 right-0 bottom-0 w-[300px] bg-white dark:bg-gray-800 lg:hidden overflow-y-auto z-50 shadow-xl h-[100vh]"
                >
                  <div className="p-6 pt-20 relative">
                    <button
                      onClick={closeMobileMenu}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Close menu"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    {config.menuItems.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="mb-4">
                        {item.submenu ? (
                          <div>
                            <button
                              onClick={() => setOpenMobileSubmenu(openMobileSubmenu === index ? null : index)}
                              className="flex items-center justify-between w-full text-left text-gray-900 dark:text-gray-200 py-2"
                            >
                              <span className="text-base font-medium">{item.title}</span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                                  openMobileSubmenu === index ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {openMobileSubmenu === index && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-4 py-2 space-y-2">
                                    {item.submenu.map((subItem, subIndex) => (
                                      <Link
                                        key={`${subItem.title}-${subIndex}`}
                                        href={subItem.href}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] py-2 text-sm border-l-2 border-gray-200 dark:border-gray-600 pl-3 hover:border-[#FF6B38] dark:hover:border-[#FF6B38] transition-colors"
                                        onClick={closeMobileMenu}
                                        {...getLinkProps(subItem)}
                                      >
                                        {subItem.title}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block text-gray-900 dark:text-gray-200 py-2 text-base font-medium"
                            onClick={closeMobileMenu}
                            {...getLinkProps(item)}
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                    {ctaLabel && (
                      <button
                        onClick={() => {
                          handleCta()
                          closeMobileMenu()
                        }}
                        className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 border-2 border-[#FF6B38] text-[#FF6B38] rounded-full text-sm font-medium hover:bg-[#FF6B38] hover:text-white transition-colors duration-200"
                      >
                        {ctaLabel}
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  )
}
