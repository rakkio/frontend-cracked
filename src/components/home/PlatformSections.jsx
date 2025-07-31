'use client'

import { useState } from 'react'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaDownload, FaStar, FaEye, FaArrowRight } from 'react-icons/fa'

export default function PlatformSections({ apps, apks, ipas, games }) {
    const [activeSection, setActiveSection] = useState('android')

    const sections = [
        {
            id: 'android',
            title: 'Android APKs',
            subtitle: 'Modded & Premium Apps',
            icon: FaAndroid,
            color: 'green',
            data: apks,
            path: '/apk',
            description: 'Premium Android applications with unlocked features, ad-free experience, and full functionality.'
        },
        {
            id: 'ios',
            title: 'iOS IPAs',
            subtitle: 'Sideload & Tweaked',
            icon: FaApple,
            color: 'gray',
            data: ipas,
            path: '/ipa',
            description: 'Sideloadable iOS applications with enhanced features and premium unlocks for iPhone and iPad.'
        },
        {
            id: 'windows',
            title: 'PC Applications',
            subtitle: 'Full Software Suite',
            icon: FaWindows,
            color: 'blue',
            data: apps,
            path: '/apps',
            description: 'Complete Windows software collection including productivity tools, creative suites, and utilities.'
        },
        {
            id: 'games',
            title: 'Premium Games',
            subtitle: 'All Platforms',
            icon: FaGamepad,
            color: 'red',
            data: games,
            path: '/games',
            description: 'Latest games across all platforms with DLCs, mods, and premium content unlocked.'
        }
    ]

    const getColorClasses = (color) => {
        const colors = {
            green: {
                bg: 'from-green-600 to-emerald-600',
                border: 'border-green-500/30',
                text: 'text-green-400',
                glow: 'shadow-green-500/20'
            },
            gray: {
                bg: 'from-gray-600 to-slate-600',
                border: 'border-gray-500/30',
                text: 'text-gray-400',
                glow: 'shadow-gray-500/20'
            },
            blue: {
                bg: 'from-blue-600 to-cyan-600',
                border: 'border-blue-500/30',
                text: 'text-blue-400',
                glow: 'shadow-blue-500/20'
            },
            red: {
                bg: 'from-red-600 to-orange-600',
                border: 'border-red-500/30',
                text: 'text-red-400',
                glow: 'shadow-red-500/20'
            }
        }
        return colors[color] || colors.green
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const activeData = sections.find(s => s.id === activeSection)
    const colors = getColorClasses(activeData.color)

    return (
        <section className="py-20 relative bg-gray-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        PLATFORMS
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Choose your platform and discover thousands of premium applications, 
                        games, and tools - all cracked and ready to download.
                    </p>
                </div>

                {/* Platform Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {sections.map((section) => {
                        const sectionColors = getColorClasses(section.color)
                        const isActive = activeSection === section.id
                        
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`
                                    group relative flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300
                                    ${isActive 
                                        ? `bg-gradient-to-r ${sectionColors.bg} text-white shadow-lg ${sectionColors.glow} scale-105` 
                                        : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:scale-105 border border-gray-200'
                                    }
                                `}
                            >
                                <section.icon className="text-xl" />
                                <div className="text-left">
                                    <div className="font-bold">{section.title}</div>
                                    <div className="text-xs opacity-75">{section.subtitle}</div>
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-xl"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Active Section Content */}
                <div className="max-w-7xl mx-auto">
                    {/* Section Info */}
                    <div className={`bg-gradient-to-r ${colors.bg} bg-opacity-10 border ${colors.border} rounded-2xl p-8 mb-8`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${colors.bg} rounded-xl flex items-center justify-center`}>
                                <activeData.icon className="text-white text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{activeData.title}</h3>
                                <p className="text-gray-400">{activeData.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Apps Grid */}
                    {activeData.data && activeData.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {activeData.data.slice(0, 6).map((item, index) => (
                                <div 
                                    key={item._id || item.id || index}
                                    className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                                >
                                    {/* App Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                            {item.icon || item.image ? (
                                                <img 
                                                    src={item.icon || item.image} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'
                                                        e.target.nextSibling.style.display = 'flex'
                                                    }}
                                                />
                                            ) : null}
                                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400">
                                                <activeData.icon className="text-xl" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h4>
                                            <p className="text-gray-400 text-sm line-clamp-2">
                                                {item.shortDescription || item.description || 'Premium software with full features'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* App Stats */}
                                    <div className="flex items-center justify-between mb-4 text-sm">
                                        <div className="flex items-center gap-3">
                                            {item.rating && (
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-gray-300">{item.rating}</span>
                                                </div>
                                            )}
                                            {item.downloads && (
                                                <div className="text-gray-400">
                                                    {formatNumber(item.downloads)} DL
                                                </div>
                                            )}
                                        </div>
                                        {item.category && (
                                            <div className={`px-2 py-1 rounded-full text-xs ${colors.text} bg-gray-800`}>
                                                {item.category.name || item.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => window.open(`${activeData.path}/${item.slug}`, '_blank')}
                                            className={`flex-1 py-2 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
                                        >
                                            <FaDownload />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => window.open(`${activeData.path}/${item.slug}`, '_blank')}
                                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-300 flex items-center justify-center"
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${colors.bg} rounded-full flex items-center justify-center`}>
                                <activeData.icon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                            <p className="text-gray-400">
                                {activeData.title} will be available soon. Stay tuned for updates!
                            </p>
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="text-center">
                        <button
                            onClick={() => window.open(activeData.path, '_blank')}
                            className={`px-8 py-4 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto hover:shadow-lg ${colors.glow}`}
                        >
                            View All {activeData.title}
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    )
}
