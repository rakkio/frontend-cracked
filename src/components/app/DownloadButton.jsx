'use client'

import { HiOutlineDownload } from 'react-icons/hi'
import { FaHeart, FaShare } from 'react-icons/fa'
import { useDownload } from '@/hooks/useDownload'

export default function DownloadButton({ 
    app, 
    className = "", 
    text = "Download App", 
    size = "md", 
    showIcon = true,
    showFavorite = true,
    showShare = true 
}) {
    const { triggerDownload } = useDownload()

    const handleDownload = () => {
        // Prepare app data for download
        const downloadData = {
            _id: app._id,
            name: app.name,
            slug: app.slug,
            downloadUrl: app.downloadLinks?.[0]?.url || app.downloadUrl,
            size: app.size,
            version: app.version
        }
        
        console.log('Triggering download for:', downloadData)
        triggerDownload(downloadData)
    }

    const handleFavorite = () => {
        // TODO: Implement favorite functionality
        console.log('Add to favorites:', app.name)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: app.name,
                text: `Check out ${app.name} - ${app.shortDescription || app.description}`,
                url: window.location.href
            }).catch(console.error)
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!')
            }).catch(() => {
                console.log('Share fallback')
            })
        }
    }

    return (
        <div className="flex-shrink-0">
            <button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
            >
                <HiOutlineDownload className="w-6 h-6" />   
                Download App
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-4">
                <button 
                    onClick={handleFavorite}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Add to favorites"
                >
                    <FaHeart className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                    onClick={handleShare}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Share app"
                >
                    <FaShare className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    )
}
