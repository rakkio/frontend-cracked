'use client'

import { useState, useEffect } from 'react'
import { FaFire, FaChartLine, FaDownload, FaStar, FaClock, FaEye, FaAndroid, FaApple, FaWindows, FaGamepad } from 'react-icons/fa'

export default function TrendingSection() {
    const [activeTab, setActiveTab] = useState('hot')
    const [animatedNumbers, setAnimatedNumbers] = useState({})

    // Mock trending data - in real app this would come from API
    const trendingData = {
        hot: [
            {
                id: 1,
                name: 'Adobe Photoshop 2024',
                platform: 'windows',
                icon: FaWindows,
                color: 'blue',
                downloads: 125000,
                rating: 4.8,
                trend: '+45%',
                category: 'Design',
                image: '/icons/photoshop.png'
            },
            {
                id: 2,
                name: 'Spotify Premium APK',
                platform: 'android',
                icon: FaAndroid,
                color: 'green',
                downloads: 89000,
                rating: 4.9,
                trend: '+38%',
                category: 'Music',
                image: '/icons/spotify.png'
            },
            {
                id: 3,
                name: 'Call of Duty Mobile',
                platform: 'games',
                icon: FaGamepad,
                color: 'red',
                downloads: 156000,
                rating: 4.7,
                trend: '+52%',
                category: 'Action',
                image: '/icons/cod.png'
            },
            {
                id: 4,
                name: 'Instagram++ IPA',
                platform: 'ios',
                icon: FaApple,
                color: 'gray',
                downloads: 67000,
                rating: 4.6,
                trend: '+29%',
                category: 'Social',
                image: '/icons/instagram.png'
            }
        ],
        new: [
            {
                id: 5,
                name: 'Microsoft Office 2024',
                platform: 'windows',
                icon: FaWindows,
                color: 'blue',
                downloads: 45000,
                rating: 4.9,
                trend: 'NEW',
                category: 'Productivity',
                image: '/icons/office.png'
            },
            {
                id: 6,
                name: 'TikTok Pro APK',
                platform: 'android',
                icon: FaAndroid,
                color: 'green',
                downloads: 78000,
                rating: 4.5,
                trend: 'NEW',
                category: 'Social',
                image: '/icons/tiktok.png'
            }
        ],
        rising: [
            {
                id: 7,
                name: 'Final Cut Pro',
                platform: 'windows',
                icon: FaWindows,
                color: 'blue',
                downloads: 34000,
                rating: 4.8,
                trend: '+125%',
                category: 'Video',
                image: '/icons/finalcut.png'
            },
            {
                id: 8,
                name: 'Among Us Mod',
                platform: 'games',
                icon: FaGamepad,
                color: 'red',
                downloads: 92000,
                rating: 4.4,
                trend: '+89%',
                category: 'Casual',
                image: '/icons/amongus.png'
            }
        ]
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
    }, [activeTab])

    const currentData = trendingData[activeTab] || []
    const activeTabData = tabs.find(tab => tab.id === activeTab)

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
                                <div 
                                    key={item.id}
                                    className="group bg-gray-900/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:border-gray-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Rank Badge */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        #{index + 1}
                                    </div>

                                    {/* Trend Badge */}
                                    <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${activeTabData.color} rounded-full text-white text-xs font-bold flex items-center gap-1`}>
                                        <FaChartLine />
                                        {item.trend}
                                    </div>

                                    <div className="flex items-start gap-4">
                                        {/* App Icon */}
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400">
                                                {item.images && item.images.length > 0 && (
                                                    <img src={item.images[0]} alt={item.name} className="w-12 h-12" />
                                                )}  
                                            </div>
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
                            )
                        })}
                    </div>

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
