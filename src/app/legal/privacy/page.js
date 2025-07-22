'use client'

import Link from 'next/link'
import Head from 'next/head'
import { FaHome, FaShieldAlt, FaClock, FaEnvelope, FaDatabase, FaCookieBite } from 'react-icons/fa'

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - AppsCracked</title>
                <meta 
                    name="description" 
                    content="Privacy policy and data protection practices of AppsCracked platform." 
                />
            </Head>
            
            <div className="min-h-screen bg-gray-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-900/20 to-gray-900/20 border-b border-gray-800">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex items-center justify-center mb-6">
                            <FaShieldAlt className="text-4xl text-green-500 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Privacy Policy
                            </h1>
                        </div>
                        <p className="text-gray-400 text-center max-w-2xl mx-auto">
                            Your privacy is important to us. This policy outlines how we handle your data.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="card p-8">
                            {/* Last Updated */}
                            <div className="flex items-center text-gray-400 text-sm mb-8">
                                <FaClock className="mr-2" />
                                Last updated: {new Date().toLocaleDateString()}
                            </div>

                            {/* Privacy Content */}
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                                
                                <h3 className="text-xl font-semibold text-gray-200 mb-3 flex items-center">
                                    <FaDatabase className="mr-2 text-blue-400" />
                                    Personal Information
                                </h3>
                                <p className="text-gray-300 mb-4">
                                    When you register for an account, we may collect:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>Username and email address</li>
                                    <li>Profile information you choose to provide</li>
                                    <li>Download history and preferences</li>
                                    <li>Comments and reviews you post</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-200 mb-3">
                                    Usage Information
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    We automatically collect information about how you use our service, including:
                                    IP addresses, browser type, device information, pages visited, and interaction patterns.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                                <p className="text-gray-300 mb-4">We use collected information to:</p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>Provide and maintain our service</li>
                                    <li>Personalize your experience</li>
                                    <li>Send important notifications</li>
                                    <li>Improve our platform and features</li>
                                    <li>Detect and prevent fraud or abuse</li>
                                    <li>Comply with legal obligations</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                                    <FaCookieBite className="mr-3 text-yellow-400" />
                                    3. Cookies and Tracking
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    We use cookies and similar technologies to:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>Remember your preferences and settings</li>
                                    <li>Analyze site usage and performance</li>
                                    <li>Provide personalized content</li>
                                    <li>Enable social media features</li>
                                </ul>
                                <p className="text-gray-300 mb-6">
                                    You can control cookies through your browser settings, but this may limit 
                                    some functionality of our service.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
                                <p className="text-gray-300 mb-4">
                                    We do not sell, trade, or rent your personal information to third parties. 
                                    We may share information only in these circumstances:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>With your explicit consent</li>
                                    <li>To comply with legal requirements</li>
                                    <li>To protect our rights and safety</li>
                                    <li>In case of business transfer or merger</li>
                                    <li>With service providers who assist our operations</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                                    <p className="text-gray-300 mb-4">
                                        We implement appropriate security measures to protect your personal information:
                                    </p>
                                    <ul className="text-gray-300 list-disc pl-6">
                                        <li>SSL encryption for data transmission</li>
                                        <li>Secure server infrastructure</li>
                                        <li>Regular security audits and updates</li>
                                        <li>Limited access to personal data</li>
                                        <li>Password hashing and protection</li>
                                    </ul>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                                <p className="text-gray-300 mb-4">
                                    You have the right to:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Delete your account and data</li>
                                    <li>Export your data</li>
                                    <li>Withdraw consent for data processing</li>
                                    <li>File complaints with data protection authorities</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                                <p className="text-gray-300 mb-6">
                                    We retain your information only as long as necessary to provide our services 
                                    and comply with legal obligations. Account data is typically deleted within 
                                    30 days of account closure, unless required for legal or security purposes.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
                                <p className="text-gray-300 mb-6">
                                    Our service may contain links to third-party websites or services. We are 
                                    not responsible for their privacy practices. We encourage you to read their 
                                    privacy policies before providing any information.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">9. Children&apos;s Privacy</h2>
                                <p className="text-gray-300 mb-6">
                                    Our service is not intended for children under 13. We do not knowingly 
                                    collect personal information from children. If we discover we have collected 
                                    information from a child, we will delete it immediately.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">10. Policy Changes</h2>
                                <p className="text-gray-300 mb-6">
                                    We may update this privacy policy periodically. We will notify you of any 
                                    material changes by email or through our service. Your continued use after 
                                    changes indicates acceptance of the new policy.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                                <div className="bg-gray-800/50 rounded-lg p-6">
                                    <p className="text-gray-300 mb-4">
                                        If you have questions about this privacy policy or your personal data:
                                    </p>
                                    <div className="flex items-center text-green-400">
                                        <FaEnvelope className="mr-2" />
                                        <span>privacy@appscracked.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex justify-center">
                            <Link 
                                href="/"
                                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 
                                         text-white rounded-lg transition-colors duration-200"
                            >
                                <FaHome className="mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 