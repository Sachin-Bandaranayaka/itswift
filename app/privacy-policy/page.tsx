import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Swift Solution Pvt Ltd',
    description: 'Privacy Policy for Swift Solution Pvt Ltd - Learn how we collect, use, and protect your personal information in compliance with DPDP Act 2023, GDPR, and CCPA.',
    keywords: 'privacy policy, data protection, DPDP Act, GDPR, CCPA, Swift Solution',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Swift Solution Pvt Ltd</strong>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Effective Date:</strong> September 1, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Last Updated:</strong> September 1, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Version:</strong> 1.0
                        </p>
                    </div>

                    <nav className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li><a href="#introduction" className="text-blue-600 dark:text-blue-400 hover:underline">Introduction</a></li>
                            <li><a href="#scope-and-applicability" className="text-blue-600 dark:text-blue-400 hover:underline">Scope and Applicability</a></li>
                            <li><a href="#information-we-collect" className="text-blue-600 dark:text-blue-400 hover:underline">Information We Collect</a></li>
                            <li><a href="#how-we-use-your-information" className="text-blue-600 dark:text-blue-400 hover:underline">How We Use Your Information</a></li>
                            <li><a href="#legal-basis-for-processing" className="text-blue-600 dark:text-blue-400 hover:underline">Legal Basis for Processing</a></li>
                            <li><a href="#information-sharing-and-disclosure" className="text-blue-600 dark:text-blue-400 hover:underline">Information Sharing and Disclosure</a></li>
                            <li><a href="#data-retention" className="text-blue-600 dark:text-blue-400 hover:underline">Data Retention</a></li>
                            <li><a href="#your-rights-and-choices" className="text-blue-600 dark:text-blue-400 hover:underline">Your Rights and Choices</a></li>
                            <li><a href="#data-security" className="text-blue-600 dark:text-blue-400 hover:underline">Data Security</a></li>
                            <li><a href="#international-data-transfers" className="text-blue-600 dark:text-blue-400 hover:underline">International Data Transfers</a></li>
                            <li><a href="#cookies-and-tracking-technologies" className="text-blue-600 dark:text-blue-400 hover:underline">Cookies and Tracking Technologies</a></li>
                            <li><a href="#childrens-privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Children's Privacy</a></li>
                            <li><a href="#third-party-services" className="text-blue-600 dark:text-blue-400 hover:underline">Third-Party Services</a></li>
                            <li><a href="#changes-to-this-privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Changes to This Privacy Policy</a></li>
                            <li><a href="#contact-information" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Information</a></li>
                            <li><a href="#jurisdiction-and-governing-law" className="text-blue-600 dark:text-blue-400 hover:underline">Jurisdiction and Governing Law</a></li>
                        </ol>
                    </nav>

                    <section id="introduction" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Introduction</h2>
                        <p className="mb-4">
                            Swift Solution Pvt Ltd ("Swift Solution," "we," "us," or "our") is committed to protecting and respecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our
                            website at <a href="https://www.itswift.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.itswift.com</a> (the "Website"),
                            use our e-learning development services, or otherwise interact with us.
                        </p>
                        <p className="mb-4">
                            We understand that privacy is fundamental to trust, and we are dedicated to being transparent about our data practices.
                            This policy has been designed to comply with applicable privacy laws, including India's Digital Personal Data Protection Act, 2023 ("DPDP Act"),
                            the European Union's General Data Protection Regulation ("GDPR"), the California Consumer Privacy Act ("CCPA"),
                            and other relevant privacy regulations worldwide.
                        </p>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-3">About Swift Solution Pvt Ltd:</h3>
                            <p>
                                We are a leading e-learning development company based in Bangalore, Karnataka, India, with over 25 years of experience
                                in providing custom e-learning solutions, corporate training programs, microlearning modules, and learning management
                                system implementation services to organizations globally.
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Our Commitment:</h3>
                            <p>
                                We are committed to processing your personal data lawfully, fairly, and transparently, ensuring that your privacy
                                rights are respected and protected at all times.
                            </p>
                        </div>
                    </section>

                    <section id="scope-and-applicability" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Scope and Applicability</h2>

                        <h3 className="text-xl font-semibold mb-4">2.1 Geographic Scope</h3>
                        <p className="mb-4">This Privacy Policy applies to all users of our services worldwide, including but not limited to:</p>
                        <ul className="list-disc list-inside mb-6 space-y-2">
                            <li>Individuals located in India</li>
                            <li>European Union residents (subject to GDPR)</li>
                            <li>California residents (subject to CCPA)</li>
                            <li>Users from other jurisdictions with applicable privacy laws</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-4">2.2 Services Covered</h3>
                        <p className="mb-4">This policy covers all interactions with Swift Solution, including:</p>
                        <ul className="list-disc list-inside mb-6 space-y-2">
                            <li>Our corporate website</li>
                            <li>E-learning development services</li>
                            <li>Corporate training solutions</li>
                            <li>Microlearning module development</li>
                            <li>LMS implementation and consultancy services</li>
                            <li>Rapid e-learning development</li>
                            <li>Video-based training solutions</li>
                            <li>Game-based learning development</li>
                            <li>E-learning translation and localization services</li>
                            <li>Any other services provided by Swift Solution</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-4">2.3 Data Controller Information</h3>
                        <p className="mb-4">
                            Swift Solution Pvt Ltd acts as the data controller (or "Data Fiduciary" under Indian law) for personal information
                            collected through our services.
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <h4 className="font-semibold mb-3">Registered Office:</h4>
                            <p className="mb-2">
                                <strong>Address:</strong> # 31, 14th Main, Agromore Layout, Atthiguppe Extn, (Near to Chandra Layout Water Tank),
                                Vijaynagar, Bangalore - 560 040 Karnataka
                            </p>
                            <p className="mb-2"><strong>Phone:</strong> 080-23215884</p>
                            <p className="mb-2"><strong>Email:</strong> swiftsol@itswift.com</p>
                            <p><strong>Corporate Identification Number (CIN):</strong> U72900KA2000PTC026847</p>
                        </div>
                    </section>          <
                        section id="information-we-collect" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Information We Collect</h2>
                        <p className="mb-6">
                            We collect personal information that you provide directly to us, information we obtain automatically when you use our services,
                            and information from third-party sources. The types of information we collect depend on how you interact with our services.
                        </p>

                        <h3 className="text-xl font-semibold mb-4">3.1 Information You Provide Directly</h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                <h4 className="font-semibold mb-3">Contact Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Full name</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Job title and company name</li>
                                    <li>Mailing address</li>
                                    <li>Professional LinkedIn profile (if provided)</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                                <h4 className="font-semibold mb-3">Business Information:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Company details and industry</li>
                                    <li>Project requirements and specifications</li>
                                    <li>Training needs assessment data</li>
                                    <li>Learning objectives and goals</li>
                                    <li>Budget and timeline information</li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">3.2 Information We Collect Automatically</h3>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-6">
                            <h4 className="font-semibold mb-3">Website Usage Data:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>IP address and location information</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Device information (type, model, identifiers)</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring and exit pages</li>
                                <li>Click-through rates and user interactions</li>
                            </ul>
                        </div>
                    </section>

                    <section id="how-we-use-your-information" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">4. How We Use Your Information</h2>
                        <p className="mb-6">
                            We use your personal information for various legitimate business purposes, always in accordance with applicable privacy laws
                            and with appropriate legal basis.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Service Delivery</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Understand your training requirements</li>
                                    <li>Develop customized e-learning solutions</li>
                                    <li>Create content that meets your specifications</li>
                                    <li>Deliver high-quality educational materials</li>
                                    <li>Manage project timelines and deliverables</li>
                                </ul>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Business Operations</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Process service requests</li>
                                    <li>Manage customer accounts</li>
                                    <li>Handle billing and payments</li>
                                    <li>Provide customer support</li>
                                    <li>Ensure legal compliance</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="legal-basis-for-processing" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Legal Basis for Processing</h2>
                        <p className="mb-6">
                            Under applicable privacy laws, we must have a valid legal basis for processing your personal information.
                            We rely on the following legal bases:
                        </p>

                        <div className="space-y-6">
                            <div className="border-l-4 border-blue-500 pl-6">
                                <h3 className="text-lg font-semibold mb-2">Consent</h3>
                                <p className="text-sm">
                                    For marketing communications, newsletter subscriptions, and optional data collection, we obtain your explicit,
                                    informed, and freely given consent. You may withdraw this consent at any time.
                                </p>
                            </div>

                            <div className="border-l-4 border-green-500 pl-6">
                                <h3 className="text-lg font-semibold mb-2">Contractual Necessity</h3>
                                <p className="text-sm">
                                    Processing your information is necessary to perform our contractual obligations, deliver the e-learning services
                                    you have requested, and fulfill our commitments under service agreements.
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-6">
                                <h3 className="text-lg font-semibold mb-2">Legitimate Interests</h3>
                                <p className="text-sm">
                                    We process information for legitimate business interests, including improving our services, ensuring security,
                                    preventing fraud, and maintaining business records, provided these interests do not override your fundamental rights.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="information-sharing-and-disclosure" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Information Sharing and Disclosure</h2>
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
                            <p className="font-semibold text-red-800 dark:text-red-200">
                                We do not sell, rent, or trade your personal information to third parties.
                            </p>
                        </div>

                        <p className="mb-6">We may share your information only in the following circumstances:</p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Service Providers and Business Partners</h3>
                                <p className="text-sm mb-3">
                                    We may share information with carefully selected service providers who assist us in delivering our services,
                                    including cloud hosting providers, payment processors, and technical support services. These parties are
                                    contractually bound to protect your information.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
                                <p className="text-sm">
                                    We may disclose information when required by law, legal process, court order, or government request,
                                    including responses to lawful requests from public authorities.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="data-retention" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">7. Data Retention</h2>
                        <p className="mb-6">
                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                            comply with legal obligations, resolve disputes, and enforce our agreements.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Retention Periods:</h3>
                            <ul className="space-y-2 text-sm">
                                <li><strong>Active Client Data:</strong> Duration of business relationship plus 7 years after project completion</li>
                                <li><strong>Prospective Client Data:</strong> 3 years from initial contact</li>
                                <li><strong>Marketing Communications:</strong> Until consent is withdrawn</li>
                                <li><strong>Financial Records:</strong> 7 years in compliance with Indian regulations</li>
                                <li><strong>Website Analytics:</strong> 2 years for trend analysis</li>
                            </ul>
                        </div>
                    </section>

                    <section id="your-rights-and-choices" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Your Rights and Choices</h2>
                        <p className="mb-6">
                            We respect your privacy rights and provide mechanisms to exercise control over your personal information.
                            Your rights may vary depending on your location and applicable laws.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Universal Rights</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Right to Information</li>
                                    <li>Right to Access</li>
                                    <li>Right to Correction</li>
                                    <li>Right to Deletion</li>
                                    <li>Right to Restrict Processing</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Enhanced Rights (GDPR/CCPA)</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Right to Data Portability</li>
                                    <li>Right to Object to Processing</li>
                                    <li>Right to Opt-out of Sale</li>
                                    <li>Right to Non-discrimination</li>
                                    <li>Right to Lodge Complaints</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="data-security" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">9. Data Security</h2>
                        <p className="mb-6">
                            We implement comprehensive security measures to protect your personal information against unauthorized access,
                            alteration, disclosure, or destruction.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Technical Safeguards</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>SSL/TLS encryption</li>
                                    <li>AES data encryption</li>
                                    <li>Multi-factor authentication</li>
                                    <li>Firewall protection</li>
                                    <li>Regular security monitoring</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Organizational Safeguards</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Employee training</li>
                                    <li>Confidentiality agreements</li>
                                    <li>Incident response plan</li>
                                    <li>Regular security audits</li>
                                    <li>Access controls</li>
                                </ul>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Physical Security</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Facility access controls</li>
                                    <li>Surveillance systems</li>
                                    <li>Device encryption</li>
                                    <li>Secure disposal procedures</li>
                                    <li>Environmental protections</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="international-data-transfers" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">10. International Data Transfers</h2>
                        <p className="mb-6">
                            As a global e-learning services provider, we may transfer your personal information across international borders
                            to deliver our services effectively, always with appropriate safeguards in place.
                        </p>
                    </section>

                    <section id="cookies-and-tracking-technologies" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">11. Cookies and Tracking Technologies</h2>
                        <p className="mb-6">
                            We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns,
                            and improve our services.
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Types of Cookies We Use:</h3>
                            <ul className="space-y-2 text-sm">
                                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                                <li><strong>Performance Cookies:</strong> Help us improve website performance</li>
                                <li><strong>Functionality Cookies:</strong> Remember your preferences</li>
                                <li><strong>Analytics Cookies:</strong> Understand user behavior and interactions</li>
                            </ul>
                        </div>
                    </section>

                    <section id="childrens-privacy" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">12. Children's Privacy</h2>
                        <p className="mb-4">
                            We are committed to protecting the privacy of children and do not knowingly collect personal information from
                            individuals under the age of 18 without appropriate parental consent.
                        </p>
                        <p className="text-sm">
                            Our services are designed for businesses and professional users. If we become aware that we have collected
                            personal information from a child under 18 without verified parental consent, we will take steps to delete
                            such information promptly.
                        </p>
                    </section>

                    <section id="third-party-services" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">13. Third-Party Services</h2>
                        <p className="mb-4">
                            Our website and services may contain links to third-party websites, applications, or services that are not owned
                            or controlled by Swift Solution. These websites have their own privacy policies, and we are not responsible for
                            their privacy practices or content.
                        </p>
                    </section>

                    <section id="changes-to-this-privacy-policy" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">14. Changes to This Privacy Policy</h2>
                        <p className="mb-4">
                            We may update this Privacy Policy from time to time to reflect changes in our practices, services, legal requirements,
                            or other factors. For material changes, we will provide prominent notice on our website and may send direct notifications
                            to registered users.
                        </p>
                    </section>

                    <section id="contact-information" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">15. Contact Information</h2>
                        <p className="mb-6">
                            We welcome your questions, comments, and concerns about this Privacy Policy and our privacy practices.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Privacy Officer</h3>
                                <p className="text-sm mb-2"><strong>Email:</strong> privacy@itswift.com</p>
                                <p className="text-sm mb-2"><strong>Phone:</strong> 080-23215884</p>
                                <p className="text-sm">
                                    <strong>Address:</strong> # 31, 14th Main, Agromore Layout, Atthiguppe Extn,
                                    Vijaynagar, Bangalore - 560 040 Karnataka
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">General Inquiries</h3>
                                <p className="text-sm mb-2"><strong>Email:</strong> info@itswift.com</p>
                                <p className="text-sm mb-2"><strong>Website:</strong> https://www.itswift.com</p>
                                <p className="text-sm">
                                    <strong>Grievance Officer:</strong> grievance@itswift.com<br />
                                    <em>Response within 72 hours, resolution within 30 days</em>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="jurisdiction-and-governing-law" className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">16. Jurisdiction and Governing Law</h2>
                        <p className="mb-4">
                            This Privacy Policy and any disputes arising from or relating to it shall be governed by and construed in accordance
                            with the laws of India, without regard to conflict of law principles.
                        </p>
                        <p className="mb-4">
                            The courts of Bangalore, Karnataka, India shall have exclusive jurisdiction over any disputes arising from or relating
                            to this Privacy Policy or our privacy practices.
                        </p>
                    </section>

                    <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conclusion</h2>
                        <p className="mb-4">
                            Swift Solution Pvt Ltd is committed to maintaining the highest standards of privacy protection and data security.
                            This Privacy Policy reflects our dedication to transparency, accountability, and respect for your privacy rights.
                        </p>
                        <p className="mb-4">
                            We recognize that privacy is not just a legal requirement but a fundamental aspect of trust in our professional relationships.
                            We will continue to evolve our privacy practices to meet changing legal requirements, technological developments, and your expectations.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Document Version:</strong> 1.0<br />
                            <strong>Effective Date:</strong> September 1, 2025<br />
                            <strong>Next Review Date:</strong> September 1, 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}