'use client'

import { FaDownload, FaStar, FaEye, FaAndroid, FaApple, FaWindows, FaGamepad, FaDesktop } from 'react-icons/fa'
import Link from 'next/link'

export default function SearchResultCard({ 
    item, 
    viewMode, 
    getPlatformColors, 
    getPlatformIcon, 
    formatNumber, 
    getCategorySlug 
}) {
    const PlatformIcon = getPlatformIcon(item.type)
    const colors = getPlatformColors(item.type)

    const handleDownload = () => {
        window.open(`/${getCategorySlug(item.type)}/${item.slug}`, '_blank')
    }

    const handleView = () => {
        window.open(`/${getCategorySlug(item.type)}/${item.slug}`, '_blank')
    }

    if (viewMode === 'list') {
        return (
            <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-start gap-4">
                    {/* App Icon */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
                            <PlatformIcon className="text-xl" />
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{item.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {item.shortDescription || item.description || 'Premium software with full features unlocked'}
                                </p>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors.text} bg-gray-100`}>
                                <PlatformIcon />
                                {item.type === 'app' ? 'PC App' : 
                                 item.type === 'apk' ? 'Android APK' : 
                                 item.type === 'ipa' ? 'iOS IPA' : 
                                 item.type === 'game' ? 'PC Game' : 'App'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                                {item.rating && (
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400" />
                                        <span className="text-gray-700">{item.rating}</span>
                                    </div>
                                )}
                                {item.downloads && (
                                    <div className="text-gray-600">
                                        {formatNumber(item.downloads)} downloads
                                    </div>
                                )}
                                {item.category && (
                                    <div className="text-gray-600">
                                        {item.category.name || item.category}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/${getCategorySlug(item.type)}/${item.slug}`}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-300 flex items-center justify-center"
                                >
                                    <FaEye />
                                </Link>
                                <button
                                    onClick={handleDownload}
                                    className={`px-6 py-2 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2`}
                                >
                                    <FaDownload />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 -z-10 blur-xl`}></div>
            </div>
        )
    }

    // Grid View
    return (
        <div className="group relative">
            {/* Luxury Glow Effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.bg} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
            
            {/* Card */}
            <div className="relative bg-white border border-gray-200 rounded-2xl p-6 h-full hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                {/* Platform Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 bg-gradient-to-r ${colors.bg} rounded-full text-white text-xs font-bold flex items-center gap-1`}>
                    <PlatformIcon />
                    {item.type === 'app' ? 'PC' : 
                     item.type === 'apk' ? 'Android' : 
                     item.type === 'ipa' ? 'iOS' : 
                     item.type === 'game' ? 'Game' : 'App'}
                </div>

                {/* App Icon */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 mx-auto mb-4">
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
                        <PlatformIcon className="text-2xl" />
                    </div>
                </div>

                {/* App Info */}
                <div className="text-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.shortDescription || item.description || 'Premium software with full features unlocked'}
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
                        href={`/${getCategorySlug(item.type)}/${item.slug}`}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <FaEye />
                        View
                    </Link>
                    <button
                        onClick={handleDownload}
                        className={`flex-1 py-2 bg-gradient-to-r ${colors.bg} hover:scale-105 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                        <FaDownload />
                        Download
                    </button>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500 -z-10 blur-xl`}></div>
        </div>
    )
}
