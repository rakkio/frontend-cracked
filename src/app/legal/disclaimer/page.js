'use client'

import Link from 'next/link'
import Head from 'next/head'
import { FaHome, FaExclamationTriangle, FaClock, FaEnvelope, FaShieldAlt, FaBug } from 'react-icons/fa'

export default function Disclaimer() {
    return (
        <>
            <Head>
                <title>Disclaimer - AppsCracked</title>
                <meta 
                    name="description" 
                    content="Legal disclaimer for AppsCracked platform and software distribution." 
                />
            </Head>
            
            <div className="min-h-screen bg-gray-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-900/20 to-gray-900/20 border-b border-gray-800">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex items-center justify-center mb-6">
                            <FaExclamationTriangle className="text-4xl text-yellow-500 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Disclaimer
                            </h1>
                        </div>
                        <p className="text-gray-400 text-center max-w-2xl mx-auto">
                            Important legal information regarding the use of our platform and services.
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

                            {/* Important Notice */}
                            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
                                <div className="flex items-center mb-4">
                                    <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                                    <h3 className="text-red-400 font-semibold text-lg">Important Notice</h3>
                                </div>
                                <p className="text-gray-300">
                                    This disclaimer applies to all users of AppsCracked. By accessing our platform, 
                                    you acknowledge and agree to these terms. Please read carefully before using our services.
                                </p>
                            </div>

                            {/* Disclaimer Content */}
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold text-white mb-4">1. General Disclaimer</h2>
                                <p className="text-gray-300 mb-6">
                                    The information contained on AppsCracked is for general information purposes only. 
                                    We assume no responsibility for errors or omissions in the contents of the service. 
                                    The information is provided on an &apos;as is&apos; basis with no guarantees of completeness, 
                                    accuracy, usefulness, or timeliness.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                                    <FaShieldAlt className="mr-3 text-blue-400" />
                                    2. Software Disclaimer
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    <strong className="text-yellow-400">WARNING:</strong> Software distributed through 
                                    our platform may pose risks including but not limited to:
                                </p>
                                <ul className="text-gray-300 mb-6 list-disc pl-6">
                                    <li><strong>Security Risks:</strong> Modified software may contain malware, viruses, or backdoors</li>
                                    <li><strong>Legal Risks:</strong> Using cracked software may violate copyright laws in your jurisdiction</li>
                                    <li><strong>Functionality Issues:</strong> Modified software may not work as intended or may cause system instability</li>
                                    <li><strong>No Updates:</strong> Cracked software typically cannot receive official updates or support</li>
                                    <li><strong>Data Loss:</strong> Use of unauthorized software may result in data corruption or loss</li>
                                </ul>

                                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                                    <h4 className="text-yellow-400 font-semibold mb-3">User Responsibility</h4>
                                    <p className="text-gray-300">
                                        Users are solely responsible for determining the legality of software use in 
                                        their jurisdiction and for any consequences arising from the use of downloaded software. 
                                        We strongly recommend purchasing legitimate licenses for all software.
                                    </p>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-4">3. No Warranty</h2>
                                <p className="text-gray-300 mb-6">
                                    AppsCracked provides no warranties, express or implied, regarding the software 
                                    or information provided. We disclaim all warranties including but not limited to 
                                    warranties of merchantability, fitness for a particular purpose, and non-infringement. 
                                    Software is provided &apos;as is&apos; without warranty of any kind.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                                <p className="text-gray-300 mb-6">
                                    Under no circumstances shall AppsCracked, its owners, operators, or contributors 
                                    be liable for any direct, indirect, incidental, special, consequential, or punitive 
                                    damages arising from the use or inability to use our service or any software obtained 
                                    through our platform. This includes but is not limited to damages for loss of profits, 
                                    data, or other intangible losses.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                                    <FaBug className="mr-3 text-red-400" />
                                    5. Technical Risks
                                </h2>
                                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                                    <p className="text-gray-300 mb-4">
                                        Using modified or cracked software carries inherent technical risks:
                                    </p>
                                    <ul className="text-gray-300 list-disc pl-6 space-y-2">
                                        <li><strong>System Instability:</strong> May cause crashes, freezes, or performance issues</li>
                                        <li><strong>Compatibility Issues:</strong> May not work with your operating system or other software</li>
                                        <li><strong>Security Vulnerabilities:</strong> May contain hidden malicious code</li>
                                        <li><strong>No Technical Support:</strong> Official support is not available for modified software</li>
                                        <li><strong>Update Problems:</strong> Automatic updates may break functionality</li>
                                    </ul>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-4">6. Legal Compliance</h2>
                                <p className="text-gray-300 mb-6">
                                    Users must comply with all applicable local, state, national, and international 
                                    laws and regulations. The use of copyrighted software without proper authorization 
                                    may constitute copyright infringement and may subject users to legal action. 
                                    AppsCracked does not encourage or condone illegal activity.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Content</h2>
                                <p className="text-gray-300 mb-6">
                                    Our platform may contain links to third-party websites or content. We have no 
                                    control over the content, privacy policies, or practices of third-party sites. 
                                    We are not responsible for any damages or losses related to third-party content.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">8. Age Restrictions</h2>
                                <p className="text-gray-300 mb-6">
                                    Our service is intended for adults aged 18 and over. Users under 18 should 
                                    obtain parental consent before using our platform. We are not responsible for 
                                    underage use of our services.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">9. Educational Purpose</h2>
                                <p className="text-gray-300 mb-6">
                                    Information and software provided on our platform are intended for educational 
                                    and research purposes only. Users should evaluate software in a controlled 
                                    environment before use in production systems.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Disclaimer</h2>
                                <p className="text-gray-300 mb-6">
                                    We reserve the right to modify this disclaimer at any time without prior notice. 
                                    Changes will be effective immediately upon posting. Users are responsible for 
                                    regularly reviewing this disclaimer.
                                </p>

                                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
                                <div className="bg-gray-800/50 rounded-lg p-6">
                                    <p className="text-gray-300 mb-4">
                                        If you have questions about this disclaimer or need clarification:
                                    </p>
                                    <div className="flex items-center text-yellow-400">
                                        <FaEnvelope className="mr-2" />
                                        <span>legal@appscracked.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex justify-center">
                            <Link 
                                href="/"
                                className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 
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