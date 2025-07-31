'use client'

import { useState } from 'react'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaDownload, FaStar, FaEye, FaArrowRight, FaDesktop } from 'react-icons/fa'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function PlatformSections({ apps, apks, ipas, games }) {
    const [activeSection, setActiveSection] = useState('android')

    // Sample data for when no real data is available
    const sampleApks = [
        { name: 'Spotify Premium', slug: 'spotify-premium', image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Spotify', rating: 4.8, downloads: 15000, category: { name: 'Music' } },
        { name: 'YouTube Vanced', slug: 'youtube-vanced', image: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=YouTube', rating: 4.9, downloads: 25000, category: { name: 'Video' } },
        { name: 'Instagram Pro', slug: 'instagram-pro', image: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Instagram', rating: 4.7, downloads: 18000, category: { name: 'Social' } }
    ]

    const sampleIpas = [
        { name: 'TikTok++', slug: 'tiktok-plus', image: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=TikTok', rating: 4.6, downloads: 12000, category: { name: 'Social' } },
        { name: 'WhatsApp Plus', slug: 'whatsapp-plus', image: 'https://via.placeholder.com/200x200/25D366/FFFFFF?text=WhatsApp', rating: 4.8, downloads: 20000, category: { name: 'Communication' } },
        { name: 'Snapchat++', slug: 'snapchat-plus', image: 'https://via.placeholder.com/200x200/FFFC00/000000?text=Snapchat', rating: 4.5, downloads: 15000, category: { name: 'Social' } }
    ]

    const sampleGames = [
        { name: 'GTA V Mobile', slug: 'gta-v-mobile', image: 'https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=GTA+V', rating: 4.9, downloads: 30000, category: { name: 'Action' } },
        { name: 'Minecraft PE', slug: 'minecraft-pe', image: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Minecraft', rating: 4.7, downloads: 22000, category: { name: 'Adventure' } },
        { name: 'PUBG Mobile', slug: 'pubg-mobile', image: 'https://via.placeholder.com/200x200/FFD700/000000?text=PUBG', rating: 4.8, downloads: 35000, category: { name: 'Battle Royale' } }
    ]

    const sections = [
        {
            id: 'android',
            title: 'Android APKs',
            subtitle: 'Modded & Premium Apps',
            icon: FaAndroid,
            color: 'green',
            data: apks && apks.length > 0 ? apks : sampleApks,
            path: '/apk',
            description: 'Premium Android applications with unlocked features, ad-free experience, and full functionality.'
        },
        {
            id: 'ios',
            title: 'iOS IPAs',
            subtitle: 'Sideload & Tweaked',
            icon: FaApple,
            color: 'gray',
            data: ipas && ipas.length > 0 ? ipas : sampleIpas,
            path: '/ipa',
            description: 'Sideloadable iOS applications with enhanced features and premium unlocks for iPhone and iPad.'
        },
        {
            id: 'windows',
            title: 'PC Applications',
            subtitle: 'Full Software Suite',
            icon: FaDesktop,
            color: 'blue',
            data: apps && apps.length > 0 ? apps : [],
            path: '/apps',
            description: 'Complete Windows software collection including productivity tools, creative suites, and utilities.'
        },
        {
            id: 'games',
            title: 'Premium Games',
            subtitle: 'All Platforms',
            icon: FaGamepad,
            color: 'red',
            data: games && games.length > 0 ? games : sampleGames,
            path: '/games',
            description: 'Latest games across all platforms with DLCs, mods, and premium content unlocked.'
        }
    ]

    const getColorClasses = (color) => {
        const colors = {
            green: {
                bg: 'from-green-400 to-emerald-500',
                border: 'border-green-200/50',
                text: 'text-green-600',
                glow: 'shadow-green-400/30',
                hover: 'hover:bg-green-50/50',
                glass: 'bg-green-400/10 backdrop-blur-sm border-green-200/30'
            },
            gray: {
                bg: 'from-gray-400 to-slate-500',
                border: 'border-gray-200/50',
                text: 'text-gray-600',
                glow: 'shadow-gray-400/30',
                hover: 'hover:bg-gray-50/50',
                glass: 'bg-gray-400/10 backdrop-blur-sm border-gray-200/30'
            },
            blue: {
                bg: 'from-blue-400 to-cyan-500',
                border: 'border-blue-200/50',
                text: 'text-blue-600',
                glow: 'shadow-blue-400/30',
                hover: 'hover:bg-blue-50/50',
                glass: 'bg-blue-400/10 backdrop-blur-sm border-blue-200/30'
            },
            red: {
                bg: 'from-red-400 to-orange-500',
                border: 'border-red-200/50',
                text: 'text-red-600',
                glow: 'shadow-red-400/30',
                hover: 'hover:bg-red-50/50',
                glass: 'bg-red-400/10 backdrop-blur-sm border-red-200/30'
            }
        }
        return colors[color] || colors.green
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

    const activeData = sections.find(s => s.id === activeSection)
    const colors = getColorClasses(activeData.color)

    return (
        <section className="py-20 relative bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-400/8 to-orange-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                                    group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500
                                    ${isActive 
                                        ? `bg-gradient-to-r ${sectionColors.bg} text-white shadow-xl ${sectionColors.glow} scale-105 backdrop-blur-sm` 
                                        : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-white/90 hover:scale-105 border border-gray-200/60 shadow-lg'
                                    }
                                `}
                            >
                                <section.icon className="text-xl" />
                                <div className="text-left">
                                    <div className="font-bold">{section.title}</div>
                                    <div className="text-xs opacity-75">{section.subtitle}</div>
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-2xl"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Active Section Content */}
                <div className="max-w-7xl mx-auto">
                    {/* Section Info */}
                    <div className={`${colors.glass} rounded-3xl p-8 mb-8 shadow-xl`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${colors.bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                                <activeData.icon className="text-white text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{activeData.title}</h3>
                                <p className="text-gray-600">{activeData.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Apps Swiper */}
                    {activeData.data && activeData.data.length > 0 ? (
                        <div className="mb-8">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={24}
                                slidesPerView={1}
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                }}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 24,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}
                                className="platform-swiper"
                            >
                                {activeData.data.slice(0, 8).map((item, index) => (
                                    <SwiperSlide key={item._id || item.id || index}>
                                        <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl p-6 hover:border-gray-300/80 transition-all duration-500 hover:shadow-2xl hover:scale-105 h-full">
                                            {/* Platform Badge */}
                                            <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${colors.bg} rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg`}>
                                                <activeData.icon />
                                                {activeSection === 'android' ? 'Android' : 
                                                 activeSection === 'ios' ? 'iOS' : 
                                                 activeSection === 'windows' ? 'PC' : 'Game'}
                                            </div>

                                            {/* App Icon */}
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 mx-auto mb-4 shadow-lg">
                                                {item.image ? (
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                            e.target.nextSibling.style.display = 'flex'
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                                                    <activeData.icon className="text-2xl" />
                                                </div>
                                            </div>

                                            {/* App Info */}
                                            <div className="text-center mb-4">
                                                <h4 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{item.name}</h4>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                    {item.shortDescription || item.description || 'Premium software with full features'}
                                                </p>
                                                
                                                {/* Stats */}
                                                <div className="flex justify-center items-center gap-4 text-xs text-gray-500 mb-4">
                                                    {item.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <FaStar className="text-yellow-400" />
                                                            <span>{item.rating}</span>
                                                        </div>
                                                    )}
                                                    {item.downloads && (
                                                        <div className="flex items-center gap-1">
                                                            <FaDownload />
                                                            <span>{formatNumber(item.downloads)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Category */}
                                                {item.category && (
                                                    <div className="text-xs text-gray-500 mb-4">
                                                        {item.category.name || item.category}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/${getCategorySlug(activeSection === 'android' ? 'apk' : 
                                                                          activeSection === 'ios' ? 'ipa' : 
                                                                          activeSection === 'windows' ? 'app' : 'game')}/${item.slug}`}
                                                    className={`flex-1 py-2 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg`}
                                                >
                                                    <FaDownload />
                                                    Download
                                                </Link>
                                                <Link
                                                    href={`/${getCategorySlug(activeSection === 'android' ? 'apk' : 
                                                                          activeSection === 'ios' ? 'ipa' : 
                                                                          activeSection === 'windows' ? 'app' : 'game')}/${item.slug}`}
                                                    className="px-3 py-2 bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                                                >
                                                    <FaEye />
                                                </Link>
                                            </div>

                                            {/* Hover Glow Effect */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 -z-10 blur-xl`}></div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom Navigation */}
                            <div className="flex justify-center mt-8 gap-4">
                                <button className="swiper-button-prev !static !w-12 !h-12 !bg-white/80 !backdrop-blur-sm !border !border-gray-200/60 !rounded-full !shadow-lg hover:!bg-white/90 transition-all duration-300">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="swiper-button-next !static !w-12 !h-12 !bg-white/80 !backdrop-blur-sm !border !border-gray-200/60 !rounded-full !shadow-lg hover:!bg-white/90 transition-all duration-300">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}>
                                <activeData.icon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h3>
                            <p className="text-gray-600">
                                {activeData.title} will be available soon. Stay tuned for updates!
                            </p>
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="text-center">
                        <Link
                            href={activeData.path}
                            className={`px-8 py-4 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 mx-auto hover:shadow-xl ${colors.glow} inline-flex backdrop-blur-sm`}
                        >
                            View All {activeData.title}
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .platform-swiper .swiper-pagination-bullet {
                    background: #9CA3AF;
                    opacity: 0.5;
                }
                .platform-swiper .swiper-pagination-bullet-active {
                    background: #3B82F6;
                    opacity: 1;
                }
                .platform-swiper .swiper-button-next,
                .platform-swiper .swiper-button-prev {
                    color: #6B7280;
                }
                .platform-swiper .swiper-button-next:hover,
                .platform-swiper .swiper-button-prev:hover {
                    color: #3B82F6;
                }
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
