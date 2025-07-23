'use client'

import { useState, useEffect } from 'react'
import { FaEnvelope, FaPaperPlane, FaDiscord, FaTelegram, FaReddit, FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaClock, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa'

// SEO Structured Data Generator
const generateContactStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/contact#webpage`,
                "url": `${baseUrl}/contact`,
                "name": "Contact Us - Get Support for Premium Apps | AppsCracked",
                "description": "Get help with downloads, report issues, or request apps. Contact AppsCracked support team for assistance with premium cracked applications and software.",
                "breadcrumb": {
                    "@id": `${baseUrl}/contact#breadcrumb`
                },
                "inLanguage": "en-US",
                "isPartOf": {
                    "@id": `${baseUrl}#website`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/contact#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Contact",
                        "item": `${baseUrl}/contact`
                    }
                ]
            },
            {
                "@type": "ContactPage",
                "name": "AppsCracked Support Center",
                "description": "Contact our support team for help with app downloads, technical issues, and software requests",
                "url": `${baseUrl}/contact`,
                "mainEntity": {
                    "@type": "Organization",
                    "name": "AppsCracked",
                    "url": baseUrl,
                    "contactPoint": [
                        {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "availableLanguage": ["English", "Spanish"],
                            "areaServed": "Worldwide"
                        }
                    ]
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How quickly do you respond to support requests?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We typically respond to general questions within 24-48 hours, technical issues within 1-3 days, and broken links within 12-24 hours."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can you help with installation issues?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, we provide installation help and technical support for all applications available on our platform."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you take software requests?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Absolutely! We welcome software requests and regularly add new applications based on user demand."
                        }
                    }
                ]
            }
        ]
    }
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Insert structured data on component mount
    useEffect(() => {
        const structuredData = generateContactStructuredData()
        
        // Remove existing structured data
        const existingScript = document.querySelector('script[data-contact-structured="true"]')
        if (existingScript) {
            existingScript.remove()
        }
        
        // Add new structured data
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-contact-structured', 'true')
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
    }, [])

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
        <>
            {/* SEO Meta Tags */}
            <title>Contact Support - Get Help with Premium Apps | AppsCracked</title>
            <meta name="description" content="Contact AppsCracked support team for help with downloads, technical issues, broken links, and software requests. Fast response times and expert assistance." />
            <meta name="keywords" content="contact support, app help, download issues, technical support, software request, broken links, installation help, AppsCracked support" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href="https://appscracked.com/contact" />
            
            {/* Open Graph */}
            <meta property="og:title" content="Contact Support - Get Help with Premium Apps | AppsCracked" />
            <meta property="og:description" content="Contact our support team for help with app downloads, technical issues, and software requests. Fast response times and expert assistance." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://appscracked.com/contact" />
            <meta property="og:image" content="https://appscracked.com/og-contact.jpg" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Contact Support - Get Help with Premium Apps | AppsCracked" />
            <meta name="twitter:description" content="Get expert help with downloads, technical issues, and software requests from our support team." />
            <meta name="twitter:image" content="https://appscracked.com/twitter-contact.jpg" />

            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800" itemScope itemType="https://schema.org/ContactPage">
                {/* Enhanced Header */}
                <section className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-red-900/20">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    
                    <div className="container mx-auto relative z-10 max-w-6xl">
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center mb-8">
                                <div className="relative group">
                                    <FaEnvelope className="text-6xl text-red-500 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                                </div>
                            </div>
                            
                            <header className="space-y-6">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight" itemProp="name">
                                    <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                                        CONTACT SUPPORT
                                    </span>
                        </h1>
                                
                                <h2 className="text-2xl md:text-4xl text-gray-300 font-medium leading-relaxed max-w-4xl mx-auto" itemProp="description">
                                    Get expert help with downloads, technical issues, broken links, and software requests. 
                                    Our support team is here to assist you 24/7.
                                </h2>

                                {/* Trust Indicators */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto">
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaClock className="text-3xl text-blue-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block">24-48h</span>
                                        <span className="text-gray-400 text-sm">Response Time</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaShieldAlt className="text-3xl text-green-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block">Expert</span>
                                        <span className="text-gray-400 text-sm">Support Team</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaQuestionCircle className="text-3xl text-yellow-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block">All Issues</span>
                                        <span className="text-gray-400 text-sm">We Help With</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaEnvelope className="text-3xl text-purple-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block">Multiple</span>
                                        <span className="text-gray-400 text-sm">Contact Ways</span>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                        {/* Enhanced Contact Form */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-3xl font-black text-white mb-8 flex items-center space-x-3">
                                <FaPaperPlane className="text-red-400" />
                                <span>Send us a Message</span>
                            </h2>
                        
                        {isSubmitted ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                                    <div className="text-green-500 text-5xl mb-6">✓</div>
                                    <h3 className="text-green-400 font-bold text-xl mb-4">Message Sent Successfully!</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Thank you for contacting us. We'll get back to you within 24-48 hours with expert assistance.
                                </p>
                            </div>
                        ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                            <label className="block text-gray-300 font-bold mb-3 text-lg">
                                                Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                                className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg transition-all duration-300"
                                                placeholder="Enter your full name"
                                        />
                                    </div>
                                    
                                    <div>
                                            <label className="block text-gray-300 font-bold mb-3 text-lg">
                                                Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                                className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg transition-all duration-300"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                        <label className="block text-gray-300 font-bold mb-3 text-lg">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                            className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg transition-all duration-300"
                                    >
                                        <option value="">Select a subject</option>
                                            <option value="broken-link">🔗 Broken Download Link</option>
                                            <option value="installation-help">🛠️ Installation Help</option>
                                            <option value="software-request">📱 Software Request</option>
                                            <option value="technical-issue">⚙️ Technical Issue</option>
                                            <option value="account-support">👤 Account Support</option>
                                            <option value="general-question">❓ General Question</option>
                                            <option value="bug-report">🐛 Bug Report</option>
                                            <option value="other">📋 Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                        <label className="block text-gray-300 font-bold mb-3 text-lg">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                            className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 resize-none text-lg transition-all duration-300"
                                            placeholder="Describe your issue or question in detail. Include app names, error messages, or specific problems you're experiencing..."
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-xl hover:shadow-red-500/25 hover:scale-105 disabled:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                Sending Message...
                                        </>
                                    ) : (
                                        <>
                                                <FaPaperPlane className="mr-3" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                        {/* Enhanced Contact Information */}
                    <div className="space-y-8">
                        {/* Response Times */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                                    <FaClock className="text-blue-400" />
                                    <span>Response Times</span>
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-600/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-gray-300 font-medium">General Questions:</span>
                                        </div>
                                        <span className="text-green-400 font-bold">24-48 hours</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-600/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span className="text-gray-300 font-medium">Technical Issues:</span>
                                        </div>
                                        <span className="text-yellow-400 font-bold">1-3 days</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-600/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-gray-300 font-medium">Broken Links:</span>
                                        </div>
                                        <span className="text-green-400 font-bold">12-24 hours</span>
                                </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-600/30">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span className="text-gray-300 font-medium">Software Requests:</span>
                                </div>
                                        <span className="text-blue-400 font-bold">2-7 days</span>
                                </div>
                            </div>
                        </div>

                        {/* Community Channels */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                                    <FaDiscord className="text-indigo-500" />
                                    <span>Community & Quick Help</span>
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl hover:bg-indigo-900/30 transition-colors cursor-pointer group">
                                        <FaDiscord className="text-indigo-400 text-2xl mr-4 group-hover:scale-110 transition-transform" />
                                    <div>
                                            <div className="text-white font-bold text-lg">Discord Server</div>
                                            <div className="text-gray-300 text-sm">Join our community for instant help and discussions</div>
                                            <div className="text-indigo-300 text-xs">🟢 Always Active • 10K+ Members</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl hover:bg-blue-900/30 transition-colors cursor-pointer group">
                                        <FaTelegram className="text-blue-400 text-2xl mr-4 group-hover:scale-110 transition-transform" />
                                        <div>
                                            <div className="text-white font-bold text-lg">Telegram Channel</div>
                                            <div className="text-gray-300 text-sm">Get updates, announcements, and quick support</div>
                                            <div className="text-blue-300 text-xs">📢 Daily Updates • 15K+ Subscribers</div>
                                    </div>
                                </div>
                                
                                    <div className="flex items-center p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl hover:bg-orange-900/30 transition-colors cursor-pointer group">
                                        <FaReddit className="text-orange-400 text-2xl mr-4 group-hover:scale-110 transition-transform" />
                                    <div>
                                            <div className="text-white font-bold text-lg">Reddit Community</div>
                                            <div className="text-gray-300 text-sm">Discuss apps, share experiences, and get peer support</div>
                                            <div className="text-orange-300 text-xs">💬 Active Community • 25K+ Members</div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                
                            {/* Important Notice */}
                            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-3xl p-8 shadow-xl">
                                <div className="flex items-start space-x-4">
                                    <FaExclamationTriangle className="text-yellow-400 text-2xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-yellow-300 font-bold text-xl mb-4">Important Guidelines</h3>
                                        <ul className="text-gray-300 space-y-3 leading-relaxed">
                                            <li className="flex items-start space-x-2">
                                                <span className="text-yellow-400 font-bold mt-1">•</span>
                                                <span>We don't provide direct download links via email for security reasons</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="text-yellow-400 font-bold mt-1">•</span>
                                                <span>Always download applications from our official website only</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="text-yellow-400 font-bold mt-1">•</span>
                                                <span>We provide educational information, use software responsibly</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <span className="text-yellow-400 font-bold mt-1">•</span>
                                                <span>Include specific app names and error details in your message</span>
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>

                            {/* FAQ Link */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 text-center shadow-xl">
                                <FaQuestionCircle className="text-5xl text-purple-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-white mb-4">Quick Answers</h3>
                                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                                    Many common questions about downloads, installation, and troubleshooting 
                                    are already answered in our comprehensive FAQ section.
                                </p>
                                <a
                                    href="/faq"
                                    className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                                >
                                    Check FAQ Section
                                </a>
                                </div>
                            </div>
                        </div>

                    {/* Contact Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="text-3xl font-black text-green-400">98%</div>
                            <div className="text-gray-300 font-medium">Issue Resolution</div>
                            <div className="text-gray-500 text-sm">Success Rate</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="text-3xl font-black text-blue-400">24h</div>
                            <div className="text-gray-300 font-medium">Average Response</div>
                            <div className="text-gray-500 text-sm">Support Time</div>
                                </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="text-3xl font-black text-purple-400">50K+</div>
                            <div className="text-gray-300 font-medium">Users Helped</div>
                            <div className="text-gray-500 text-sm">This Year</div>
                            </div>
                        <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="text-3xl font-black text-yellow-400">24/7</div>
                            <div className="text-gray-300 font-medium">Community</div>
                            <div className="text-gray-500 text-sm">Support</div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-red-600/10 to-orange-600/10 border-t border-red-500/20">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Need Immediate Help?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join our active community for instant support or browse our knowledge base
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/faq"
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Browse FAQ
                            </a>
                            <a
                                href="/apps"
                                className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300"
                            >
                                Browse Apps
                            </a>
                    </div>
                </div>
            </section>
            </main>
        </>
    )
} 