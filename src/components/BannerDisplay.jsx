'use client'
import { useState, useEffect, useRef } from 'react'
import { usePublicBanners } from '@/hooks/useBanners'
import { api } from '@/lib/api'
import Link from 'next/link'
import { FaPlay, FaPause, FaExternalLinkAlt, FaEye } from 'react-icons/fa'

/**
 * Hero Banner Carousel Component
 * Displays rotating banners in hero position
 */
export const HeroBanner = ({ autoplay = true, interval = 5000 }) => {
    const { heroBanners, loading, error, fetchHeroBanners, trackImpression, trackClick } = usePublicBanners()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(autoplay)
    const [hasLoaded, setHasLoaded] = useState(false)
    const trackedImpressions = useRef(new Set())

    // Load banners only once
    useEffect(() => {
        if (!hasLoaded) {
            fetchHeroBanners(5)
            setHasLoaded(true)
        }
    }, [hasLoaded])

    // Track impressions when banners are viewed (avoid duplicate tracking)
    useEffect(() => {
        if (heroBanners.length > 0) {
            const currentBanner = heroBanners[currentSlide]
            if (currentBanner && !trackedImpressions.current.has(currentBanner._id)) {
                trackImpression(currentBanner._id)
                trackedImpressions.current.add(currentBanner._id)
            }
        }
    }, [currentSlide, heroBanners])

    // Auto-slide functionality
    useEffect(() => {
        if (!isPlaying || heroBanners.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroBanners.length)
        }, interval)

        return () => clearInterval(timer)
    }, [isPlaying, heroBanners.length, interval])

    const handleBannerClick = async (banner) => {
        await trackClick(banner._id)
        
        if (banner.actionType === 'link' && banner.actionValue) {
            window.open(banner.actionValue, '_blank')
        }
    }

    const handleSlideChange = (index) => {
        setCurrentSlide(index)
    }

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev)
    }

    if (loading) {
        return (
            <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 space-y-4">
                    <div className="h-8 w-64 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-96 bg-gray-700 rounded animate-pulse" />
                    <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        )
    }

    if (error || !heroBanners.length) {
        return null
    }

    const currentBanner = heroBanners[currentSlide]

    return (
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden group">
            {/* Background Media */}
            <div className="absolute inset-0">
                {currentBanner.mediaType === 'video' ? (
                    <video
                        src={currentBanner.mediaUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        poster={currentBanner.thumbnailUrl}
                    />
                ) : (
                    <img
                        src={currentBanner.mediaUrl}
                        alt={currentBanner.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {currentBanner.title}
                    </h1>
                    
                    {currentBanner.description && (
                        <p className="text-lg text-gray-200 mb-6 leading-relaxed max-w-xl">
                            {currentBanner.description}
                        </p>
                    )}
                    
                    {currentBanner.actionType !== 'none' && currentBanner.actionValue && (
                        <button
                            onClick={() => handleBannerClick(currentBanner)}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            {currentBanner.buttonText || 'Learn More'}
                            <FaExternalLinkAlt className="text-sm" />
                        </button>
                    )}
                </div>
            </div>

            {/* Controls */}
            {heroBanners.length > 1 && (
                <>
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlayPause}
                        className="absolute top-4 right-4 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 right-8 flex space-x-2">
                        {heroBanners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlideChange(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                                title={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    {isPlaying && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                                style={{
                                    width: `${((Date.now() % interval) / interval) * 100}%`
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

/**
 * Featured Banner Section
 * Displays featured banners in a grid layout
 */
export const FeaturedBanners = ({ limit = 3 }) => {
    const { featuredBanners, loading, error, fetchFeaturedBanners, trackImpression, trackClick } = usePublicBanners()
    const [hasLoaded, setHasLoaded] = useState(false)
    const [currentLimit, setCurrentLimit] = useState(limit)
    const trackedImpressions = useRef(new Set())

    // Load featured banners only when limit changes or first load
    useEffect(() => {
        if (!hasLoaded || currentLimit !== limit) {
            fetchFeaturedBanners(limit)
            setCurrentLimit(limit)
            setHasLoaded(true)
        }
    }, [limit, hasLoaded, currentLimit])

    // Track impressions when banners are loaded (avoid duplicate tracking)
    useEffect(() => {
        featuredBanners.forEach(banner => {
            if (!trackedImpressions.current.has(banner._id)) {
                trackImpression(banner._id)
                trackedImpressions.current.add(banner._id)
            }
        })
    }, [featuredBanners])

    const handleBannerClick = async (banner) => {
        await trackClick(banner._id)
        
        if (banner.actionType === 'link' && banner.actionValue) {
            window.open(banner.actionValue, '_blank')
        } else if (banner.actionType === 'app' && banner.actionValue) {
            window.location.href = `/app/${banner.actionValue}`
        } else if (banner.actionType === 'category' && banner.actionValue) {
            window.location.href = `/category/${banner.actionValue}`
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: limit }).map((_, index) => (
                    <div key={index} className="relative h-48 bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 space-y-2">
                            <div className="h-4 w-32 bg-gray-700 rounded" />
                            <div className="h-3 w-20 bg-gray-700 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error || !featuredBanners.length) {
        return null
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaEye className="text-purple-400" />
                Featured Promotions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBanners.map((banner) => (
                    <div
                        key={banner._id}
                        className="relative h-48 rounded-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        onClick={() => handleBannerClick(banner)}
                    >
                        {/* Background */}
                        {banner.mediaType === 'video' ? (
                            <video
                                src={banner.mediaUrl}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                poster={banner.thumbnailUrl}
                            />
                        ) : (
                            <img
                                src={banner.getDisplayUrl ? banner.getDisplayUrl(true) : (banner.thumbnailUrl || banner.mediaUrl)}
                                alt={banner.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                                {banner.title}
                            </h3>
                            
                            {banner.buttonText && (
                                <span className="text-sm text-purple-300 font-medium">
                                    {banner.buttonText}
                                </span>
                            )}
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Banner by Position Component
 * Generic component for displaying banners in specific positions
 */
export const BannerByPosition = ({ position, limit = 3, className = "" }) => {
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(position)
    const [currentLimit, setCurrentLimit] = useState(limit)
    const { trackImpression, trackClick } = usePublicBanners()
    const trackedImpressions = useRef(new Set())

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true)
                const response = await api.getBannersByPosition(position, { limit })
                setBanners(response.data || [])
                
                // Track impressions (avoid duplicates)
                response.data?.forEach(banner => {
                    if (!trackedImpressions.current.has(banner._id)) {
                        trackImpression(banner._id)
                        trackedImpressions.current.add(banner._id)
                    }
                })
            } catch (error) {
                console.error(`Error fetching ${position} banners:`, error)
                setBanners([])
            } finally {
                setLoading(false)
            }
        }

        // Only fetch if position or limit changed, or first load
        if (!hasLoaded || currentPosition !== position || currentLimit !== limit) {
            fetchBanners()
            setCurrentPosition(position)
            setCurrentLimit(limit)
            setHasLoaded(true)
        }
    }, [position, limit, hasLoaded, currentPosition, currentLimit])

    const handleBannerClick = async (banner) => {
        await trackClick(banner._id)
        
        if (banner.actionType === 'link' && banner.actionValue) {
            window.open(banner.actionValue, '_blank')
        } else if (banner.actionType === 'app' && banner.actionValue) {
            window.location.href = `/app/${banner.actionValue}`
        } else if (banner.actionType === 'category' && banner.actionValue) {
            window.location.href = `/category/${banner.actionValue}`
        }
    }

    if (loading || !banners.length) {
        return null
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {banners.map((banner) => (
                <div
                    key={banner._id}
                    className="relative rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => handleBannerClick(banner)}
                >
                    {banner.mediaType === 'video' ? (
                        <video
                            src={banner.mediaUrl}
                            className="w-full h-auto object-cover"
                            muted
                            poster={banner.thumbnailUrl}
                        />
                    ) : (
                        <img
                            src={banner.mediaUrl}
                            alt={banner.title}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-semibold">{banner.title}</h3>
                        {banner.description && (
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{banner.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default { HeroBanner, FeaturedBanners, BannerByPosition } 