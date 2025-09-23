"use client"

import React, { useState } from "react"
import Image from "next/image"
import Contact from "@/components/contact"
import { ArrowRight, CheckCircle, Award, BarChart, Layers, Users, ChevronDown, Building, TrendingUp, Clock, Target, Star, ExternalLink, Phone, Mail } from "lucide-react"

interface CaseStudy {
    title: string
    client: string
    industry: string
    challenge: string
    solution: string
    results: string[]
    metrics: {
        label: string
        value: string
    }[]
    tags: string[]
    detailedContent?: {
        snapshot?: {
            client: string
            challenge: string
            solution: string
            results: string[]
        }
        introduction?: string
        challengeDetails?: {
            title: string
            content: string
            points: string[]
            quote?: {
                text: string
                author: string
            }
        }
        solutionDetails?: {
            title: string
            content: string
            components: {
                title: string
                description: string
            }[]
            quote?: {
                text: string
                author: string
            }
        }
        resultsDetails?: {
            title: string
            content: string
            achievements: {
                title: string
                description: string
            }[]
        }
        conclusion?: {
            title: string
            content: string
            callToAction: {
                title: string
                content: string
                contact: {
                    phone: string
                    email: string
                    website: string
                }
            }
        }
    }
}

export default function CaseStudiesPage() {
    const [showDetails, setShowDetails] = useState<number | null>(null)
    
    // Utility function to format text with asterisk markdown
    const formatText = (text: string) => {
        return text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    }

    const generatePDF = (study: CaseStudy, index: number) => {
        // Create a new window with the case study content
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${study.title} - Case Study</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
                    .header { border-bottom: 3px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
                    .title { color: #ea580c; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .client { font-size: 18px; color: #666; margin-bottom: 5px; }
                    .industry { font-size: 16px; color: #888; }
                    .section { margin: 25px 0; }
                    .section-title { color: #ea580c; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #ea580c; padding-left: 10px; }
                    .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                    .metric { background: #f97316; color: white; padding: 15px; border-radius: 8px; text-align: center; }
                    .metric-value { font-size: 24px; font-weight: bold; }
                    .metric-label { font-size: 14px; opacity: 0.9; }
                    .results { margin: 15px 0; }
                    .result-item { margin: 8px 0; padding-left: 20px; position: relative; }
                    .result-item:before { content: "✓"; position: absolute; left: 0; color: #16a34a; font-weight: bold; }
                    .tags { margin: 20px 0; }
                    .tag { background: #fed7aa; color: #ea580c; padding: 5px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; display: inline-block; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">${study.title}</div>
                    <div class="client">Client: ${study.client}</div>
                    <div class="industry">Industry: ${study.industry}</div>
                </div>
                
                <div class="tags">
                    ${study.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>

                <div class="metrics">
                    ${study.metrics.map(metric => `
                        <div class="metric">
                            <div class="metric-value">${metric.value}</div>
                            <div class="metric-label">${metric.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <div class="section-title">Challenge</div>
                    <p>${formatText(study.challenge)}</p>
                </div>

                <div class="section">
                    <div class="section-title">Solution</div>
                    <p>${formatText(study.solution)}</p>
                </div>

                <div class="section">
                    <div class="section-title">Results Achieved</div>
                    <div class="results">
                        ${study.results.map(result => `<div class="result-item">${formatText(result)}</div>`).join('')}
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        }
                    }
                </script>
            </body>
            </html>
        `

        printWindow.document.write(htmlContent)
        printWindow.document.close()
    }

    const caseStudies: CaseStudy[] = [
        {
            title: "How Swift Solution Built a Global Online Music & Dance Learning Platform",
            client: "Visionary Music & Dance Learning Platform",
            industry: "Education & Cultural Arts",
            challenge: "Making traditional Indian arts accessible to a global audience while preserving cultural authenticity and scaling a guru-shishya tradition digitally.",
            solution: "A custom Moodle LMS with live and recorded content, integrated with WebEx and Skype, featuring over 400 hours of eLearning content and scalable video streaming infrastructure.",
            results: [
            "Established the world's leading online music and dance eLearning platform",
            "Secured VC funding for rapid growth and expansion",
            "Gained adoption from learners in multiple countries",
            "Created global platform for cultural exchange"
        ],
            metrics: [
                { label: "Content Hours", value: "400+" },
                { label: "Video Content", value: "250+ hrs" },
                { label: "Global Reach", value: "Multi-country" },
                { label: "Funding Status", value: "VC Secured" }
            ],
            tags: ["Cultural Arts", "Moodle LMS", "Live Streaming", "Video Content", "Global Platform"],
            detailedContent: {
                snapshot: {
                    client: "Visionary Music & Dance Learning Platform",
                    challenge: "Making traditional Indian arts accessible to a global audience",
                    solution: "A custom Moodle LMS with live and recorded content, integrated with WebEx and Skype",
                    results: [
                "Established the world's leading online music and dance eLearning platform",
                "Secured VC funding for rapid growth and expansion",
                "Gained adoption from learners in multiple countries"
            ]
                },
                introduction: "A visionary project to bring the rich traditions of Bharatanatyam and Carnatic vocal training to a global audience was facing a major hurdle: how to scale a culturally authentic learning experience. The founders wanted to create a digital-first platform that could connect students with qualified teachers, regardless of their location, while preserving the sanctity of the guru-shishya tradition. They partnered with Swift Solution to build a custom eLearning platform that would bridge the gap between tradition and technology.",
                challengeDetails: {
                    title: "The Challenge: Blending Tradition with Technology",
                    content: "The project presented a unique set of challenges:",
                    points: [
                        "Cultural Authenticity: The platform needed to respect and preserve the cultural traditions of Bharatanatyam and Carnatic music, ensuring an authentic learning experience for students",
                        "Scalability: The platform had to be scalable enough to handle a global audience, with high-quality streaming and reliable performance",
                        "Live and Recorded Content: The platform needed to support both live, interactive sessions with teachers and a rich library of recorded lessons",
                        "Content Management: The client team needed to be able to update and manage the content independently, without relying on technical support"
                    ],
                    quote: {
                        text: "We had a vision to share our culture with the world, but we didn't know how to make it a reality. We needed a partner who understood our vision and could help us bring it to life.",
                        author: "Founder, Music & Dance Platform"
                    }
                },
                solutionDetails: {
                    title: "The Solution: A Custom Moodle LMS",
                    content: "Swift Solution developed a custom Moodle LMS that was designed to meet the unique needs of the music and dance platform. Our solution included:",
                    components: [
                        {
                            title: "Live and Recorded Content",
                            description: "We integrated the LMS with WebEx and Skype to support live, interactive sessions, and we created over 400 hours of eLearning content, including 250+ hours of high-quality videos"
                        },
                        {
                            title: "Scalable Infrastructure",
                            description: "We built a scalable video streaming infrastructure that was capable of handling a global user base"
                        },
                        {
                            title: "Custom CMS",
                            description: "We designed a custom CMS that allowed the client team to update and manage the content independently"
                        },
                        {
                            title: "Certification Programs",
                            description: "We created certification programs ranging from short-term courses to diploma-level offerings, providing students with a structured pathway to success"
                        }
                    ],
                    quote: {
                        text: "Swift Solution's custom Moodle LMS was the perfect solution for us. It gave us the flexibility and scalability we needed to create a truly unique learning experience.",
                        author: "Founder, Music & Dance Platform"
                    }
                },
                resultsDetails: {
                    title: "The Results: A Global Platform for Cultural Exchange",
                    content: "The custom eLearning platform was a huge success, delivering significant results for the music and dance platform:",
                    achievements: [
                        {
                            title: "Global Reach",
                            description: "The platform has been adopted by learners in multiple countries, bridging cultural and geographic gaps"
                        },
                        {
                            title: "VC Funding",
                            description: "The platform has secured VC funding for rapid growth and expansion into related domains like yoga and wellness"
                        },
                        {
                            title: "Industry Leadership",
                            description: "The platform has established itself as the world's leading online music and dance eLearning platform"
                        },
                        {
                            title: "Cultural Preservation",
                            description: "Successfully preserved and promoted cultural traditions through technology, connecting students with qualified teachers globally"
                        }
                    ]
                },
                conclusion: {
                    title: "Conclusion: A Harmony of Tradition and Technology",
                    content: "This case study demonstrates the power of technology to preserve and promote cultural traditions. By partnering with Swift Solution, the music and dance platform was able to create a global platform for cultural exchange, connecting students with qualified teachers and preserving the rich traditions of Bharatanatyam and Carnatic music for future generations.",
                    callToAction: {
                        title: "Ready to Build Your Own Learning Platform?",
                        content: "If you have a vision for a unique learning platform, we can help you bring it to life. Contact us today for a free consultation and learn how Swift Solution can help you achieve your goals.",
                        contact: {
                            phone: "+91-80-23215884",
                            email: "info@itswift.com",
                            website: "https://www.itswift.com/contact-us"
                        }
                    }
                }
            }
        },
        {
            title: "How Swift Solution Scaled Induction Training for a Global Bank",
            client: "Global Bank",
            industry: "Banking & Financial Services",
            challenge: "Slow, expensive, and unscalable classroom-based induction training that couldn't keep up with rapidly expanding teams and rising transaction volumes.",
            solution: "A blended learning program with eLearning modules, interactive simulations, gamified assessments, and standardized templates to modernize the traditional induction program.",
            results: [
                "30% reduction in induction timelines",
                "Improved complaint resolution and service quality",
                "Higher ROI per trained employee",
                "Scalable solution for global workforce"
            ],
            metrics: [
                { label: "Timeline Reduction", value: "30%" },
                { label: "Process Simulations", value: "300+" },
                { label: "Cost Efficiency", value: "Higher ROI" },
                { label: "Service Quality", value: "Improved" }
            ],
            tags: ["Banking", "Induction Training", "Blended Learning", "Process Simulation", "Gamification"],
            detailedContent: {
                snapshot: {
                    client: "Global Bank",
                    challenge: "Slow, expensive, and unscalable classroom-based induction training",
                    solution: "A blended learning program with eLearning modules, interactive simulations, and gamified assessments",
                    results: [
                        "30% reduction in induction timelines",
                        "Improved complaint resolution and service quality",
                        "Higher ROI per trained employee"
                    ]
                },
                introduction: "A global banking operations division was struggling to keep up with the demands of its rapidly expanding teams. The company's existing induction program was entirely classroom-based, making it slow, expensive, and difficult to scale. With rising transaction volumes and an urgent need to onboard new employees faster, the bank turned to Swift Solution to develop a modern, blended learning program that would accelerate onboarding, improve performance, and deliver a higher return on investment.",
                challengeDetails: {
                    title: "The Challenge: Modernizing a Traditional Induction Program",
                    content: "The bank's traditional induction program was a major bottleneck, preventing the company from achieving its growth targets. The key challenges were:",
                    points: [
                        "Lack of Scalability: The classroom-based model couldn't keep up with the demand for new hires, creating a backlog of untrained employees",
                        "High Costs: The program was expensive to run, with high costs for instructors, facilities, and travel",
                        "Slow Time to Productivity: New employees were taking too long to become productive, impacting business performance and customer service",
                        "Inconsistent Quality: Ensuring consistent training quality across different locations and instructors was a major challenge"
                    ],
                    quote: {
                        text: "Our induction program was a relic of the past. We needed a solution that was as agile and innovative as our business.",
                        author: "Training Lead, Global Bank"
                    }
                },
                solutionDetails: {
                    title: "The Solution: A Blended Learning Program for the Modern Workforce",
                    content: "Swift Solution developed a blended learning program that combined the best of eLearning and classroom-based training. Our solution was designed to be flexible, engaging, and effective, and it included:",
                    components: [
                        {
                            title: "Interactive eLearning Modules",
                            description: "We developed a series of interactive eLearning modules that covered the core concepts of the induction program"
                        },
                        {
                            title: "Process Simulations",
                            description: "We mapped over 300 business processes and built interactive simulations for critical workflows, allowing new hires to practice their skills in a safe, simulated environment"
                        },
                        {
                            title: "Gamified Assessments",
                            description: "We created gamified assessments and real-time scenarios to measure learner readiness and knowledge retention"
                        },
                        {
                            title: "Explainer Videos",
                            description: "We developed a series of explainer videos to simplify complex systems and concepts for new hires"
                        },
                        {
                            title: "Standardized Templates",
                            description: "We created standardized templates and structures to ensure consistency across all training modules"
                        }
                    ],
                    quote: {
                        text: "Swift Solution's blended learning program was a game-changer for us. It allowed us to scale our training program, reduce costs, and improve the performance of our new hires.",
                        author: "Training Lead, Global Bank"
                    }
                },
                resultsDetails: {
                    title: "The Results: Faster Onboarding, Better Performance, and Higher ROI",
                    content: "The blended learning program delivered significant results for the bank:",
                    achievements: [
                        {
                            title: "30% Reduction in Induction Timelines",
                            description: "The new program reduced the time it took to onboard new employees by 30%, allowing them to become productive faster"
                        },
                        {
                            title: "Improved Complaint Resolution and Service Quality",
                            description: "The interactive simulations and real-time scenarios helped new hires to develop the skills they needed to resolve customer complaints and provide high-quality service"
                        },
                        {
                            title: "Higher ROI per Trained Employee",
                            description: "The blended learning program was more cost-effective than the traditional classroom-based model, delivering a higher return on investment per trained employee"
                        },
                        {
                            title: "Scalable Framework",
                            description: "Created a sustainable solution that could accommodate the bank's growing workforce and global expansion plans"
                        }
                    ]
                },
                conclusion: {
                    title: "Conclusion: A Scalable and Sustainable Solution for a Global Workforce",
                    content: "This case study demonstrates the power of blended learning to solve complex training challenges and drive business results. By partnering with Swift Solution, the global bank was able to transform its induction training program and create a scalable and sustainable solution for its global workforce. This project serves as a model for other financial institutions looking to modernize their training programs.",
                    callToAction: {
                        title: "Ready to Transform Your Induction Training?",
                        content: "If you're a financial institution looking to modernize your induction training program, we can help. Contact us today for a free consultation and learn how Swift Solution can help you achieve your training goals.",
                        contact: {
                            phone: "+91-80-23215884",
                            email: "info@itswift.com",
                            website: "https://www.itswift.com/contact-us"
                        }
                    }
                }
            }
        },
        {
            title: "Lean Training for 2000 Shopfloor Employees",
            client: "Swift Solution",
            industry: "Manufacturing",
            challenge: "Large-scale workforce transformation requiring efficient training delivery across multiple shifts and locations. Traditional classroom-based training was proving inefficient, costly, and difficult to scale for 2000 shopfloor employees.",
            solution: "Comprehensive eLearning platform with interactive modules, mobile-first design, gamification elements, multilingual support, and offline capability. Developed bite-sized, engaging content covering all aspects of lean methodology.",
            results: [
                "95% completion rate across all training modules",
                "60% faster delivery compared to traditional methods",
                "40% cost reduction in training delivery costs",
                "Improved knowledge retention and productivity metrics"
            ],
            metrics: [
                { label: "Completion Rate", value: "95%" },
                { label: "Faster Delivery", value: "60%" },
                { label: "Cost Reduction", value: "40%" },
                { label: "Knowledge Retention", value: "85%" }
            ],
            tags: ["Manufacturing", "Lean Training", "Shopfloor", "Microlearning", "Digital Transformation"],
            detailedContent: {
                snapshot: {
                    client: "Swift Solution",
                    challenge: "Training 2000+ new shopfloor workers in lean manufacturing principles",
                    solution: "Visual, scenario-based microlearning modules on a cloud-hosted LMS",
                    results: [
                        "95% completion rate across all training modules",
                        "60% faster delivery compared to traditional methods",
                        "40% cost reduction in training delivery costs"
                    ]
                },
                introduction: "Swift Solution successfully transformed lean training delivery for 2000 shopfloor employees, achieving remarkable efficiency gains and cost savings through innovative eLearning solutions. In today's competitive manufacturing landscape, implementing lean methodologies across large workforces presents significant challenges.",
                challengeDetails: {
                    title: "The Challenge",
                    content: "The client faced the daunting task of training 2000 shopfloor employees in lean methodologies within a tight timeline. Traditional classroom-based training was proving inefficient, costly, and difficult to scale.",
                    points: [
                        "Coordinating training schedules across multiple shifts",
                        "Ensuring consistent training quality across different locations",
                        "Managing high training costs and resource allocation",
                        "Tracking progress and competency development",
                        "Minimizing production downtime during training"
                    ],
                    quote: {
                        text: "We needed a training solution that was as lean and efficient as the manufacturing principles we were teaching. Traditional methods just weren't going to cut it.",
                        author: "Training Manager"
                    }
                },
                solutionDetails: {
                    title: "Our Solution",
                    content: "Swift Solution developed a comprehensive eLearning platform specifically designed for shopfloor environments with mobile-first design and gamification elements.",
                    components: [
                        {
                            title: "Interactive Learning Modules",
                            description: "Bite-sized, engaging content covering all aspects of lean methodology"
                        },
                        {
                            title: "Mobile-First Design",
                            description: "Accessible on tablets and mobile devices for flexible learning"
                        },
                        {
                            title: "Gamification Elements",
                            description: "Progress tracking, badges, and leaderboards to boost engagement"
                        },
                        {
                            title: "Multilingual Support",
                            description: "Content available in local languages for better comprehension"
                        }
                    ],
                    quote: {
                        text: "The mobile-first approach was revolutionary for our shopfloor environment. Workers could learn during breaks without disrupting production.",
                        author: "Operations Director"
                    }
                },
                resultsDetails: {
                    title: "Results Achieved",
                    content: "The implementation delivered exceptional results that exceeded all expectations with significant improvements in completion rates and cost savings.",
                    achievements: [
                        {
                            title: "95% Completion Rate",
                            description: "Significantly higher than traditional training methods"
                        },
                        {
                            title: "60% Faster Delivery",
                            description: "Reduced training time from weeks to days"
                        },
                        {
                            title: "40% Cost Reduction",
                            description: "Substantial savings in training delivery costs"
                        },
                        {
                            title: "Enhanced Productivity",
                            description: "25% improvement in lean implementation metrics"
                        }
                    ]
                },
                conclusion: {
                    title: "Transforming Manufacturing Training",
                    content: "This project demonstrates Swift Solution's ability to deliver scalable, effective training solutions that drive real business results. Our innovative approach to lean training has set a new standard for manufacturing education.",
                    callToAction: {
                        title: "Ready to Transform Your Training?",
                        content: "Discover how Swift Solution can revolutionize your workforce development with cutting-edge eLearning solutions.",
                        contact: {
                            phone: "+91 80 4154 1288",
                            email: "info@itswift.com",
                            website: "www.itswift.com"
                        }
                    }
                }
            }
        },
        {
            title: "Scalable Courseware for Global EdTech Leader",
            client: "Global Education Services Provider",
            industry: "Education Technology",
            challenge: "Rapidly scaling courseware development without sacrificing quality. The company needed to create large volumes of structured, high-quality content across multiple domains with strict university timelines requiring faster turnaround.",
            solution: "Turnkey course development model with dedicated project managers, SME collaboration, standardized templates, robust QA process including plagiarism checks, and pilot testing with learners before rollout.",
            results: [
                "Delivered high-quality courses faster while ensuring academic rigor",
                "Enabled universities to launch programs on schedule without delays",
                "Established scalable, repeatable framework for future course creation",
                "Achieved 40% reduction in development time through standardized processes"
            ],
            metrics: [
                { label: "Quality", value: "High" },
                { label: "Delivery Speed", value: "Faster" },
                { label: "Schedule", value: "On Time" },
                { label: "Efficiency", value: "40%" }
            ],
            tags: ["Content Development", "EdTech", "Quality Assurance", "Scalability"],
            detailedContent: {
                snapshot: {
                    client: "Global Education Services Provider",
                    challenge: "Rapidly scaling courseware development without sacrificing quality",
                    solution: "Turnkey course development model with standardized templates and robust QA",
                    results: [
                        "Delivered high-quality courses faster while ensuring academic rigor",
                        "Enabled universities to launch programs on schedule",
                        "Established scalable, repeatable framework for future course creation"
                    ]
                },
                introduction: "A globally recognized education services provider was facing a classic growth challenge: how to scale content production to meet the demands of a rapidly expanding network of university partners without compromising on quality. They turned to Swift Solution to develop a scalable and repeatable course development model.",
                challengeDetails: {
                    title: "The Challenge: Balancing Speed and Quality",
                    content: "The EdTech leader was under pressure to deliver diverse courseware including assessments, faculty slides, gamified content, and multimedia lessons to university partners.",
                    points: [
                        "Scalability: Rapidly scale content development capabilities",
                        "Consistency: Maintain quality with multiple SMEs and developers",
                        "Speed: Meet strict university timelines without compromising quality",
                        "Quality Control: Ensure academic rigor across all content"
                    ],
                    quote: {
                        text: "We were caught in a classic Catch-22. We needed to move fast, but we couldn't afford to sacrifice quality. We needed a partner who could help us do both.",
                        author: "Program Director"
                    }
                },
                solutionDetails: {
                    title: "The Solution: Turnkey Course Development Model",
                    content: "Swift Solution developed a turnkey course development model designed to be both scalable and quality-driven with standardized processes and robust QA.",
                    components: [
                        {
                            title: "Dedicated Project Management",
                            description: "Appointed dedicated project managers for communication and progress tracking"
                        },
                        {
                            title: "SME Collaboration",
                            description: "Engaged SMEs across multiple domains for accurate curricula validation"
                        },
                        {
                            title: "Standardized Templates",
                            description: "Created standardized templates and instructional design guides"
                        },
                        {
                            title: "Robust QA Process",
                            description: "Deployed quality assurance with plagiarism checks and multi-level reviews"
                        }
                    ],
                    quote: {
                        text: "Swift Solution's turnkey model was exactly what we needed. It gave us the scalability and quality control we needed to meet our growth targets.",
                        author: "Program Director"
                    }
                },
                resultsDetails: {
                    title: "Results: Faster Delivery and Higher Quality",
                    content: "The turnkey course development model delivered significant results enabling faster delivery while maintaining the highest standards of quality and academic rigor.",
                    achievements: [
                        {
                            title: "Faster Delivery",
                            description: "Streamlined process enabled faster course delivery for university partners"
                        },
                        {
                            title: "Higher Quality",
                            description: "Robust QA process ensured highest standards of academic rigor"
                        },
                        {
                            title: "Scalable Framework",
                            description: "Repeatable framework enabled scaling without starting from scratch"
                        },
                        {
                            title: "Zero Quality Issues",
                            description: "No quality-related escalations from university partners post-implementation"
                        }
                    ]
                },
                conclusion: {
                    title: "A Partnership for Growth",
                    content: "This case study highlights the importance of strategic partnership in achieving scalable and sustainable growth. Swift Solution enabled the EdTech leader to overcome content development challenges and position for long-term success.",
                    callToAction: {
                        title: "Ready to Scale Your Content Development?",
                        content: "If you're an EdTech company looking to scale content development without sacrificing quality, we can help. Contact us for a free consultation.",
                        contact: {
                            phone: "+91-80-23215884",
                            email: "info@itswift.com",
                            website: "https://www.itswift.com/contact-us"
                        }
                    }
                }
            }
        },
        {
            title: "Modernizing Dealer Training with Mobile-First eLearning",
            client: "India's Top Furniture & Mattress Company",
            industry: "Furniture & Retail",
            challenge: "Fragmented training landscape with inconsistent messaging and high costs. Dealer training was decentralized across regions, leading to inconsistency in product messaging. Traditional training was expensive, time-consuming, and lacked scalability.",
            solution: "Mobile-first eLearning program with microlearning videos (2-3 minutes each), multilingual modules, CMS integrated with cloud LMS, and assessments with certifications for accountability and motivation.",
            results: [
                "1000+ employees trained and certified within first year",
                "60% reduction in training costs compared to traditional methods",
                "Improved consistency and engagement across dealer networks",
                "Enhanced mobile accessibility for flexible learning"
            ],
            metrics: [
                { label: "Employees Trained", value: "1000+" },
                { label: "Cost Reduction", value: "60%" },
                { label: "Consistency", value: "Improved" },
                { label: "Engagement", value: "Enhanced" }
            ],
            tags: ["Dealer Training", "Microlearning", "Multilingual", "Mobile Learning"],
            detailedContent: {
                snapshot: {
                    client: "India's Top Furniture & Mattress Company",
                    challenge: "Fragmented training landscape with inconsistent messaging and high costs",
                    solution: "Mobile-first eLearning program with microlearning videos and multilingual content",
                    results: [
                        "1000+ employees trained and certified within first year",
                        "60% reduction in training costs",
                        "Improved consistency across dealer networks"
                    ]
                },
                introduction: "A leading furniture brand was struggling with a decentralized training approach creating inconsistent messaging, high costs, and low engagement across their vast network of dealers and distributors. Swift Solution developed a comprehensive mobile-first eLearning program that transformed their dealer training approach.",
                challengeDetails: {
                    title: "The Challenge: Unifying a Fragmented Training Landscape",
                    content: "The furniture brand's decentralized training approach was creating multiple problems that needed immediate attention.",
                    points: [
                        "Inconsistent Messaging: Product messaging varied from region to region",
                        "High Costs: Traditional classroom training was expensive with high facility costs",
                        "Lack of Scalability: Existing model couldn't cover vast dealer network",
                        "Low Engagement: Training wasn't motivating enough for participation"
                    ],
                    quote: {
                        text: "We had a world-class product, but our training was stuck in the past. We needed a solution that was as modern and innovative as our furniture.",
                        author: "L&D Head"
                    }
                },
                solutionDetails: {
                    title: "The Solution: Mobile-First eLearning Program",
                    content: "Swift Solution developed a mobile-first eLearning program designed to be engaging, accessible, and scalable for the modern dealer network.",
                    components: [
                        {
                            title: "Microlearning Videos",
                            description: "Short 2-3 minute videos designed for mobile consumption and engagement"
                        },
                        {
                            title: "Multilingual Content",
                            description: "Modules in multiple languages to accommodate diverse regional dealers"
                        },
                        {
                            title: "Centralized LMS",
                            description: "CMS integrated with cloud LMS for easy access and management"
                        },
                        {
                            title: "Assessments & Certifications",
                            description: "Introduced accountability measures to motivate completion"
                        }
                    ],
                    quote: {
                        text: "Swift Solution's mobile-first approach was a game-changer for us. It allowed us to reach all dealers regardless of location and provide the training they needed to succeed.",
                        author: "L&D Head"
                    }
                },
                resultsDetails: {
                    title: "Results: Significant Cost Savings and Improved Engagement",
                    content: "The mobile-first eLearning program delivered exceptional results with substantial cost savings and dramatically improved engagement across the dealer network.",
                    achievements: [
                        {
                            title: "1000+ Employees Certified",
                            description: "Successfully trained and certified over 1000 employees in the first year"
                        },
                        {
                            title: "60% Cost Reduction",
                            description: "Significant savings compared to traditional classroom-based training"
                        },
                        {
                            title: "Improved Consistency",
                            description: "Unified messaging and training standards across all regions"
                        },
                        {
                            title: "Enhanced Engagement",
                            description: "Mobile accessibility led to higher participation and completion rates"
                        }
                    ]
                },
                conclusion: {
                    title: "Modernizing Retail Training",
                    content: "This project demonstrates how mobile-first eLearning can transform traditional training approaches in the retail sector. Swift Solution's innovative approach has set a new standard for dealer training programs.",
                    callToAction: {
                        title: "Ready to Modernize Your Training?",
                        content: "Transform your dealer or employee training with our mobile-first eLearning solutions. Contact us to learn how we can help.",
                        contact: {
                            phone: "+91 80 4154 1288",
                            email: "info@itswift.com",
                            website: "www.itswift.com"
                        }
                    }
                }
            }
        },
        {
            title: "Oil Rig Training with 3D BOP Simulations",
            client: "Leading Oil & Gas Company",
            industry: "Oil & Gas",
            challenge: "Conventional classroom training could not replicate the rig environment or show internal BOP components. Technicians found it difficult to visualize complex subsystems, making it harder to apply theoretical knowledge in practice.",
            solution: "Collaborated with SMEs to design detailed learning objectives aligned to real-world rig operations. Developed 3D animations and simulations of BOP units and subsystems with cross-sectional visualizations to explain internal mechanics. Integrated troubleshooting scenarios for hands-on learning.",
            results: [
                "Reduced training duration from 2 weeks to 1 week",
                "50% improvement in comprehension of complex BOP operations",
                "Improved productivity and reduced safety risks",
                "Enhanced visualization of complex subsystems"
            ],
            metrics: [
                { label: "Training Time", value: "50%" },
                { label: "Comprehension", value: "50%" },
                { label: "Safety Risks", value: "Reduced" },
                { label: "Productivity", value: "Improved" }
            ],
            tags: ["Safety Training", "3D Simulation", "Oil & Gas", "Technical Training"]
        },
        {
            title: "Centralized Dealer Training for Furniture Brand",
            client: "India's Top Furniture & Mattress Company",
            industry: "Furniture & Retail",
            challenge: "Dealer training was fragmented across regions, leading to inconsistency in product messaging. Traditional training was expensive, time-consuming, and lacked scalability needed to cover thousands of partners. Required multilingual, mobile-friendly, and motivating eLearning solution.",
            solution: "Partnered with L&D teams to identify dealer-specific training needs. Developed microlearning videos (2–3 minutes each) to encourage regular engagement. Designed multilingual modules and deployed CMS integrated with cloud LMS. Introduced assessments and certifications for accountability.",
            results: [
                "1000+ employees trained and certified within first year",
                "Reduced training costs by 60% compared to traditional methods",
                "Improved consistency and engagement across dealer networks",
                "Enhanced mobile accessibility for flexible learning"
            ],
            metrics: [
                { label: "Employees Trained", value: "1000+" },
                { label: "Cost Reduction", value: "60%" },
                { label: "Consistency", value: "Improved" },
                { label: "Engagement", value: "Enhanced" }
            ],
            tags: ["Dealer Training", "Microlearning", "Multilingual", "Mobile Learning"]
        },
        {
            title: "Digitized Training for Asia's Largest Bank",
            client: "Asia's Largest Bank",
            industry: "Banking & Financial Services",
            challenge: "Traditional classroom-heavy training model struggled to keep pace with business demands for 240,000+ employees across thousands of branches. Geographically dispersed workforce had diverse learning needs, with costly, time-consuming, and inconsistent classroom training creating skill gaps.",
            solution: "Developed SCORM/AICC compliant HTML5 courses compatible with multiple platforms. Created bite-sized mobile nuggets for anytime, anywhere access. Adopted gamification strategies to enhance motivation. Designed modules covering banking operations, HR, technology, and compliance optimized for multiple devices.",
            results: [
                "Scaled training to 240,000+ employees nationwide",
                "Reduced dependency on physical training academies",
                "Improved accessibility and learner engagement with mobile-first content",
                "Enhanced consistency across all regions and branches"
            ],
            metrics: [
                { label: "Employees Reached", value: "240K+" },
                { label: "Mobile Access", value: "Enabled" },
                { label: "Academy Dependency", value: "Reduced" },
                { label: "Engagement", value: "Enhanced" }
            ],
            tags: ["Banking", "Mobile Learning", "Gamification", "Large Scale"]
        }
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
                {/* Banner Image */}
                <div 
                    className="absolute inset-0 z-0 opacity-30"
                    suppressHydrationWarning
                    style={{
                        backgroundImage: 'url("/IMAGES/elearning case studies.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-orange-100">
                            Real results from real clients - discover how we've transformed learning experiences
                        </p>
                    </div>
                </div>
            </section>

            {/* Overview Stats */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                            Our Impact Across Industries
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">240K+</div>
                                <div className="text-gray-700">Employees Trained</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">400+</div>
                                <div className="text-gray-700">Hours of Content</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
                                <div className="text-gray-700">Average Cost Reduction</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
                                <div className="text-gray-700">Training Time Reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Case Studies Grid */}
                        <div className="space-y-8">
                            {caseStudies.map((study, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {study.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-3 text-gray-900">{study.title}</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <Building className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Client:</span>
                                                </div>
                                                <p className="text-gray-700 mb-4">{study.client}</p>
                                                
                                                <div className="flex items-center mb-2">
                                                    <Layers className="h-5 w-5 text-orange-500 mr-2" />
                                                    <span className="font-semibold text-gray-900">Industry:</span>
                                                </div>
                                                <p className="text-gray-700">{study.industry}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                {study.metrics.map((metric, metricIndex) => (
                                                    <div key={metricIndex} className="text-center bg-orange-50 rounded-lg p-4">
                                                        <div className="text-2xl font-bold text-orange-600">{metric.value}</div>
                                                        <div className="text-sm text-gray-700">{metric.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                <Target className="h-5 w-5 text-orange-500 mr-2" />
                                                Challenge
                                            </h4>
                                            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatText(study.challenge) }}></p>
                                        </div>
                                        
                                        {showDetails === index && study.detailedContent && (
                            <div className="space-y-8 bg-gray-50 rounded-lg p-6 mt-6">
                                {/* Snapshot Section */}
                                {study.detailedContent?.snapshot && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Snapshot</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Client:</p>
                                                <p className="text-gray-800 mb-3">{study.detailedContent.snapshot.client}</p>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Challenge:</p>
                                                <p className="text-gray-800 mb-3">{study.detailedContent.snapshot.challenge}</p>
                                                <p className="text-sm font-semibold text-gray-600 mb-1">Solution:</p>
                                                <p className="text-gray-800">{study.detailedContent.snapshot.solution}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-600 mb-2">Results:</p>
                                                <ul className="space-y-1">
                                                    {study.detailedContent.snapshot.results.map((result, idx) => (
                                                        <li key={idx} className="flex items-center space-x-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: formatText(result) }}></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Introduction */}
                                {study.detailedContent?.introduction && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Introduction</h4>
                                        <p className="text-gray-700 leading-relaxed">{study.detailedContent.introduction}</p>
                                    </div>
                                )}

                                {/* Challenge Details */}
                                {study.detailedContent?.challengeDetails && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">{study.detailedContent.challengeDetails.title}</h4>
                                        <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: formatText(study.detailedContent.challengeDetails.content) }}></p>
                                        <ul className="space-y-3 mb-6">
                                            {study.detailedContent.challengeDetails.points.map((point, idx) => (
                                                <li key={idx} className="flex items-start space-x-3">
                                                    <Target className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatText(point) }}></span>
                                                </li>
                                            ))}
                                        </ul>
                                        {study.detailedContent.challengeDetails.quote && (
                                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                                <blockquote className="text-gray-700 italic mb-2">
                                                    "{study.detailedContent.challengeDetails.quote.text}"
                                                </blockquote>
                                                <cite className="text-sm text-gray-600 font-medium">
                                                    - {study.detailedContent.challengeDetails.quote.author}
                                                </cite>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Solution Details */}
                                {study.detailedContent?.solutionDetails && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">{study.detailedContent.solutionDetails.title}</h4>
                                        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: formatText(study.detailedContent.solutionDetails.content) }}></p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {study.detailedContent.solutionDetails.components.map((component, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                                                        <Layers className="h-4 w-4 text-orange-500 mr-2" />
                                                        {component.title}
                                                    </h5>
                                                    <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: formatText(component.description) }}></p>
                                                </div>
                                            ))}
                                        </div>
                                        {study.detailedContent.solutionDetails.quote && (
                                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                                <blockquote className="text-gray-700 italic mb-2">
                                                    "{study.detailedContent.solutionDetails.quote.text}"
                                                </blockquote>
                                                <cite className="text-sm text-gray-600 font-medium">
                                                    - {study.detailedContent.solutionDetails.quote.author}
                                                </cite>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Results Details */}
                                {study.detailedContent.resultsDetails && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">{study.detailedContent.resultsDetails.title}</h4>
                                        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: formatText(study.detailedContent.resultsDetails.content) }}></p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {study.detailedContent.resultsDetails.achievements.map((achievement, idx) => (
                                                <div key={idx} className="bg-green-50 rounded-lg p-4">
                                                    <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                                                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                                                        {achievement.title}
                                                    </h5>
                                                    <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: formatText(achievement.description) }}></p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Conclusion */}
                                {study.detailedContent.conclusion && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">{study.detailedContent.conclusion.title}</h4>
                                        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: formatText(study.detailedContent.conclusion.content) }}></p>
                                        
                                        {/* Call to Action */}
                                        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                                            <h5 className="text-lg font-bold text-orange-800 mb-3">{study.detailedContent.conclusion.callToAction.title}</h5>
                                            <p className="text-gray-700 mb-4">{study.detailedContent.conclusion.callToAction.content}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-orange-600" />
                                                    <span className="text-gray-700">{study.detailedContent.conclusion.callToAction.contact.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-orange-600" />
                                                    <span className="text-gray-700">{study.detailedContent.conclusion.callToAction.contact.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <ExternalLink className="h-4 w-4 text-orange-600" />
                                                    <a href={study.detailedContent.conclusion.callToAction.contact.website} 
                                                       className="text-orange-600 hover:text-orange-700 transition-colors">
                                                        Contact Us
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {showDetails === index && !study.detailedContent && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                        <Layers className="h-5 w-5 text-orange-500 mr-2" />
                                        Solution
                                    </h4>
                                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatText(study.solution) }}></p>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                                        Results Achieved
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {study.results.map((result, resultIndex) => (
                                            <div key={resultIndex} className="flex items-center space-x-2">
                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatText(result) }}></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                                        
                                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={() => setShowDetails(showDetails === index ? null : index)}
                                                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200"
                                            >
                                                <span>{showDetails === index ? 'Hide Details' : 'View Details'}</span>
                                                <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${showDetails === index ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => generatePDF(study, index)}
                                                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                                            >
                                                <span>Download PDF</span>
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">
                            Consistent Results Across All Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Faster Training Delivery</h3>
                                <p className="text-gray-700">Reduced training duration from 2 weeks to 1 week with improved comprehension</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Massive Scale Achievement</h3>
                                <p className="text-gray-700">Successfully trained 240,000+ employees across global operations</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <Star className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Cost Optimization</h3>
                                <p className="text-gray-700">Average 50-60% reduction in training costs while improving quality</p>
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
                            Ready to Create Your Success Story?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Let's discuss how we can help you achieve similar results for your organization.
                        </p>
                    </div>
                    <Contact />
                </div>
            </section>
        </div>
    )
}