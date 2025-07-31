'use client'

import Link from 'next/link'
import { FaApple, FaDownload, FaStar, FaUsers, FaShieldAlt } from 'react-icons/fa'
import { MdVerified, MdSecurity } from 'react-icons/md'

export default function IpaHeader({ stats, featuredIpas = [] }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num?.toString() || '0'
    }

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-blue-900 border-b border-blue-500/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            <div className="relative container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    {/* Main Title */}
                    <div className="flex items-center justify-center mb-4">
                        <FaApple className="text-4xl text-blue-400 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            iOS IPAs
                        </h1>
                    </div>
                    
                    <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
                        Premium iOS applications and games for iPhone and iPad. 
                        Sideload or jailbreak compatible.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 text-center">
                        <FaApple className="text-2xl text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.totalIpas)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Total IPAs</div>
                    </div>
                    
                    <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
                        <FaDownload className="text-2xl text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.totalDownloads)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Downloads</div>
                    </div>
                    
                    <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-4 text-center">
                        <FaStar className="text-2xl text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {stats?.averageRating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Avg Rating</div>
                    </div>
                    
                    <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center">
                        <FaUsers className="text-2xl text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.activeUsers)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Active Users</div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                        <MdVerified className="text-green-400 mr-2" />
                        <span className="text-sm font-mono text-green-400">Verified IPAs</span>
                    </div>
                    <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                        <MdSecurity className="text-blue-400 mr-2" />
                        <span className="text-sm font-mono text-blue-400">Malware Scanned</span>
                    </div>
                    <div className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
                        <FaShieldAlt className="text-purple-400 mr-2" />
                        <span className="text-sm font-mono text-purple-400">Safe Installation</span>
                    </div>
                </div>

                {/* Featured IPAs */}
                {featuredIpas.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                            <FaStar className="mr-2" />
                            Featured IPAs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featuredIpas.map((ipa) => (
                                <Link
                                    key={ipa._id}
                                    href={`/ipa/${ipa.slug}`}
                                    className="group bg-black/30 border border-blue-500/20 rounded-lg p-4 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    <div className="flex items-center mb-2">
                                        {ipa.icon ? (
                                            <img
                                                src={ipa.icon}
                                                alt={ipa.name}
                                                className="w-10 h-10 rounded-lg mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                                <FaApple className="text-white text-lg" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {ipa.name}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-mono">
                                                {ipa.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center">
                                            <FaStar className="text-yellow-400 mr-1" />
                                            {ipa.rating?.toFixed(1) || '0.0'}
                                        </span>
                                        <span className="flex items-center">
                                            <FaDownload className="text-green-400 mr-1" />
                                            {formatNumber(ipa.downloads)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
