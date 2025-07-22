'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { FaDownload, FaStar, FaFire, FaCrown, FaSpinner, FaTrophy } from 'react-icons/fa'

export default function TopRatedApps() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchTopRatedApps()
    }, [])

    const fetchTopRatedApps = async (pageNum = 1) => {
        try {
            setLoading(true)
            const response = await api.getApps({
                page: pageNum,
                limit: 16,
                sortBy: 'rating',
                sortOrder: 'desc'
            })
            
            if (pageNum === 1) {
                setApps(response.data.apps)
            } else {
                setApps(prev => [...prev, ...response.data.apps])
            }
            
            setHasMore(response.data.pagination.hasNext)
            setPage(pageNum)
        } catch (error) {
            console.error('Error fetching top rated apps:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchTopRatedApps(page + 1)
        }
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-yellow-400" />)
        }

        if (hasHalfStar) {
            stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />)
        }

        const emptyStars = 5 - Math.ceil(rating)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="text-gray-500" />)
        }

        return stars
    }

    if (loading && page === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-red-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <FaTrophy className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Top Rated Apps
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Highest rated applications based on user reviews and ratings. Quality-tested and community-approved.
                    </p>
                </div>

                {/* Apps Grid */}
                {apps.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {apps.map((app, index) => (
                                <Link key={app._id} href={`/app/${app.slug}`}>
                                    <div className="card group cursor-pointer overflow-hidden relative">
                                        {/* Medal Badge for top 3 */}
                                        {index < 3 && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                                                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' : 
                                                    'bg-gradient-to-r from-amber-500 to-amber-700'
                                                }`}>
                                                    <FaTrophy />
                                                </div>
                                            </div>
                                        )}

                                        {/* App Image */}
                                        <div className="relative">
                                            {app.images && app.images[0] ? (
                                                <img 
                                                    src={app.images[0]} 
                                                    alt={app.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-4xl">
                                                    📱
                                                </div>
                                            )}
                                            
                                            {/* Badges */}
                                            <div className="absolute top-3 right-3 flex flex-col space-y-2">
                                                {app.isHot && (
                                                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center w-fit">
                                                        <FaFire className="mr-1" />
                                                        HOT
                                                    </span>
                                                )}
                                                {app.isPremium && (
                                                    <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center w-fit">
                                                        <FaCrown className="mr-1" />
                                                        PRO
                                                    </span>
                                                )}
                                                {app.isTopRated && (
                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center w-fit">
                                                        <FaTrophy className="mr-1" />
                                                        TOP
                                                    </span>
                                                )}
                                            </div>

                                            {/* Rating Display */}
                                            <div className="absolute bottom-3 right-3">
                                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                                                    <FaStar className="text-yellow-400 mr-1" />
                                                    {(app.rating || 4.5).toFixed(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* App Info */}
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold mb-2 group-hover:text-red-400 transition-colors">
                                                {app.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3">
                                                {app.developer}
                                            </p>
                                            
                                            {/* Star Rating */}
                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center mr-2">
                                                    {renderStars(app.rating || 4.5)}
                                                </div>
                                                <span className="text-white text-sm font-medium">
                                                    {(app.rating || 4.5).toFixed(1)}
                                                </span>
                                                <span className="text-gray-400 text-sm ml-2">
                                                    ({app.reviewsCount || 0} reviews)
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <FaDownload className="mr-1" />
                                                    {app.downloads || 0} downloads
                                                </div>
                                            </div>
                                            
                                            {app.category && (
                                                <div className="mt-3">
                                                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                                        {app.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Apps'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <FaTrophy className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Top Rated Apps Found</h3>
                        <p className="text-gray-400 mb-6">Check back later for highly rated applications</p>
                        <Link href="/">
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg">
                                Browse All Apps
                            </button>
                        </Link>
                    </div>
                )}
            </section>
        </div>
    )
} 