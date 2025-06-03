import Image from "next/image"

export default function ValueProposition() {
    const propositions = [
        {
            title: "Customized Learning for Your Business",
            description: "No two businesses are alike. Our custom e-learning solutions are tailored to reflect your company's culture, goals, and audience."
        },
        {
            title: "Scalable Rapid E-Learning",
            description: "When time is critical, our rapid e-learning development delivers high-quality learning—fast."
        },
        {
            title: "Microlearning Expertise",
            description: "We design microlearning modules that fit seamlessly into busy schedules while maximizing retention."
        },
        {
            title: "End-to-End Partnership",
            description: "From elearning strategy to implementation and support, we provide a full-service experience."
        },
        {
            title: "Proven Track Record",
            description: "Trusted by global organizations in healthcare, finance, technology, education, and more."
        }
    ]

    // SVG Icons inline for more control
    const icons = [
        <svg key="1" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:invert">
            <path d="M15 10H45C47.7614 10 50 12.2386 50 15V45C50 47.7614 47.7614 50 45 50H15C12.2386 50 10 47.7614 10 45V15C10 12.2386 12.2386 10 15 10Z" stroke="#FF6B38" strokeWidth="2" />
            <path d="M20 20H40V40H20V20Z" fill="#FF6B38" opacity="0.2" />
            <path d="M25 25L35 25" stroke="#FF6B38" strokeWidth="2" />
            <path d="M25 30L35 30" stroke="#FF6B38" strokeWidth="2" />
            <path d="M25 35L32 35" stroke="#FF6B38" strokeWidth="2" />
        </svg>,
        <svg key="2" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:invert">
            <path d="M30 10L45 30L30 50L15 30L30 10Z" fill="#FF6B38" opacity="0.2" />
            <path d="M30 10L45 30L30 50L15 30L30 10Z" stroke="#FF6B38" strokeWidth="2" />
            <path d="M25 30H35" stroke="#FF6B38" strokeWidth="2" />
            <path d="M30 25L30 35" stroke="#FF6B38" strokeWidth="2" />
        </svg>,
        <svg key="3" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:invert">
            <rect x="15" y="15" width="30" height="8" rx="2" fill="#FF6B38" opacity="0.2" />
            <rect x="15" y="15" width="30" height="8" rx="2" stroke="#FF6B38" strokeWidth="2" />
            <rect x="15" y="26" width="30" height="8" rx="2" fill="#FF6B38" opacity="0.2" />
            <rect x="15" y="26" width="30" height="8" rx="2" stroke="#FF6B38" strokeWidth="2" />
            <rect x="15" y="37" width="30" height="8" rx="2" fill="#FF6B38" opacity="0.2" />
            <rect x="15" y="37" width="30" height="8" rx="2" stroke="#FF6B38" strokeWidth="2" />
        </svg>,
        <svg key="4" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:invert">
            <path d="M20 30H40" stroke="#FF6B38" strokeWidth="2" />
            <path d="M15 25L20 30L15 35" stroke="#FF6B38" strokeWidth="2" />
            <path d="M45 25L40 30L45 35" stroke="#FF6B38" strokeWidth="2" />
            <rect x="15" y="15" width="30" height="30" rx="2" stroke="#FF6B38" strokeWidth="2" fill="#FF6B38" opacity="0.1" />
        </svg>,
        <svg key="5" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:invert">
            <circle cx="30" cy="30" r="15" fill="#FF6B38" opacity="0.1" stroke="#FF6B38" strokeWidth="2" />
            <path d="M25 30L28 33L35 26" stroke="#FF6B38" strokeWidth="2" />
            <path d="M30 15V20" stroke="#FF6B38" strokeWidth="2" />
            <path d="M30 40V45" stroke="#FF6B38" strokeWidth="2" />
            <path d="M15 30H20" stroke="#FF6B38" strokeWidth="2" />
            <path d="M40 30H45" stroke="#FF6B38" strokeWidth="2" />
        </svg>
    ]

    return (
        <div className="relative">
            {/* Orange section */}
            <section className="pt-16 pb-48 bg-[#FF6B38] dark:bg-[#CC5630]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4 text-white">Our Unique Value Proposition</h2>
                        <hr className="w-24 border-t-2 border-white mx-auto my-6" />

                        {/* Company description text added here */}
                        <div className="max-w-3xl mx-auto text-white text-center mt-8 mb-12 leading-relaxed">
                            <p className="mb-4">
                                For over two decades, Swift Solution has partnered with organizations worldwide to craft custom e-learning development solutions that inspire, engage, and deliver measurable results. As a pioneer in the elearning content development space, we understand the evolving needs of modern businesses and provide bespoke elearning solutions tailored to your workforce.
                            </p>
                            <p>
                                Whether you are launching your first employee elearning program or scaling an enterprise-wide corporate elearning solution, our team combines innovation, experience, and technology to help you succeed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* White section */}
            <section className="pt-40 pb-16 bg-white dark:bg-gray-900">
                {/* Empty section for spacing */}
            </section>

            {/* Cards section - now using negative margin instead of absolute positioning */}
            <div className="container mx-auto px-4 -mt-80">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
                    {propositions.map((prop, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full transform transition-transform hover:-translate-y-2 duration-300">
                            <div className="flex flex-col items-center text-center h-full">
                                <div className="pt-5 pb-3">
                                    {icons[index]}
                                </div>
                                <div className="pb-5 px-4 flex-1">
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">{prop.title}</h3>
                                    <div className="w-12 h-1 bg-[#FF6B38] mx-auto mb-3"></div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{prop.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}