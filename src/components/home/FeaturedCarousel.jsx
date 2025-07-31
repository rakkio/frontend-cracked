'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaDownload, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function FeaturedCarousel({ apps, apks, ipas, games }) {
    const swiperRef = useRef(null)

    // Combine all featured items with platform info
    const allFeatured = [
        ...apps.map(item => ({ ...item, platform: 'apps', icon: FaWindows, color: 'blue' })),
        ...apks.map(item => ({ ...item, platform: 'apk', icon: FaAndroid, color: 'green' })),
        ...ipas.map(item => ({ ...item, platform: 'ipa', icon: FaApple, color: 'gray' })),
        ...games.map(item => ({ ...item, platform: 'games', icon: FaGamepad, color: 'red' }))
    ].slice(0, 12) // Limit to 12 items

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getPlatformColors = (color) => {
        const colors = {
            blue: { bg: 'from-blue-600 to-cyan-600', border: 'border-blue-500/30', text: 'text-blue-600' },
            green: { bg: 'from-green-600 to-emerald-600', border: 'border-green-500/30', text: 'text-green-600' },
            gray: { bg: 'from-gray-600 to-slate-600', border: 'border-gray-500/30', text: 'text-gray-600' },
            red: { bg: 'from-red-600 to-orange-600', border: 'border-red-500/30', text: 'text-red-600' }
        }
        return colors[color] || colors.blue
    }

    if (allFeatured.length === 0) {
        return null
    }

    return (
        <section className="py-20 relative overflow-hidden bg-gray-50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/50 to-transparent"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        FEATURED
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Handpicked premium software across all platforms. Updated daily with the latest releases.
                    </p>
                </div>

                {/* Custom Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 shadow-md"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 shadow-md"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper }}
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 20,
                        stretch: 0,
                        depth: 200,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={{
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !bg-green-500',
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-green-400'
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                        1280: {
                            slidesPerView: 5,
                        }
                    }}
                    className="featured-swiper"
                >
                    {allFeatured.map((item, index) => {
                        const colors = getPlatformColors(item.color)
                        const PlatformIcon = item.icon

                        return (
                            <SwiperSlide key={`${item.platform}-${item._id || item.id || index}`}>
                                <div className="group relative">
                                    {/* Card */}
                                    <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                        {/* Platform Badge */}
                                        <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r ${colors.bg} rounded-full flex items-center justify-center`}>
                                            <PlatformIcon className="text-white text-sm" />
                                        </div>

                                        {/* App Icon */}
                                        <div className="relative mb-4">
                                            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-gray-800 flex items-center justify-center">
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
                                                    <PlatformIcon className="text-2xl" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* App Info */}
                                        <div className="text-center">
                                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                                                {item.name}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {item.shortDescription || item.description || 'Premium software with full features unlocked'}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex justify-center items-center gap-4 mb-4 text-sm">
                                                {item.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-500" />
                                                        <span className="text-gray-700">{item.rating}</span>
                                                    </div>
                                                )}
                                                {item.downloads && (
                                                    <div className="text-gray-600">
                                                        {formatNumber(item.downloads)} DL
                                                    </div>
                                                )}
                                                {item.category && (
                                                    <div className={`px-2 py-1 rounded-full text-xs ${colors.text} bg-gray-100`}>
                                                        {item.category.name || item.category}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Download Button */}
                                            <button
                                                onClick={() => window.open(`/${item.platform}/${item.slug}`, '_blank')}
                                                className={`w-full py-3 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg`}
                                            >
                                                <FaDownload />
                                                Download
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500 -z-10 blur-xl`}></div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => window.open('/featured', '_blank')}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                        View All Featured
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .featured-swiper .swiper-pagination {
                    bottom: -50px !important;
                }
                
                .featured-swiper .swiper-pagination-bullet {
                    width: 12px !important;
                    height: 12px !important;
                    opacity: 0.5 !important;
                }
                
                .featured-swiper .swiper-pagination-bullet-active {
                    opacity: 1 !important;
                    transform: scale(1.3) !important;
                }
                
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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
