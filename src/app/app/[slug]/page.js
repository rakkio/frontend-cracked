'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useDownload } from '@/hooks/useDownload'
import { 
    FaDownload, 
    FaStar, 
    FaCalendar, 
    FaHdd, 
    FaWindows,
    FaAndroid,
    FaApple,
    FaLinux,
    FaSpinner,
    FaArrowLeft,
    FaShieldAlt,
    FaInfoCircle,
    FaExclamationTriangle
} from 'react-icons/fa'

export default function AppPage() {
    const params = useParams()
    const { triggerDownload } = useDownload()
    const [app, setApp] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedApps, setRelatedApps] = useState([])

    useEffect(() => {
        if (params.slug) {
            fetchApp(params.slug)
        }
    }, [params.slug])

    const fetchApp = async (slug) => {
        try {
            setLoading(true)
            const response = await api.getAppBySlug(slug)
            setApp(response.app) // Changed from response.data.app to response.app
            
            // Fetch related apps
            if (response.app.category?._id) {
                try {
                    const relatedResponse = await api.getApps({
                        category: response.app.category._id,
                        limit: 4
                    })
                    const related = relatedResponse.data.apps.filter(relatedApp => 
                        relatedApp._id !== response.app._id
                    )
                    setRelatedApps(related.slice(0, 3))
                } catch (relatedError) {
                    console.warn('Could not fetch related apps:', relatedError)
                }
            }
        } catch (error) {
            console.error('Error fetching app:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!app) return

        // Use the new advertising-enabled download system
        triggerDownload({
            _id: app._id,
            name: app.name,
            slug: app.slug,
            downloadUrl: app.downloadUrl,
            size: app.size,
            version: app.version
        })
    }

    const getPlatformIcon = (platform) => {
        switch (platform?.toLowerCase()) {
            case 'windows': return <FaWindows className="text-blue-500" />
            case 'android': return <FaAndroid className="text-green-500" />
            case 'ios': return <FaApple className="text-gray-400" />
            case 'linux': return <FaLinux className="text-yellow-500" />
            default: return <FaWindows className="text-blue-500" />
        }
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown'
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-red-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading application...</p>
                </div>
            </div>
        )
    }

    if (error || !app) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
                    <p className="text-gray-400 mb-6">
                        {error || 'The requested application could not be found.'}
                    </p>
                    <Link href="/apps" className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <FaArrowLeft />
                        <span>Back to Apps</span>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-gray-400 mb-8">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/apps" className="hover:text-white transition-colors">Apps</Link>
                    <span>/</span>
                    {app.category && (
                        <>
                            <Link href={`/category/${app.category.slug}`} className="hover:text-white transition-colors">
                                {app.category.name}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-white">{app.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* App Header */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* App Icon */}
                                <div className="flex-shrink-0">
                                    {app.icon ? (
                                        <Image
                                            src={app.icon}
                                            alt={app.name}
                                            width={128}
                                            height={128}
                                            className="rounded-xl shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-4xl font-bold">
                                                {app.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* App Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-white mb-2">{app.name}</h1>
                                    <p className="text-gray-400 mb-4">{app.developer || 'Unknown Developer'}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        {app.rating && (
                                            <div className="flex items-center space-x-1">
                                                <FaStar className="text-yellow-500" />
                                                <span className="text-white font-medium">{app.rating.toFixed(1)}</span>
                                                <span className="text-gray-400">({app.totalRatings || 0} reviews)</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-2">
                                            {getPlatformIcon(app.platform)}
                                            <span className="text-gray-400">{app.platform || 'Windows'}</span>
                                        </div>

                                        {app.version && (
                                            <div className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                                                v{app.version}
                                            </div>
                                        )}

                                        {app.isFeatured && (
                                            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm rounded-full">
                                                Featured
                                            </div>
                                        )}
                                    </div>

                                    {/* Download Button */}
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        <FaDownload />
                                        <span>Download Now</span>
                                    </button>

                                    {/* Advertisement Notice */}
                                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                        <div className="flex items-start space-x-2">
                                            <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                            <div className="text-sm text-blue-300">
                                                <p className="font-medium mb-1">Advertisement Notice</p>
                                                <p>
                                                    Before downloading, you'll view a brief advertisement to support our free service. 
                                                    This helps us maintain and improve the platform for everyone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {app.description && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                                <div 
                                    className="text-gray-300 prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: app.description.replace(/\n/g, '<br>') }}
                                />
                            </div>
                        )}

                        {/* Screenshots */}
                        {app.screenshots && app.screenshots.length > 0 && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {app.screenshots.map((screenshot, index) => (
                                        <Image
                                            key={index}
                                            src={screenshot}
                                            alt={`${app.name} screenshot ${index + 1}`}
                                            width={400}
                                            height={300}
                                            className="rounded-lg shadow-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* System Requirements */}
                        {app.systemRequirements && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-bold text-white mb-4">System Requirements</h2>
                                <div className="text-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: app.systemRequirements.replace(/\n/g, '<br>') }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* App Details */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-bold text-white mb-4">App Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Version</span>
                                    <span className="text-white">{app.version || 'Latest'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Size</span>
                                    <span className="text-white">{formatFileSize(app.size)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Downloads</span>
                                    <span className="text-white">{app.downloadCount?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Platform</span>
                                    <span className="text-white">{app.platform || 'Windows'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-white">
                                        {app.category ? (
                                            <Link href={`/category/${app.category.slug}`} className="hover:text-red-400 transition-colors">
                                                {app.category.name}
                                            </Link>
                                        ) : 'Uncategorized'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Added</span>
                                    <span className="text-white">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Safety Notice */}
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-8">
                            <div className="flex items-center space-x-3 mb-3">
                                <FaShieldAlt className="text-green-400 text-xl" />
                                <h3 className="text-lg font-bold text-green-400">Safety First</h3>
                            </div>
                            <p className="text-green-300 text-sm">
                                All downloads are scanned for viruses and malware. However, we recommend running your own antivirus scan after downloading any software.
                            </p>
                        </div>

                        {/* Related Apps */}
                        {relatedApps.length > 0 && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Related Apps</h3>
                                <div className="space-y-4">
                                    {relatedApps.map((relatedApp) => (
                                        <Link
                                            key={relatedApp._id}
                                            href={`/app/${relatedApp.slug}`}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                                        >
                                            {relatedApp.icon ? (
                                                <Image
                                                    src={relatedApp.icon}
                                                    alt={relatedApp.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">
                                                        {relatedApp.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-white truncate">{relatedApp.name}</p>
                                                <p className="text-gray-400 text-sm truncate">{relatedApp.developer}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 