'use client'

import { useState } from 'react'
import { FaEnvelope, FaPaperPlane, FaDiscord, FaTelegram, FaReddit, FaExclamationTriangle } from 'react-icons/fa'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 2000)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaEnvelope className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Contact Us
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions, suggestions, or need help? We&apos;re here to assist you. 
                        Choose your preferred way to get in touch with our support team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                        
                        {isSubmitted ? (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                                <div className="text-green-500 text-4xl mb-4">✓</div>
                                <h3 className="text-green-400 font-semibold mb-2">Message Sent Successfully!</h3>
                                <p className="text-gray-300">
                                    Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-300 font-medium mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="broken-link">Broken Download Link</option>
                                        <option value="installation-help">Installation Help</option>
                                        <option value="software-request">Software Request</option>
                                        <option value="technical-issue">Technical Issue</option>
                                        <option value="general-question">General Question</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                        placeholder="Describe your issue or question in detail..."
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Response Times */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Response Times</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">General Questions:</span>
                                    <span className="text-green-400">24-48 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Technical Issues:</span>
                                    <span className="text-yellow-400">1-3 days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Broken Links:</span>
                                    <span className="text-green-400">12-24 hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Community Channels */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Community & Support</h3>
                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                                    <FaDiscord className="text-indigo-500 text-xl mr-3" />
                                    <div>
                                        <div className="text-white font-medium">Discord Server</div>
                                        <div className="text-gray-400 text-sm">Join our community for quick help</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                                    <FaTelegram className="text-blue-500 text-xl mr-3" />
                                    <div>
                                        <div className="text-white font-medium">Telegram Channel</div>
                                        <div className="text-gray-400 text-sm">Get updates and announcements</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-gray-700/30 rounded-lg">
                                    <FaReddit className="text-orange-500 text-xl mr-3" />
                                    <div>
                                        <div className="text-white font-medium">Reddit Community</div>
                                        <div className="text-gray-400 text-sm">Discuss and share experiences</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                            <div className="flex items-start">
                                <FaExclamationTriangle className="text-yellow-500 text-xl mr-3 mt-1" />
                                <div>
                                    <h3 className="text-yellow-500 font-semibold mb-2">Important Notice</h3>
                                    <ul className="text-gray-300 text-sm space-y-1">
                                        <li>• We don&apos;t provide direct download links via email</li>
                                        <li>• Always download from our official website</li>
                                        <li>• We don&apos;t support illegal distribution of software</li>
                                        <li>• Use cracked software at your own risk</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Link */}
                        <div className="card p-6 text-center">
                            <h3 className="text-xl font-bold text-white mb-3">Quick Answers</h3>
                            <p className="text-gray-400 mb-4">
                                Many common questions are already answered in our FAQ section.
                            </p>
                            <a
                                href="/faq"
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                            >
                                Check FAQ
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 