import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Outsourcing() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Outsourcing Learning and Development with Swift Solution</h2>
                            <p className="text-gray-600 mb-6">
                                Outsource your content development to Swift Solution and benefit from our 25 years of expertise. Our content development outsourcing services cover the entire lifecycle, including instructional design, e-learning content development, and deployment.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B38] bg-opacity-10 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-[#FF6B38] font-medium">✓</span>
                                    </span>
                                    <span>Access to specialized e-learning experts</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B38] bg-opacity-10 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-[#FF6B38] font-medium">✓</span>
                                    </span>
                                    <span>Cost-effective training development</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B38] bg-opacity-10 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-[#FF6B38] font-medium">✓</span>
                                    </span>
                                    <span>Faster time-to-market for your learning programs</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#FF6B38] bg-opacity-10 flex items-center justify-center mr-3 mt-1">
                                        <span className="text-[#FF6B38] font-medium">✓</span>
                                    </span>
                                    <span>Scalable resources to meet fluctuating demands</span>
                                </li>
                            </ul>
                            <Button asChild className="bg-[#FF6B38] hover:bg-[#ff855d]">
                                <Link href="/#contact">Learn More About Outsourcing</Link>
                            </Button>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-[#FF6B38] bg-opacity-10 rounded-lg transform rotate-3"></div>
                                <Image
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Team collaborating on e-learning development"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-lg relative z-10 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 