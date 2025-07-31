'use client'

import { useState, useEffect } from 'react'
import { 
    FaShieldAlt, FaLock, FaCheckCircle, FaDownload, FaVirus, 
    FaCertificate, FaUserShield, FaCloudDownloadAlt, FaExclamationTriangle 
} from 'react-icons/fa'

export default function SecurityBanner() {
    const [activeFeature, setActiveFeature] = useState(0)

    const securityFeatures = [
        {
            icon: FaShieldAlt,
            title: 'Malware Scanned',
            description: 'Every file is scanned with multiple antivirus engines before upload',
            color: 'from-green-500 to-emerald-500',
            stat: '100%'
        },
        {
            icon: FaLock,
            title: 'Secure Downloads',
            description: 'All downloads are served over HTTPS with end-to-end encryption',
            color: 'from-blue-500 to-cyan-500',
            stat: 'SSL'
        },
        {
            icon: FaCertificate,
            title: 'Verified Sources',
            description: 'Software sourced from trusted developers and verified publishers',
            color: 'from-purple-500 to-pink-500',
            stat: 'Trusted'
        },
        {
            icon: FaUserShield,
            title: 'Privacy Protected',
            description: 'No registration required, anonymous downloads, zero tracking',
            color: 'from-orange-500 to-red-500',
            stat: 'Anonymous'
        }
    ]

    const safetyTips = [
        'Always scan downloaded files with your antivirus',
        'Create system restore points before installing',
        'Download only from our official mirrors',
        'Keep your antivirus updated and active'
    ]

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % securityFeatures.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="py-20 relative overflow-hidden bg-gray-50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-blue-100/20 to-purple-100/20"></div>
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Security Banner */}
                <div className="bg-white backdrop-blur-sm border border-green-200 rounded-3xl p-8 md:p-12 mb-12 shadow-xl">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaShieldAlt className="text-white text-3xl" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            SECURE & SAFE
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Your security is our priority. Every download is thoroughly scanned, 
                            verified, and served through secure channels.
                        </p>
                    </div>

                    {/* Security Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {securityFeatures.map((feature, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveFeature(index)}
                                className={`
                                    group cursor-pointer bg-gray-50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-500 hover:scale-105
                                    ${activeFeature === index 
                                        ? 'border-green-300 bg-green-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }
                                `}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="text-white text-xl" />
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                                <div className={`inline-block px-3 py-1 bg-gradient-to-r ${feature.color} bg-opacity-10 rounded-full text-sm font-semibold text-gray-700`}>
                                    {feature.stat}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Active Feature Details */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${securityFeatures[activeFeature].color} rounded-xl flex items-center justify-center`}>
                                {(() => {
                                    const IconComponent = securityFeatures[activeFeature].icon
                                    return <IconComponent className="text-white text-2xl" />
                                })()}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-1">
                                    {securityFeatures[activeFeature].title}
                                </h4>
                                <p className="text-gray-600">
                                    {securityFeatures[activeFeature].description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                        
                {/* Safety Guidelines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Safety Tips */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaExclamationTriangle className="text-yellow-400 text-2xl" />
                            <h3 className="text-2xl font-bold text-white">Safety Guidelines</h3>
                        </div>
                        <div className="space-y-4">
                            {safetyTips.map((tip, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                    <p className="text-gray-300">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Download Stats */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaCloudDownloadAlt className="text-blue-400 text-2xl" />
                            <h3 className="text-2xl font-bold text-white">Security Stats</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Files Scanned</span>
                                <span className="text-2xl font-bold text-green-400">5M+</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Malware Detected</span>
                                <span className="text-2xl font-bold text-red-400">0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Safe Downloads</span>
                                <span className="text-2xl font-bold text-blue-400">100%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Uptime</span>
                                <span className="text-2xl font-bold text-purple-400">99.9%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Badges */}
                <div className="mt-12 text-center">
                    <h4 className="text-xl font-bold text-white mb-6">Trusted by Security Experts</h4>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                            <FaVirus className="text-red-400" />
                            <span className="text-gray-300 text-sm">VirusTotal Verified</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                            <FaShieldAlt className="text-green-400" />
                            <span className="text-gray-300 text-sm">SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                            <FaCertificate className="text-blue-400" />
                            <span className="text-gray-300 text-sm">Digitally Signed</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                            <FaUserShield className="text-purple-400" />
                            <span className="text-gray-300 text-sm">Privacy Protected</span>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
                        <h4 className="text-2xl font-bold text-white mb-4">Ready to Download Safely?</h4>
                        <p className="text-gray-300 mb-6">
                            Join millions of users who trust our secure platform for their software needs.
                        </p>
                        <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto">
                            <FaDownload />
                            Start Downloading
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
