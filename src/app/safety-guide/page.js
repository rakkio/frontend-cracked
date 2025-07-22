'use client'

import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaLock, FaVirus, FaDesktop } from 'react-icons/fa'

export default function SafetyGuide() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaShieldAlt className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Safety Guide
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Essential security practices for safely downloading and using cracked software. 
                        Protect your system and data with these important guidelines.
                    </p>
                </div>

                {/* Security Essentials */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <FaVirus className="text-red-500 mr-3" />
                            Antivirus Protection
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Keep Antivirus Updated</h4>
                                    <p className="text-gray-400 text-sm">Always use updated antivirus software with real-time protection enabled.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Scan All Downloads</h4>
                                    <p className="text-gray-400 text-sm">Scan every file before opening, even if it&apos;s from a trusted source.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Use Multiple Scanners</h4>
                                    <p className="text-gray-400 text-sm">Consider using online scanners like VirusTotal for additional verification.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <FaDesktop className="text-blue-500 mr-3" />
                            System Protection
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Create Restore Points</h4>
                                    <p className="text-gray-400 text-sm">Always create a system restore point before installing new software.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Backup Important Data</h4>
                                    <p className="text-gray-400 text-sm">Regular backups protect against data loss from malicious software.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                                <div>
                                    <h4 className="text-white font-medium mb-1">Use Virtual Machines</h4>
                                    <p className="text-gray-400 text-sm">Test suspicious software in isolated virtual environments first.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Signs */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-3" />
                        Red Flags to Avoid
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-red-400 font-semibold mb-3">Suspicious File Behavior</h3>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Multiple antivirus detections</li>
                                <li>• Unusual file sizes (too small or too large)</li>
                                <li>• Requests for admin rights unnecessarily</li>
                                <li>• Files with double extensions (.exe.txt)</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-red-400 font-semibold mb-3">Download Source Issues</h3>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Redirects through multiple suspicious sites</li>
                                <li>• Requires installing additional software</li>
                                <li>• Poor website design or broken English</li>
                                <li>• No user reviews or comments</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Best Practices */}
                <div className="card p-6 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FaLock className="text-green-500 mr-3" />
                        Safe Download Practices
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-white font-semibold mb-3">Before Downloading</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>✓ Check user reviews and ratings</li>
                                <li>✓ Verify file size and version</li>
                                <li>✓ Read installation instructions</li>
                                <li>✓ Check for recent uploads</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-3">During Download</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>✓ Use direct download links</li>
                                <li>✓ Avoid download managers</li>
                                <li>✓ Don&apos;t install browser extensions</li>
                                <li>✓ Watch for bundled software</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-3">After Download</h3>
                            <ul className="text-gray-400 space-y-2 text-sm">
                                <li>✓ Scan with multiple antiviruses</li>
                                <li>✓ Check digital signatures</li>
                                <li>✓ Test in isolated environment</li>
                                <li>✓ Monitor system behavior</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Emergency Actions */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FaExclamationTriangle className="text-yellow-500 mr-3" />
                        If Something Goes Wrong
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-yellow-500 font-semibold mb-3">Immediate Actions</h3>
                            <ol className="text-gray-300 space-y-2 text-sm">
                                <li>1. Disconnect from internet immediately</li>
                                <li>2. Run full system antivirus scan</li>
                                <li>3. Check for unusual system behavior</li>
                                <li>4. Review recent file modifications</li>
                            </ol>
                        </div>
                        
                        <div>
                            <h3 className="text-yellow-500 font-semibold mb-3">Recovery Steps</h3>
                            <ol className="text-gray-300 space-y-2 text-sm">
                                <li>1. Use system restore to previous point</li>
                                <li>2. Boot from antivirus rescue disk</li>
                                <li>3. Change all important passwords</li>
                                <li>4. Monitor accounts for suspicious activity</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Recommended Tools */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Recommended Security Tools</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-red-400 font-semibold mb-3">Antivirus Software</h3>
                            <ul className="text-gray-400 space-y-1 text-sm">
                                <li>• Windows Defender (Free)</li>
                                <li>• Malwarebytes (Free)</li>
                                <li>• Kaspersky</li>
                                <li>• Bitdefender</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-blue-400 font-semibold mb-3">Online Scanners</h3>
                            <ul className="text-gray-400 space-y-1 text-sm">
                                <li>• VirusTotal</li>
                                <li>• Hybrid Analysis</li>
                                <li>• Jotti Malware Scan</li>
                                <li>• MetaDefender</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-green-400 font-semibold mb-3">System Tools</h3>
                            <ul className="text-gray-400 space-y-1 text-sm">
                                <li>• Process Monitor</li>
                                <li>• Autoruns</li>
                                <li>• TCPView</li>
                                <li>• System Restore</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 