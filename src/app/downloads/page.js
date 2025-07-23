'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Link from 'next/link'
import { 
    FaDownload, 
    FaSpinner, 
    FaCalendar, 
    FaStar,
    FaArrowLeft,
    FaSearch,
    FaHistory,
    FaUser,
    FaLock,
    FaShieldAlt,
    FaClock,
    FaTrophy
} from 'react-icons/fa'

// SEO Structured Data Generator
const generateDownloadsStructuredData = (user, downloads) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/downloads#webpage`,
                "url": `${baseUrl}/downloads`,
                "name": "My Downloads - Track Your Apps History | AppsCracked",
                "description": "View and manage your download history. Track all your downloaded premium applications, ratings, and installation dates on AppsCracked.",
                "breadcrumb": {
                    "@id": `${baseUrl}/downloads#breadcrumb`
                },
                "inLanguage": "en-US",
                "isPartOf": {
                    "@id": `${baseUrl}#website`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/downloads#breadcrumb`,
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
                        "name": "Profile",
                        "item": `${baseUrl}/profile`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Downloads",
                        "item": `${baseUrl}/downloads`
                    }
                ]
            },
            {
                "@type": "ProfilePage",
                "name": `${user?.name || 'User'}'s Download History`,
                "description": `Download history and app management for ${user?.name || 'user'}`,
                "mainEntity": user ? {
                    "@type": "Person",
                    "name": user.name,
                    "identifier": user.id
                } : undefined
            }
        ]
    }
}

