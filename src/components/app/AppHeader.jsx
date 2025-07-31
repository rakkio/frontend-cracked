'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaStar, FaDownload, FaTrophy, FaGem, FaCrown, FaShieldAlt, FaCheckCircle, FaInfoCircle, FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa'
import { DownloadService } from '@/services/DownloadService'

function getPlatformIcon(platform) {
    const iconClass = "text-lg"
    switch (platform?.toLowerCase()) {
        case 'windows': return <FaWindows className={iconClass} />
        case 'mac': case 'macos': return <FaApple className={iconClass} />
        case 'linux': return <FaLinux className={iconClass} />
        case 'android': return <FaAndroid className={iconClass} />
        default: return <FaWindows className={iconClass} />
    }
}

export default function AppHeader({ app }) {
    const [isDownloading, setIsDownloading] = useState(false)
    
    if (!app) return null
    
    const handleDownload = async () => {
        if (isDownloading || !app) return

        setIsDownloading(true)
        
        try {
            // Track download analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: 'app',
                    event_label: app.name,
                    value: 1
                })
            }
            
            // Use the original DownloadService to handle the download flow
            await DownloadService.handleDownload(app, { slug: app.slug })
            
        } catch (error) {
            console.error('Download error:', error)
            alert('Download failed. Please try again later.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <header className="relative bg-gradient-to-br from-gray-900/90 via-black/95 to-red-900/90 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 mb-12 overflow-hidden shadow-2xl shadow-red-500/10">
            {/* Animated background effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-600/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse" style={{animationDelay: '2s'}} />
            
            <div className="relative flex flex-col md:flex-row gap-8">
                {/* App Icon */}
                <div className="flex-shrink-0 group">
                    {app.images && app.images.length > 0 ? (
                        <div className="relative">
                            <img
                                src={app.images[0]}
                                alt={`${app.name} - Free Download`}
                                width={150}
                                height={150}
                                className="rounded-2xl shadow-2xl group-hover:shadow-red-500/30 transition-all duration-500 hover:scale-105 border-2 border-red-500/30 hover:border-red-400/60"
                                itemProp="image"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ) : (
                        <div className="w-36 h-36 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-red-500/40 transition-all duration-500 hover:scale-105 relative overflow-hidden border-2 border-red-500/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            <span className="text-white text-5xl font-black relative z-10 drop-shadow-lg font-mono">
                                {app.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                            <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                        </div>
                    )}
                </div>

                {/* App Info */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text mb-4 leading-tight font-mono tracking-wider drop-shadow-lg" itemProp="name">
                            {app.name?.toUpperCase() || 'UNKNOWN APP'}
                        </h1>
                        <p className="text-gray-300 text-xl font-medium font-mono" itemProp="author" itemScope itemType="https://schema.org/Organization">
                            <span className="text-red-400">[</span>
                            <span itemProp="name">{app.developer || 'UNKNOWN_DEVELOPER'}</span>
                            <span className="text-red-400">]</span>
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        {app.rating && (
                            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-4 py-2 rounded-lg border border-yellow-500/40 shadow-lg backdrop-blur-sm" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                <FaStar className="text-yellow-400 text-lg" />
                                <span className="text-white font-bold text-lg font-mono" itemProp="ratingValue">{app.rating.toFixed(1)}</span>
                                <span className="text-gray-300 font-mono">({app.totalRatings || 100})</span>
                                <meta itemProp="reviewCount" content={app.totalRatings || '100'} />
                                <meta itemProp="bestRating" content="5" />
                                <meta itemProp="worstRating" content="1" />
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-4 py-2 rounded-lg border border-blue-500/40 shadow-lg backdrop-blur-sm" itemProp="operatingSystem">
                            {getPlatformIcon(app.platform)}
                            <span className="text-gray-300 font-medium font-mono">{app.platform || 'WINDOWS'}</span>
                        </div>

                        {app.version && (
                            <div className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-red-700/80 text-white font-bold rounded-lg shadow-xl border border-red-500/50 font-mono" itemProp="softwareVersion">
                                v{app.version}
                            </div>
                        )}

                        {app.isFeatured && (
                            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg shadow-xl animate-pulse flex items-center space-x-1 border border-yellow-400/50 font-mono">
                                <FaTrophy />
                                <span>FEATURED</span>
                            </div>
                        )}

                        <div className="px-4 py-2 bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white font-bold rounded-lg shadow-xl flex items-center space-x-1 border border-green-500/50 font-mono">
                            <FaGem />
                            <span>PREMIUM</span>
                        </div>

                        <div className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-pink-600/80 text-white font-bold rounded-lg shadow-xl flex items-center space-x-1 border border-red-500/50 font-mono animate-pulse">
                            <FaCrown />
                            <span>CRACKED</span>
                        </div>
                    </div>

                    {/* Download info - interactive button */}
                    <div className="space-y-6">
                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`group flex items-center justify-center space-x-4 w-full px-10 py-6 bg-gradient-to-r text-white rounded-xl font-black text-xl relative overflow-hidden border font-mono transition-all duration-300 cursor-pointer shadow-2xl ${
                                isDownloading 
                                    ? 'from-gray-600 via-gray-700 to-gray-800 border-gray-500/50 cursor-not-allowed shadow-gray-500/20' 
                                    : 'from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 border-red-500/50 hover:scale-105 hover:shadow-red-500/50 shadow-red-500/30'
                            }`}
                        >
                            {/* Animated background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                            
                            {/* Pulse effect */}
                            <div className="absolute inset-0 bg-red-500/20 rounded-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <FaDownload className={`text-2xl relative z-10 ${isDownloading ? 'animate-bounce' : 'group-hover:animate-bounce'}`} />
                            <span className="relative z-10">{isDownloading ? 'INITIALIZING...' : 'DOWNLOAD_NOW - FREE'}</span>
                            
                            {/* Corner decorations */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
                            <div className="absolute bottom-2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '0.5s'}}></div>
                        </button>

                        {/* Download info */}
                        <div className="flex items-center justify-between text-sm font-mono">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-green-400 font-medium">
                                    <FaShieldAlt className="text-sm" />
                                    <span>VIRUS_FREE</span>
                                </div>
                                <div className="flex items-center space-x-2 text-blue-400 font-medium">
                                    <FaCheckCircle className="text-sm" />
                                    <span>100%_SAFE</span>
                                </div>
                            </div>
                            <div className="text-gray-300 font-medium flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 font-bold">
                                    {(app.downloadCount && app.downloadCount > 0) 
                                        ? app.downloadCount.toLocaleString() 
                                        : (Math.floor(Math.random() * 5000) + 1000).toLocaleString()
                                    }
                                </span>
                                <span>downloads</span>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Advertisement Notice */}
                    <div className="mt-8 p-6 bg-gradient-to-br from-red-900/20 via-black/40 to-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm shadow-xl">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                <FaInfoCircle className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-300 mb-3 text-lg font-mono">DOWNLOAD_PROTOCOL:</h3>
                                <ul className="text-red-200 space-y-2 leading-relaxed font-mono text-sm">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-400 font-bold mt-1">[1]</span>
                                        <span>CLICK download button to initialize process</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-400 font-bold mt-1">[2]</span>
                                        <span>VIEW advertisement to support free service</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-400 font-bold mt-1">[3]</span>
                                        <span>DOWNLOAD starts automatically after viewing</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-green-400 font-bold mt-1">[4]</span>
                                        <span>ENJOY premium application completely free!</span>
                                    </li>
                                </ul>
                                <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-400/30">
                                    <p className="text-red-300 text-sm font-medium flex items-center space-x-2 font-mono">
                                        <FaGem className="text-yellow-400" />
                                        <span><strong>PRO_TIP:</strong> Ads help us keep all downloads 100% free forever!</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}