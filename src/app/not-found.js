'use client'

import Link from 'next/link'
import Head from 'next/head'
import { FaHome, FaSearch, FaSkull, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter()

    const popularCategories = [
        { name: 'Games', href: '/category/games', icon: '🎮' },
        { name: 'Productivity', href: '/category/productivity', icon: '📊' },
        { name: 'Design', href: '/category/design', icon: '🎨' },
        { name: 'Entertainment', href: '/category/entertainment', icon: '🎬' },
    ]

    const popularApps = [
        'Adobe Photoshop',
        'Microsoft Office',
        'Spotify Premium',
        'Video Editor',
        'Antivirus Software'
    ]

    return (
        <>
            <Head>
                <title>Page Not Found - 404 | Apps Cracked</title>
                <meta name="description" content="The page you're looking for doesn't exist. Browse our collection of premium apps or search for what you need." />
                <meta name="robots" content="noindex,follow" />
            </Head>
            
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* 404 Animation */}
                    <div className="mb-8">
                        <div className="flex justify-center items-center space-x-4 mb-6">
                            <FaSkull className="text-red-500 text-6xl animate-bounce" />
                            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                404
                            </div>
                            <FaSkull className="text-red-500 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }} />
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Lost in the Underground
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            The page you&apos;re looking for has vanished into the digital void. 
                            But don&apos;t worry, we&apos;ll help you find your way back to the treasure.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/">
                            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2">
                                <FaHome />
                                <span>Return Home</span>
                            </button>
                        </Link>
                        
                        <button
                            onClick={() => router.back()}
                            className="px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2"
                        >
                            <FaArrowLeft />
                            <span>Go Back</span>
                        </button>
                        
                        <Link href="/apps">
                            <button className="px-8 py-4 bg-transparent border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2">
                                <FaSearch />
                                <span>Browse Apps</span>
                            </button>
                        </Link>
                    </div>

                    {/* Popular Categories */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Popular Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {popularCategories.map((category, index) => (
                                <Link key={index} href={category.href}>
                                    <div className="card p-6 text-center group cursor-pointer">
                                        <div className="text-3xl mb-2">{category.icon}</div>
                                        <h3 className="text-white font-medium group-hover:text-red-400 transition-colors">
                                            {category.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Search Suggestions */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Maybe you were looking for:</h2>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {popularApps.map((app, index) => (
                                <Link key={index} href={`/apps?search=${encodeURIComponent(app)}`}>
                                    <button className="px-4 py-2 bg-gray-800 hover:bg-red-900/30 text-gray-300 hover:text-red-400 rounded-full border border-gray-700 hover:border-red-500 transition-all duration-300">
                                        {app}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <Link href="/categories">
                            <div className="card p-6 text-center group cursor-pointer">
                                <div className="text-purple-500 text-3xl mb-3">📂</div>
                                <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors mb-2">
                                    Browse Categories
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Explore our organized collection
                                </p>
                            </div>
                        </Link>

                        <Link href="/apps?featured=true">
                            <div className="card p-6 text-center group cursor-pointer">
                                <div className="text-yellow-500 text-3xl mb-3">⭐</div>
                                <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors mb-2">
                                    Featured Apps
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Most popular downloads
                                </p>
                            </div>
                        </Link>

                        <Link href="/apps?newest=true">
                            <div className="card p-6 text-center group cursor-pointer">
                                <div className="text-green-500 text-3xl mb-3">🆕</div>
                                <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors mb-2">
                                    Latest Releases
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Newest additions
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Error Code */}
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <p className="text-gray-500 text-sm">
                            Error Code: 404 - Page Not Found | 
                            <Link href="/" className="text-red-400 hover:text-red-300 ml-1">
                                Apps Cracked Underground Hub
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
} 