'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Target,
  Lightbulb,
  Clock,
  Star,
  Play,
  Zap,
  Brain
} from 'lucide-react';
import Contact from "@/components/contact"

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

export default function GameBasedElearningPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const benefits = [
    {
      icon: Trophy,
      title: "90% Higher Engagement",
      description: "Game-based learning increases learner engagement by up to 90% compared to traditional methods."
    },
    {
      icon: Brain,
      title: "Better Retention",
      description: "Interactive gaming elements improve knowledge retention rates by 75% through active participation."
    },
    {
      icon: Target,
      title: "Immediate Feedback",
      description: "Real-time feedback and scoring systems help learners understand their progress instantly."
    },
    {
      icon: Users,
      title: "Social Learning",
      description: "Multiplayer features and leaderboards foster collaboration and healthy competition."
    }
  ];

  const gameTypes = [
    {
      title: "Simulation Games",
      description: "Realistic scenarios that allow learners to practice skills in a safe, virtual environment.",
      features: ["Risk-free practice", "Real-world scenarios", "Decision-making skills", "Consequence learning"],
      icon: Play
    },
    {
      title: "Quiz & Trivia Games",
      description: "Interactive knowledge testing with competitive elements and immediate feedback.",
      features: ["Knowledge assessment", "Competitive scoring", "Instant feedback", "Progress tracking"],
      icon: Lightbulb
    },
    {
      title: "Adventure & Story Games",
      description: "Narrative-driven learning experiences that immerse learners in engaging storylines.",
      features: ["Immersive storytelling", "Character development", "Progressive challenges", "Emotional engagement"],
      icon: BookOpen
    },
    {
      title: "Puzzle & Strategy Games",
      description: "Problem-solving challenges that develop critical thinking and analytical skills.",
      features: ["Critical thinking", "Problem solving", "Strategic planning", "Logic development"],
      icon: Target
    }
  ];

  const process = [
    {
      step: "01",
      title: "Learning Objectives Analysis",
      description: "We identify your training goals and determine the best gaming mechanics to achieve them."
    },
    {
      step: "02",
      title: "Game Design & Mechanics",
      description: "Our designers create engaging game mechanics that align with your learning objectives."
    },
    {
      step: "03",
      title: "Content Integration",
      description: "We seamlessly integrate your training content into the game framework for maximum impact."
    },
    {
      step: "04",
      title: "Interactive Development",
      description: "Our developers build the game using cutting-edge technology and user experience principles."
    },
    {
      step: "05",
      title: "Testing & Optimization",
      description: "We thoroughly test the game and optimize based on user feedback and performance data."
    }
  ];

  const features = [
    {
      title: "Leaderboards & Achievements",
      description: "Motivate learners with competitive elements and recognition systems"
    },
    {
      title: "Progress Tracking",
      description: "Detailed analytics and progress monitoring for learners and administrators"
    },
    {
      title: "Adaptive Difficulty",
      description: "Dynamic difficulty adjustment based on learner performance and skill level"
    },
    {
      title: "Multi-Platform Support",
      description: "Games that work seamlessly across desktop, tablet, and mobile devices"
    },
    {
      title: "Social Features",
      description: "Team challenges, collaboration tools, and social sharing capabilities"
    },
    {
      title: "Customizable Avatars",
      description: "Personalization options that increase learner investment and engagement"
    }
  ];

  const faqs = [
    {
      question: "How effective is game-based learning compared to traditional methods?",
      answer: "Studies show that game-based learning can increase engagement by up to 90% and improve retention rates by 75%. The interactive nature of games makes learning more memorable and enjoyable."
    },
    {
      question: "What types of training content work best with game-based learning?",
      answer: "Game-based learning is particularly effective for compliance training, soft skills development, product knowledge, safety procedures, and any content that benefits from scenario-based practice."
    },
    {
      question: "Can you integrate games with our existing LMS?",
      answer: "Yes, our games are designed to integrate seamlessly with most Learning Management Systems through SCORM, xAPI (Tin Can), and other standard protocols."
    },
    {
      question: "How do you measure learning outcomes in games?",
      answer: "We implement comprehensive analytics that track player actions, decision-making patterns, time spent on tasks, and knowledge retention through embedded assessments and real-world application scenarios."
    },
    {
      question: "What's the typical development timeline for a game-based learning solution?",
      answer: "Development time varies based on complexity, but typically ranges from 8-16 weeks for a comprehensive game-based learning module, including design, development, testing, and deployment."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/IMAGES/3.custom learning/download (3).png" 
            alt="Game-Based Learning Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Game-Based
              <span className="block text-yellow-400">eLearning Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform learning into an engaging adventure with interactive games that boost retention and motivation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Gaming
                <Gamepad2 className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
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
              Level Up Your Learning Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Game-based learning combines the power of gaming with educational content to create immersive, 
              engaging experiences that drive real learning outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Game-Based Learning Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Zap className="h-6 w-6 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Intrinsic Motivation:</strong> Games tap into natural human desires for achievement, competition, and mastery
                  </p>
                </div>
                <div className="flex items-start">
                  <Brain className="h-6 w-6 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Active Learning:</strong> Interactive gameplay requires active participation, improving knowledge retention
                  </p>
                </div>
                <div className="flex items-start">
                  <Target className="h-6 w-6 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Safe Practice:</strong> Virtual environments allow learners to practice skills without real-world consequences
                  </p>
                </div>
                <div className="flex items-start">
                  <Trophy className="h-6 w-6 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Immediate Feedback:</strong> Real-time scoring and feedback help learners adjust and improve quickly
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              {...fadeInUp}
            >
              <div className="text-center">
                <Gamepad2 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-4">Learning Impact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">90%</div>
                    <div className="text-sm text-gray-600">Higher Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600">75%</div>
                    <div className="text-sm text-gray-600">Better Retention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">60%</div>
                    <div className="text-sm text-gray-600">Faster Learning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
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
              Benefits of Game-Based Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how gaming elements can transform your training programs
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
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300"
                variants={fadeInUp}
              >
                <benefit.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
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

      {/* Game Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Types of Learning Games We Create
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simulations to adventures, we design games that match your learning objectives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {gameTypes.map((game, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                {...fadeInUp}
              >
                <game.icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {game.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {game.description}
                </p>
                <ul className="space-y-2">
                  {game.features.map((feature, featureIndex) => (
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Game Features That Drive Engagement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced gaming features that keep learners motivated and engaged
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300"
                {...fadeInUp}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Game Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to creating engaging, educational games
            </p>
          </motion.div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                {...fadeInUp}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6">
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about game-based learning
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                {...fadeInUp}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ArrowRight 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}