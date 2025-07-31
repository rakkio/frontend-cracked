'use client'

import { useState } from 'react'
import { FaStar, FaDownload } from 'react-icons/fa'
import { DownloadService } from '@/services/DownloadService'

export default function FeaturedCardClient({ item, type }) {
    const [isDownloading, setIsDownloading] = useState(false)

    const formatNumber = (num) => {
        if (!num || num === 0) return '0'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const getItemUrl = () => {
        switch (type) {
            case 'apk': return `/apk/${item.slug}`
            case 'ipa': return `/ipa/${item.slug}`
            case 'game': return `/games/${item.slug}`
            default: return `/app/${item.slug}`
        }
    }

    const handleDownload = async () => {
        if (isDownloading || !item) return

        setIsDownloading(true)
        
        try {
            // Track download analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: type,
                    event_label: item.name,
                    value: 1
                })
            }
            
            // Use DownloadService to handle the download flow
            await DownloadService.handleDownload(item, { slug: item.slug })
            
        } catch (error) {
            console.error('Download error:', error)
            alert('Download failed. Please try again later.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 group">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.images && item.images[0] ? (
                        <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover"
                        />
                    ) : (
                        <span className="text-xl font-bold text-white">
                            {item.name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {item.category?.name || 'Software'} • {item.version || '1.0.0'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-yellow-400" />
                            <span>{item.rating || '4.5'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaDownload className="w-4 h-4 text-green-500" />
                            <span>{formatNumber(item.downloads || item.downloadCount || 1200)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {item.shortDescription || item.description}
            </p>
            
            <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    type === 'apk' ? 'bg-green-100 text-green-800' :
                    type === 'ipa' ? 'bg-blue-100 text-blue-800' :
                    type === 'game' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                    {type.toUpperCase()}
                </span>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`
                            flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                            ${isDownloading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                            }
                            text-white
                        `}
                    >
                        <FaDownload className={`w-3 h-3 ${isDownloading ? 'animate-bounce' : ''}`} />
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                    <a 
                        href={getItemUrl()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    >
                        Details
                    </a>
                </div>
            </div>
        </div>
    )
}
