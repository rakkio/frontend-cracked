'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiDownload, FiStar, FiShield, FiZap } from 'react-icons/fi'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaDesktop, FaMobile, FaCrown, FaFire, FaGem } from 'react-icons/fa'

export default function UnifiedItemCard({ item, type, className = "" }) {
    // Determine item type if not provided
    const itemType = type || detectItemType(item)
    
    // Get appropriate link based on type
    const getItemLink = () => {
        switch (itemType) {
            case 'apk': return `/apk/${item.slug}`
            case 'ipa': return `/ipa/${item.slug}`
            case 'game': return `/games/${item.slug}`
            case 'app':
            default: return `/app/${item.slug}`
        }
    }

    // Get platform icon
    const getPlatformIcon = () => {
        switch (itemType) {
            case 'apk': return <FaAndroid className="text-green-500" />
            case 'ipa': return <FaApple className="text-gray-400" />
            case 'game': return <FaGamepad className="text-purple-500" />
            case 'app':
            default: 
                if (item.platforms?.includes('Windows')) return <FaWindows className="text-blue-500" />
                if (item.platforms?.includes('Android')) return <FaAndroid className="text-green-500" />
                if (item.platforms?.includes('iOS')) return <FaApple className="text-gray-400" />
                return <FaDesktop className="text-blue-500" />
        }
    }

    // Get type badge
    const getTypeBadge = () => {
        switch (itemType) {
            case 'apk': return { text: 'APK', color: 'bg-green-500' }
            case 'ipa': return { text: 'IPA', color: 'bg-gray-500' }
            case 'game': return { text: 'GAME', color: 'bg-purple-500' }
            case 'app':
            default: return { text: 'APP', color: 'bg-blue-500' }
        }
    }

    // Format numbers
    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    // Get download count
    const getDownloadCount = () => {
        return item.downloads || item.downloadCount || 0
    }

    // Get rating
    const getRating = () => {
        return item.rating || 0
    }

    const typeBadge = getTypeBadge()

    return (
        <Link href={getItemLink()}>
            <div className={`group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
                {/* Header with image and type badge */}
                <div className="relative p-4 pb-2">
                    <div className="flex items-start gap-3">
                        {/* App Icon */}
                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                {item.icon || item.image ? (
                                    <Image
                                        src={item.icon || item.image}
                                        alt={item.name}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {item.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Platform icon overlay */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                                {getPlatformIcon()}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h3>
                                
                                {/* Type Badge */}
                                <span className={`${typeBadge.color} text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0`}>
                                    {typeBadge.text}
                                </span>
                            </div>
                            
                            {/* Category/Developer */}
                            <p className="text-gray-500 text-xs mt-1 truncate">
                                {item.category?.name || item.developer || item.publisher || 'Unknown'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats and badges */}
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <FiStar className="text-yellow-400 text-sm" />
                            <span className="text-gray-600 text-sm font-medium">
                                {getRating() > 0 ? getRating().toFixed(1) : 'New'}
                            </span>
                        </div>

                        {/* Downloads */}
                        <div className="flex items-center gap-1">
                            <FiDownload className="text-gray-400 text-sm" />
                            <span className="text-gray-600 text-sm font-medium">
                                {formatNumber(getDownloadCount())}
                            </span>
                        </div>
                    </div>

                    {/* Special badges */}
                    <div className="flex items-center gap-2 mt-3">
                        {item.isFeatured && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <FaFire className="text-xs" />
                                Featured
                            </span>
                        )}
                        {item.isPremium && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <FaCrown className="text-xs" />
                                Premium
                            </span>
                        )}
                        {item.isHot && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <FaZap className="text-xs" />
                                Hot
                            </span>
                        )}
                        
                        {/* Safe badge */}
                        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ml-auto">
                            <FiShield className="text-xs" />
                            Safe
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

// Helper function to detect item type
function detectItemType(item) {
    if (item.packageName) return 'apk'
    if (item.bundleId) return 'ipa'
    if (item.genre || item.gameMode) return 'game'
    return 'app'
}
