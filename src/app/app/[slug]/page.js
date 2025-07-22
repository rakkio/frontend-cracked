'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
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

    const handleDownload = async () => {
        if (!app) return

        console.log('=== Starting download process ===')
        console.log('App:', app.name)
        
        try {
            // 1. Hacer solicitud para verificar si existe anuncio
            console.log('🔍 Checking for active advertisement...')
            const response = await api.getActiveAdvertisement({
                type: 'download',
                placement: 'button_click',
                page: window.location.pathname  
            })
            
            console.log('Advertisement response:', response)
            
            // 2. Verificar si existe anuncio con crackmarket direct_link
            const advertisement = response?.data?.advertisement
            
            console.log('🔍 Validating advertisement...')
            console.log('Advertisement exists:', !!advertisement)
            console.log('Crackmarket enabled:', advertisement?.crackmarket?.enabled)
            console.log('Ad format:', advertisement?.crackmarket?.adFormat)
            console.log('Direct link:', advertisement?.crackmarket?.directLink)
            
            if (advertisement && 
                advertisement.crackmarket?.enabled === true && 
                advertisement.crackmarket?.adFormat === 'direct_link' && 
                advertisement.crackmarket?.directLink) {
                
                console.log('✅ Found crackmarket direct_link advertisement')
                console.log('Direct link URL:', advertisement.crackmarket.directLink)
                
                // 🚀 NUEVA ESTRATEGIA: Abrir publicidad en la MISMA pestaña, luego redirigir a descarga
                console.log('🎯 Opening advertisement in SAME TAB (no popup blocker issues)...')
                
                // Guardar URL de descarga en sessionStorage para después
                sessionStorage.setItem('pendingDownload', JSON.stringify({
                    url: app.downloadUrl,
                    appName: app.name,
                    appId: app._id
                }))
                
                // Track impression antes de redirigir
                try {
                    await api.trackAdvertisementImpression(advertisement._id)
                    console.log('📊 Advertisement impression tracked')
                } catch (trackError) {
                    console.warn('Failed to track impression:', trackError)
                }
                
                console.log('🔄 Redirecting to advertisement page...')
                // Redirigir a nuestra página intermedia que manejará la publicidad
                const adRedirectUrl = `/ad-redirect?adUrl=${encodeURIComponent(advertisement.crackmarket.directLink)}`
                window.location.href = adRedirectUrl
                
            } else {
                // No hay anuncio con direct_link, descarga directa
                console.log('ℹ️ No direct_link advertisement found, proceeding with direct download')
                
                if (app.downloadUrl) {
                    window.open(app.downloadUrl, '_blank')
                    console.log('✅ Direct download opened:', app.downloadUrl)
                } else {
                    console.warn('❌ No download URL available')
                    alert('Download URL not available')
                }
            }
            
        } catch (error) {
            console.error('❌ Error in download process:', error)
            
            // Fallback: descarga directa
            console.log('🔄 Falling back to direct download due to error')
            if (app.downloadUrl) {
                window.open(app.downloadUrl, '_blank')
                console.log('✅ Fallback download opened:', app.downloadUrl)
            } else {
                alert('Download failed. Please try again later.')
            }
        }
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
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                            
                            <div className="relative flex flex-col md:flex-row gap-6">
                                {/* App Icon */}
                                <div className="flex-shrink-0 group">
                                    {app.icon ? (
                                        <div className="relative">
                                            <Image
                                                src={app.icon}
                                                alt={app.name}
                                                width={128}
                                                height={128}
                                                className="rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-xl" />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            <span className="text-white text-4xl font-bold relative z-10">
                                                {app.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* App Info */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {app.name}
                                        </h1>
                                        <p className="text-gray-400 text-lg">{app.developer || 'Unknown Developer'}</p>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        {app.rating && (
                                            <div className="flex items-center space-x-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                                                <FaStar className="text-yellow-500" />
                                                <span className="text-white font-medium">{app.rating.toFixed(1)}</span>
                                                <span className="text-gray-400">({app.totalRatings || 0})</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                                            {getPlatformIcon(app.platform)}
                                            <span className="text-gray-300">{app.platform || 'Windows'}</span>
                                        </div>

                                        {app.version && (
                                            <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-full shadow-lg">
                                                v{app.version}
                                            </div>
                                        )}

                                        {app.isFeatured && (
                                            <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm rounded-full shadow-lg animate-pulse">
                                                ⭐ Featured
                                            </div>
                                        )}
                                    </div>

                                    {/* Download Button */}
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleDownload}
                                            className="group flex items-center justify-center space-x-3 w-full px-8 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                        >
                                            {/* Animated background effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            
                                            <FaDownload className="text-xl group-hover:animate-bounce" />
                                            <span>Download Now - FREE</span>
                                            
                                            {/* Download icon animation */}
                                            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0ms'}} />
                                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '100ms'}} />
                                                    <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '200ms'}} />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Download info */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2 text-green-400">
                                                <FaShieldAlt className="text-xs" />
                                                <span>Virus-free download</span>
                                            </div>
                                            <div className="text-gray-400">
                                                {app.downloadCount?.toLocaleString() || '0'} downloads
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advertisement Notice */}
                                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl backdrop-blur-sm">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <FaInfoCircle className="text-white text-sm" />
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-blue-300 mb-2">Before downloading:</p>
                                                <ul className="text-blue-200 space-y-1">
                                                    <li>• You'll see a brief advertisement (15 seconds)</li>
                                                    <li>• This supports our free service and keeps downloads available</li>
                                                    <li>• Your download will start automatically after viewing</li>
                                                </ul>
                                                <div className="mt-3 text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">
                                                    💡 <strong>Pro tip:</strong> The download process is completely automated - just wait for the countdown!
                                                </div>
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