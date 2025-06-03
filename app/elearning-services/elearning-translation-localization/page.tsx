"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
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
    Laptop,
    Stethoscope,
    Factory,
    Building,
    Store,
    HardHat,
    Brain,
    Upload,
    ListChecks,
    ThumbsDown,
    Timer,
    Languages,
    BarChart2,
    BadgeCheck,
    ChevronRight,
    FileQuestion,
    Plus,
    Minus
} from "lucide-react"

export default function ElearningTranslationLocalizationPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // FAQ items
    const faqItems = [
        {
            question: "What types of e-learning content can be translated and localized?",
            answer: "We can translate and localize virtually any type of e-learning content, including SCORM packages, HTML5 courses, video-based training, virtual reality simulations, mobile learning apps, assessments, and interactive scenarios. Our technical team has experience with all major authoring tools and formats."
        },
        {
            question: "How does AI improve the translation and localization process?",
            answer: "AI significantly accelerates the translation process through neural machine translation, automates content extraction and reconstruction, provides quality assurance checks, identifies cultural adaptation needs, and maintains terminology consistency. This reduces timelines by 50-70% while maintaining high quality through human refinement of AI outputs."
        },
        {
            question: "Will translated content work in our existing LMS?",
            answer: "Yes, we ensure all translated content functions properly in your learning management system. Our technical team tests all language versions to verify proper character display, assessment functionality, tracking, and reporting. We have experience with all major LMS platforms and can provide integration support."
        },
        {
            question: "How do you handle cultural nuances in e-learning translation?",
            answer: "Our localization specialists adapt content to reflect local cultural norms, business practices, and learning preferences. This includes modifying examples, scenarios, humor, graphics, and references to ensure cultural relevance and appropriateness. We also adapt assessment approaches to align with regional educational expectations."
        },
        {
            question: "What languages do you support for e-learning translation?",
            answer: "We support over 50 languages, including all major European, Asian, Middle Eastern, and African languages. Our specialized e-learning linguists are native speakers with subject matter expertise in relevant industries, ensuring accurate translation of even complex technical content."
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Transform Your E-Learning Content for Global Audiences
                        </h1>
                        <p className="text-xl mb-8 text-blue-100">
                            Expert translation and localization services to make your training content culturally relevant and linguistically accurate
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#process" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section id="introduction" className="py-16 bg-white">
                {/* Content from previous section */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                What Is E-Learning Translation and Localization?
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                E-learning translation and localization is the comprehensive process of adapting educational content for different languages, cultures, and regions while preserving the instructional effectiveness of the original material.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                This goes far beyond simple text translation to include:
                            </p>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Translation:</strong> Converting text content into target languages with perfect linguistic accuracy</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Localization:</strong> Adapting cultural references, examples, and scenarios to resonate with local audiences</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Technical Adaptation:</strong> Modifying interactive elements, assessments, and navigation to function properly in translated versions</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Multimedia Transformation:</strong> Adapting audio, video, graphics, and other media elements for cultural appropriateness</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>Compliance Alignment:</strong> Ensuring content meets regional regulatory and legal requirements</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <span><strong>LMS Integration:</strong> Testing and validating functionality across learning management systems in multiple languages</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative rounded-lg overflow-hidden shadow-xl">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                {/* Replace with actual image */}
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <Globe className="h-24 w-24 text-blue-600 opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 bg-gray-50">
                {/* Content from previous section */}
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose Professional E-Learning Translation and Localization Services?
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our AI-enhanced approach combines advanced machine translation technology with human expertise to deliver multilingual e-learning solutions that maintain engagement, effectiveness, and impact.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefits cards from previous section */}
                        {/* ... */}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-16 bg-white">
                {/* Content from previous section */}
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our AI-Powered E-Learning Translation and Localization Process
                        </h2>
                        <p className="text-lg text-gray-700">
                            We've developed a streamlined, technology-enhanced process that delivers exceptional quality while reducing traditional timelines.
                        </p>
                    </div>
                    {/* Process steps from previous section */}
                    {/* ... */}
                </div>
            </section>

            {/* Industries Section */}
            <section id="industries" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Industries We Serve with Multilingual E-Learning Solutions
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our e-learning translation and localization services support diverse industries with specialized terminology and compliance requirements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Industry 1 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Laptop className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Information Technology</h3>
                            </div>
                            <p className="text-gray-700">
                                Technical training, software tutorials, and certification programs with precise technical terminology and platform-specific instruction.
                            </p>
                        </div>

                        {/* Industry 2 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Stethoscope className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Pharmaceuticals & Healthcare</h3>
                            </div>
                            <p className="text-gray-700">
                                Compliance training, medical procedures, and patient care protocols with regulatory alignment across different healthcare systems.
                            </p>
                        </div>

                        {/* Industry 3 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Factory className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Manufacturing</h3>
                            </div>
                            <p className="text-gray-700">
                                Safety procedures, equipment operation, and quality control processes with precise technical translations and region-specific safety standards.
                            </p>
                        </div>

                        {/* Industry 4 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Building className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Financial Services</h3>
                            </div>
                            <p className="text-gray-700">
                                Regulatory compliance, product knowledge, and customer service training with market-specific regulations and financial terminology.
                            </p>
                        </div>

                        {/* Industry 5 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Store className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Retail & Hospitality</h3>
                            </div>
                            <p className="text-gray-700">
                                Customer service, operational procedures, and brand standards training adapted for cultural differences in customer expectations.
                            </p>
                        </div>

                        {/* Industry 6 */}
                        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Corporate HR</h3>
                            </div>
                            <p className="text-gray-700">
                                Onboarding, policy training, and professional development programs with culturally appropriate workplace examples and leadership concepts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Innovation Section */}
            <section id="ai-innovation" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            How AI Is Revolutionizing E-Learning Translation and Localization
                        </h2>
                        <p className="text-lg text-gray-700">
                            The integration of artificial intelligence has transformed e-learning translation and localization, making it faster, more accurate, and more cost-effective than ever before.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* AI Innovation 1 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <Brain className="h-12 w-12 text-blue-600 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900">AI-Powered Machine Translation with Human Refinement</h3>
                            </div>
                            <p className="text-gray-700">
                                Our hybrid approach combines the speed and efficiency of neural machine translation with the nuanced understanding of human linguists. This "human-in-the-loop" methodology delivers quality comparable to fully human translation at a fraction of the time and cost.
                            </p>
                        </div>

                        {/* AI Innovation 2 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <Zap className="h-12 w-12 text-blue-600 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900">Neural Machine Translation for Faster Turnaround</h3>
                            </div>
                            <p className="text-gray-700">
                                Our specialized neural machine translation engines are trained specifically on e-learning content, understanding instructional design patterns and educational terminology. This specialized training delivers initial translations that require significantly less human editing.
                            </p>
                        </div>

                        {/* AI Innovation 3 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <ListChecks className="h-12 w-12 text-blue-600 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900">Automated Quality Assurance and Consistency Checks</h3>
                            </div>
                            <p className="text-gray-700">
                                AI-powered quality assurance tools automatically identify inconsistencies in terminology, formatting issues, and potential cultural misalignments before human review, ensuring higher quality and reducing revision cycles.
                            </p>
                        </div>

                        {/* AI Innovation 4 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <Globe className="h-12 w-12 text-blue-600 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900">AI-Driven Cultural Adaptation Recommendations</h3>
                            </div>
                            <p className="text-gray-700">
                                Our AI systems analyze content for cultural appropriateness and suggest adaptations for different target markets, helping our human experts make informed decisions about localization strategies.
                            </p>
                        </div>

                        {/* AI Innovation 5 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 md:col-span-2">
                            <div className="flex items-center mb-6">
                                <Upload className="h-12 w-12 text-blue-600 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900">Intelligent Content Extraction and Reconstruction</h3>
                            </div>
                            <p className="text-gray-700">
                                Automated systems extract translatable text from complex e-learning formats (SCORM, xAPI, HTML5) while preserving code and functionality, then reconstruct the content after translation without technical errors, dramatically reducing the time and technical resources required.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Challenges Section */}
            <section id="challenges" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Common Challenges Solved by Our Translation and Localization Services
                        </h2>
                        <p className="text-lg text-gray-700">
                            We address the most significant pain points organizations face when deploying multilingual training.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Challenge 1 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                                <ThumbsDown className="h-6 w-6 text-orange-500 mr-3" />
                                Struggling to deploy training in multiple languages?
                            </h3>
                            <div className="h-px bg-gray-200 mb-4"></div>
                            <p className="text-gray-700 mb-4">
                                Many organizations face delays in rolling out training across regions due to lengthy translation processes.
                            </p>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                <p className="text-green-800 font-medium">Our Solution:</p>
                                <p className="text-green-700">
                                    Our streamlined process and AI-enhanced translation workflow can reduce traditional translation timelines by up to 60%, allowing you to deploy multilingual training simultaneously rather than in staggered releases.
                                </p>
                            </div>
                        </div>

                        {/* Challenge 2 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                                <ThumbsDown className="h-6 w-6 text-orange-500 mr-3" />
                                Finding it difficult to maintain consistency across translations?
                            </h3>
                            <div className="h-px bg-gray-200 mb-4"></div>
                            <p className="text-gray-700 mb-4">
                                Inconsistent terminology and messaging across language versions can confuse learners and diminish training effectiveness.
                            </p>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                <p className="text-green-800 font-medium">Our Solution:</p>
                                <p className="text-green-700">
                                    Our translation memory systems and terminology databases ensure perfect consistency in terminology, brand voice, and instructional approach across all language versions and throughout all future updates.
                                </p>
                            </div>
                        </div>

                        {/* Challenge 3 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                                <ThumbsDown className="h-6 w-6 text-orange-500 mr-3" />
                                Need to reduce the time and cost of multilingual course development?
                            </h3>
                            <div className="h-px bg-gray-200 mb-4"></div>
                            <p className="text-gray-700 mb-4">
                                Traditional translation methods are often prohibitively expensive for comprehensive training programs.
                            </p>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                <p className="text-green-800 font-medium">Our Solution:</p>
                                <p className="text-green-700">
                                    Our AI-powered translation process significantly reduces the time and cost associated with traditional translation methods while maintaining high quality, making multilingual training accessible even with limited budgets.
                                </p>
                            </div>
                        </div>

                        {/* Challenge 4 */}
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                                <ThumbsDown className="h-6 w-6 text-orange-500 mr-3" />
                                Concerned about cultural appropriateness in different regions?
                            </h3>
                            <div className="h-px bg-gray-200 mb-4"></div>
                            <p className="text-gray-700 mb-4">
                                Directly translated content often contains culturally insensitive elements that can alienate learners or cause confusion.
                            </p>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4">
                                <p className="text-green-800 font-medium">Our Solution:</p>
                                <p className="text-green-700">
                                    Our localization specialists ensure all content elements—from examples and scenarios to images and graphics—are culturally appropriate and relevant for each target market, avoiding potential cultural missteps.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section id="results" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Real Results from Our Multilingual E-Learning Projects
                        </h2>
                        <p className="text-lg text-gray-700">
                            Our clients have achieved measurable improvements in training effectiveness, engagement, and compliance across global operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Case Study 1 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-600 p-4 text-white">
                                <h3 className="text-xl font-semibold">Global Technology Corporation</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <BarChart2 className="h-12 w-12 text-blue-600 mr-4" />
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">12</p>
                                        <p className="text-gray-600">Languages</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Translated technical certification program into 12 languages, reducing translation time by 65% and increasing global certification completion rates by 42% through culturally adapted content.
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">65%</p>
                                        <p className="text-gray-600">Time Reduction</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">42%</p>
                                        <p className="text-gray-600">Completion Rate Increase</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-600 p-4 text-white">
                                <h3 className="text-xl font-semibold">Multinational Pharmaceutical Company</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <ShieldCheck className="h-12 w-12 text-blue-600 mr-4" />
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">8</p>
                                        <p className="text-gray-600">Regional Markets</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Localized compliance training for 8 regional markets, ensuring regulatory alignment in each jurisdiction while reducing translation costs by 38% compared to traditional methods.
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">38%</p>
                                        <p className="text-gray-600">Cost Reduction</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">100%</p>
                                        <p className="text-gray-600">Compliance Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-600 p-4 text-white">
                                <h3 className="text-xl font-semibold">Indian IT Services Provider with Global Clients</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <Users className="h-12 w-12 text-blue-600 mr-4" />
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">5</p>
                                        <p className="text-gray-600">Languages</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Transformed client onboarding materials into 5 languages with market-specific examples, reducing training time for international clients by 30% and improving satisfaction scores by 27%.
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">30%</p>
                                        <p className="text-gray-600">Training Time Reduction</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">27%</p>
                                        <p className="text-gray-600">Satisfaction Increase</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 4 */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-blue-600 p-4 text-white">
                                <h3 className="text-xl font-semibold">International Banking Institution</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <Clock className="h-12 w-12 text-blue-600 mr-4" />
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">15</p>
                                        <p className="text-gray-600">Countries</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Adapted anti-money laundering training for 15 countries with region-specific regulations and examples, achieving 100% compliance certification while reducing translation timeline from 12 weeks to just 4 weeks.
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">67%</p>
                                        <p className="text-gray-600">Time Reduction</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">100%</p>
                                        <p className="text-gray-600">Compliance Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credentials Section */}
                    <div className="mt-16 bg-gray-50 rounded-lg p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                            Why Choose ITSwift in Bangalore for Your E-Learning Translation and Localization Needs?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Language Expertise</h4>
                                    <p className="text-gray-700 text-sm">Professional translation capabilities in 50+ languages with specialized e-learning linguists</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Technical Proficiency</h4>
                                    <p className="text-gray-700 text-sm">Experience with all major authoring tools (Articulate, Captivate, Lectora) and LMS platforms</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">AI Innovation</h4>
                                    <p className="text-gray-700 text-sm">Proprietary AI-enhanced translation workflow that reduces timelines while maintaining quality</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Cultural Intelligence</h4>
                                    <p className="text-gray-700 text-sm">Deep understanding of cultural nuances across global markets</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Industry Knowledge</h4>
                                    <p className="text-gray-700 text-sm">Specialized expertise in technical, compliance, and soft skills training across sectors</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BadgeCheck className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Quality Commitment</h4>
                                    <p className="text-gray-700 text-sm">ISO-certified translation processes with rigorous quality assurance protocols</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Frequently Asked Questions About E-Learning Translation and Localization
                        </h2>
                        <p className="text-lg text-gray-700">
                            Get answers to common questions about our e-learning translation and localization services.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <div key={index} className="mb-4">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className={`w-full flex items-center justify-between p-5 bg-white rounded-lg shadow-sm border border-gray-200 ${openFaq === index ? 'border-blue-300 ring-1 ring-blue-200' : ''} hover:border-blue-300 transition-colors duration-200`}
                                >
                                    <div className="flex items-center text-left">
                                        <FileQuestion className={`h-6 w-6 mr-3 ${openFaq === index ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <span className="font-medium text-gray-900">{item.question}</span>
                                    </div>
                                    {openFaq === index ? (
                                        <Minus className="h-5 w-5 text-blue-600" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {openFaq === index && (
                                    <div className="p-5 border border-t-0 border-gray-200 bg-white rounded-b-lg">
                                        <p className="text-gray-700">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Related Resources */}
                    <div className="mt-16 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">
                            Related Resources
                        </h3>
                        <div className="space-y-4">
                            <a href="/blog/complete-guide-elearning-translation-localization" className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">The Complete Guide to E-Learning Translation and Localization</h4>
                                        <p className="text-gray-600 text-sm">A comprehensive overview of best practices, processes, and considerations for global e-learning content</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                </div>
                            </a>
                            <a href="/blog/ai-transformation-elearning-translation-2025" className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">How AI Is Transforming E-Learning Translation in 2025</h4>
                                        <p className="text-gray-600 text-sm">Exploring the latest AI technologies revolutionizing multilingual training content development</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                </div>
                            </a>
                            <a href="/blog/cultural-adaptation-strategies-global-training" className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">Cultural Adaptation Strategies for Effective Global Training</h4>
                                        <p className="text-gray-600 text-sm">Key approaches to ensure your training content resonates with learners across different cultures</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ready to get started section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Take Your E-Learning Content Global?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            We focus on transforming your e-learning content for global audiences so you can focus on your core business objectives. Our Bangalore-based translation and localization services provide the perfect balance of AI-powered efficiency, linguistic accuracy, and cultural adaptation.
                        </p>
                        <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 text-lg">
                            Contact Us Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Contact Us Today
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Ready to take your e-learning content global with AI-powered translation and localization? Our Bangalore team is ready to help you reach international audiences with culturally relevant, linguistically accurate training materials.
                            </p>
                            <p className="text-lg text-gray-700 mb-8">
                                Contact us today to discuss your specific needs and discover how our e-learning translation and localization services can help you achieve your global training objectives efficiently and cost-effectively.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Call Us</p>
                                        <p className="text-lg font-medium text-gray-900">+91 XXXX XXXXXX</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Us</p>
                                        <p className="text-lg font-medium text-gray-900">info@itswift.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Visit Us</p>
                                        <p className="text-lg font-medium text-gray-900">Bangalore, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Contact />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}