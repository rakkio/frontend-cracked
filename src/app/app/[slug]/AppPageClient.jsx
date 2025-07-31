'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaDownload, FaHeart, FaShare, FaStar } from 'react-icons/fa'
import { DownloadService } from '@/services/DownloadService'

export default function AppPageClient({ app, relatedApps }) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const router = useRouter()

    const handleDownload = async () => {
        if (isDownloading || !app) return

        setIsDownloading(true)
        
        try {
            // Track download analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: 'app',
                    event_label: app.name,
                    value: 1
                })
            }
            
            // Use the original DownloadService to handle the download flow
            await DownloadService.handleDownload(app, { slug: app.slug })
            
        } catch (error) {
            console.error('Download error:', error)
            alert('Download failed. Please try again later.')
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
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

                    
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


        </div>
    )
}
