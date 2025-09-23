"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface MenuItem {
  title: string
  href: string
  submenu?: { title: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    title: "eLearning Services",
    href: "/elearning-services",
    submenu: [
      { title: "AI-Powered eLearning Solutions", href: "/elearning-services/ai-powered-solutions" },
      { title: "Custom eLearning", href: "/elearning-services/custom-elearning" },
      { title: "Micro Learning", href: "/elearning-services/micro-learning" },
      { title: "Video Based Training", href: "/elearning-services/video-based-training" },
      { title: "ILT to eLearning conversion", href: "/elearning-services/ilt-to-elearning" },
      { title: "Webinar to eLearning conversion", href: "/elearning-services/webinar-to-elearning" },
      { title: "Game based eLearning", href: "/elearning-services/game-based-elearning" },
      { title: "eLearning translation and localization", href: "/elearning-services/translation-localization" },
      { title: "Rapid eLearning", href: "/elearning-services/rapid-elearning" },
    ],
  },
  {
    title: "eLearning Solutions",
    href: "/elearning-solutions",
    submenu: [
      { title: "Onboarding", href: "/elearning-solutions/on-boarding" },
      { title: "Compliance", href: "/elearning-solutions/compliance" },
      { title: "Sales enablement", href: "/elearning-solutions/sales-enablement" },
    ],
  },
  {
    title: "eLearning Consultancy",
    href: "/elearning-consultancy",
    submenu: [
      { title: "LMS implementation", href: "/elearning-consultancy/lms-implementation" },
      { title: "Instructional design services", href: "/elearning-consultancy/instructional-design" },
    ],
  },
  {
    title: "Our profile",
    href: "#",
    submenu: [
      { title: "About Us", href: "/about-us" },
      { title: "Case studies", href: "/case-studies" },
    ],
  },
  { title: "Blog", href: "/blog" },
  { title: "Contact Us", href: "/contact" },
]

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToContact = () => {
    const contactElement = document.getElementById('contact')
    if (contactElement) {
      contactElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-50">
            <Image
              src="/IMAGES/Swift_logo_new copy.svg"
              alt="Swift Solution - Growth thru Creativity"
              width={360}
              height={120}
              className="w-auto h-24"
            />
          </Link>

          {/* Main Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setOpenMenu(index)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] transition-colors duration-200 text-sm"
                >
                  {item.title}
                  {item.submenu && <ChevronDown className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />}
                </Link>

                {/* Desktop Dropdown Menu */}
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
                          key={subIndex}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] hover:bg-gray-50 dark:hover:bg-gray-700"
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

          {/* CTA Button and Theme Toggle - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center px-4 py-2 border-2 border-primary text-primary rounded-full text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200 whitespace-nowrap"
            >
              Get quote
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 relative z-50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
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
                    {menuItems.map((item, index) => (
                      <div key={index} className="mb-4">
                        {item.submenu ? (
                          <div>
                            <button
                              onClick={() => setOpenMobileSubmenu(openMobileSubmenu === index ? null : index)}
                              className="flex items-center justify-between w-full text-left text-gray-900 dark:text-gray-200 py-2"
                            >
                              <span className="text-base font-medium">{item.title}</span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${openMobileSubmenu === index ? "rotate-180" : ""
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
                                        key={subIndex}
                                        href={subItem.href}
                                        className="block text-gray-600 dark:text-gray-300 hover:text-[#FF6B38] dark:hover:text-[#FF6B38] py-2 text-sm border-l-2 border-gray-200 dark:border-gray-600 pl-3 hover:border-[#FF6B38] dark:hover:border-[#FF6B38] transition-colors"
                                        onClick={closeMobileMenu}
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
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        scrollToContact()
                        closeMobileMenu()
                      }}
                      className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 border-2 border-[#FF6B38] text-[#FF6B38] rounded-full text-sm font-medium hover:bg-[#FF6B38] hover:text-white transition-colors duration-200"
                    >
                      Get a quote!
                    </button>
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

