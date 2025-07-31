'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaSearch, FaDownload, FaShieldAlt, FaRocket } from 'react-icons/fa'

export default function MarketplaceHero({ stats }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const router = useRouter()

    const platforms = [
        { id: 'all', label: 'All Platforms', icon: FaRocket, color: 'from-purple-600 to-pink-600', count: stats.totalApps + stats.totalApks + stats.totalIpas + stats.totalGames },
        { id: 'android', label: 'Android APKs', icon: FaAndroid, color: 'from-green-600 to-emerald-600', count: stats.totalApks },
        { id: 'ios', label: 'iOS IPAs', icon: FaApple, color: 'from-gray-600 to-slate-600', count: stats.totalIpas },
        { id: 'windows', label: 'PC Apps', icon: FaWindows, color: 'from-blue-600 to-cyan-600', count: stats.totalApps },
        { id: 'games', label: 'Games', icon: FaGamepad, color: 'from-red-600 to-orange-600', count: stats.totalGames }
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            const searchPath = activeTab === 'all' ? '/search' : `/${activeTab}`
            router.push(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    return (
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-3000"></div>
            </div>

            {/* Matrix Rain Effect */}
            <div className="absolute inset-0 opacity-10">
                <div className="matrix-rain"></div>
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="text-center mb-12">
                    {/* Main Title */}
                    <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        CRACK<span className="text-black">MARKET</span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-700 mb-4 font-mono">
                        &gt; Premium Software. <span className="text-green-600">Zero Cost.</span> All Platforms.
                    </p>
                    
                    {/* Tagline */}
                    <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
                        Your ultimate marketplace for cracked applications, modded APKs, iOS IPAs, and premium games. 
                        <span className="text-green-600 font-semibold"> No limits. No subscriptions. Just pure access.</span>
                    </p>

                    {/* Live Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <div className="bg-white/80 backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-2 shadow-lg">
                            <div className="text-orange-600 text-2xl font-bold">{formatNumber(stats.totalDownloads)}</div>
                            <div className="text-gray-600 text-sm">Downloads</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 shadow-lg">
                            <div className="text-blue-600 text-2xl font-bold">{formatNumber(stats.activeUsers)}</div>
                            <div className="text-gray-600 text-sm">Active Users</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 shadow-lg">
                            <div className="text-purple-600 text-2xl font-bold">
                            {formatNumber(stats.totalApps + stats.totalApks + stats.totalIpas + stats.totalGames)}</div>
                            <div className="text-gray-600 text-sm">Total Apps</div>
                        </div>
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => setActiveTab(platform.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300
                                ${activeTab === platform.id 
                                    ? `bg-gradient-to-r ${platform.color} text-white shadow-lg scale-105` 
                                    : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md'
                                }
                            `}
                        >
                            <platform.icon />
                            <span className="hidden sm:inline">{platform.label}</span>
                            <span className="text-xs bg-black/30 px-2 py-1 rounded-full">
                                {formatNumber(platform.count)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
                    <div className="relative bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${activeTab === 'all' ? 'all platforms' : platforms.find(p => p.id === activeTab)?.label.toLowerCase()}...`}
                            className="w-full pl-4 pr-4 py-6 text-xl bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all duration-300"
                        />
                        <button
                            type="submit"
                            className="absolute inset-y-0 right-0 mr-2 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <FaRocket />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </form>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => router.push('/apps')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        <FaWindows />
                        Browse PC Apps
                    </button>
                    <button
                        onClick={() => router.push('/apk')}
                        className="flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 text-green-600 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        <FaAndroid />
                        Browse APKs
                    </button>
                    <button
                        onClick={() => router.push('/ipa')}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        <FaApple />
                        Browse IPAs
                    </button>
                    <button
                        onClick={() => router.push('/games')}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-300 hover:scale-105 shadow-md"
                    >
                        <FaGamepad />
                        Browse Games
                    </button>
                </div>

                {/* Security Notice */}
                <div className="mt-16 max-w-2xl mx-auto">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow-lg">
                        <FaShieldAlt className="text-green-600 text-3xl mx-auto mb-3" />
                        <h3 className="text-green-700 font-bold text-lg mb-2">Secure & Verified</h3>
                        <p className="text-gray-600 text-sm">
                            All software is scanned for malware and tested for functionality. 
                            Download with confidence from our secure servers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
