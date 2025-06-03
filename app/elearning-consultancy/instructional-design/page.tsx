"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Phone, Mail, FileText, Calendar, Brain, Zap, LineChart, Network, RefreshCw } from "lucide-react"

export default function InstructionalDesignPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How does AI improve the instructional design process?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        AI enhances instructional design by automating routine tasks, enabling personalization at scale, accelerating content development, providing deeper learning analytics, and facilitating continuous improvement through data-driven insights. Our proprietary AI tools reduce development time by up to 65% while improving learning outcomes through adaptive experiences tailored to individual needs. The combination of AI efficiency with human instructional expertise creates learning experiences that are both pedagogically sound and highly engaging.
                    </p>
                </>
            )
        },
        {
            question: "What makes your LLM different from generic AI tools like ChatGPT?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Our proprietary LLM has been specifically trained on instructional design principles, learning science research, and thousands of successful learning modules across diverse industries. Unlike generic AI tools, our system understands the nuances of effective learning design, including cognitive load management, knowledge scaffolding, and assessment validity. It incorporates best practices in adult learning theory and can generate content that adheres to specific instructional methodologies like ADDIE, SAM, or action mapping. This specialized training ensures all AI-generated content maintains instructional integrity while leveraging the efficiency of automation.
                    </p>
                </>
            )
        },
        {
            question: "How do you ensure the quality of AI-generated instructional content?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        We implement a rigorous quality assurance process that combines AI analysis with expert human review. Our AI systems evaluate content for readability, engagement potential, instructional alignment, and assessment validity before passing to our instructional design experts. These professionals then refine the content, ensuring perfect alignment with learning objectives, brand voice, and pedagogical best practices. This hybrid approach maintains the highest quality standards while still benefiting from the efficiency of AI-assisted development. Additionally, our continuous improvement systems monitor learner performance and feedback to identify opportunities for enhancement.
                    </p>
                </>
            )
        },
        {
            question: "Can AI-powered instructional design integrate with our existing LMS?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Yes, our AI-powered instructional design services are designed for seamless integration with all major learning management systems through SCORM, xAPI (Tin Can), cmi5, or LTI standards. Our technical team handles all aspects of integration, ensuring proper tracking of completion, assessment results, and learner progress. For organizations with custom or proprietary LMS platforms, we provide specialized integration services to ensure full compatibility. We can also enhance your existing LMS capabilities with our AI personalization layer, adding adaptive functionality without replacing your current system.
                    </p>
                </>
            )
        },
        {
            question: "How do you measure the effectiveness of AI-powered instructional design?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        We employ a comprehensive measurement framework that tracks multiple dimensions of learning effectiveness. Our AI analytics platform monitors engagement metrics (completion rates, time-on-task, interaction patterns), learning outcomes (assessment performance, knowledge retention, skill demonstration), and business impact (performance improvement, error reduction, productivity gains). These metrics are presented through intuitive dashboards that provide both high-level insights and detailed drill-down capabilities. For organizations with specific measurement requirements, we can customize our analytics to track the precise indicators most relevant to your business objectives.
                    </p>
                </>
            )
        },
        {
            question: "How quickly can you develop AI-powered instructional design solutions?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Our AI-accelerated development methodology typically delivers standard instructional design projects 40% faster than traditional approaches. For example, a one-hour eLearning module that might take 4-6 weeks with conventional methods can often be completed in 2-3 weeks using our AI-powered process. For urgent requirements, we offer rapid development services that can deliver quality learning experiences in as little as 5-7 business days. The exact timeline depends on factors like content complexity, level of customization, and integration requirements, which we assess during our initial consultation.
                    </p>
                </>
            )
        },
        {
            question: "How does AI personalization work in your instructional design?",
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Our AI personalization engine creates tailored learning experiences through several mechanisms. First, pre-assessments identify existing knowledge and skill gaps, allowing the system to recommend appropriate starting points. As learners progress, the AI continuously analyzes performance data, adjusting content difficulty, providing additional resources for challenging concepts, and accelerating through familiar material. The system also considers learning preferences, offering content in formats that match individual styles. This personalization occurs in real-time, creating a unique learning path for each individual while still ensuring all critical learning objectives are met.
                    </p>
                </>
            )
        }
    ];

    const services = [
        {
            title: "AI-Driven Learning Strategy Development",
            description: "We employ advanced AI analytics to assess organizational learning needs, identify skill gaps, and develop comprehensive learning strategies that align with business objectives. Our proprietary algorithms analyze performance data, industry trends, and learner demographics to create targeted learning roadmaps that deliver maximum impact.",
            icon: <Brain className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Personalized Learning Path Design",
            description: "Our AI systems create dynamic, adaptive learning paths that evolve based on individual performance, preferences, and goals. These personalized journeys ensure each learner receives precisely the content they need, when they need it, optimizing both efficiency and effectiveness of training initiatives.",
            icon: <Network className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Custom eLearning Content Creation",
            description: "Leveraging our proprietary LLM model specifically trained for instructional design, we generate instructionally sound content that adheres to proven learning principles. Our AI-assisted content development process creates engaging, accurate materials in a fraction of the time required by traditional methods.",
            icon: <Layers className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Voice and Image Generation for eLearning",
            description: "Our advanced AI tools create professional voiceovers, realistic images, and dynamic visualizations that enhance learning content. These technologies enable rapid development of multimedia elements that would traditionally require extensive time and specialized resources.",
            icon: <Zap className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Intelligent Assessment Development",
            description: "We design AI-powered assessment systems that go beyond basic knowledge checks to evaluate true comprehension and application ability. These intelligent assessments adapt to learner responses, providing deeper insights into knowledge gaps and enabling more targeted remediation.",
            icon: <CheckCircle className="h-12 w-12 text-orange-500" />
        },
        {
            title: "Learning Analytics and Performance Measurement",
            description: "Our AI-driven analytics platforms track learner progress, engagement, and performance, providing actionable insights for continuous improvement. These sophisticated measurement tools connect learning activities directly to performance outcomes, demonstrating clear ROI for training investments.",
            icon: <LineChart className="h-12 w-12 text-orange-500" />
        }
    ];

    const advantages = [
        {
            title: "Proprietary LLM Technology",
            description: "Unlike competitors who rely solely on generic AI tools, Swift Solution has developed a proprietary Large Language Model specifically trained on instructional design principles, learning science, and educational best practices. This specialized LLM creates instructionally sound documents and learning materials that maintain pedagogical integrity.",
            icon: <Brain className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Hybrid AI-Human Design Approach",
            description: "We've perfected the balance between AI efficiency and human expertise, combining the computational power of artificial intelligence with the creativity, empathy, and contextual understanding of experienced instructional designers. This hybrid approach ensures technically accurate, pedagogically sound learning experiences.",
            icon: <Users className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Cross-Industry Expertise",
            description: "Our AI systems have been trained on diverse industry data, enabling us to quickly develop specialized content for any sector. This cross-industry knowledge allows for rapid customization of learning materials that incorporate relevant terminology, scenarios, and compliance requirements specific to your business context.",
            icon: <Award className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Seamless Integration Capabilities",
            description: "Our AI-powered instructional design services integrate smoothly with your existing learning management systems, knowledge bases, and performance management tools. This interoperability creates a unified learning ecosystem that maximizes accessibility and impact of training initiatives.",
            icon: <Network className="h-8 w-8 text-orange-500" />
        },
        {
            title: "Rapid Implementation Methodology",
            description: "Our AI-accelerated development process delivers high-quality instructional design in 40% less time than traditional approaches. This efficiency enables your organization to respond quickly to emerging training needs without sacrificing quality or effectiveness.",
            icon: <Zap className="h-8 w-8 text-orange-500" />
        }
    ];

    const innovations = [
        {
            title: "Adaptive Content Sequencing",
            description: "Our AI algorithms dynamically adjust content sequence based on learner performance and preferences, ensuring optimal knowledge building. This adaptive approach prevents cognitive overload while addressing specific knowledge gaps, creating more efficient learning experiences."
        },
        {
            title: "Multimodal Learning Generation",
            description: "We leverage AI to automatically create diverse content formats—text, audio, video, interactive elements—from a single source material. This multimodal approach accommodates different learning preferences while maintaining consistency across all formats."
        },
        {
            title: "Natural Language Processing for Feedback",
            description: "Our advanced NLP systems provide personalized, contextual feedback on learner responses and assignments. This technology enables more meaningful interactions than simple right/wrong feedback, creating deeper learning through guided reflection."
        },
        {
            title: "Predictive Learning Analytics",
            description: "Our AI systems analyze learning patterns to predict knowledge gaps and potential performance issues before they impact job performance. These predictive capabilities enable proactive intervention and support, preventing skill gaps from affecting business outcomes."
        },
        {
            title: "Automated Content Refreshment",
            description: "We employ AI to continuously monitor content for accuracy, relevance, and effectiveness, automatically flagging materials that need updating. This system ensures learning content remains current without requiring constant manual review, reducing maintenance overhead."
        }
    ];

    const industries = [
        {
            title: "Healthcare and Pharmaceutical",
            description: "Our AI-powered instructional design for healthcare organizations focuses on compliance requirements, clinical procedures, and patient interaction skills. We create personalized learning experiences that help medical professionals stay updated on the latest protocols while fitting into their demanding schedules."
        },
        {
            title: "Financial Services",
            description: "For financial institutions, we develop AI-enhanced learning that addresses regulatory compliance, product knowledge, and customer service excellence. Our intelligent assessment systems help financial professionals navigate complex scenarios while adhering to strict industry regulations."
        },
        {
            title: "Manufacturing and Production",
            description: "Our manufacturing instructional design solutions emphasize safety procedures, equipment operation, and quality control processes. These AI-powered modules provide just-in-time guidance on the production floor, reducing errors and improving operational efficiency."
        },
        {
            title: "Technology and Software",
            description: "For technology organizations, we create adaptive learning experiences that address rapidly evolving technical skills, product knowledge, and development methodologies. Our AI-driven approach ensures technical staff can quickly master new technologies and frameworks as they emerge."
        },
        {
            title: "Retail and Customer Service",
            description: "Retail organizations benefit from our AI-powered microlearning modules on product knowledge, customer engagement, and sales techniques. These personalized learning experiences can be completed during shift breaks or slow periods, ensuring consistent customer experiences."
        }
    ];

    const processSteps = [
        {
            title: "AI-Enhanced Needs Analysis",
            description: "We begin with a comprehensive analysis of your organization's learning needs, using AI to process performance data, identify skill gaps, and pinpoint specific learning objectives. This data-driven approach ensures your instructional design initiative targets the right content areas for maximum impact.",
            icon: <Brain className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Learning Experience Architecture",
            description: "Our instructional designers collaborate with our proprietary LLM to create the optimal learning architecture, determining content structure, interaction types, and assessment strategies. This AI-assisted design process ensures pedagogically sound frameworks while accelerating development.",
            icon: <Layers className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Rapid Content Development",
            description: "Using our suite of AI content generation tools, we create initial drafts of all learning materials, including text, scenarios, assessments, and multimedia elements. Our instructional designers then refine these materials, ensuring perfect alignment with learning objectives and organizational voice.",
            icon: <Zap className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Intelligent Review and Optimization",
            description: "Our AI systems analyze draft content for readability, engagement potential, and instructional effectiveness, suggesting improvements before human review. This intelligent quality assurance process ensures consistently high standards across all learning materials.",
            icon: <CheckCircle className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Personalization Engine Configuration",
            description: "We configure our AI personalization engines to deliver adaptive learning experiences based on your specific learner demographics and organizational requirements. This customization ensures the right balance of standardization and personalization for your learning initiatives.",
            icon: <Users className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Integration and Deployment",
            description: "Our technical team ensures seamless integration of all AI-powered learning experiences with your existing systems and platforms. This careful implementation process guarantees a smooth transition and immediate value from your instructional design investment.",
            icon: <Network className="h-10 w-10 text-orange-500" />
        },
        {
            title: "Continuous Improvement",
            description: "Our AI analytics continuously monitor learner engagement, performance, and feedback, automatically identifying opportunities for enhancement. This ongoing optimization ensures your learning experiences remain effective and relevant over time.",
            icon: <RefreshCw className="h-10 w-10 text-orange-500" />
        }
    ];

    const metrics = [
        {
            value: "70%",
            label: "higher learner engagement",
            description: "compared to traditional instructional design approaches"
        },
        {
            value: "65%",
            label: "faster content development",
            description: "through AI-assisted creation and curation"
        },
        {
            value: "40%",
            label: "improved knowledge retention",
            description: "through personalized, adaptive learning experiences"
        },
        {
            value: "35%",
            label: "reduction in training costs",
            description: "by streamlining development and delivery processes"
        },
        {
            value: "50%",
            label: "faster time-to-competency",
            description: "through targeted, personalized learning paths"
        },
        {
            value: "80%",
            label: "increase in learning transfer",
            description: "to on-the-job performance"
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            AI-Powered Instructional Design Services: Revolutionize Learning with Swift Solution
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Transform corporate training with our AI-powered instructional design services
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#services" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Revolutionize Corporate Learning with AI-Powered Instructional Design
                        </h2>
                        <div className="prose max-w-none">
                            <p className="text-lg text-gray-700 mb-4">
                                In today's rapidly evolving corporate landscape, traditional instructional design approaches often fall short of meeting modern learning needs. Information overload, diverse learning preferences, and the demand for personalized experiences have created significant challenges for L&D professionals. AI-powered instructional design offers a transformative solution by leveraging cutting-edge technology to create learning experiences that are personalized, engaging, and measurably effective.
                            </p>
                            <p className="text-lg text-gray-700 mb-4">
                                At Swift Solution, we've pioneered the integration of artificial intelligence into every aspect of the instructional design process. Our expert team combines deep pedagogical knowledge with proprietary AI technologies to conceptualize, design, and develop eLearning strategies and content that deliver exceptional results.
                            </p>
                            <p className="text-lg text-gray-700">
                                Through our comprehensive AI-powered instructional design services, we help organizations across all industries accelerate skill development, boost knowledge retention, and drive measurable performance improvements—all while reducing development time and training costs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why AI is Transforming Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">Traditional Instructional Design Challenges</h3>
                                <ul className="space-y-4 w-full max-w-md">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>One-size-fits-all training fails to address individual needs</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Manual content creation is time-consuming and resource-intensive</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Generic content struggles to maintain learner attention</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Standard assessments fail to accurately measure knowledge</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Traditional approaches struggle to scale efficiently</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Why AI is Transforming Instructional Design Forever
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    The integration of artificial intelligence into instructional design isn't just an incremental improvement—it's a fundamental paradigm shift that addresses the core limitations of traditional approaches:
                                </p>
                                <ul className="space-y-4 text-gray-700">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold">Personalization Challenge:</span>
                                            <p>Our AI-powered approach creates personalized learning paths that adapt to each learner's knowledge gaps, preferences, and pace.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold">Content Development Bottlenecks:</span>
                                            <p>Our AI tools accelerate development by 65%, allowing rapid deployment of high-quality learning materials.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold">Engagement Limitations:</span>
                                            <p>Our AI-driven personalization increases engagement by 70% through relevant, contextual learning experiences.</p>
                                        </div>
                                    </li>
                                </ul>
                                <p className="text-lg text-gray-700 mt-4">
                                    Swift Solution's AI-enhanced instructional design methodology addresses these challenges directly, delivering learning experiences that align with how modern professionals acquire and retain knowledge.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Comprehensive AI-Powered Instructional Design Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our extensive portfolio of instructional design services leverages artificial intelligence throughout the learning development lifecycle
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-5">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            The Swift Solution Advantage in AI-Powered Instructional Design
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            When you partner with Swift Solution for your instructional design needs, you gain several distinct advantages that set us apart from traditional providers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advantages.map((advantage, index) => (
                            <div key={index} className="flex bg-white rounded-lg p-6 shadow-md border border-gray-100">
                                <div className="mr-4 flex-shrink-0">
                                    {advantage.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{advantage.title}</h3>
                                    <p className="text-gray-600 text-sm">{advantage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Transforming Learning Outcomes Through AI-Powered Instructional Design
                        </h2>
                        <p className="text-lg text-orange-100 max-w-3xl mx-auto">
                            The most effective instructional design doesn't just deliver content differently—it fundamentally transforms learning outcomes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                                <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                                <div className="text-xl font-medium text-white mb-1">{metric.label}</div>
                                <p className="text-orange-100 text-sm">{metric.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center max-w-3xl mx-auto">
                        <p className="text-orange-100">
                            Our clients consistently report that AI-powered instructional design initiatives deliver significant improvements in training effectiveness, learner satisfaction, and operational efficiency, leading to measurable business impact and stronger organizational performance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Innovations Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Innovative AI Applications in Instructional Design
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Swift Solution implements cutting-edge AI technologies to enhance every aspect of the instructional design process
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {innovations.map((innovation, index) => (
                            <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{innovation.title}</h3>
                                <p className="text-gray-700">{innovation.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Industry-Specific AI Instructional Design Solutions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Different industries face unique training challenges that require tailored instructional design approaches
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {industries.map((industry, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-100 h-full">
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">{industry.title}</h3>
                                <p className="text-gray-600 text-sm">{industry.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            The AI Instructional Design Process at Swift Solution
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our systematic approach to AI-powered instructional design ensures exceptional results for every project
                        </p>
                    </div>

                    <div className="space-y-8 max-w-4xl mx-auto">
                        {processSteps.map((step, index) => (
                            <div key={index} className="flex items-start bg-white rounded-lg p-6 shadow-md border border-gray-100">
                                <div className="mr-6 flex-shrink-0 bg-orange-50 p-3 rounded-full">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            FAQ: AI-Powered Instructional Design Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our AI-powered instructional design services
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div key={index} className="mb-4">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className={`flex justify-between items-center w-full p-5 text-left rounded-lg ${openFaqIndex === index ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'} border`}
                                >
                                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                    <span>
                                        {openFaqIndex === index ? (
                                            <ChevronDown className="h-5 w-5 text-orange-500 transform rotate-180 transition-transform duration-200" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-orange-500 transition-transform duration-200" />
                                        )}
                                    </span>
                                </button>
                                {openFaqIndex === index && (
                                    <div className="p-5 border border-t-0 border-orange-200 bg-orange-50 rounded-b-lg">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            Partner with Swift Solution for AI-Powered Instructional Design Excellence
                        </h2>
                        <p className="text-lg mb-8 text-orange-100">
                            Don't settle for outdated instructional design approaches that fail to engage today's learners or deliver lasting results. Partner with Swift Solution to develop powerful, personalized learning experiences that transform your corporate training capabilities and accelerate workforce development.
                        </p>
                        <p className="text-lg mb-8 text-orange-100">
                            Our team of learning experts, instructional designers, and AI specialists is ready to help you create an instructional design strategy that not only meets your current requirements but also provides the flexibility and scalability to support your future growth.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Contact Us Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Contact us today to discuss your instructional design needs
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="flex items-center">
                                <Phone className="h-8 w-8 text-orange-500 mr-4" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                    <p className="text-gray-600">080-23215884</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="h-8 w-8 text-orange-500 mr-4" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                    <p className="text-gray-600">swiftsol@itswift.com</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-orange-500 mr-4" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Resources</h3>
                                    <a href="#" className="text-orange-600 hover:underline">Download Our AI Instructional Design Guide</a>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-orange-500 mr-4" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
                                    <a href="#" className="text-orange-600 hover:underline">Schedule a Consultation</a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Contact />
                    </div>
                </div>
            </section>
        </div>
    );
}