'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { 
    FaUser, 
    FaEnvelope, 
    FaCalendar, 
    FaCrown, 
    FaDownload, 
    FaHeart, 
    FaStar,
    FaSpinner,
    FaArrowRight,
    FaCog
} from 'react-icons/fa'

export default function ProfilePage() {
    const { user } = useAuth()
    const [userStats, setUserStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recentDownloads, setRecentDownloads] = useState([])
    const [recentFavorites, setRecentFavorites] = useState([])

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            
            // Fetch user profile data
            try {
                const profile = await api.getUserProfile()
                setUserStats(profile.user)
                
                // Extract recent downloads (last 5)
                if (profile.user?.downloads && Array.isArray(profile.user.downloads)) {
                    setRecentDownloads(profile.user.downloads.slice(0, 5))
                }
                
                // Extract recent favorites (last 5)  
                if (profile.user?.favorites && Array.isArray(profile.user.favorites)) {
                    setRecentFavorites(profile.user.favorites.slice(0, 5))
                }
            } catch (error) {
                console.warn('Could not fetch user profile:', error.message)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDownloadsCount = () => {
        if (userStats?.downloads && Array.isArray(userStats.downloads)) {
            return userStats.downloads.length
        }
        return 0
    }

    const getFavoritesCount = () => {
        if (userStats?.favorites && Array.isArray(userStats.favorites)) {
            return userStats.favorites.length
        }
        return 0
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">My Profile</h1>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                            <FaCog />
                            <span>Settings</span>
                        </button>
                    </div>
                    
                    {/* Profile Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                <FaUser className="text-white text-2xl" />
                            </div>
                            
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{user?.name || userStats?.name || 'User'}</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className="text-gray-300">{user?.email || userStats?.email || 'user@example.com'}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <FaCrown className="text-yellow-500" />
                                        <span className="text-gray-300 capitalize">{user?.role || userStats?.role || 'user'}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <FaCalendar className="text-gray-400" />
                                        <span className="text-gray-300">
                                            Joined {user?.createdAt || userStats?.createdAt 
                                                ? new Date(user?.createdAt || userStats?.createdAt).toLocaleDateString() 
                                                : 'Recently'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <FaDownload className="text-blue-500 text-xl" />
                                    <h3 className="text-lg font-semibold text-white">Downloads</h3>
                                </div>
                                <Link 
                                    href="/downloads"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <FaArrowRight />
                                </Link>
                            </div>
                            <p className="text-3xl font-bold text-white mb-2">{getDownloadsCount()}</p>
                            <p className="text-gray-400 text-sm">Total applications downloaded</p>
                        </div>
                        
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <FaHeart className="text-red-500 text-xl" />
                                    <h3 className="text-lg font-semibold text-white">Favorites</h3>
                                </div>
                                <Link 
                                    href="/favorites"
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <FaArrowRight />
                                </Link>
                            </div>
                            <p className="text-3xl font-bold text-white mb-2">{getFavoritesCount()}</p>
                            <p className="text-gray-400 text-sm">Applications in favorites</p>
                        </div>
                        
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <FaStar className="text-yellow-500 text-xl" />
                                <h3 className="text-lg font-semibold text-white">Reviews</h3>
                            </div>
                            <p className="text-3xl font-bold text-white mb-2">0</p>
                            <p className="text-gray-400 text-sm">Reviews written</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    {!loading && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Downloads */}
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">Recent Downloads</h3>
                                    <Link 
                                        href="/downloads"
                                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>
                                
                                {recentDownloads.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentDownloads.map((download, index) => (
                                            <div key={download._id || index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <FaDownload className="text-white text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-white truncate">
                                                        {download.app?.name || 'Unknown App'}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {download.downloadedAt 
                                                            ? new Date(download.downloadedAt).toLocaleDateString()
                                                            : 'Recently'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaDownload className="text-4xl text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">No downloads yet</p>
                                        <Link href="/apps">
                                            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                                                Browse Apps
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Recent Favorites */}
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">Recent Favorites</h3>
                                    <Link 
                                        href="/favorites"
                                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>
                                
                                {recentFavorites.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentFavorites.map((favorite, index) => (
                                            <div key={favorite._id || index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                                                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                                    <FaHeart className="text-white text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-white truncate">
                                                        {favorite.name || 'Unknown App'}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {favorite.developer || 'Unknown Developer'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaHeart className="text-4xl text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">No favorites yet</p>
                                        <Link href="/apps">
                                            <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                                                Find Apps to Favorite
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-20">
                            <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading profile data...</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 