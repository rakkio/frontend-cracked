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
    FaExclamationTriangle,
    FaHome,
    FaTrophy,
    FaCrown,
    FaGem,
    FaCheckCircle
} from 'react-icons/fa'

// SEO Structured Data Generator
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const generateAppStructuredData = (app, relatedApps) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/app/${app.slug}#webpage`,
                "url": `${baseUrl}/app/${app.slug}`,
                "name": `Download ${app.name} ${app.version ? `v${app.version}` : ''} Free - Premium Cracked App | AppsCracked`,
                "description": `Download ${app.name} for free. ${app.description ? app.description.substring(0, 160) + '...' : 'Premium cracked version with full features unlocked. Direct download link available.'}`,
                "breadcrumb": {
                    "@id": `${baseUrl}/app/${app.slug}#breadcrumb`
                },
                "inLanguage": "en-US",
                "isPartOf": {
                    "@id": `${baseUrl}#website`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/app/${app.slug}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Apps",
                        "item": `${baseUrl}/apps`
                    },
                    ...(app.category ? [{
                        "@type": "ListItem",
                        "position": 3,
                        "name": app.category.name,
                        "item": `${baseUrl}/category/${app.category.slug}`
                    }] : []),
                    {
                        "@type": "ListItem",
                        "position": app.category ? 4 : 3,
                        "name": app.name,
                        "item": `${baseUrl}/app/${app.slug}`
                    }
                ]
            },
            {
                "@type": "SoftwareApplication",
                "name": app.name,
                "description": app.description || `Download ${app.name} for free - Premium cracked version with full features unlocked`,
                "url": `${baseUrl}/app/${app.slug}`,
                "downloadUrl": `${baseUrl}/app/${app.slug}`,
                "image": app.images?.[0] || `${baseUrl}/default-app-icon.png`,
                "screenshot": app.screenshots || [],
                "applicationCategory": app.category?.name || "UtilitiesApplication",
                "operatingSystem": app.platform || "Windows",
                "softwareVersion": app.version || "Latest",
                "author": {
                    "@type": "Organization",
                    "name": app.developer || "Unknown Developer"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "AppsCracked",
                    "url": baseUrl
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": app.rating || 4.5,
                    "reviewCount": app.totalRatings || 100,
                    "bestRating": 5,
                    "worstRating": 1
                },
                "offers": {
                    "@type": "Offer",
                    "price": "0.00",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "AppsCracked",
                        "url": baseUrl
                    }
                },
                "datePublished": app.createdAt,
                "dateModified": app.updatedAt || app.createdAt,
                "fileSize": app.size ? `${app.size} bytes` : undefined,
                "downloadUrl": `${baseUrl}/app/${app.slug}`,
                "installUrl": `${baseUrl}/app/${app.slug}`,
                "softwareRequirements": app.systemRequirements || "Windows 10 or later",
                "featureList": [
                    "Free download",
                    "Full version",
                    "No registration required",
                    "Direct download link",
                    "Virus-free",
                    "Premium features unlocked"
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `Is ${app.name} safe to download?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Yes, ${app.name} is safe to download. All files are scanned for viruses and malware before being made available.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Is ${app.name} really free?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Yes, ${app.name} is completely free to download. No registration, subscription, or payment required.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `What platforms does ${app.name} support?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `${app.name} supports ${app.platform || 'Windows'} and is compatible with most modern systems.`
                        }
                    }
                ]
            }
        ]
    }
}

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

    // Insert structured data
    useEffect(() => {
        if (!loading && app) {
            const structuredData = generateAppStructuredData(app, relatedApps)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-app-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-app-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, app, relatedApps])

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
        console.log('App download URL:', app.downloadUrl)
        console.log('App ID:', app._id)
            
        // Validar que tenemos los datos necesarios
        if (!app.downloadUrl) {
            console.error('❌ No download URL available')
            alert('Download URL not available for this app')
            return
        }
        
        // Guardar información de descarga en sessionStorage
        const downloadData = {
                    url: app.downloadUrl,
                    appName: app.name,
            appSlug: app.slug || params.slug, // ALWAYS use slug for redirection
            appId: app._id, // Keep ID only for reference, never for URL routing
            categorySlug: app.category?.slug
                }
                
        console.log('📦 Saving download data:', downloadData)
        
        try {
            sessionStorage.setItem('pendingDownload', JSON.stringify(downloadData))
            
            // Verificar que se guardó correctamente
            const savedData = sessionStorage.getItem('pendingDownload')
            console.log('✅ Data saved to sessionStorage:', savedData)
            
            if (!savedData) {
                console.error('❌ Failed to save data to sessionStorage')
                alert('Error preparing download. Please try again.')
                return
            }
            
        } catch (error) {
            console.error('❌ Error saving to sessionStorage:', error)
            alert('Error preparing download. Please try again.')
            return
        }
        
        console.log('🔄 Redirecting to advertisement page...')
        
        // Pequeño delay para asegurar que sessionStorage se guarde
        setTimeout(() => {
            window.location.href = '/ad-redirect'
        }, 100)
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

    // SEO title and description generators
    const getPageTitle = () => {
        if (!app) return 'Loading App | AppsCracked'
        
        const version = app.version ? ` v${app.version}` : ''
        const category = app.category ? ` ${app.category.name}` : ''
        
        return `Download ${app.name}${version} Free - Premium${category} App 2024 | AppsCracked`
    }

    const getPageDescription = () => {
        if (!app) return 'Premium application download'
        
        const baseDesc = `Download ${app.name} for free. ${app.description ? app.description.substring(0, 120) + '...' : 'Premium cracked version with full features unlocked.'} Direct download link, virus-free, and 100% safe.`
        
        return baseDesc.length > 160 ? baseDesc.substring(0, 157) + '...' : baseDesc
    }

    const getKeywords = () => {
        if (!app) return 'app, download, free'
        
        const keywords = [
            app.name.toLowerCase(),
            `download ${app.name.toLowerCase()}`,
            `${app.name.toLowerCase()} free`,
            `${app.name.toLowerCase()} cracked`,
            `${app.name.toLowerCase()} premium`,
            app.category?.name.toLowerCase(),
            app.developer?.toLowerCase(),
            app.platform?.toLowerCase(),
            'free download',
            'cracked app',
            'premium software'
        ].filter(Boolean)
        
        return keywords.slice(0, 15).join(', ')
    }

    if (loading) {
        return (
            <>
                <title>Loading App - Premium Software | AppsCracked</title>
                <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <FaSpinner className="animate-spin text-5xl text-red-500 mx-auto" />
                        <h2 className="text-2xl text-white font-bold">Loading Application...</h2>
                        <p className="text-gray-400">Fetching app details and download information</p>
                </div>
                </main>
            </>
        )
    }

    if (error || !app) {
        return (
            <>
                <title>App Not Found - Download Premium Apps | AppsCracked</title>
                <meta name="robots" content="noindex, follow" />
                
                <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                    <div className="text-center text-white max-w-lg mx-auto p-8">
                        <FaExclamationTriangle className="text-8xl text-red-500 mx-auto mb-8" />
                        <h1 className="text-4xl font-bold mb-6">Application Not Found</h1>
                        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                            {error || 'The requested application could not be found. It may have been moved or removed.'}
                    </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apps" className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105">
                        <FaArrowLeft />
                                <span>Browse All Apps</span>
                            </Link>
                            <Link href="/categories" className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300">
                                <span>Browse Categories</span>
                    </Link>
                </div>
            </div>
                </main>
            </>
        )
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <meta name="keywords" content={getKeywords()} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href={`https://appscracked.com/app/${app.slug}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://appscracked.com/app/${app.slug}`} />
            <meta property="og:image" content={app.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content={app.images?.[0] || 'https://appscracked.com/default-app.jpg'} />
            
            {/* App-specific meta */}
            <meta name="application-name" content={app.name} />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta property="app:price:amount" content="0.00" />
            <meta property="app:price:currency" content="USD" />

            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900" itemScope itemType="https://schema.org/SoftwareApplication">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Enhanced Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-gray-400 mb-8 text-sm" itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
                        <Link href="/" className="flex items-center space-x-1 hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <FaHome />
                            <span itemProp="name">Home</span>
                            <meta itemProp="position" content="1" />
                        </Link>
                    <span>/</span>
                        <Link href="/apps" className="hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span itemProp="name">Apps</span>
                            <meta itemProp="position" content="2" />
                        </Link>
                    <span>/</span>
                    {app.category && (
                        <>
                                <Link href={`/category/${app.category.slug}`} className="hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                    <span itemProp="name">{app.category.name}</span>
                                    <meta itemProp="position" content="3" />
                            </Link>
                            <span>/</span>
                        </>
                    )}
                        <span className="text-white font-bold" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span itemProp="name">{app.name}</span>
                            <meta itemProp="position" content={app.category ? "4" : "3"} />
                        </span>
                </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                            {/* Enhanced App Header */}
                            <header className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-3xl p-8 mb-12 relative overflow-hidden shadow-2xl">
                            {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                            
                                <div className="relative flex flex-col md:flex-row gap-8">
                                {/* App Icon */}
                                <div className="flex-shrink-0 group">
                                        {app.images && app.images.length > 0 ? (
                                        <img
                                            src={app.images[0]}
                                                alt={`${app.name} - Free Download`}
                                                width={150}
                                                height={150}
                                                className="rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-gray-600/50"
                                                itemProp="image"
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className="w-36 h-36 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden border-2 border-gray-600/50">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                                <span className="text-white text-5xl font-black relative z-10 drop-shadow-lg">
                                                {app.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* App Info */}
                                <div className="flex-1">
                                        <div className="mb-6">
                                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight" itemProp="name">
                                                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                                            {app.name}
                                                </span>
                                        </h1>
                                            <p className="text-gray-300 text-xl font-medium" itemProp="author" itemScope itemType="https://schema.org/Organization">
                                                <span itemProp="name">{app.developer || 'Unknown Developer'}</span>
                                            </p>
                                    </div>
                                    
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                        {app.rating && (
                                                <div className="flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/40 shadow-lg" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                                    <FaStar className="text-yellow-500 text-lg" />
                                                    <span className="text-white font-bold text-lg" itemProp="ratingValue">{app.rating.toFixed(1)}</span>
                                                    <span className="text-gray-300">({app.totalRatings || 100})</span>
                                                    <meta itemProp="reviewCount" content={app.totalRatings || '100'} />
                                                    <meta itemProp="bestRating" content="5" />
                                                    <meta itemProp="worstRating" content="1" />
                                            </div>
                                        )}
                                        
                                            <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/40 shadow-lg" itemProp="operatingSystem">
                                            {getPlatformIcon(app.platform)}
                                                <span className="text-gray-300 font-medium">{app.platform || 'Windows'}</span>
                                        </div>

                                        {app.version && (
                                                <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full shadow-xl" itemProp="softwareVersion">
                                                v{app.version}
                                            </div>
                                        )}

                                        {app.isFeatured && (
                                                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full shadow-xl animate-pulse flex items-center space-x-1">
                                                    <FaTrophy />
                                                    <span>FEATURED</span>
                                                </div>
                                            )}

                                            <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full shadow-xl flex items-center space-x-1">
                                                <FaGem />
                                                <span>PREMIUM</span>
                                            </div>

                                            <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-xl flex items-center space-x-1">
                                                <FaCrown />
                                                <span>CRACKED</span>
                                            </div>
                                    </div>

                                        {/* Enhanced Download Button */}
                                        <div className="space-y-6">
                                        <button
                                            onClick={handleDownload}
                                                className="group flex items-center justify-center space-x-4 w-full px-10 py-6 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 relative overflow-hidden"
                                                aria-label={`Download ${app.name} for free`}
                                        >
                                            {/* Animated background effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                            
                                                <FaDownload className="text-2xl group-hover:animate-bounce" />
                                                <span>DOWNLOAD NOW - FREE</span>
                                            
                                            {/* Download icon animation */}
                                                <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0ms'}} />
                                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '100ms'}} />
                                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '200ms'}} />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Download info */}
                                        <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-2 text-green-400 font-medium">
                                                        <FaShieldAlt className="text-sm" />
                                                <span>Virus-free download</span>
                                            </div>
                                                    <div className="flex items-center space-x-2 text-blue-400 font-medium">
                                                        <FaCheckCircle className="text-sm" />
                                                        <span>100% Safe</span>
                                                    </div>
                                                </div>
                                                <div className="text-gray-300 font-medium">
                                                    <span className="text-green-400">{app.downloadCount?.toLocaleString() || '0'}</span> downloads
                                            </div>
                                        </div>
                                    </div>

                                        {/* Enhanced Advertisement Notice */}
                                        <div className="mt-8 p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl backdrop-blur-sm shadow-xl">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <FaInfoCircle className="text-white" />
                                            </div>
                                                <div>
                                                    <h3 className="font-bold text-blue-300 mb-3 text-lg">How Download Works:</h3>
                                                    <ul className="text-blue-200 space-y-2 leading-relaxed">
                                                        <li className="flex items-start space-x-2">
                                                            <span className="text-green-400 font-bold mt-1">1.</span>
                                                            <span>Click download button to start the process</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <span className="text-green-400 font-bold mt-1">2.</span>
                                                            <span>View advertisement to support our free service</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <span className="text-green-400 font-bold mt-1">3.</span>
                                                            <span>Your download will start automatically after viewing</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <span className="text-green-400 font-bold mt-1">4.</span>
                                                            <span>Enjoy your premium application completely free!</span>
                                                        </li>
                                                </ul>
                                                    <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-400/30">
                                                        <p className="text-blue-300 text-sm font-medium flex items-center space-x-2">
                                                            <FaGem className="text-yellow-400" />
                                                            <span><strong>Pro tip:</strong> Ads help us keep all downloads 100% free forever!</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Enhanced Description */}
                        {app.description && (
                                <section className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 mb-8 shadow-xl">
                                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                                        <FaInfoCircle className="text-blue-400" />
                                        <span>About {app.name}</span>
                                    </h2>
                                <div 
                                        className="text-gray-300 prose prose-invert prose-lg max-w-none leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: app.description.replace(/\n/g, '<br>') }}
                                        itemProp="description"
                                />
                                </section>
                        )}

                            {/* Enhanced Screenshots */}
                        {app.screenshots && app.screenshots.length > 0 && (
                                <section className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 mb-8 shadow-xl">
                                    <h2 className="text-2xl font-black text-white mb-6">Screenshots</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {app.screenshots.map((screenshot, index) => (
                                            <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-600/40 hover:border-red-500/60 transition-all duration-300">
                                        <Image
                                            src={screenshot}
                                            alt={`${app.name} screenshot ${index + 1}`}
                                                    width={500}
                                                    height={350}
                                                    className="rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                    loading={index < 2 ? "eager" : "lazy"}
                                                    itemProp="screenshot"
                                        />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                    ))}
                                </div>
                                </section>
                        )}

                            {/* Enhanced System Requirements */}
                        {app.systemRequirements && (
                                <section className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 mb-8 shadow-xl">
                                    <h2 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                                        <FaHdd className="text-green-400" />
                                        <span>System Requirements</span>
                                    </h2>
                                    <div className="text-gray-300 leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: app.systemRequirements.replace(/\n/g, '<br>') }} itemProp="softwareRequirements" />
                                </div>
                                </section>
                        )}
                    </div>

                        {/* Enhanced Sidebar */}
                        <aside className="lg:col-span-1">
                            {/* Enhanced App Details */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 mb-8 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-6">App Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">Version</span>
                                        <span className="text-white font-bold" itemProp="softwareVersion">{app.version || 'Latest'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">File Size</span>
                                        <span className="text-white font-bold" itemProp="fileSize">
                                                {
                                                    formatFileSize(app.fileSize)
                                                }
                                </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">Downloads</span>
                                        <span className="text-green-400 font-bold">{app.downloadCount?.toLocaleString() || '0'}</span>
                                </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">Platform</span>
                                        <div className="flex items-center space-x-2">
                                            {getPlatformIcon(app.platform)}
                                            <span className="text-white font-bold">{app.platform || 'Windows'}</span>
                                </div>
                                </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">Category</span>
                                        <span className="text-white font-bold" itemProp="applicationCategory">
                                        {app.category ? (
                                            <Link href={`/category/${app.category.slug}`} className="hover:text-red-400 transition-colors">
                                                {app.category.name}
                                            </Link>
                                        ) : 'Uncategorized'}
                                    </span>
                                </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-gray-600/30">
                                        <span className="text-gray-300 font-medium">Added</span>
                                        <span className="text-white font-bold" itemProp="datePublished">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                            {/* Enhanced Safety Notice */}
                            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-2xl p-6 mb-8 shadow-xl">
                                <div className="flex items-center space-x-3 mb-4">
                                    <FaShieldAlt className="text-green-400 text-2xl" />
                                    <h3 className="text-xl font-black text-green-400">100% Safe Download</h3>
                            </div>
                                <ul className="text-green-300 space-y-3">
                                    <li className="flex items-start space-x-2">
                                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                        <span>Scanned for viruses and malware</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                        <span>No registration required</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                        <span>Direct download link</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                                        <span>Premium features unlocked</span>
                                    </li>
                                </ul>
                        </div>

                            {/* Enhanced Related Apps */}
                        {relatedApps.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 shadow-xl">
                                    <h3 className="text-xl font-black text-white mb-6">Related Apps</h3>
                                <div className="space-y-4">
                                    {relatedApps.map((relatedApp) => (
                                        <Link
                                            key={relatedApp._id}
                                            href={`/app/${relatedApp.slug}`}
                                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-700/30 transition-colors border border-gray-600/30 hover:border-red-500/50 group"
                                                itemScope itemType="https://schema.org/SoftwareApplication"
                                        >
                                                {relatedApp.images && relatedApp.images.length > 0 ? (
                                                <img
                                                    src={relatedApp.images[0]}
                                                        alt={`${relatedApp.name} - Related App`}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                        itemProp="image"
                                                    />
                                                ) : (   
                                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                        <span className="text-white font-bold">
                                                        {relatedApp.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                    <p className="font-bold text-white truncate group-hover:text-red-400 transition-colors" itemProp="name">{relatedApp.name}</p>
                                                <p className="text-gray-400 text-sm truncate">{relatedApp.developer}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {relatedApp.rating && (
                                                            <div className="flex items-center space-x-1">
                                                                <FaStar className="text-yellow-500 text-xs" />
                                                                <span className="text-gray-300 text-xs">{relatedApp.rating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                        <span className="text-green-400 text-xs font-bold">FREE</span>
                                                    </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        </aside>
                    </div>
                </div>

                {/* Hidden Schema Properties */}
                <meta itemProp="url" content={`https://appscracked.com/app/${app.slug}`} />
                <meta itemProp="downloadUrl" content={`https://appscracked.com/app/${app.slug}`} />
                <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
                    <meta itemProp="price" content="0.00" />
                    <meta itemProp="priceCurrency" content="USD" />
                    <meta itemProp="availability" content="https://schema.org/InStock" />
            </div>
                <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
                    <meta itemProp="name" content="AppsCracked" />
                    <meta itemProp="url" content="https://appscracked.com" />
        </div>
            </main>
        </>
    )
} 