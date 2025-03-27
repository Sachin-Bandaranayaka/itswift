import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function CTA() {
    const features = [
        "Custom Content Development eLearning",
        "Microlearning Modules & Strategies",
        "Outsourcing Learning and Development",
        "Interactive and Game-Based E-Learning"
    ]

    return (
        <section className="py-24 bg-[#FF6B38] bg-opacity-5">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workforce with Swift Solution?</h2>
                    <p className="text-lg text-gray-600 mb-10">
                        With 25 years of expertise in custom e-learning development, rapid e-learning, and corporate elearning solutions,
                        Swift Solution is your partner for learning transformation.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-[#FF6B38] mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-start justify-center md:justify-start">
                                <MapPin className="h-5 w-5 text-[#FF6B38] mr-3 mt-1 flex-shrink-0" />
                                <span className="text-left">
                                    # 31, 14th Main, Agromore Layout, Atthiguppe Extn, (Near to Chandra Layout Water Tank), Vijaynagar, Bangalore - 560 040 Karnataka
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <Phone className="h-5 w-5 text-[#FF6B38] mr-3 flex-shrink-0" />
                                <a href="tel:08023215884" className="hover:underline">080-23215884</a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <Mail className="h-5 w-5 text-[#FF6B38] mr-3 flex-shrink-0" />
                                <a href="mailto:swiftsol@itswift.com" className="hover:underline">swiftsol@itswift.com</a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <Globe className="h-5 w-5 text-[#FF6B38] mr-3 flex-shrink-0" />
                                <a href="http://www.itswift.com" className="text-[#FF6B38] hover:underline">www.itswift.com</a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button asChild className="bg-[#FF6B38] hover:bg-[#ff855d] px-8 py-3 text-lg">
                            <Link href="/contact">Contact Us Today</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
} 