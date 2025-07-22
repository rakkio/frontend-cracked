'use client'

import Link from 'next/link'
import Head from 'next/head'
import { FaHome, FaFileContract, FaClock, FaEnvelope } from 'react-icons/fa'

export default function TermsOfService() {
    return (
        <>
            <Head>
                <title>Terms of Service - AppsCracked</title>
                <meta 
                    name="description" 
                    content="Terms and conditions for using AppsCracked platform and services." 
                />
            </Head>
            
            <div className="min-h-screen bg-gray-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-900/20 to-gray-900/20 border-b border-gray-800">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex items-center justify-center mb-6">
                            <FaFileContract className="text-4xl text-red-500 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Terms of Service
                            </h1>
                        </div>
                        <p className="text-gray-400 text-center max-w-2xl mx-auto">
                            Please read these terms carefully before using our services.
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

                            {/* Terms Content */}
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="text-gray-300 mb-6">
                                    By accessing and using AppsCracked, you accept and agree to be bound by the terms 
                                    and provision of this agreement. These Terms of Service apply to all users of the site.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
                                <p className="text-gray-300 mb-4">
                                    Permission is granted to temporarily download one copy of the materials on 
                                    AppsCracked for personal, non-commercial transitory viewing only. This is the 
                                    grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>modify or copy the materials</li>
                                    <li>use the materials for any commercial purpose or for any public display</li>
                                    <li>attempt to reverse engineer any software contained on the website</li>
                                    <li>remove any copyright or other proprietary notations from the materials</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
                                <p className="text-gray-300 mb-6">
                                    The materials on AppsCracked are provided on an &apos;as is&apos; basis. AppsCracked makes 
                                    no warranties, expressed or implied, and hereby disclaims and negates all other 
                                    warranties including without limitation, implied warranties or conditions of 
                                    merchantability, fitness for a particular purpose, or non-infringement of 
                                    intellectual property or other violation of rights.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">4. Software Distribution</h2>
                                <p className="text-gray-300 mb-6">
                                    AppsCracked provides information and links to software applications. Users are 
                                    responsible for ensuring they comply with all applicable software licenses and 
                                    copyright laws. We do not guarantee the functionality, safety, or legality of 
                                    any software provided through our platform.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>
                                <p className="text-gray-300 mb-4">Users agree to:</p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li>Use the service at their own risk</li>
                                    <li>Verify the legitimacy of all software before use</li>
                                    <li>Not use the service for illegal activities</li>
                                    <li>Respect intellectual property rights</li>
                                    <li>Use adequate security measures when downloading software</li>
                                </ul>

                                <h2 className="text-2xl font-bold text-white mb-4">6. Limitations</h2>
                                <p className="text-gray-300 mb-6">
                                    In no event shall AppsCracked or its suppliers be liable for any damages 
                                    (including, without limitation, damages for loss of data or profit, or due to 
                                    business interruption) arising out of the use or inability to use the materials 
                                    on AppsCracked, even if AppsCracked or a representative has been notified orally 
                                    or in writing of the possibility of such damage.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">7. Privacy</h2>
                                <p className="text-gray-300 mb-6">
                                    Your privacy is important to us. Please review our Privacy Policy, which also 
                                    governs your use of the website, to understand our practices.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">8. Modifications</h2>
                                <p className="text-gray-300 mb-6">
                                    AppsCracked may revise these terms of service at any time without notice. By 
                                    using this website, you are agreeing to be bound by the then current version 
                                    of these terms of service.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
                                <div className="bg-gray-800/50 rounded-lg p-6">
                                    <p className="text-gray-300 mb-4">
                                        If you have any questions about these Terms of Service, please contact us:
                                    </p>
                                    <div className="flex items-center text-red-400">
                                        <FaEnvelope className="mr-2" />
                                        <span>contact@appscracked.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex justify-center">
                            <Link 
                                href="/"
                                className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 
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