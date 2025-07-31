'use client'

import { FaDownload, FaStar, FaEye, FaAndroid, FaApple, FaWindows, FaGamepad } from 'react-icons/fa'

export default function SearchResultCard({ item, viewMode, colors }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getPlatformIcon = (platform) => {
        const icons = {
            apk: FaAndroid,
            ipa: FaApple,
            apps: FaWindows,
            games: FaGamepad
        }
        return icons[platform] || FaWindows
    }

    const PlatformIcon = getPlatformIcon(item.platform)

    const handleDownload = () => {
        window.open(`/${item.platform}/${item.slug}`, '_blank')
    }

    const handleView = () => {
        window.open(`/${item.platform}/${item.slug}`, '_blank')
    }

    if (viewMode === 'list') {
        return (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                    {/* App Icon */}
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
                            <PlatformIcon className="text-xl" />
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {item.shortDescription || item.description || 'Premium software with full features unlocked'}
                                </p>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors.text} bg-gray-800`}>
                                <PlatformIcon />
                                {item.platformLabel}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                                {item.rating && (
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400" />
                                        <span className="text-gray-300">{item.rating}</span>
                                    </div>
                                )}
                                {item.downloads && (
                                    <div className="text-gray-400">
                                        {formatNumber(item.downloads)} downloads
                                    </div>
                                )}
                                {item.category && (
                                    <div className="text-gray-400">
                                        {item.category.name || item.category}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleView}
                                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-300 flex items-center justify-center"
                                >
                                    <FaEye />
                                </button>
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
            </div>
        )
    }

    // Grid view
    return (
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 hover:scale-105">
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
                <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">
                    {item.name}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.shortDescription || item.description || 'Premium software with full features unlocked'}
                </p>

                {/* Stats */}
                <div className="flex justify-center items-center gap-4 mb-4 text-sm">
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
                    {item.category && (
                        <div className={`px-2 py-1 rounded-full text-xs ${colors.text} bg-gray-800`}>
                            {item.category.name || item.category}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleView}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                        <FaEye />
                    </button>
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
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500 -z-10 blur-xl`}></div>
        </div>
    )
}
