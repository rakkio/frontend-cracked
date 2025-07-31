'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { FaStar, FaDesktop, FaAndroid, FaApple, FaGamepad, FaDownload, FaCrown, FaArrowRight } from 'react-icons/fa'
import { FiAward, FiZap } from 'react-icons/fi'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function FeaturedPageClient({ initialData }) {
    const [activeTab, setActiveTab] = useState('apps')
    const [hoveredItem, setHoveredItem] = useState(null)

    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getPlatformIcon = (platforms, type) => {
        if (type === 'apk') return <FaAndroid className="text-green-500" />
        if (type === 'ipa') return <FaApple className="text-gray-600" />
        if (type === 'game') return <FaGamepad className="text-purple-500" />
        if (!platforms || platforms.length === 0) return <FaDesktop className="text-blue-500" />
        const platform = platforms[0].toLowerCase()
        switch (platform) {
            case 'windows': return <FaDesktop className="text-blue-500" />
            case 'android': return <FaAndroid className="text-green-500" />
            case 'ios': return <FaApple className="text-gray-600" />
            case 'macos': return <FaApple className="text-gray-600" />
            default: return <FaDesktop className="text-blue-500" />
        }
    }

    const getPlatformBadge = (type) => {
        switch (type) {
            case 'apk': return { text: 'APK', color: 'bg-green-500' }
            case 'ipa': return { text: 'IPA', color: 'bg-gray-600' }
            case 'game': return { text: 'GAME', color: 'bg-purple-500' }
            default: return { text: 'APP', color: 'bg-blue-500' }
        }
    }

    const getAllItems = () => {
        const items = [
            ...initialData.apps.map(item => ({ ...item, type: 'app' })),
            ...initialData.apks.map(item => ({ ...item, type: 'apk' })),
            ...initialData.ipas.map(item => ({ ...item, type: 'ipa' })),
            ...initialData.games.map(item => ({ ...item, type: 'game' }))
        ]
        return items.sort((a, b) => (b.downloads || b.downloadCount || 0) - (a.downloads || a.downloadCount || 0))
    }

    const getFilteredItems = () => {
        const allItems = getAllItems()
        switch (activeTab) {
            case 'apps':
                return allItems.filter(item => item.type === 'app')
            case 'apks':
                return allItems.filter(item => item.type === 'apk')
            case 'ipas':
                return allItems.filter(item => item.type === 'ipa')
            case 'games':
                return allItems.filter(item => item.type === 'game')
            default:
                return allItems.filter(item => item.type === 'app')
        }
    }

    const getCategorySlug = (item) => {
        if (item.type === 'apk') return 'apk'
        if (item.type === 'ipa') return 'ipa'
        if (item.type === 'game') return 'games'
        return 'apps'
    }

    const renderCarouselSection = (title, items, type, icon, color) => {
        if (!items || items.length === 0) return null

        return (
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                                {icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                                <p className="text-gray-600 text-sm">{items.length} featured items</p>
                            </div>
                        </div>
                        <Link 
                            href={`/${type}`}
                            className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                        >
                            <span>View All</span>
                            <FaArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Swiper Carousel */}
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 }
                        }}
                        className="featured-swiper"
                    >
                        {items.map((item, index) => (
                            <SwiperSlide key={`${item.type}-${item._id || item.id}`}>
                                <Link href={`/${getCategorySlug(item)}/${item.slug}`} className="block">
                                    <div
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                        onMouseEnter={() => setHoveredItem(item._id || item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            {/* Item Image */}
                                            {item.images && item.images[0] ? (
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                    <FaDesktop className="text-4xl text-gray-400" />
                                                </div>
                                            )}
                                            
                                            {/* Featured Badge */}
                                            <div className="absolute top-3 left-3">
                                                <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                                    <FaCrown className="w-3 h-3" />
                                                    <span>FEATURED</span>
                                                </div>
                                            </div>
                                            
                                            {/* Platform Badge */}
                                            <div className="absolute top-3 right-3">
                                                <div className={`${getPlatformBadge(item.type).color} text-white px-2 py-1 rounded text-xs font-bold`}>
                                                    {getPlatformBadge(item.type).text}
                                                </div>
                                            </div>
                                            
                                            {/* Platform Icon */}
                                            <div className="absolute bottom-3 right-3">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                                                    {getPlatformIcon(item.platforms, item.type)}
                                                </div>
                                            </div>
                                            
                                            {/* Premium Badge */}
                                            {item.isPremium && (
                                                <div className="absolute bottom-3 left-3">
                                                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        PREMIUM
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Item Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors duration-300">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                                {item.shortDescription || item.description}
                                            </p>
                                            
                                            {/* Stats */}
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-1 text-gray-600">
                                                        <FaDownload className="w-3 h-3" />
                                                        <span className="font-medium">{formatNumber(item.downloads || item.downloadCount)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-yellow-600">
                                                        <FaStar className="w-3 h-3" />
                                                        <span className="font-medium">{item.rating?.toFixed(1) || '4.5'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {item.size || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Hover Effect */}
                                        {hoveredItem === (item._id || item.id) && (
                                            <div className="absolute inset-0 border-2 border-yellow-500 rounded-2xl pointer-events-none animate-pulse"></div>
                                        )}
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        )
    }

    return (
        <>
            {/* Filters Section */}
            <section className="py-8 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { id: 'apps', label: 'PC Apps', icon: FaDesktop, count: initialData.apps.length },
                                { id: 'apks', label: 'Android APKs', icon: FaAndroid, count: initialData.apks.length },
                                { id: 'ipas', label: 'iOS IPAs', icon: FaApple, count: initialData.ipas.length },
                                { id: 'games', label: 'PC Games', icon: FaGamepad, count: initialData.games.length }
                            ].map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-yellow-500 text-white shadow-lg'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        
                        {/* Featured Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <FaCrown className="w-4 h-4 text-yellow-500" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FiAward className="w-4 h-4 text-orange-500" />
                                <span>Expert Curated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PC Apps Carousel */}
            {activeTab === 'apps' && renderCarouselSection(
                'Featured PC Applications',
                initialData.apps,
                'apps',
                <FaDesktop className="text-white text-xl" />,
                'bg-gradient-to-br from-blue-500 to-blue-600'
            )}

            {/* Android APKs Carousel */}
            {activeTab === 'apks' && renderCarouselSection(
                'Featured Android APKs',
                initialData.apks,
                'apk',
                <FaAndroid className="text-white text-xl" />,
                'bg-gradient-to-br from-green-500 to-green-600'
            )}

            {/* iOS IPAs Carousel */}
            {activeTab === 'ipas' && renderCarouselSection(
                'Featured iOS Applications',
                initialData.ipas,
                'ipa',
                <FaApple className="text-white text-xl" />,
                'bg-gradient-to-br from-gray-600 to-gray-700'
            )}

            {/* PC Games Carousel */}
            {activeTab === 'games' && renderCarouselSection(
                'Featured PC Games',
                initialData.games,
                'games',
                <FaGamepad className="text-white text-xl" />,
                'bg-gradient-to-br from-purple-500 to-purple-600'
            )}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        Explore More Premium Content
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Discover thousands of premium applications across all platforms. From productivity tools to entertainment apps.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/apps"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Browse All Apps
                        </Link>
                        <Link
                            href="/apk"
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Android APKs
                        </Link>
                        <Link
                            href="/ipa"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            iOS IPAs
                        </Link>
                        <Link
                            href="/games"
                            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            PC Games
                        </Link>
                    </div>
                </div>
            </section>

            {/* Custom Swiper Styles */}
            <style jsx global>{`
                .featured-swiper .swiper-button-next,
                .featured-swiper .swiper-button-prev {
                    color: #eab308;
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .featured-swiper .swiper-button-next:hover,
                .featured-swiper .swiper-button-prev:hover {
                    background: #fefce8;
                }
                
                .featured-swiper .swiper-pagination-bullet {
                    background: #eab308;
                }
                
                .featured-swiper .swiper-pagination-bullet-active {
                    background: #ca8a04;
                }
            `}</style>
        </>
    )
} 