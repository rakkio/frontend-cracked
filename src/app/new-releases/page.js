'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { FaDownload, FaStar, FaFire, FaCrown, FaSpinner, FaCalendar } from 'react-icons/fa'

export default function NewReleases() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        fetchNewReleases()
    }, [])

    const fetchNewReleases = async (pageNum = 1) => {
        try {
            setLoading(true)
            const response = await api.getApps({
                page: pageNum,
                limit: 16,
                sortBy: 'createdAt',
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
            console.error('Error fetching new releases:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchNewReleases(page + 1)
        }
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
                        <FaCalendar className="text-3xl text-red-500 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            New Releases
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover the latest apps and games added to our collection. 
                        Fresh content updated daily with the newest releases.
                    </p>
                </div>

                {/* Apps Grid */}
                {apps.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {apps.map((app) => (
                                <Link key={app._id} href={`/app/${app.slug}`}>
                                    <div className="card group cursor-pointer overflow-hidden">
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
                                            <div className="absolute top-3 left-3 flex flex-col space-y-2">
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
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    NEW
                                                </span>
                                            </div>

                                            {/* Added Date */}
                                            <div className="absolute bottom-3 right-3">
                                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    {new Date(app.createdAt).toLocaleDateString()}
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
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-yellow-400 text-sm">
                                                    <FaStar className="mr-1" />
                                                    {app.rating || '4.5'}
                                                </div>
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <FaDownload className="mr-1" />
                                                    {app.downloads || 0}
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
                        <FaCalendar className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No New Releases Found</h3>
                        <p className="text-gray-400 mb-6">Check back later for the latest apps and games</p>
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