export default function DownloadsPage() {
    const { user, isAuthenticated } = useAuth()
    const [downloads, setDownloads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'rating'

    useEffect(() => {
        if (isAuthenticated) {
            fetchDownloads()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated])

    // Insert structured data
    useEffect(() => {
        if (!loading && isAuthenticated) {
            const structuredData = generateDownloadsStructuredData(user, downloads)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-downloads-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-downloads-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, isAuthenticated, user, downloads])

    const fetchDownloads = async () => {
        try {
            setLoading(true)
            // This endpoint might not exist yet, handle gracefully
            const response = await api.getUserDownloads()
            setDownloads(response.data?.downloads || [])
        } catch (error) {
            console.error('Error fetching downloads:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Filter and sort downloads
    const filteredDownloads = downloads
        .filter(download => 
            !searchTerm || 
            download.app?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            download.app?.developer?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.app?.name || '').localeCompare(b.app?.name || '')
                case 'rating':
                    return (b.app?.rating || 0) - (a.app?.rating || 0)
                default: // 'date'
                    return new Date(b.downloadedAt) - new Date(a.downloadedAt)
            }
        })

    if (!isAuthenticated) {
        return (
            <>
                {/* SEO Meta Tags for Non-Authenticated */}
                <title>Login Required - Access Your Downloads | AppsCracked</title>
                <meta name="description" content="Login to view your download history and manage your premium apps collection. Track installations, ratings, and access your personal library." />
                <meta name="keywords" content="login, download history, user account, app library, premium apps access, AppsCracked login" />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="author" content="AppsCracked" />
                <link rel="canonical" href="https://appscracked.com/downloads" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Login Required - Access Your Downloads | AppsCracked" />
                <meta property="og:description" content="Login to view your download history and manage your premium apps collection." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://appscracked.com/downloads" />
                <meta property="og:image" content="https://appscracked.com/og-login.jpg" />

                <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                    <div className="text-center max-w-lg mx-auto p-8">
                        <div className="relative mb-8">
                            <FaLock className="text-7xl text-red-500 mx-auto drop-shadow-2xl" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                        </div>
                        
                        <h1 className="text-4xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                LOGIN REQUIRED
                            </span>
                        </h1>
                        
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Access your personal download history and manage your premium apps collection. 
                            Track installations, view ratings, and organize your software library.
                    </p>
                        
                        <div className="space-y-4">
                    <Link href="/auth/login">
                                <button className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-red-500/25">
                            Login to Continue
                        </button>
                    </Link>
                            <Link href="/auth/register">
                                <button className="w-full px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-red-500 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-300">
                                    Create Account
                                </button>
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="mt-12 grid grid-cols-1 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <FaHistory className="text-2xl text-blue-400 mx-auto mb-2" />
                                <h3 className="text-white font-bold mb-1">Download History</h3>
                                <p className="text-gray-400 text-sm">Track all your apps</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <FaShieldAlt className="text-2xl text-green-400 mx-auto mb-2" />
                                <h3 className="text-white font-bold mb-1">Secure Access</h3>
                                <p className="text-gray-400 text-sm">Protected account</p>
                            </div>
                </div>
            </div>
                </main>
            </>
        )
    }

    if (loading) {
        return (
            <>
                <title>Loading Downloads - My Apps History | AppsCracked</title>
                <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <FaSpinner className="text-5xl text-red-500 animate-spin mx-auto" />
                        <h2 className="text-2xl text-white font-bold">Loading Your Downloads...</h2>
                        <p className="text-gray-400">Retrieving your app history</p>
                </div>
                </main>
            </>
        )
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <title>My Downloads - Track Your Apps History | AppsCracked</title>
            <meta name="description" content={`View ${downloads.length} downloaded apps in your personal library. Track installation history, ratings, and manage your premium software collection.`} />
            <meta name="keywords" content="download history, my apps, user library, app management, premium software collection, installation history, AppsCracked downloads" />
            <meta name="robots" content="noindex, follow" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href="https://appscracked.com/downloads" />
            
            {/* Open Graph */}
            <meta property="og:title" content="My Downloads - Personal App Library | AppsCracked" />
            <meta property="og:description" content="Manage your downloaded premium applications and track your software collection history." />
            <meta property="og:type" content="profile" />
            <meta property="og:url" content="https://appscracked.com/downloads" />
            <meta property="og:image" content="https://appscracked.com/og-downloads.jpg" />

            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800" itemScope itemType="https://schema.org/ProfilePage">
                {/* Enhanced Header */}
                <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-black to-red-900/20">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                    
                    <div className="container mx-auto relative z-10 max-w-6xl">
                        <div className="flex items-center justify-between mb-8">
                        <Link 
                            href="/profile"
                                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors font-medium"
                        >
                            <FaArrowLeft />
                            <span>Back to Profile</span>
                        </Link>
                    </div>
                    
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center mb-8">
                                <div className="relative group">
                                    <FaDownload className="text-6xl text-red-500 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg"></div>
                                </div>
                            </div>
                            
                            <header className="space-y-6">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight" itemProp="name">
                                    <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                                        MY DOWNLOADS
                                    </span>
                                </h1>
                                
                                <h2 className="text-2xl md:text-4xl text-gray-300 font-medium leading-relaxed max-w-4xl mx-auto" itemProp="description">
                                    Track all your downloaded applications, installation history, and manage your premium software collection.
                                </h2>

                                {/* User Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-4xl mx-auto">
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaDownload className="text-3xl text-green-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block text-2xl">{filteredDownloads.length}</span>
                                        <span className="text-gray-400 text-sm">Total Downloads</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaUser className="text-3xl text-blue-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block text-2xl">{user?.name?.split(' ')[0] || 'User'}</span>
                                        <span className="text-gray-400 text-sm">Account</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaClock className="text-3xl text-purple-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block text-2xl">
                                            {downloads.length > 0 ? new Date(downloads[0]?.downloadedAt).toLocaleDateString('en', { month: 'short' }) : 'N/A'}
                                        </span>
                                        <span className="text-gray-400 text-sm">Last Activity</span>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                        <FaTrophy className="text-3xl text-yellow-400 mx-auto mb-3" />
                                        <span className="text-white font-bold block text-2xl">
                                            {downloads.length >= 10 ? 'Pro' : downloads.length >= 5 ? 'Active' : 'New'}
                                        </span>
                                        <span className="text-gray-400 text-sm">Status</span>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </section>

            {/* Content */}
                <section className="container mx-auto px-4 py-12">
                {error ? (
                    <div className="text-center py-20">
                            <div className="text-6xl mb-8">⚠️</div>
                            <h3 className="text-3xl font-bold text-white mb-4">Service Coming Soon</h3>
                            <p className="text-gray-400 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
                                Download history feature is under development. This powerful feature will allow you to track all your downloads, 
                                manage installations, and organize your premium software collection.
                        </p>
                            
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-8 max-w-2xl mx-auto mb-8">
                                <h4 className="text-blue-400 font-bold text-xl mb-4">Coming Features:</h4>
                                <ul className="text-gray-300 space-y-2 text-left">
                                    <li className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Complete download history tracking</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Installation status monitoring</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Personal app ratings and reviews</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Custom collections and favorites</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Update notifications for installed apps</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apps">
                                    <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl">
                                Browse Apps
                            </button>
                        </Link>
                                <Link href="/profile">
                                    <button className="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-red-500 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-300">
                                        Back to Profile
                                    </button>
                                </Link>
                            </div>
                    </div>
                ) : downloads.length > 0 ? (
                        <>
                            {/* Enhanced Search and Filters */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 mb-8">
                                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                                    {/* Search */}
                                    <div className="relative flex-1 max-w-md">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            placeholder="Search your downloads..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-lg"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <div className="flex items-center space-x-3">
                                        <span className="text-gray-400 text-sm font-medium">Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 font-medium"
                                        >
                                            <option value="date">📅 Latest Downloads</option>
                                            <option value="name">🔤 App Name</option>
                                            <option value="rating">⭐ Highest Rated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Downloads Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" itemScope itemType="https://schema.org/ItemList">
                                <meta itemProp="numberOfItems" content={filteredDownloads.length} />
                                
                                {filteredDownloads.map((download, index) => (
                                    <article 
                                        key={index} 
                                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group"
                                        itemScope itemType="https://schema.org/SoftwareApplication"
                                        itemProp="itemListElement"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                    {download.app?.images?.[0] ? (
                                                        <img 
                                                            src={download.app.images[0]} 
                                                            alt={`${download.app.name} - Downloaded App`}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                            itemProp="image"
                                                        />
                                                    ) : (
                                                        <FaDownload className="text-white text-xl" />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-lg mb-1 line-clamp-1 group-hover:text-red-400 transition-colors" itemProp="name">
                                            {download.app?.name || 'Unknown App'}
                                        </h3>
                                                <p className="text-gray-400 text-sm mb-3" itemProp="publisher">
                                            {download.app?.developer || 'Unknown Developer'}
                                        </p>
                                                
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="flex items-center space-x-1 text-gray-300">
                                                            <FaCalendar className="text-blue-400" />
                                                <span>{new Date(download.downloadedAt).toLocaleDateString()}</span>
                                            </span>
                                            {download.app?.rating && (
                                                            <span className="flex items-center space-x-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                                                    <FaStar className="text-yellow-500" />
                                                                <span className="text-gray-300" itemProp="ratingValue">{download.app.rating}</span>
                                                                <meta itemProp="reviewCount" content="100" />
                                                </span>
                                            )}
                                                    </div>
                                                    
                                                    <span className="px-2 py-1 bg-green-900/20 border border-green-500/30 text-green-400 text-xs rounded-full font-bold">
                                                        DOWNLOADED
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hidden Schema Data */}
                                        <meta itemProp="description" content={download.app?.description || `Downloaded ${download.app?.name || 'application'} on ${new Date(download.downloadedAt).toLocaleDateString()}`} />
                                        <meta itemProp="applicationCategory" content={download.app?.category?.name || 'Software'} />
                                        <meta itemProp="operatingSystem" content="Windows, MacOS, Android, iOS" />
                                    </article>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <FaDownload className="text-8xl text-gray-600 mx-auto mb-8 opacity-50" />
                            <h3 className="text-4xl font-bold text-white mb-6">No Downloads Yet</h3>
                            <p className="text-gray-400 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                                Start building your premium software collection! Download apps to see your history here 
                                and track your installations over time.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaDownload className="text-3xl text-green-400 mx-auto mb-3" />
                                    <h4 className="text-white font-bold mb-2">Download Apps</h4>
                                    <p className="text-gray-400 text-sm">Get premium software for free</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaHistory className="text-3xl text-blue-400 mx-auto mb-3" />
                                    <h4 className="text-white font-bold mb-2">Track History</h4>
                                    <p className="text-gray-400 text-sm">Monitor your downloads</p>
                                    </div>
                                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                    <FaShieldAlt className="text-3xl text-purple-400 mx-auto mb-3" />
                                    <h4 className="text-white font-bold mb-2">Stay Organized</h4>
                                    <p className="text-gray-400 text-sm">Manage your collection</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/apps">
                                    <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl">
                                        Browse Apps
                                    </button>
                                </Link>
                                <Link href="/categories">
                                    <button className="px-8 py-4 bg-transparent border-2 border-gray-600 hover:border-red-500 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-300">
                                        Browse Categories
                                    </button>
                                </Link>
                            </div>
                    </div>
                    )}
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-red-600/10 to-orange-600/10 border-t border-red-500/20">
                    <div className="container mx-auto text-center max-w-4xl">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Discover More Premium Apps
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Expand your software collection with thousands of premium applications
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apps">
                                <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105">
                                    Browse All Apps
                                </button>
                            </Link>
                            <Link href="/apps?featured=true">
                                <button className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300">
                                    Featured Apps
                            </button>
                        </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
} 