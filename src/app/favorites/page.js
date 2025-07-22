'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Link from 'next/link'
import { 
    FaHeart, 
    FaSpinner, 
    FaStar,
    FaDownload,
    FaArrowLeft,
    FaSearch
} from 'react-icons/fa'

export default function FavoritesPage() {
    const { user, isAuthenticated } = useAuth()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated])

    const fetchFavorites = async () => {
        try {
            setLoading(true)
            // This endpoint might not exist yet, handle gracefully
            const response = await api.getUserFavorites()
            setFavorites(response.data?.favorites || [])
        } catch (error) {
            console.error('Error fetching favorites:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <FaHeart className="text-6xl text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
                    <p className="text-gray-400 mb-6">
                        You need to be logged in to view your favorite applications.
                    </p>
                    <Link href="/auth/login">
                        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                            Login to Continue
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your favorites...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900/20 to-gray-900/20 border-b border-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <Link 
                            href="/profile"
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back to Profile</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <FaHeart className="text-4xl text-red-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
                            <p className="text-gray-400">Your saved applications collection</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {error ? (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Service Unavailable</h3>
                        <p className="text-gray-400 mb-6">
                            Favorites feature is coming soon. This will allow you to save and organize your favorite applications.
                        </p>
                        <Link href="/apps">
                            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                Browse Apps
                            </button>
                        </Link>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((app, index) => (
                            <Link 
                                key={index} 
                                href={`/app/${app.slug || app._id}`}
                                className="block bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500/50 transition-all hover:scale-105"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                        {app.images?.[0] ? (
                                            <img 
                                                src={app.images[0]} 
                                                alt={app.name} 
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">📱</span>
                                        )}
                                    </div>
                                    
                                    <h3 className="font-semibold text-white mb-2 truncate">
                                        {app.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {app.developer || 'Unknown Developer'}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        {app.rating && (
                                            <span className="flex items-center space-x-1">
                                                <FaStar className="text-yellow-500" />
                                                <span>{app.rating}</span>
                                            </span>
                                        )}
                                        {app.downloads && (
                                            <span className="flex items-center space-x-1">
                                                <FaDownload className="text-green-500" />
                                                <span>{app.downloads > 1000 ? `${(app.downloads/1000).toFixed(1)}k` : app.downloads}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FaHeart className="text-6xl text-gray-600 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
                        <p className="text-gray-400 mb-6">
                            Start adding apps to your favorites to see them here.
                        </p>
                        <Link href="/apps">
                            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                Browse Apps
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
} 