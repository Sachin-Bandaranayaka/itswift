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
            label: "Client satisfaction"
        },
        {
            value: "$2M+",
            label: "Training ROI delivered"
        }
    ]

    return (
        <section className="py-24 bg-white">
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
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl text-gray-600"
                        >
                            Delivering impactful learning solutions that drive measurable results.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
} 