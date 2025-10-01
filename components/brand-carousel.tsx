"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const logos = [
  { src: "/IMAGES/new logos/Flipkart_logo.png", alt: "Flipkart - India's leading e-commerce platform" },
  { src: "/IMAGES/new logos/Google_2015_logo.svg.png", alt: "Google - Global technology leader" },
  { src: "/IMAGES/new logos/HGS.jpg", alt: "HGS - Global business process management company" },
  { src: "/IMAGES/new logos/ITC_Limited.png", alt: "ITC Limited - Indian multinational conglomerate" },
  { src: "/IMAGES/new logos/KPMG_logo.png", alt: "KPMG - Global professional services firm" },
  { src: "/IMAGES/new logos/ONGC.jpg", alt: "ONGC - Oil and Natural Gas Corporation of India" },
  { src: "/IMAGES/new logos/RR.jpg", alt: "Reliance Retail - India's largest retailer" },
  { src: "/IMAGES/new logos/SBI.jpg", alt: "State Bank of India - India's largest public sector bank" },
  { src: "/IMAGES/new logos/Swiggy_Logo.png", alt: "Swiggy - India's leading food delivery platform" },
  { src: "/IMAGES/new logos/Zepto.png", alt: "Zepto - Quick commerce delivery platform" },
  { src: "/IMAGES/new logos/microsoft.jpg", alt: "Microsoft - Global technology corporation" },
  { src: "/IMAGES/new logos/mrf-logo.png", alt: "MRF - India's largest tire manufacturer" },
  { src: "/IMAGES/new logos/novo.jpg", alt: "Novo Nordisk - Global healthcare company" },
]

export default function BrandCarousel() {
  const [duplicatedLogos, setDuplicatedLogos] = useState<typeof logos>([])

  useEffect(() => {
    // Duplicate logos to create seamless infinite scroll effect
    setDuplicatedLogos([...logos, ...logos])
  }, [])

  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Global leaders and Top companies in india</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join hundreds of companies that trust us with their eLearning needs
          </p>
        </motion.div>

        <div className="relative w-full">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling logos */}
          <div className="relative overflow-hidden w-full">
            <motion.div
              className="flex gap-16 items-center py-4"
              animate={{
                x: [0, -120 * logos.length],
              }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative w-[140px] h-[70px] grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="140px"
                    className="object-contain"
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

