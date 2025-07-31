'use client'

import { useState, useEffect } from 'react'
import { FaFire, FaChartLine, FaDownload, FaStar, FaClock, FaEye, FaAndroid, FaApple, FaWindows, FaGamepad, FaDesktop } from 'react-icons/fa'
import Link from 'next/link'

export default function TrendingSection() {
    const [activeTab, setActiveTab] = useState('hot')
    const [animatedNumbers, setAnimatedNumbers] = useState({})
    const [trendingData, setTrendingData] = useState({
        hot: [],
        new: [],
        rising: []
    })
    const [loading, setLoading] = useState(true)

    // Fetch trending data from API
    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                setLoading(true)
                const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
                
                const response = await fetch(`${baseUrl}/api/v1/trending/data?limit=8`)
                const data = await response.json()

                if (data.success && data.data) {
                    // Combine all items and sort by downloads
                    const allItems = [
                        ...(data.data.apps || []).map(item => ({ ...item, type: 'app', platform: 'windows' })),
                        ...(data.data.apks || []).map(item => ({ ...item, type: 'apk', platform: 'android' })),
                        ...(data.data.ipas || []).map(item => ({ ...item, type: 'ipa', platform: 'ios' })),
                        ...(data.data.games || []).map(item => ({ ...item, type: 'game', platform: 'games' }))
                    ].sort((a, b) => (b.downloads || b.downloadCount || 0) - (a.downloads || a.downloadCount || 0))

                    // Split into different categories
                    const hot = allItems.slice(0, 4) // Top 4 by downloads
                    const newItems = allItems.filter(item => item.isNewApp || item.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).slice(0, 4)
                    const rising = allItems.filter(item => (item.downloads || 0) > 1000 && (item.rating || 0) > 4.0).slice(0, 4)

                    setTrendingData({
                        hot: hot.map((item, index) => ({
                            id: item._id || item.id,
                            name: item.name,
                            platform: item.platform,
                            icon: getPlatformIcon(item.platform),
                            color: getPlatformColor(item.platform),
                            downloads: item.downloads || item.downloadCount || 0,
                            rating: item.rating || 4.5,
                            trend: `#${index + 1}`,
                            category: item.category?.name || 'Software',
                            image: item.images?.[0] || null,
                            type: item.type,
                            slug: item.slug
                        })),
                        new: newItems.map((item, index) => ({
                            id: item._id || item.id,
                            name: item.name,
                            platform: item.platform,
                            icon: getPlatformIcon(item.platform),
                            color: getPlatformColor(item.platform),
                            downloads: item.downloads || item.downloadCount || 0,
                            rating: item.rating || 4.5,
                            trend: 'NEW',
                            category: item.category?.name || 'Software',
                            image: item.images?.[0] || null,
                            type: item.type,
                            slug: item.slug
                        })),
                        rising: rising.map((item, index) => ({
                            id: item._id || item.id,
                            name: item.name,
                            platform: item.platform,
                            icon: getPlatformIcon(item.platform),
                            color: getPlatformColor(item.platform),
                            downloads: item.downloads || item.downloadCount || 0,
                            rating: item.rating || 4.5,
                            trend: `+${Math.floor(Math.random() * 50) + 20}%`,
                            category: item.category?.name || 'Software',
                            image: item.images?.[0] || null,
                            type: item.type,
                            slug: item.slug
                        }))
                    })
                }
            } catch (error) {
                console.error('Error fetching trending data:', error)
                // Fallback to mock data if API fails
                setTrendingData({
                    hot: [],
                    new: [],
                    rising: []
                })
            } finally {
                setLoading(false)
            }
        }

        fetchTrendingData()
    }, [])

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'windows': return FaWindows
            case 'android': return FaAndroid
            case 'ios': return FaApple
            case 'games': return FaGamepad
            default: return FaDesktop
        }
    }

    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'windows': return 'blue'
            case 'android': return 'green'
            case 'ios': return 'gray'
            case 'games': return 'red'
            default: return 'blue'
        }
    }

    const tabs = [
        { id: 'hot', label: 'Hot', icon: FaFire, color: 'from-red-500 to-orange-500' },
        { id: 'new', label: 'New', icon: FaClock, color: 'from-green-500 to-emerald-500' },
        { id: 'rising', label: 'Rising', icon: FaChartLine, color: 'from-purple-500 to-pink-500' }
    ]

    const getPlatformColors = (color) => {
        const colors = {
            blue: { bg: 'from-blue-600 to-cyan-600', text: 'text-blue-400' },
            green: { bg: 'from-green-600 to-emerald-600', text: 'text-green-400' },
            gray: { bg: 'from-gray-600 to-slate-600', text: 'text-gray-400' },
            red: { bg: 'from-red-600 to-orange-600', text: 'text-red-400' }
        }
        return colors[color] || colors.blue
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getCategorySlug = (type) => {
        switch (type) {
            case 'app': return 'app'
            case 'apk': return 'apk'
            case 'ipa': return 'ipa'
            case 'game': return 'games'
            default: return 'apps'
        }
    }

    // Animate numbers on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const numbers = {}
            trendingData[activeTab].forEach(item => {
                numbers[item.id] = item.downloads
            })
            setAnimatedNumbers(numbers)
        }, 500)

        return () => clearTimeout(timer)
    }, [activeTab, trendingData])

    const currentData = trendingData[activeTab] || []
    const activeTabData = tabs.find(tab => tab.id === activeTab)

    if (loading) {
        return (
            <section className="py-20 relative overflow-hidden bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading trending content...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 relative overflow-hidden bg-white">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        TRENDING
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Discover what's hot right now. Real-time trending apps, games, and software 
                        based on downloads, ratings, and community engagement.
                    </p>
                </div>

                {/* Trending Tabs */}
                <div className="flex justify-center gap-4 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300
                                ${activeTab === tab.id 
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` 
                                    : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:scale-105'
                                }
                            `}
                        >
                            <tab.icon className="text-xl" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Trending Content */}
                <div className="max-w-6xl mx-auto">
                    {/* Active Tab Header */}
                    <div className={`bg-gradient-to-r ${activeTabData.color} bg-opacity-10 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 mb-8`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${activeTabData.color} rounded-xl flex items-center justify-center`}>
                                <activeTabData.icon className="text-white text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{activeTabData.label} Right Now</h3>
                                <p className="text-gray-400">
                                    {activeTab === 'hot' && 'Most downloaded in the last 24 hours'}
                                    {activeTab === 'new' && 'Latest additions to our collection'}
                                    {activeTab === 'rising' && 'Fastest growing downloads this week'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trending Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentData.map((item, index) => {
                            const colors = getPlatformColors(item.color)
                            const PlatformIcon = item.icon
                            
                            return (
                                <Link 
                                    key={item.id}
                                    href={`/${getCategorySlug(item.type)}/${item.slug}`}
                                    className="block"   
                                >
                                    <div 
                                        className="group bg-gray-900/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:border-gray-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Rank Badge */}
                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {activeTab === 'hot' ? `#${index + 1}` : activeTab === 'new' ? 'NEW' : '↑'}
                                        </div>

                                        {/* Trend Badge */}
                                        <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${activeTabData.color} rounded-full text-white text-xs font-bold flex items-center gap-1`}>
                                            <FaChartLine />
                                            {item.trend}
                                        </div>

                                        <div className="flex items-start gap-4">
                                            {/* App Icon */}
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400">
                                                        <PlatformIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* App Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-bold text-white text-lg truncate">{item.name}</h4>
                                                    <PlatformIcon className={`${colors.text} text-xl ml-2`} />
                                                </div>
                                                
                                                <div className="flex items-center gap-3 mb-3 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-400" />
                                                        <span className="text-gray-300">{item.rating}</span>
                                                    </div>
                                                    <div className="text-gray-400">
                                                        <FaDownload className="inline mr-1" />
                                                        {formatNumber(animatedNumbers[item.id] || 0)}
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs ${colors.text} bg-gray-800`}>
                                                        {item.category}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button className={`flex-1 py-2 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                                                        <FaDownload />
                                                        Download
                                                    </button>
                                                    <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-300 flex items-center justify-center">
                                                        <FaEye />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500 -z-10 blur-xl`}></div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Empty State */}
                    {currentData.length === 0 && (
                        <div className="text-center py-16">
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                                <FaFire className="text-6xl text-gray-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Trending Items</h3>
                                <p className="text-gray-600">Check back later for the latest trending applications.</p>
                            </div>
                        </div>
                    )}

                    {/* Trending Stats */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center">
                            <FaFire className="text-red-400 text-3xl mx-auto mb-3" />
                            <div className="text-2xl font-bold text-white mb-1">24/7</div>
                            <div className="text-gray-400">Live Updates</div>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 text-center">
                            <FaChartLine className="text-green-400 text-3xl mx-auto mb-3" />
                            <div className="text-2xl font-bold text-white mb-1">Real-time</div>
                            <div className="text-gray-400">Trend Analysis</div>
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                            <FaDownload className="text-blue-400 text-3xl mx-auto mb-3" />
                            <div className="text-2xl font-bold text-white mb-1">Instant</div>
                            <div className="text-gray-400">Downloads</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
