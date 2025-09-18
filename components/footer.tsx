import Image from "next/image"
import { Linkedin, Instagram, Youtube, Mail, Phone, Map, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#FF6B38] via-[#e05a79] to-[#9d4edd] text-white py-16 dark:from-[#CC5630] dark:via-[#b34861] dark:to-[#7d3eb1]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Social Media */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <Image
              src="/IMAGES/Swift_logo_new.png"
              alt="Swift Solution"
              width={180}
              height={60}
              className="w-auto h-12 mb-8"
            />

            <div className="flex space-x-4 mb-8">
              <Link href="https://x.com/itswiftdotcom" className="hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6 text-white" />
              </Link>
              <Link href="https://in.linkedin.com/company/swift-solution-pvt-ltd" className="hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6 text-white" />
              </Link>
              <Link href="https://www.youtube.com/@swiftsolutionpvtltd" className="hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-6 w-6 text-white" />
              </Link>
            </div>

            <div className="text-white text-sm">
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <p>080-23215884</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <p>swiftsol@itswift.com</p>
              </div>
            </div>
          </div>

          {/* eLearning Services */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6">eLearning Services</h3>
            <div className="grid grid-cols-1 gap-y-3">
              {/* First column of services */}
              <div className="space-y-3">
                <Link href="/elearning-services/ai-powered-solutions" className="block text-white hover:underline text-sm">
                  AI-Powered eLearning Solutions
                </Link>
                <Link href="/elearning-services/custom-elearning" className="block text-white hover:underline text-sm">
                  Custom eLearning
                </Link>
                <Link href="/elearning-services/micro-learning" className="block text-white hover:underline text-sm">
                  Micro Learning
                </Link>
                <Link href="/elearning-services/video-based-training" className="block text-white hover:underline text-sm">
                  Video Based Training
                </Link>
                <Link href="/elearning-services/ilt-to-elearning" className="block text-white hover:underline text-sm">
                  ILT to eLearning Conversion
                </Link>
              </div>
              
              {/* Second column of services */}
              <div className="space-y-3 mt-4">
                <Link href="/elearning-services/webinar-to-elearning" className="block text-white hover:underline text-sm">
                  Webinar to eLearning Conversion
                </Link>
                <Link href="/elearning-services/game-based-elearning" className="block text-white hover:underline text-sm">
                  Game Based eLearning
                </Link>
                <Link href="/elearning-services/translation-localization" className="block text-white hover:underline text-sm">
                  eLearning Translation & Localization
                </Link>
                <Link href="/elearning-services/rapid-elearning" className="block text-white hover:underline text-sm">
                  Rapid eLearning
                </Link>
              </div>
            </div>
          </div>

          {/* eLearning Solutions */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6">eLearning Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/elearning-solutions/on-boarding" className="text-white hover:underline text-sm">
                  On-Boarding
                </Link>
              </li>
              <li>
                <Link href="/elearning-solutions/compliance" className="text-white hover:underline text-sm">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/elearning-solutions/sales-enablement" className="text-white hover:underline text-sm">
                  Sales Enablement
                </Link>
              </li>
              <li>
                <Link href="/elearning-consultancy/lms-implementation" className="text-white hover:underline text-sm">
                  LMS Implementation
                </Link>
              </li>
              <li>
                <Link href="/elearning-consultancy/instructional-design" className="text-white hover:underline text-sm">
                  Instructional Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-white hover:underline text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-white hover:underline text-sm">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-white hover:underline text-sm">
                  Awards
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white hover:underline text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="mailto:swiftsol@itswift.com" className="text-white hover:underline text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="mailto:swiftsol@itswift.com?subject=Quote Request" className="text-white hover:underline text-sm">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white hover:underline text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Address */}
        <div className="mt-16 text-sm border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-start mb-4 md:mb-0">
            <Map className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-left">
              # 31, 14th Main, Agromore Layout, Atthiguppe Extn, (Near to Chandra Layout Water Tank), Vijaynagar, Bangalore - 560 040 Karnataka
            </p>
          </div>
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Swift Solution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

