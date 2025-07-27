'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaDownload, FaHeart, FaShare, FaStar } from 'react-icons/fa'

export default function AppPageClient({ app, relatedApps }) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const router = useRouter()

    const handleDownload = async () => {
        if (isDownloading) return

        setIsDownloading(true)
        
        try {
            // Simulate download process
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Track download analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: 'app',
                    event_label: app.name,
                    value: 1
                })
            }
            
            // You can add actual download logic here
            console.log(`Downloading ${app.name}...`)
            
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleFavorite = () => {
        setIsFavorited(!isFavorited)
        // Add to favorites logic here
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${app.name} - Free Download`,
                    text: `Download ${app.name} for free from AppsCracked`,
                    url: window.location.href
                })
            } catch (error) {
                console.log('Share cancelled or failed:', error)
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            } catch (error) {
                console.error('Failed to copy link:', error)
            }
        }
    }

    const handleRelatedAppClick = (relatedApp) => {
        router.push(`/app/${relatedApp.slug}`)
    }

    return (
        <div className="mt-8 space-y-6">
            {/* Interactive Download Section */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Download?</h3>
                        <p className="text-gray-300">Get {app.name} with all premium features unlocked</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300
                                ${isDownloading 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 hover:scale-105'
                                }
                                text-white shadow-lg
                            `}
                        >
                            <FaDownload className={isDownloading ? 'animate-bounce' : ''} />
                            {isDownloading ? 'Downloading...' : 'Download Now'}
                        </button>
                        
                        <button
                            onClick={handleFavorite}
                            className={`
                                p-3 rounded-lg transition-all duration-300 border-2
                                ${isFavorited 
                                    ? 'bg-red-600 border-red-600 text-white' 
                                    : 'border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-600'
                                }
                            `}
                            title="Add to Favorites"
                        >
                            <FaHeart />
                        </button>
                        
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-lg border-2 border-gray-600 text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                            title="Share App"
                        >
                            <FaShare />
                        </button>
                    </div>
                </div>
            </div>

            {/* Interactive Rating Section */}
            {app.rating && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Rate this App</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`
                                        text-2xl transition-colors duration-200
                                        ${star <= Math.floor(app.rating) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-600 hover:text-yellow-400'
                                        }
                                    `}
                                    onClick={() => {
                                        // Add rating logic here
                                        console.log(`Rated ${star} stars`)
                                    }}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                        <span className="text-gray-300">
                            {app.rating.toFixed(1)} ({app.reviewsCount || 0} reviews)
                        </span>
                    </div>
                </div>
            )}

            {/* Related Apps Interactive Section */}
            {relatedApps && relatedApps.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">You Might Also Like</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedApps.slice(0, 3).map((relatedApp) => (
                            <button
                                key={relatedApp._id}
                                onClick={() => handleRelatedAppClick(relatedApp)}
                                className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-300 text-left group"
                            >
                                {relatedApp.icon && (
                                    <img 
                                        src={relatedApp.icon} 
                                        alt={relatedApp.name}
                                        className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors duration-300">
                                        {relatedApp.name}
                                    </h4>
                                    <p className="text-sm text-gray-400 truncate">
                                        {relatedApp.category?.name}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
