'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Lightbulb,
  Clock,
  Star,
  Play
} from 'lucide-react';
import Contact from "@/components/contact";
import { usePageContent } from '@/hooks/use-page-content';
import DynamicFAQ from '@/components/dynamic-faq';
import DynamicContent from '@/components/dynamic-content';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SalesEnablementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { getContent } = usePageContent('elearning-solutions/sales-enablement');

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increased Sales Performance",
      description: "Boost your sales team's performance with targeted training that directly impacts revenue growth."
    },
    {
      icon: Target,
      title: "Improved Win Rates",
      description: "Enhance your team's ability to close deals with strategic sales methodologies and best practices."
    },
    {
      icon: Users,
      title: "Consistent Messaging",
      description: "Ensure all sales representatives deliver consistent, compelling value propositions to prospects."
    },
    {
      icon: Clock,
      title: "Faster Onboarding",
      description: "Accelerate new hire productivity with structured, comprehensive sales training programs."
    }
  ];

  const solutions = [
    {
      title: "Product Knowledge Training",
      description: "Comprehensive training on your products, features, benefits, and competitive advantages.",
      features: ["Interactive product demos", "Feature comparison tools", "Competitive analysis", "Use case scenarios"]
    },
    {
      title: "Sales Process Training",
      description: "Structured training on your sales methodology, from prospecting to closing deals.",
      features: ["Lead qualification", "Objection handling", "Negotiation tactics", "Closing techniques"]
    },
    {
      title: "Customer Relationship Management",
      description: "Training on building and maintaining strong customer relationships throughout the sales cycle.",
      features: ["Communication skills", "Relationship building", "Customer needs analysis", "Follow-up strategies"]
    },
    {
      title: "Sales Tools & Technology",
      description: "Training on CRM systems, sales automation tools, and digital selling techniques.",
      features: ["CRM optimization", "Sales automation", "Digital prospecting", "Analytics & reporting"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Needs Assessment",
      description: "We analyze your sales challenges, team skills, and performance gaps to design targeted solutions."
    },
    {
      step: "02",
      title: "Content Development",
      description: "Our experts create customized training content aligned with your sales process and methodology."
    },
    {
      step: "03",
      title: "Interactive Design",
      description: "We develop engaging, interactive modules with simulations, role-plays, and real-world scenarios."
    },
    {
      step: "04",
      title: "Implementation",
      description: "We deploy the training program with proper change management and user adoption strategies."
    },
    {
      step: "05",
      title: "Performance Tracking",
      description: "We monitor progress, measure results, and provide ongoing optimization recommendations."
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getContent('hero.image.src', '/IMAGES/11.Sales enablement/download (1).png')}
            alt={getContent('hero.image.alt', 'Sales Enablement Background')}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <DynamicContent 
                sectionKey="hero_title" 
                pageSlug="elearning-solutions/sales-enablement" 
                fallback="Sales Enablement & Product Training eLearning Solutions"
                as="span"
              />
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-white opacity-90">
              <DynamicContent 
                sectionKey="hero_subtitle" 
                pageSlug="elearning-solutions/sales-enablement" 
                fallback="Empower your sales team with comprehensive training programs that drive results. Our sales enablement solutions combine product knowledge, sales techniques, and customer engagement strategies."
                as="span"
              />
            </p>
            <div className="flex justify-center">
              <motion.button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <DynamicContent 
                  sectionKey="cta_button" 
                  pageSlug="elearning-solutions/sales-enablement" 
                  fallback="Get Started with Sales Training"
                  as="span"
                />
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content - Now integrated into styled sections below */}

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                <DynamicContent 
                  sectionKey="features_section_title" 
                  pageSlug="elearning-solutions/sales-enablement" 
                  fallback="Comprehensive Sales Training Features"
                  as="span"
                />
              </h2>
              <div className="prose prose-lg max-w-4xl mx-auto text-gray-600">
                <DynamicContent 
                  sectionKey="features_section_description" 
                  pageSlug="elearning-solutions/sales-enablement" 
                  fallback="Our platform offers a complete suite of tools and training modules designed to enhance every aspect of your sales process."
                  as="div"
                />
              </div>
            </motion.div>

            {/* Additional Dynamic Content Sections */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Feature Cards with Dynamic Content */}
              <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  <DynamicContent 
                    sectionKey="feature_1_title" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Product Knowledge Training"
                    as="span"
                  />
                </h3>
                <div className="text-gray-600">
                  <DynamicContent 
                    sectionKey="feature_1_description" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Comprehensive product training modules that ensure your sales team understands every feature and benefit."
                    as="div"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  <DynamicContent 
                    sectionKey="feature_2_title" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Sales Techniques & Methodologies"
                    as="span"
                  />
                </h3>
                <div className="text-gray-600">
                  <DynamicContent 
                    sectionKey="feature_2_description" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Advanced sales methodologies and proven techniques to improve conversion rates and deal closure."
                    as="div"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  <DynamicContent 
                    sectionKey="feature_3_title" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Performance Analytics"
                    as="span"
                  />
                </h3>
                <div className="text-gray-600">
                  <DynamicContent 
                    sectionKey="feature_3_description" 
                    pageSlug="elearning-solutions/sales-enablement" 
                    fallback="Track progress, measure performance, and identify areas for improvement with detailed analytics."
                    as="div"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <DynamicContent 
                sectionKey="value_proposition_title" 
                pageSlug="elearning-solutions/sales-enablement" 
                fallback="Transform Your Sales Performance"
                as="span"
              />
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <DynamicContent 
                sectionKey="value_proposition_subtitle" 
                pageSlug="elearning-solutions/sales-enablement" 
                fallback="Comprehensive Sales Training Solutions"
                as="span"
              />
            </p>
            <div className="mt-6">
              <DynamicContent 
                sectionKey="value_proposition_description" 
                pageSlug="elearning-solutions/sales-enablement" 
                fallback="Our sales enablement solutions provide your team with the knowledge, skills, and tools they need to excel in today's competitive marketplace."
                as="div"
                className="text-lg text-gray-600 max-w-4xl mx-auto"
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Sales Enablement Matters
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Accelerated Revenue Growth:</strong> Well-trained sales teams consistently outperform their peers by 15-20%
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Reduced Ramp Time:</strong> New hires become productive 30% faster with structured training programs
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Improved Win Rates:</strong> Consistent messaging and methodology increase deal closure rates
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Enhanced Customer Experience:</strong> Better-trained reps provide more value to prospects and customers
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              {...fadeInUp}
            >
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-4">Performance Impact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">25%</div>
                    <div className="text-sm text-gray-600">Revenue Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-gray-600">Faster Onboarding</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">30%</div>
                    <div className="text-sm text-gray-600">Higher Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">50%</div>
                    <div className="text-sm text-gray-600">Better Retention</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Sales Enablement Solutions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver comprehensive, results-driven training programs that transform sales performance
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                variants={fadeInUp}
              >
                <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Sales Enablement Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed to address every aspect of your sales process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                {...fadeInUp}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {solution.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {solution.description}
                </p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures your sales enablement program delivers measurable results
            </p>
          </motion.div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                {...fadeInUp}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <DynamicFAQ pageSlug="elearning-solutions/sales-enablement" />

      {/* Contact Section */}
      <div id="contact-section">
        <Contact />
      </div>
    </div>
  );
}