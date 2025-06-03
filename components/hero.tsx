"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <div className="relative overflow-hidden w-full">
      {/* Full-width video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '56.25%' }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            style={{ objectPosition: "center" }}
          >
            <source src="/Banner Video V3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Dark overlay with minimal opacity */}
        <div className="absolute inset-0 bg-black opacity-30 dark:opacity-40"></div>
      </div>

      {/* Height container for the video */}
      <div className="relative min-h-[80vh] md:min-h-screen">
        {/* Text container positioned at the bottom center with more space from bottom */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 z-10 mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-white max-w-5xl mx-auto"
          >
            <span className="inline block mb-2 md:mb-0 md:inline">Transforming Corporate Learning </span>
            <span className="inline-block text-white bg-black bg-opacity-50 px-2 py-1 rounded">with 25 Years of E-Learning Excellence</span>
          </motion.h1>
        </div>
      </div>
    </div>
  )
}

