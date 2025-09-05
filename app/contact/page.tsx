"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
    const [formState, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: { [key: string]: string } = {}

        if (!formState.firstName) newErrors.firstName = "First name is required"
        if (!formState.email) newErrors.email = "Email is required"
        if (!formState.message) newErrors.message = "Message is required"

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true)
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formState),
                })

                if (response.ok) {
                    setIsSubmitted(true)
                    setFormState({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        company: "",
                        message: "",
                    })
                } else {
                    throw new Error('Failed to submit form')
                }
            } catch (error) {
                console.error('Error submitting form:', error)
                setErrors({ submit: 'Failed to submit form. Please try again.' })
            } finally {
                setIsSubmitting(false)
            }
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Contact Swift Solution
                        </h1>
                        <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                            Ready to transform your corporate training? Get in touch with Bangalore's leading eLearning company for a free consultation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">
                        <div className="grid md:grid-cols-2">
                            {/* Form Section */}
                            <div className="p-8 lg:p-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Get a Free Consultation
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        Fill out the form below and our team will get back to you within 24 hours to discuss your eLearning needs.
                                    </p>

                                    <AnimatePresence>
                                        {!isSubmitted ? (
                                            <motion.form
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-6"
                                                onSubmit={handleSubmit}
                                            >
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            First Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? "border-red-500" : "border-gray-300"
                                                                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                            value={formState.firstName}
                                                            onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                                                        />
                                                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            value={formState.lastName}
                                                            onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                                            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                        value={formState.email}
                                                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                    />
                                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            value={formState.phone}
                                                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Company
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                            value={formState.company}
                                                            onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Message *
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-500" : "border-gray-300"
                                                            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                                        value={formState.message}
                                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                        placeholder="Tell us about your eLearning needs..."
                                                    />
                                                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                                                </div>

                                                {errors.submit && (
                                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                        <p className="text-sm text-red-600">{errors.submit}</p>
                                                    </div>
                                                )}

                                                <div>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors duration-200"
                                                    >
                                                        {isSubmitting ? "Sending..." : "Send Message"}
                                                    </Button>
                                                </div>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center py-12"
                                            >
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
                                                <p className="text-gray-600 mb-6">
                                                    Your message has been sent successfully. Our team will get back to you within 24 hours.
                                                </p>
                                                <Button
                                                    onClick={() => setIsSubmitted(false)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                                >
                                                    Send Another Message
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 lg:p-12 text-white">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="h-full flex flex-col justify-center"
                                >
                                    <h3 className="text-3xl font-bold mb-8">Contact Information</h3>

                                    {/* Bangalore Office */}
                                    <div className="mb-10">
                                        <h4 className="text-xl font-semibold mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            India Office
                                        </h4>
                                        <div className="space-y-3 text-orange-100">
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium text-white">Swift Solution Pvt. Ltd.</p>
                                                    <p># 31, 14th Main, Agromore Layout,</p>
                                                    <p>Atthiguppe Extn, (Near To Chandra Layout Water Tank),</p>
                                                    <p>Vijaynagar, Bangalore - 560 040</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <a href="tel:08023215884" className="hover:text-white transition-colors">080-23215884</a>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <a href="mailto:swiftsol@itswift.com" className="hover:text-white transition-colors">swiftsol@itswift.com</a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Atlanta Partner */}
                                    <div>
                                        <h4 className="text-xl font-semibold mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            USA Partner
                                        </h4>
                                        <div className="space-y-3 text-orange-100">
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium text-white">Swift Solution Pvt Ltd, USA</p>
                                                    <p className="text-sm mb-1">Represented by: Sunray Corp</p>
                                                    <p>3621 Vinings Slope SE, Suite 4310</p>
                                                    <p>Atlanta, GA 30339, USA</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <div className="flex flex-col">
                                                    <a href="tel:+16785841312" className="hover:text-white transition-colors">+1 (678) 584-1312</a>
                                                    <a href="tel:+16785841525" className="hover:text-white transition-colors">+1 (678) 584-1525</a>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <a href="mailto:sunraycorp@itswift.com" className="hover:text-white transition-colors">sunraycorp@itswift.com</a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Hours */}
                                    <div className="mt-10">
                                        <h4 className="text-xl font-semibold mb-4">Business Hours</h4>
                                        <div className="space-y-2 text-orange-100">
                                            <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                                            <p>Saturday: 10:00 AM - 2:00 PM IST</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}