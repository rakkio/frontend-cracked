'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { api } from '@/lib/api'
import { 
    FaDownload, 
    FaStar, 
    FaEye, 
    FaCalendar, 
    FaCode, 
    FaShieldAlt, 
    FaUser, 
    FaTag, 
    FaFire, 
    FaCrown, 
    FaSpinner,
    FaArrowLeft,
    FaWindows,
    FaApple,
    FaLinux,
    FaAndroid,
    FaExternalLinkAlt
} from 'react-icons/fa'

export default function AppPage() {
    const [app, setApp] = useState(null)
    const [loading, setLoading] = useState(true)
    const [relatedApps, setRelatedApps] = useState([])
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.slug) {
            fetchApp()
        }
    }, [params.slug])

    const fetchApp = async () => {
        try {
            setLoading(true)
            const response = await api.getAppBySlug(params.slug)
            setApp(response.app)
            
            // Fetch related apps from same category
            if (response.app.category) {
                fetchRelatedApps(response.app.category._id, response.app._id)
            }
        } catch (error) {
            console.error('Error fetching app:', error)
            if (error.status === 404) {
                router.push('/404')
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchRelatedApps = async (categoryId, currentAppId) => {
        try {
            const response = await api.getApps({ 
                category: categoryId, 
                limit: 4 
            })
            const filtered = response.data.apps?.filter(a => a._id !== currentAppId) || []
            setRelatedApps(filtered.slice(0, 3))
        } catch (error) {
            console.error('Error fetching related apps:', error)
        }
    }

    const handleDownload = async (downloadUrl) => {
        try {
            await api.registerDownload(app.slug)
            // Open download link in new tab
            window.open(downloadUrl, '_blank')
        } catch (error) {
            console.error('Error registering download:', error)
            // Open download link anyway
            window.open(downloadUrl, '_blank')
        }
    }

    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'windows': return FaWindows
            case 'mac': return FaApple
            case 'linux': return FaLinux
            case 'android': return FaAndroid
            case 'ios': return FaApple
            default: return FaDownload
        }
    }

    const getPlatformName = (platform) => {
        switch (platform.toLowerCase()) {
            case 'windows': return 'Windows'
            case 'mac': return 'macOS'
            case 'linux': return 'Linux'
            case 'android': return 'Android'
            case 'ios': return 'iOS'
            default: return platform
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-red-500 animate-spin" />
            </div>
        )
    }

    if (!app) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl text-white mb-4">App not found</h1>
                    <Link href="/">
                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {app && (
                <Head>
                    <title>{app.name} - Download Free | Apps Cracked</title>
                    <meta name="description" content={`Download ${app.name} v${app.version} for free. ${app.shortDescription || app.description?.substring(0, 160)}. Direct download links available.`} />
                    <meta name="keywords" content={`${app.name}, download, free, cracked, ${app.category?.name}, ${app.developer}, ${app.tags?.join(', ') || ''}`} />
                    <meta property="og:title" content={`${app.name} - Free Download`} />
                    <meta property="og:description" content={`Download ${app.name} v${app.version} for free. ${app.shortDescription || 'Premium app available for download.'}`} />
                    <meta property="og:image" content={app.images?.[0] || '/default-app-image.jpg'} />
                    <meta property="og:type" content="website" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${app.name} - Free Download`} />
                    <meta name="twitter:description" content={`Download ${app.name} v${app.version} for free.`} />
                    <meta name="twitter:image" content={app.images?.[0] || '/default-app-image.jpg'} />
                    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/app/${app.slug}`} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": app.name,
                            "description": app.description,
                            "operatingSystem": "Windows, Mac, Android, iOS",
                            "applicationCategory": app.category?.name || "Application",
                            "author": {
                                "@type": "Organization",
                                "name": app.developer
                            },
                            "softwareVersion": app.version,
                            "fileSize": app.size,
                            "downloadUrl": app.downloadLinks?.map(link => link.url) || [],
                            "image": app.images || [],
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": app.rating || 4.5,
                                "ratingCount": app.downloads || 100
                            }
                        })}
                    </script>
                </Head>
            )}
            
            <div className="min-h-screen">
                {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-8">
                <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                    <Link href="/" className="hover:text-red-400">Home</Link>
                    <span>/</span>
                    <Link 
                        href={`/category/${app.category?.slug}`}
                        className="hover:text-red-400"
                    >
                        {app.category?.name}
                    </Link>
                    <span>/</span>
                    <span className="text-white">{app.name}</span>
                </nav>

                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>
            </div>

            {/* App Header */}
            <section className="container mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* App Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-start space-x-6 mb-6">
                            {app.images && app.images[0] ? (
                                <img 
                                    src={app.images[0]} 
                                    alt={app.name}
                                    className="w-24 h-24 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center text-3xl">
                                    📱
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-white">{app.name}</h1>
                                    {app.isHot && (
                                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                            <FaFire className="mr-1" />
                                            HOT
                                        </span>
                                    )}
                                    {app.isPremium && (
                                        <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                            <FaCrown className="mr-1" />
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-4">{app.shortDescription || 'Premium application'}</p>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center text-yellow-400">
                                        <FaStar className="mr-1" />
                                        <span>{app.rating || '4.5'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <FaDownload className="mr-1" />
                                        <span>{app.downloads || 0} downloads</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <FaEye className="mr-1" />
                                        <span>{app.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {app.tags && app.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {app.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Download Card */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-4">
                            {/* Download Links */}
                            {app.downloadLinks && app.downloadLinks.length > 0 ? (
                                <div className="mb-4">
                                    <h3 className="text-white font-semibold mb-3 flex items-center">
                                        <FaDownload className="mr-2" />
                                        Download Links
                                    </h3>
                                    <div className="space-y-2">
                                        {app.downloadLinks
                                            .filter(link => link.isActive)
                                            .map((link, index) => {
                                                const IconComponent = getPlatformIcon(link.platform)
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDownload(link.url)}
                                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between group"
                                                    >
                                                        <div className="flex items-center">
                                                            <IconComponent className="mr-3 text-lg" />
                                                            <span>{getPlatformName(link.platform)}</span>
                                                        </div>
                                                        <FaExternalLinkAlt className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                )
                                            })}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <div className="text-center">
                                        <FaDownload className="text-2xl text-gray-500 mx-auto mb-2" />
                                        <p className="text-gray-400 text-sm">Download links will be available soon</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Version:</span>
                                    <span className="text-white">{app.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Size:</span>
                                    <span className="text-white">{app.size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Developer:</span>
                                    <span className="text-white">{app.developer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Category:</span>
                                    <Link 
                                        href={`/category/${app.category?.slug}`}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        {app.category?.name}
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Added:</span>
                                    <span className="text-white">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Screenshots */}
            {app.images && app.images.length > 1 && (
                <section className="container mx-auto px-4 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {app.images.slice(1).map((image, index) => (
                            <img 
                                key={index}
                                src={image} 
                                alt={`${app.name} screenshot ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(image, '_blank')}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Description */}
            <section className="container mx-auto px-4 mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Description</h2>
                <div className="card p-6">
                    <div 
                        className="text-gray-300 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ 
                            __html: app.description
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/__(.*?)__/g, '<u>$1</u>')
                                .replace(/`(.*?)`/g, '<code style="background-color: rgb(75 85 99); padding: 2px 4px; border-radius: 3px;">$1</code>')
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #ef4444;">$1</a>')
                                .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.25em; font-weight: bold; margin: 0.5em 0;">$1</h2>')
                                .replace(/^- (.*$)/gm, '<li style="margin-left: 1em;">$1</li>')
                                .replace(/^\d+\. (.*$)/gm, '<li style="margin-left: 1em; list-style-type: decimal;">$1</li>')
                                .replace(/^> (.*$)/gm, '<blockquote style="border-left: 3px solid #ef4444; padding-left: 1em; margin: 0.5em 0; color: #d1d5db;">$1</blockquote>')
                                .replace(/\n/g, '<br>')
                        }} 
                    />
                </div>
            </section>

            {/* Related Apps */}
            {relatedApps.length > 0 && (
                <section className="container mx-auto px-4 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Related Apps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedApps.map((relatedApp) => (
                            <Link key={relatedApp._id} href={`/app/${relatedApp.slug}`}>
                                <div className="card p-6 group cursor-pointer">
                                    <div className="flex items-center space-x-4 mb-4">
                                        {relatedApp.images && relatedApp.images[0] ? (
                                            <img 
                                                src={relatedApp.images[0]} 
                                                alt={relatedApp.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                                📱
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-white font-semibold group-hover:text-red-400 transition-colors">
                                                {relatedApp.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{relatedApp.developer}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-yellow-400">
                                            <FaStar className="inline mr-1" />
                                            {relatedApp.rating || '4.5'}
                                        </span>
                                        <span className="text-gray-400">
                                            <FaDownload className="inline mr-1" />
                                            {relatedApp.downloads || 0}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            </div>
        </>
    )
} 