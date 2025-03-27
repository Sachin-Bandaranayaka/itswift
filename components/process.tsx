import { Search, Lightbulb, LayoutTemplate, Upload } from "lucide-react"

export default function Process() {
    const steps = [
        {
            icon: <Search className="h-8 w-8 text-white" />,
            title: "Discovery & Consultation",
            description: "Understanding your business goals, learning challenges, and audience needs."
        },
        {
            icon: <Lightbulb className="h-8 w-8 text-white" />,
            title: "Instructional Design & Storyboarding",
            description: "Crafting impactful content using elearning templates, ensuring alignment with your brand."
        },
        {
            icon: <LayoutTemplate className="h-8 w-8 text-white" />,
            title: "Development & Testing",
            description: "Using mobile learning authoring tools, we create responsive, device-agnostic learning experiences."
        },
        {
            icon: <Upload className="h-8 w-8 text-white" />,
            title: "Deployment & Support",
            description: "Delivering ready-to-use custom e-learning solutions with continuous updates and maintenance."
        }
    ]

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Our E-Learning Development Process</h2>
                    <p className="text-lg text-gray-600">Tried, Tested, and Trusted</p>
                    <p className="mt-4 text-gray-600">
                        Our proven elearning development process ensures seamless project execution, on time and within budget.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="relative">
                        {/* Process step connector line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#FF6B38] bg-opacity-20 transform -translate-x-1/2" />

                        <div className="space-y-12 md:space-y-0">
                            {steps.map((step, index) => (
                                <div key={index} className="relative flex flex-col md:flex-row items-center">
                                    <div className={`flex items-center justify-center md:w-1/2 ${index % 2 === 0 ? 'md:justify-end md:pr-8' : 'md:order-2 md:justify-start md:pl-8'}`}>
                                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm z-10">
                                            <h3 className="text-xl font-semibold mb-2">{`Step ${index + 1}: ${step.title}`}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>

                                    <div className={`flex-shrink-0 z-10 my-4 md:my-0 ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                                        <div className="w-16 h-16 rounded-full bg-[#FF6B38] flex items-center justify-center shadow-lg">
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 