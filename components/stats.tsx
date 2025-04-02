"use client"

import { motion } from "framer-motion"

export default function Stats() {
    const stats = [
        {
            value: "8,000+",
            label: "Learners trained"
        },
        {
            value: "97%",
            label: "Completion rate"
        },
        {
            value: "99.9%",
            label: "Uptime guarantee"
        },
        {
            value: "$2M+",
            label: "Client ROI delivered"
        }
    ]

    return (
        <section className="py-16 relative">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-bold mb-4"
                        >
                            Trusted by organizations worldwide
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-gray-600"
                        >
                            Our track record speaks for itself
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Background effect with orange tint */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-gray-50/80 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 ease-out"></div>

                                {/* Content */}
                                <div className="relative text-center p-8 rounded-2xl">
                                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
} 