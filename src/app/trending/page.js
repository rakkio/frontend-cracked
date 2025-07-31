'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiDownload, FiStar, FiMonitor, FiHardDrive, FiShield, FiZap, FiTrendingUp, FiClock, FiEye } from 'react-icons/fi'
import { FaSkull, FaTerminal, FaFire, FaGamepad, FaDesktop, FaMobile, FaApple, FaWindows, FaAndroid } from 'react-icons/fa'
import { api } from '@/lib/api'

export default function TrendingPage() {
    const [trendingApps, setTrendingApps] = useState([])
    const [trendingGames, setTrendingGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [timeFilter, setTimeFilter] = useState('week')
    const [hoveredApp, setHoveredApp] = useState(null)

    useEffect(() => {
        fetchTrendingData()
    }, [timeFilter])

    const fetchTrendingData = async () => {
        setLoading(true)
        try {
            const [appsResponse, gamesResponse] = await Promise.all([
                fetch(`/api/v1/apps?sort=downloads&order=desc&limit=12&featured=true`),
                fetch(`/api/v1/games/popular?limit=8`)
            ])

            const appsData = await appsResponse.json()
            const gamesData = await gamesResponse.json()

            if (appsData.success) {
                setTrendingApps(appsData.data.apps || [])
            }
            if (gamesData.success) {
                setTrendingGames(gamesData.data.games || [])
            }
        } catch (error) {
            console.error('Error fetching trending data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num?.toString() || '0'
    }

    const getPlatformIcon = (platforms) => {
        if (!platforms || platforms.length === 0) return <FaDesktop className="text-blue-400" />
        const platform = platforms[0].toLowerCase()
        switch (platform) {
            case 'windows': return <FaWindows className="text-blue-400" />
            case 'android': return <FaAndroid className="text-green-400" />
            case 'ios': return <FaApple className="text-gray-300" />
            case 'macos': return <FaApple className="text-gray-300" />
            default: return <FaDesktop className="text-blue-400" />
        }
    }

    const filteredData = () => {
        switch (activeTab) {
            case 'apps':
                return trendingApps
            case 'games':
                return trendingGames
            default:
                return [...trendingApps, ...trendingGames].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {/* Loading Hero */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px',
                            animation: 'gridMove 20s linear infinite'
                        }}></div>
                    </div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
                                <span className="text-red-500">[</span>SCANNING<span className="text-red-500">]</span>
                                <br />
                                <span className="text-red-500">TRENDING APPS</span>
                            </h1>
                            <div className="flex justify-center items-center space-x-4 mb-8">
                                <FaTerminal className="text-red-500 text-2xl animate-pulse" />
                                <div className="text-green-400 font-mono text-lg">
                                    ANALYZING_DOWNLOAD_PATTERNS...
                                    <span className="animate-pulse text-red-500 ml-2">█</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="metro-tile animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                                    <div className="relative h-80">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black opacity-90"></div>
                                        <div className="absolute inset-0 scan-lines opacity-30"></div>
                                        
                                        <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center">
                                            <FaSkull className="text-4xl text-red-500 mb-4 animate-pulse" />
                                            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                                                <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-loading-bar"></div>
                                            </div>
                                            <p className="text-gray-300 font-mono text-sm text-center">
                                                LOADING_TREND_{index + 1}
                                            </p>
                                        </div>
                                        
                                        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                                        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                                        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                                        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite'
                    }}></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '0s'}}>{'<trending>'}</div>
                    <div className="absolute top-40 right-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '2s'}}>{'popular()'}</div>
                    <div className="absolute bottom-40 left-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '4s'}}>{'[hot]'}</div>
                    <div className="absolute bottom-20 right-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '6s'}}>{'</downloads>'}</div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
                            <span className="text-red-500">[</span>TRENDING<span className="text-red-500">]</span>
                            <br />
                            <span className="text-red-500">CRACKED APPS</span>
                        </h1>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">
                            Most downloaded premium applications this {timeFilter}. All apps are 100% free, fully cracked, and virus-scanned.
                        </p>
                        
                        {/* Status Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                            <div className="metro-tile-small group">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-black opacity-90"></div>
                                <div className="relative z-10 p-4 text-center">
                                    <FiShield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                    <div className="text-green-400 font-mono text-sm font-bold">VIRUS FREE</div>
                                    <div className="text-gray-300 text-xs">100% Clean</div>
                                </div>
                            </div>
                            
                            <div className="metro-tile-small group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-black opacity-90"></div>
                                <div className="relative z-10 p-4 text-center">
                                    <FiZap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <div className="text-blue-400 font-mono text-sm font-bold">INSTANT ACCESS</div>
                                    <div className="text-gray-300 text-xs">No Wait Time</div>
                                </div>
                            </div>
                            
                            <div className="metro-tile-small group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-black opacity-90"></div>
                                <div className="relative z-10 p-4 text-center">
                                    <FaFire className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                    <div className="text-purple-400 font-mono text-sm font-bold">HOT TRENDING</div>
                                    <div className="text-gray-300 text-xs">Updated Daily</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Category Tabs */}
                        <div className="flex space-x-2">
                            {[
                                { id: 'all', label: 'All Trending', icon: FiTrendingUp },
                                { id: 'apps', label: 'Apps', icon: FaDesktop },
                                { id: 'games', label: 'Games', icon: FaGamepad }
                            ].map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Time Filter */}
                        <div className="flex space-x-2">
                            {[
                                { id: 'day', label: 'Today' },
                                { id: 'week', label: 'This Week' },
                                { id: 'month', label: 'This Month' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setTimeFilter(filter.id)}
                                    className={`px-3 py-1 rounded font-mono text-xs transition-all duration-300 ${
                                        timeFilter === filter.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Apps Grid */}
            <section className="py-16 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="matrix-bg"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredData().map((app, index) => (
                            <Link 
                                key={app._id || app.id} 
                                href={`/${app.category?.slug || 'apps'}/${app.slug}`}
                                className="block"
                            >
                                <div 
                                    className="metro-tile group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                    onMouseEnter={() => setHoveredApp(app._id || app.id)}
                                    onMouseLeave={() => setHoveredApp(null)}
                                >
                                    <div className="relative h-80 overflow-hidden">
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            {app.images && app.images[0] ? (
                                                <Image
                                                    src={app.images[0]}
                                                    alt={app.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                                    <FaSkull className="text-6xl text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                                        
                                        {/* Trending Badge */}
                                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                                            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                                                <FaFire className="w-3 h-3" />
                                                <span>#{index + 1}</span>
                                            </div>
                                            {app.featured && (
                                                <div className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                    HOT
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Platform Icon */}
                                        <div className="absolute top-4 right-4">
                                            {getPlatformIcon(app.platforms)}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                                                {app.name}
                                            </h3>
                                            
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                                {app.shortDescription || app.description}
                                            </p>
                                            
                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <FiDownload className="w-3 h-3" />
                                                        <span>{formatNumber(app.downloads)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FiStar className="w-3 h-3 text-yellow-400" />
                                                        <span>{app.rating?.toFixed(1) || '4.5'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FiEye className="w-3 h-3" />
                                                        <span>{formatNumber(app.views)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-gray-500">
                                                    {app.size || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Hover Effect */}
                                        {hoveredApp === (app._id || app.id) && (
                                            <div className="absolute inset-0 border-2 border-red-500 pointer-events-none animate-pulse"></div>
                                        )}
                                        
                                        {/* Corner Brackets */}
                                        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {filteredData().length === 0 && (
                        <div className="text-center py-16">
                            <FaSkull className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Trending Apps Found</h3>
                            <p className="text-gray-400">Check back later for the latest trending applications.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-900/20 to-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="matrix-bg"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 terminal-text">
                        <span className="text-red-500">[</span>STAY UPDATED<span className="text-red-500">]</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Get notified when new trending apps are available. Never miss the hottest cracked software.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            href="/apps" 
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/25"
                        >
                            Browse All Apps
                        </Link>
                        <Link 
                            href="/games" 
                            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Games
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
