"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const logos = [
  "/IMAGES/new logos/Flipkart_logo.png",
  "/IMAGES/new logos/Google_2015_logo.svg.png",
  "/IMAGES/new logos/HGS.jpg",
  "/IMAGES/new logos/ITC_Limited.png",
  "/IMAGES/new logos/KPMG_logo.png",
  "/IMAGES/new logos/ONGC.jpg",
  "/IMAGES/new logos/RR.jpg",
  "/IMAGES/new logos/SBI.jpg",
  "/IMAGES/new logos/Swiggy_Logo.png",
  "/IMAGES/new logos/Zepto.png",
  "/IMAGES/new logos/microsoft.jpg",
  "/IMAGES/new logos/mrf-logo.png",
  "/IMAGES/new logos/novo.jpg",
]

export default function BrandCarousel() {
  const [duplicatedLogos, setDuplicatedLogos] = useState<string[]>([])

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
                    src={logo}
                    alt={`Partner logo ${index + 1}`}
                    fill
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

