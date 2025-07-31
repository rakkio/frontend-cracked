'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaDownload, FaHeart, FaShare, FaStar, FaAndroid, FaShieldAlt, FaInfoCircle, FaLock, FaCog, FaUsers, FaCalendarAlt, FaFileAlt } from 'react-icons/fa'
import { DownloadService } from '@/services/DownloadService'
import Image from 'next/image'

export default function ApkPageClient({ apk, relatedApks }) {
    console.log('ApkPageClient received data:', { apk, relatedApks })
    
    const [isDownloading, setIsDownloading] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const router = useRouter()

    const handleDownload = async () => {
        if (isDownloading || !apk) return

        setIsDownloading(true)
        
        try {
            // Track download analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    event_category: 'apk',
                    event_label: apk.name,
                    value: 1
                })
            }
            
            // Use the original DownloadService to handle the download flow
            await DownloadService.handleDownload(apk, { slug: apk.slug })
            
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
                    title: `${apk.name} APK - Free Download`,
                    text: `Download ${apk.name} APK for free from CrackMarket`,
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

    const handleRelatedApkClick = (relatedApk) => {
        router.push(`/apk/${relatedApk.slug}`)
    }

    // Early return if no APK data
    if (!apk) {
        return (
            <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                <h2 className="text-xl font-bold text-red-400 mb-2">APK Not Found</h2>
                <p className="text-gray-300">The requested APK could not be loaded.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section with APK Info */}
            <div className="bg-gradient-to-br from-green-900/30 via-slate-800/50 to-blue-900/30 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* APK Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center shadow-2xl">
                            {apk.images && apk.images[0] ? (
                                <Image
                                    src={apk.images[0]}
                                    alt={apk.name}
                                    width={128}
                                    height={128}
                                    className="rounded-2xl object-cover"
                                />
                            ) : (
                                <FaAndroid className="text-6xl text-white" />
                            )}
                        </div>
                    </div>
                    
                    {/* APK Details */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{apk.name}</h1>
                                <p className="text-green-400 font-semibold mb-1">{apk.category?.name || 'Android APK'}</p>
                                <p className="text-gray-400 text-sm">Package: {apk.packageName || 'com.example.app'}</p>
                            </div>
                            
                            {/* Rating */}
                            {apk.rating && (
                                <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= Math.floor(apk.rating) ? 'text-yellow-400' : 'text-gray-600'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-300">{apk.rating.toFixed(1)} ({apk.reviewsCount || 0} reviews)</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Short Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {apk.shortDescription || apk.description?.substring(0, 200) + '...' || 'Professional Android application with premium features unlocked.'}
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-green-900/30 rounded-lg p-3 text-center">
                                <FaDownload className="text-green-400 text-xl mx-auto mb-1" />
                                <p className="text-sm text-gray-300">Downloads</p>
                                <p className="text-white font-bold">{apk.downloadCount?.toLocaleString() || '1,000+'}</p>
                            </div>
                            <div className="bg-blue-900/30 rounded-lg p-3 text-center">
                                <FaAndroid className="text-blue-400 text-xl mx-auto mb-1" />
                                <p className="text-sm text-gray-300">Version</p>
                                <p className="text-white font-bold">{apk.version || '1.0.0'}</p>
                            </div>
                            <div className="bg-purple-900/30 rounded-lg p-3 text-center">
                                <FaShieldAlt className="text-purple-400 text-xl mx-auto mb-1" />
                                <p className="text-sm text-gray-300">Size</p>
                                <p className="text-white font-bold">{apk.size || '6.8 MB'}</p>
                            </div>
                            <div className="bg-orange-900/30 rounded-lg p-3 text-center">
                                <FaCalendarAlt className="text-orange-400 text-xl mx-auto mb-1" />
                                <p className="text-sm text-gray-300">Updated</p>
                                <p className="text-white font-bold">{apk.updatedAt ? new Date(apk.updatedAt).toLocaleDateString() : 'Recent'}</p>
                            </div>
                        </div>
                        
                        {/* Download Button */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`
                                    flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex-1 justify-center
                                    ${isDownloading 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                                    }
                                    text-white
                                `}
                            >
                                <FaDownload className={isDownloading ? 'animate-bounce' : ''} />
                                {isDownloading ? 'Downloading...' : 'Download APK'}
                            </button>
                            
                            <button
                                onClick={handleFavorite}
                                className={`
                                    p-4 rounded-xl transition-all duration-300 border-2
                                    ${isFavorited 
                                        ? 'bg-red-600 border-red-600 text-white' 
                                        : 'border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-600'
                                    }
                                `}
                                title="Add to Favorites"
                            >
                                <FaHeart className="text-xl" />
                            </button>
                            
                            <button
                                onClick={handleShare}
                                className="p-4 rounded-xl border-2 border-gray-600 text-gray-400 hover:border-green-600 hover:text-green-600 transition-all duration-300"
                                title="Share APK"
                            >
                                <FaShare className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/40 rounded-xl mb-8">
                <div className="flex overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
                        { id: 'permissions', label: 'Permissions', icon: FaShieldAlt },
                        { id: 'features', label: 'Mod Features', icon: FaLock },
                        { id: 'requirements', label: 'Requirements', icon: FaCog }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap
                                ${activeTab === tab.id 
                                    ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20' 
                                    : 'text-gray-400 hover:text-green-400'
                                }
                            `}
                        >
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/40 rounded-xl p-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaFileAlt className="text-green-400" />
                                Description
                            </h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {apk.description || 'This is a premium Android application with advanced features and capabilities. Download and enjoy all the premium features unlocked for free.'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Screenshots */}
                        {apk.images && apk.images.length > 1 && (
                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">Screenshots</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {apk.images.slice(1).map((image, index) => (
                                        <div key={index} className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Screenshot ${index + 1}`}
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* What's New */}
                        {apk.changelog && (
                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">What's New</h4>
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <p className="text-gray-300">{apk.changelog}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'permissions' && (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaShieldAlt className="text-green-400" />
                            Required Permissions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(apk.permissions || [
                                'INTERNET',
                                'WRITE_EXTERNAL_STORAGE',
                                'READ_EXTERNAL_STORAGE',
                                'ACCESS_NETWORK_STATE',
                                'CHANGE_CONFIGURATION',
                                'ACCESS_SUPERUSER',
                                'RECEIVE_BOOT_COMPLETED'
                            ]).map((permission, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                    <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-300 font-medium">{permission}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-300 text-sm">
                                <strong>Note:</strong> These permissions are required for the app to function properly. All permissions are safe and necessary for the app's features.
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'features' && (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaLock className="text-green-400" />
                            Mod Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(apk.modFeatures || [
                                'Premium Unlocked',
                                'Root Access Enabled',
                                'Ad-Free Experience',
                                'Advanced Tools Unlocked'
                            ]).map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
                                    <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
                                    <span className="text-white font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <p className="text-green-300 text-sm">
                                <strong>Premium Features:</strong> This modded version includes all premium features unlocked, giving you access to the full functionality without any limitations.
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'requirements' && (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaCog className="text-green-400" />
                            System Requirements
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">Android Version</span>
                                        <span className="text-green-400 font-bold">{apk.minAndroidVersion || '5.0'}+</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">Architecture</span>
                                        <span className="text-green-400 font-bold">{apk.architecture || 'arm64-v8a'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">Size</span>
                                        <span className="text-green-400 font-bold">{apk.size || '6.8 MB'}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">RAM Required</span>
                                        <span className="text-green-400 font-bold">1 GB+</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">Storage</span>
                                        <span className="text-green-400 font-bold">50 MB+</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                                        <span className="text-gray-300">Internet</span>
                                        <span className="text-green-400 font-bold">Required</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Installation Instructions */}
                            <div className="mt-8">
                                <h4 className="text-xl font-bold text-white mb-4">Installation Instructions</h4>
                                <div className="space-y-3">
                                    {[
                                        'Download the APK file from the link above',
                                        'Enable "Unknown Sources" in your device settings',
                                        'Open the downloaded APK file',
                                        'Follow the installation prompts',
                                        'Launch the app and enjoy premium features'
                                    ].map((step, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg">
                                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <span className="text-gray-300">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related APKs Section */}
            {relatedApks && relatedApks.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/40 rounded-xl p-8 mt-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaUsers className="text-green-400" />
                        You Might Also Like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedApks.slice(0, 6).map((relatedApk) => (
                            <button
                                key={relatedApk._id}
                                onClick={() => handleRelatedApkClick(relatedApk)}
                                className="group bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-green-500/50 rounded-xl p-4 transition-all duration-300 text-left hover:scale-105"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {relatedApk.images && relatedApk.images[0] ? (
                                            <Image
                                                src={relatedApk.images[0]}
                                                alt={relatedApk.name}
                                                width={64}
                                                height={64}
                                                className="rounded-xl object-cover"
                                            />
                                        ) : (
                                            <FaAndroid className="text-2xl text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white group-hover:text-green-400 transition-colors duration-300 truncate">
                                            {relatedApk.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 truncate">
                                            {relatedApk.category?.name || 'Android APK'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-green-400 font-semibold">
                                        {relatedApk.downloadCount?.toLocaleString() || '1K+'} downloads
                                    </span>
                                    <span className="text-gray-400">
                                        {relatedApk.size || '5MB'}
                                    </span>
                                </div>
                                
                                {relatedApk.rating && (
                                    <div className="flex items-center gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`text-xs ${
                                                    star <= Math.floor(relatedApk.rating) 
                                                        ? 'text-yellow-400' 
                                                        : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1">
                                            {relatedApk.rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
