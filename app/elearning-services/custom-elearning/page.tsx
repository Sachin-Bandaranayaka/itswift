"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown } from "lucide-react"

// Metadata needs to be moved to a separate layout file or removed from client components
// export const metadata: Metadata = {
//   title: "Custom E-Learning Solutions | Swift Solution",
//   description: "Your custom E-Learning solutions Partner catering to customized eLearning requirements of your company",
// }

export default function CustomElearningPage() {
    const [showAllFaqs, setShowAllFaqs] = useState(false);

    // All FAQ items
    const faqItems = [
        {
            question: "How can we help create custom eLearning Solutions?",
            icon: <Users className="h-6 w-6 text-orange-600" />,
            answer: (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Our instructional designers are adept at taking your existing content and turning it into highly interactive eLearning</li>
                    <li>We make the eLearning content adaptable, scalable and ensure seamless transmission of content across multiple devices</li>
                    <li>We will partner closely with you to align with the company values and brand</li>
                    <li>We will ensure to build latest innovations which include social interaction, gamification, and immersive learning experiences</li>
                </ul>
            )
        },
        {
            question: "Can examples of custom eLearning solutions be provided?",
            icon: <Award className="h-6 w-6 text-orange-600" />,
            answer: (
                <>
                    <h4 className="font-medium mb-2 text-gray-900">Custom eLearning Solutions: What We Offer</h4>
                    <p className="text-gray-700 mb-4">
                        Yes, we provide a wide array of custom eLearning solutions tailored to meet the specific needs of potential clients. Our portfolio includes numerous examples showcasing how our strategies can enhance your business's training and development programs.
                    </p>
                    <h4 className="font-medium mb-2 text-gray-900">Industry-Specific Courses</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Healthcare: Interactive modules focusing on compliance and patient care.</li>
                        <li>Finance: Courses designed to simplify complex regulatory requirements.</li>
                        <li>Retail: Training that improves customer service skills and product knowledge.</li>
                    </ul>
                    <h4 className="font-medium mt-4 mb-2 text-gray-900">Request More Examples</h4>
                    <p className="text-gray-700">
                        If you're interested in exploring more of our work, we welcome you to reach out. Our team can share detailed examples, ensuring you gain insights into how our eLearning solutions can be crafted specifically for your industry's needs.
                    </p>
                </>
            )
        },
        {
            question: "How long does it typically take to create a custom eLearning module, and what factors affect the timeline?",
            icon: <BarChart className="h-6 w-6 text-orange-600" />,
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        The timeline for crafting a custom eLearning module can vary significantly, but typically you can expect the process to take anywhere from 1 to 4 months. A variety of factors influence this duration, each playing a crucial role in determining the final timeline.
                    </p>
                    <h4 className="font-medium mb-2 text-gray-900">Key Factors Affecting the Timeline:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>
                            <strong>Course Length and Complexity</strong>
                            <p>The more extensive and intricate the course, the longer it will take to develop. Short modules naturally require less time than comprehensive programs.</p>
                        </li>
                        <li>
                            <strong>Subject Matter</strong>
                            <p>Topics that are highly technical or require in-depth research may extend the timeline compared to more straightforward subjects.</p>
                        </li>
                        <li>
                            <strong>Custom Visuals and Multimedia</strong>
                            <p>If the module incorporates unique graphics, animations, or videos, additional time will be necessary for production. Custom visuals are often vital for learner engagement but do add to the development process.</p>
                        </li>
                        <li>
                            <strong>Existing Content</strong>
                            <p>Utilizing pre-existing content from other courses can accelerate the process. In scenarios where content is being reused, completion can be achieved in about 8 to 10 weeks.</p>
                        </li>
                        <li>
                            <strong>Content Development from Scratch</strong>
                            <p>Building a course from the ground up is more time-consuming, typically taking around 3.5 months. This duration ensures the content is well-researched and tailored precisely to your needs.</p>
                        </li>
                        <li>
                            <strong>Iterative Feedback and Revisions</strong>
                            <p>Throughout the development phase, regular feedback rounds are essential for refining the course materials. The more iterations needed, the longer the timeline can become.</p>
                        </li>
                    </ol>
                </>
            )
        },
        {
            question: "Are custom eLearning templates available, and how are they tailored to specific business needs?",
            icon: <Layers className="h-6 w-6 text-orange-600" />,
            answer: (
                <>
                    <h4 className="font-medium mb-2 text-gray-900">Are Custom eLearning Templates Available?</h4>
                    <p className="text-gray-700 mb-4">
                        Absolutely! Custom eLearning templates are not only available but are specifically crafted to meet your unique business requirements.
                    </p>
                    <h4 className="font-medium mb-2 text-gray-900">How Are They Tailored?</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>
                            <strong>Understanding Your Business Goals</strong>
                            <p>The first step in creating a custom template involves a deep dive into understanding your business objectives. This ensures that the eLearning solution aligns perfectly with your company's vision and targets.</p>
                        </li>
                        <li>
                            <strong>Personalized Design Approach</strong>
                            <p>Unlike one-size-fits-all solutions, custom templates are designed from scratch. This bespoke approach allows you to incorporate branding, specific functionalities, and interactive elements that resonate with your audience.</p>
                        </li>
                        <li>
                            <strong>Collaborative Development Process</strong>
                            <p>Collaborating with you throughout the design and development stages ensures that the final product not only meets but exceeds your expectations. Regular feedback loops and iterations are key to this dynamic process.</p>
                        </li>
                        <li>
                            <strong>Unique Employee Needs</strong>
                            <p>We consider the diverse learning preferences and needs of your employees. This tailored approach ensures that the training is engaging, effective, and boosts productivity.</p>
                        </li>
                    </ol>
                </>
            )
        },
        {
            question: "What factors influence the cost of a custom eLearning course?",
            icon: <ChevronDown className="h-6 w-6 text-orange-600" />,
            answer: (
                <>
                    <p className="text-gray-700 mb-4">
                        Creating a custom eLearning course involves multiple elements that can impact the overall cost. Here's a breakdown of key factors:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>
                            <strong>Course Type:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Update vs. New Build: Costs differ significantly between giving an existing course a cosmetic makeover and designing a new course from scratch.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Content Complexity:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Multimedia Integration: Including custom audio or video can enhance the learning experience but also adds to the expense.</li>
                                <li>Interactive Elements: Features like quizzes, simulations, or games require additional development time and resources.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Customization Level:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Tailoring content to align with specific brand guidelines or organizational needs may require more intricate design work and thus, higher costs.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Technical Requirements:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Courses needing advanced functionalities or compatibility with various platforms could incur additional technical development expenses.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Project Timeline:</strong>
                            <ul className="list-disc pl-5 mt-1">
                                <li>Rush projects or tight deadlines can lead to an increased budget to accommodate expedited work.</li>
                            </ul>
                        </li>
                    </ol>
                </>
            )
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section with Background */}
            <section className="relative text-white py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/IMAGES/3.custom learning/download (1).png" 
                        alt="Custom E-Learning Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Custom E-Learning Solutions
                        </h1>
                        <p className="text-xl mb-8 text-orange-100">
                            Your custom E-Learning solutions Partner catering to customized eLearning requirements of your company
                        </p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                            <a href="#methodology" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-200">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Outsource Your E-Learning Requirements
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-4">
                                    Swift Solution Pvt Ltd. offers custom elearning development services enabling you to completely outsource your e-Learning requirements / online learning solutions. We recognize that high costs can be an important barrier to any e-Learning project. If you are looking to realize significant benefits by outsourcing your training requirements, in whole or part, we will be the right partner to work with.
                                </p>
                                <p className="text-lg text-gray-700">
                                    We Design and develop e-Learning content and elearning solutions based on rigorous research of learners, understand their needs, their expectations and trigger points which will bring in required modification amongst the learners and work towards increasing their job performance through enhanced learning experience.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-80"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Our Custom eLearning?</h3>
                                <ul className="space-y-4 w-full max-w-md">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Tailored to your specific business needs and objectives</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Engaging and interactive learning experiences</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Cost-effective solutions with measurable ROI</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-orange-200 mr-3 flex-shrink-0 mt-0.5" />
                                        <span>Seamless integration with your existing LMS</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our custom eLearning solutions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Display first 2 FAQs by default, or all if showAllFaqs is true */}
                        {faqItems.slice(0, showAllFaqs ? faqItems.length : 2).map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-orange-100 p-2 rounded-full mr-4">
                                            {faq.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className="prose prose-orange max-w-none">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All FAQs Button */}
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setShowAllFaqs(!showAllFaqs)}
                            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
                        >
                            {showAllFaqs ? "Show Less" : "View All FAQs"}
                            <ArrowRight className={`ml-2 h-4 w-4 ${showAllFaqs ? "rotate-90" : ""}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section id="methodology" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our Methodology for End-to-End eLearning Solutions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            In the ever-evolving landscape of digital education, finding the right eLearning solution is paramount. Our approach blends meticulous planning and cutting-edge design to deliver unparalleled eLearning experiences.
                        </p>
                    </div>

                    {/* Service Categories */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Service Categories</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[
                                "Custom eLearning Solutions",
                                "eLearning Consultancy",
                                "Mobile Learning",
                                "Micro Learning",
                                "LMS Services",
                                "Performance Support",
                                "eLearning through AR and VR",
                                "Game-Based Learning",
                                "Conversion from Flash to HTML",
                                "Readymade Courses",
                                "Rapid Learning"
                            ].map((service, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200">
                                    <span className="text-sm font-medium">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Development Process */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Development Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Understand Your Needs",
                                    description: "The journey begins with a deep dive into understanding your specific needs and goals.",
                                    icon: <Users className="h-8 w-8 text-orange-500" />
                                },
                                {
                                    title: "Storyboard Draft & Review",
                                    description: "We craft a storyboard that outlines the course content, ensuring the narrative aligns with your goals.",
                                    icon: <Layers className="h-8 w-8 text-orange-500" />
                                },
                                {
                                    title: "Develop the Course",
                                    description: "Our skilled designers and creative team bring the course to life, integrating visual and audio elements.",
                                    icon: <Award className="h-8 w-8 text-orange-500" />
                                },
                                {
                                    title: "Final Approval & Upload",
                                    description: "We ensure seamless course publication across platforms, including SCORM or Tin Can settings.",
                                    icon: <BarChart className="h-8 w-8 text-orange-500" />
                                }
                            ].map((step, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                    <div className="bg-orange-50 p-3 rounded-full inline-block mb-4">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h4>
                                    <p className="text-gray-700">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quality Assurance */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Quality Assurance</h3>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
                            <h4 className="text-xl font-semibold mb-4 text-gray-900">How do we ensure quality of our courses?</h4>
                            <p className="text-gray-700 mb-4">
                                The impact of the learning is felt when the design of media assets like videos, animations, voice overs, and overall visual design is in sync with well-designed information that is instructionally sound. Our small but incredibly talented team prides themselves on producing courses that are nothing but the highest quality.
                            </p>
                            <p className="text-gray-700 mb-4">
                                We lean on this textual, auditory, and visual quality to help improve the learners' experience, ultimately helping them retain more information. The top eLearning solutions companies stand out by offering comprehensive platforms that integrate innovative visual design components, making learning not just informative but also engaging.
                            </p>
                            <p className="text-gray-700">
                                This includes intuitive user interfaces, interactive videos, and gamification, which enhance the learning experience and improve retention rates. Rest assured that all courses will have your branding and pass LMS testing standards, ensuring a seamless and personalized learning journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Blog Posts Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Related Blog Posts
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Explore our latest insights and articles on eLearning
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Blog Post 1 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-500">
                                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                                    eLearning Trends
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">The Future of eLearning</h3>
                                <p className="text-gray-600 mb-4">Exploring emerging trends and technologies in the eLearning industry.</p>
                                <a href="#" className="text-orange-500 hover:text-orange-700 font-medium inline-flex items-center">
                                    Read more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Blog Post 2 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
                                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                                    ROI Strategies
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Maximizing ROI with Custom eLearning</h3>
                                <p className="text-gray-600 mb-4">How to measure and optimize the return on investment for your eLearning initiatives.</p>
                                <a href="#" className="text-orange-500 hover:text-orange-700 font-medium inline-flex items-center">
                                    Read more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Blog Post 3 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-500">
                                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                                    Gamification
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Gamification in Corporate Training</h3>
                                <p className="text-gray-600 mb-4">Leveraging game mechanics to increase engagement and knowledge retention.</p>
                                <a href="#" className="text-orange-500 hover:text-orange-700 font-medium inline-flex items-center">
                                    Read more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Contact Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Ready to transform your eLearning experience? Get in touch with our team today.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}