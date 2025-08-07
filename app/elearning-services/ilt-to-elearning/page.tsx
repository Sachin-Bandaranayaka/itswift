"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Contact from "@/components/contact"
import Link from "next/link"
import {
    ArrowRight,
    CheckCircle,
    Award,
    BarChart,
    Layers,
    Users,
    ChevronDown,
    Globe,
    Clock,
    ShieldCheck,
    Zap,
    Puzzle,
    Search,
    Database,
    Bot,
    User,
    Settings,
    CheckSquare,
    Server,
    FileText,
    TrendingUp,
    CheckCheck,
    Star,
    Building,
    DollarSign,
    Gauge,
    Brain,
    LineChart,
    BookOpen
} from "lucide-react"

export default function IltToElearningPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ items
    const faqItems = [
        {
            question: "What types of ILT content can be converted to eLearning?",
            answer: "Virtually any instructor-led training can be effectively converted to eLearning, including technical training, soft skills development, compliance programs, product knowledge, sales training, and customer service. Our approach adapts to the specific content type and learning objectives to ensure effective digital transformation."
        },
        {
            question: "How long does the ILT to eLearning conversion process take?",
            answer: "Typical conversion timelines range from 4-12 weeks depending on the complexity and volume of content. Our Bangalore team's 24/7 production capability allows us to deliver even complex projects 40-50% faster than most Western providers. We can also implement phased approaches for urgent training needs."
        },
        {
            question: "Will converted content work in our existing LMS?",
            answer: "Yes, we ensure compatibility with all major learning management systems used across the US, Europe, and Middle East. Our technical team has extensive experience with Cornerstone, Saba, Moodle, Blackboard, SAP SuccessFactors, and many other platforms, ensuring seamless integration with your existing infrastructure."
        },
        {
            question: "How do you maintain the effectiveness of instructor-led sessions?",
            answer: "We use a variety of digital strategies to preserve or enhance the effectiveness of instructor interactions, including interactive scenarios, branching simulations, video demonstrations, virtual coaching, and social learning elements. Our approach focuses on identifying the core value of instructor interactions and finding effective digital alternatives."
        },
        {
            question: "What is the ROI of converting ILT to eLearning?",
            answer: "Organizations typically see ROI within 6-12 months of conversion, with ongoing savings for programs delivered multiple times. Cost reductions come from eliminated travel, venue, instructor, and material expenses, while benefits include faster deployment, consistent quality, improved completion rates, and detailed analytics for continuous improvement."
        }
    ];

    // Process Steps
    const processSteps = [
        {
            number: "01",
            title: "Comprehensive Content Analysis",
            description: "We begin by thoroughly analyzing your existing ILT materials, identifying learning objectives, key content elements, interactive components, and assessment strategies. This analysis forms the foundation for an effective digital transformation."
        },
        {
            number: "02",
            title: "Instructional Design Blueprint",
            description: "Our instructional designers create a detailed blueprint that restructures your content for digital delivery while maintaining instructional integrity. This blueprint incorporates adult learning principles and digital engagement strategies specific to your target regions."
        },
        {
            number: "03",
            title: "Storyboarding and Prototyping",
            description: "We develop detailed storyboards that visualize the digital learning experience, including screen layouts, navigation, interactions, and multimedia elements. Prototype modules allow you to experience and provide feedback on the converted content early in the process."
        },
        {
            number: "04",
            title: "Multimedia and Interactive Development",
            description: "Our specialized development team creates professional videos, animations, simulations, and interactive elements that replace or enhance the classroom experience. All media is optimized for your specific target markets in the US, Europe, and Middle East."
        },
        {
            number: "05",
            title: "Assessment and Feedback Integration",
            description: "We design effective digital assessment strategies that evaluate knowledge and skills while providing meaningful feedback to learners. These assessments maintain the rigor of your classroom evaluations while leveraging digital capabilities."
        },
        {
            number: "06",
            title: "Technical Implementation and Testing",
            description: "Our technical team ensures your converted content functions flawlessly across all required platforms and devices. Rigorous testing verifies functionality, usability, and learning effectiveness before deployment."
        },
        {
            number: "07",
            title: "Deployment and Performance Analysis",
            description: "We support the launch of your converted programs and help you analyze performance data to continuously improve the learning experience and outcomes."
        }
    ];

    // Benefits
    const benefits = [
        {
            title: "Content Analysis and Instructional Design",
            description: "Our specialized instructional designers analyze your existing ILT materials to identify the most effective conversion strategies. We preserve the core instructional value while enhancing it with digital learning principles that drive engagement and retention.",
            icon: <BookOpen className="h-12 w-12 text-white" />,
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            title: "Multimedia Development and Interactive Elements",
            description: "We transform static presentations and instructor demonstrations into engaging videos, animations, and interactive simulations. These elements maintain the visual learning aspects of classroom training while adding the benefits of repeatability and self-pacing.",
            icon: <Layers className="h-12 w-12 text-white" />,
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            title: "Assessment and Feedback Mechanisms",
            description: "Our conversion process includes developing effective digital assessment strategies that evaluate knowledge and application while providing immediate, personalized feedback. These assessments maintain the rigor of classroom evaluation while adding consistency and detailed analytics.",
            icon: <CheckSquare className="h-12 w-12 text-white" />,
            bgColor: "from-orange-500 to-orange-600"
        },
        {
            title: "LMS Integration and Technical Implementation",
            description: "We ensure your converted content integrates seamlessly with your existing learning management system, whether you're using Cornerstone, Saba, Moodle, or proprietary platforms. Our technical team handles all aspects of implementation, testing, and troubleshooting.",
            icon: <Server className="h-12 w-12 text-white" />,
            bgColor: "from-orange-400 to-orange-500"
        },
        {
            title: "Quality Assurance and Learner Experience Testing",
            description: "Every converted module undergoes rigorous testing with representative learners from your target regions. This testing verifies not only technical functionality but also learning effectiveness, cultural appropriateness, and user experience quality.",
            icon: <CheckCheck className="h-12 w-12 text-white" />,
            bgColor: "from-orange-500 to-orange-600"
        }
    ];

    // Challenges
    const challenges = [
        {
            question: "Struggling with global training consistency?",
            answer: "Our conversion process ensures every learner receives the same high-quality experience regardless of location. Standardized content, assessments, and learning paths eliminate the variability that occurs with different instructors or classroom environments across global locations.",
            icon: <Globe className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Finding it difficult to scale instructor-led programs?",
            answer: "Traditional ILT programs face inherent scaling limitations based on instructor availability and classroom capacity. Our converted eLearning programs can be deployed to unlimited learners simultaneously, allowing you to scale training initiatives across the US, Europe, and Middle East without proportional cost increases.",
            icon: <TrendingUp className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Need to reduce training costs without sacrificing quality?",
            answer: "Our conversion services typically reduce overall training delivery costs by 50-70% by eliminating travel, venue, instructor, and material expenses. These savings can be reinvested in higher-quality digital content or expanded training initiatives while maintaining or improving learning outcomes.",
            icon: <DollarSign className="h-12 w-12 text-orange-500" />
        },
        {
            question: "Concerned about learner engagement in digital formats?",
            answer: "Our specialized approach focuses on creating highly interactive, engaging digital experiences that often exceed the engagement levels of traditional classroom training. We incorporate scenario-based learning, gamification, social elements, and multimedia components that keep learners actively involved throughout the experience.",
            icon: <Users className="h-12 w-12 text-orange-500" />
        }
    ];

    // AI Applications
    const aiApplications = [
        {
            title: "AI-Powered Content Analysis and Extraction",
            description: "Our AI tools analyze your existing ILT materials to automatically identify key concepts, learning objectives, and content structure. This analysis accelerates the conversion process by extracting and organizing content elements while identifying gaps that need to be addressed in the digital version.",
            icon: <Bot className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Automated Storyboarding and Instructional Design",
            description: "AI-assisted instructional design tools help our team rapidly develop effective learning structures based on proven educational models. These tools suggest optimal content sequencing, interaction points, and assessment strategies based on your specific learning objectives and audience characteristics.",
            icon: <Brain className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Intelligent Media Enhancement and Generation",
            description: "Our AI-powered media tools can enhance existing visual assets or generate new illustrations, animations, and simulations based on your ILT content. This capability dramatically reduces production time while creating professional, engaging visual elements that support learning objectives.",
            icon: <Layers className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Adaptive Learning Path Development",
            description: "AI enables us to create adaptive learning paths that personalize the experience based on individual learner performance and preferences. These adaptive elements ensure each learner receives the right content at the right time, improving efficiency and effectiveness compared to the one-size-fits-all approach of traditional ILT.",
            icon: <Puzzle className="h-10 w-10 text-orange-500" />
        }
    ];

    // Case Studies
    const caseStudies = [
        {
            company: "Global Technology Corporation",
            challenge: "Needed to scale technical certification program across global operations",
            solution: "Converted a 5-day technical certification program into a modular eLearning curriculum",
            results: [
                "Reduced delivery costs by 68%",
                "Increased certification completion rates by 42%",
                "Successfully deployed across US and European operations"
            ],
            icon: <Server className="h-10 w-10 text-orange-500" />
        },
        {
            company: "Multinational Financial Services Provider",
            challenge: "Required consistent compliance training across 12 countries",
            solution: "Transformed compliance training for banking regulations into interactive eLearning modules",
            results: [
                "Achieved 100% completion rates across 12 countries",
                "Reduced training time by 35%",
                "Successfully implemented in UAE and Saudi Arabia"
            ],
            icon: <Building className="h-10 w-10 text-orange-500" />
        },
        {
            company: "European Manufacturing Company",
            challenge: "Needed multilingual safety training for global production facilities",
            solution: "Converted safety training into multilingual eLearning available in 8 languages",
            results: [
                "28% reduction in safety incidents",
                "100% compliance with regional regulations",
                "Successful deployment across European and Middle Eastern facilities"
            ],
            icon: <ShieldCheck className="h-10 w-10 text-orange-500" />
        },
        {
            company: "US Healthcare Organization",
            challenge: "Needed to scale clinical procedure training efficiently",
            solution: "Transformed clinical procedure training from instructor-led workshops to simulation-based eLearning",
            results: [
                "45% reduction in training time",
                "23% improvement in competency assessment scores",
                "Enabled rapid onboarding during staffing expansion"
            ],
            icon: <Users className="h-10 w-10 text-orange-500" />
        },
        {
            company: "Middle East Telecommunications Company",
            challenge: "Struggling to scale customer service training during rapid growth",
            solution: "Converted customer service training from classroom delivery to interactive eLearning scenarios",
            results: [
                "18% improvement in customer satisfaction scores",
                "Successfully accommodated rapid workforce expansion",
                "Created consistent training experience across the region"
            ],
            icon: <CheckSquare className="h-10 w-10 text-orange-500" />
        }
    ];

    // Company Advantages
    const companyAdvantages = [
        {
            title: "Global Expertise with Local Value",
            description: "Our Bangalore location allows us to offer world-class conversion services at competitive rates compared to US or European providers, typically delivering 30-40% cost savings without compromising quality.",
            icon: <Globe className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Cross-Cultural Understanding",
            description: "Our diverse team includes instructional designers and developers with experience working with organizations across the US, Europe, and Middle East, ensuring culturally appropriate and effective learning experiences for your specific target markets.",
            icon: <Users className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Technical Excellence",
            description: "Our developers are certified in all major eLearning authoring tools (Articulate, Captivate, Lectora) and have deep experience with global LMS platforms, ensuring seamless implementation regardless of your technical environment.",
            icon: <Award className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Rapid Delivery Capability",
            description: "Our large, specialized team and 24/7 production capability allow us to deliver conversion projects 40-50% faster than most Western providers, helping you accelerate your digital learning transformation.",
            icon: <Clock className="h-10 w-10 text-orange-500" />
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/5.ILT to elearning conversion service/download (1).png" 
                        alt="ILT to eLearning Conversion Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Transform Your Instructor-Led Training into Engaging Digital Learning Experiences
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Is your organization struggling to scale traditional instructor-led training programs across global locations? Our Bangalore-based team specializes in transforming your existing ILT materials into engaging, interactive eLearning experiences that deliver consistent training to your teams in the US, Europe, Middle East, and beyond.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#process" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our Proven ILT to eLearning Conversion Process
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our Bangalore team has developed a systematic, proven approach to ILT conversion that preserves the strengths of your existing training while enhancing it with digital capabilities.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {processSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative pl-16"
                                >
                                    <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-lg text-xl font-bold">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-700">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Key Benefits of Converting ILT to eLearning
                        </h2>
                        <p className="text-lg text-gray-700">
                            Transform your instructor-led training into powerful digital learning experiences that scale globally while maintaining effectiveness.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                            >
                                <div className={`p-6 bg-gradient-to-r ${benefit.bgColor} flex items-center justify-center`}>
                                    {benefit.icon}
                                </div>
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenges Section */}
            <section id="challenges" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Common Challenges Solved by Our ILT to eLearning Conversion Services
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our conversion approach addresses the most common obstacles faced by organizations implementing global training programs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {challenges.map((challenge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        {challenge.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                            {challenge.question}
                                        </h3>
                                        <p className="text-gray-700">
                                            {challenge.answer}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Integration Section */}
            <section id="ai-integration" className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            How AI Is Accelerating ILT to eLearning Conversion
                        </h2>
                        <p className="text-lg text-gray-700">
                            The integration of artificial intelligence has revolutionized the ILT to eLearning conversion process, making it faster, more effective, and more personalized.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {aiApplications.map((app, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                            >
                                <div className="mb-4">
                                    {app.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                    {app.title}
                                </h3>
                                <p className="text-gray-700">
                                    {app.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies Section */}
            <section id="case-studies" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Real Results from Our ILT to eLearning Conversion Projects
                        </h2>
                        <p className="text-lg text-gray-700">
                            See how organizations across industries have successfully transformed their training programs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {caseStudies.slice(0, 3).map((study, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                            >
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="mr-4">
                                            {study.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {study.company}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 mb-2"><span className="font-medium">Challenge:</span> {study.challenge}</p>
                                    <p className="text-gray-700"><span className="font-medium">Solution:</span> {study.solution}</p>
                                </div>
                                <div className="p-6 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Results:</h4>
                                    <ul className="space-y-1">
                                        {study.results.map((result, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{result}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-6">
                        {caseStudies.slice(3, 5).map((study, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                            >
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="mr-4">
                                            {study.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {study.company}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 mb-2"><span className="font-medium">Challenge:</span> {study.challenge}</p>
                                    <p className="text-gray-700"><span className="font-medium">Solution:</span> {study.solution}</p>
                                </div>
                                <div className="p-6 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Results:</h4>
                                    <ul className="space-y-1">
                                        {study.results.map((result, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{result}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="why-choose-us" className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Swift Solution Bangalore for Your ILT to eLearning Conversion Needs?
                        </h2>
                        <p className="text-lg text-gray-700">
                            With over 15 years of specialized experience in training transformation, our Bangalore team brings unique advantages to your ILT conversion projects.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {companyAdvantages.map((advantage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="mb-4 flex justify-center">
                                    {advantage.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 text-center">
                                    {advantage.title}
                                </h3>
                                <p className="text-gray-700 text-center">
                                    {advantage.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Frequently Asked Questions About ILT to eLearning Conversion
                        </h2>
                        <p className="text-lg text-gray-700">
                            Get answers to the most common questions about our ILT to eLearning conversion services.
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {faqItems.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="mb-4"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex items-center justify-between w-full p-5 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors duration-200"
                                >
                                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                        <p className="text-gray-700">{faq.answer}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Ready to Transform Your Training Programs?
                        </h2>
                        <p className="text-xl mb-8 text-orange-100">
                            We focus on transforming your instructor-led training into effective digital learning experiences so you can focus on your core business objectives. Our Bangalore-based conversion services provide the perfect balance of instructional design expertise, technical capability, and cost-effectiveness for organizations targeting the US, European, and Middle East markets.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Contact Us Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 border border-white text-white rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                                Request a Demo
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-lg text-gray-700">
                                Ready to transform your instructor-led training into effective digital learning experiences? Our Bangalore team is ready to help you reach audiences across the US, Europe, and Middle East with engaging, consistent training.
                            </p>
                            <p className="text-lg text-gray-700 mt-4">
                                Contact us today to discuss how our ILT to eLearning conversion services can help you reduce costs, expand reach, and improve training effectiveness across your global operations.
                            </p>
                        </div>
                        <Contact />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
