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
    FaSearch
} from 'react-icons/fa'

export default function DownloadsPage() {
    const { user, isAuthenticated } = useAuth()
    const [downloads, setDownloads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isAuthenticated) {
            fetchDownloads()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated])

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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <FaDownload className="text-6xl text-red-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
                    <p className="text-gray-400 mb-6">
                        You need to be logged in to view your download history.
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
                    <p className="text-gray-400">Loading your downloads...</p>
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
                        <FaDownload className="text-4xl text-red-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Downloads</h1>
                            <p className="text-gray-400">Track all your downloaded applications</p>
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
                            Download history feature is coming soon. This feature will allow you to track all your downloads.
                        </p>
                        <Link href="/apps">
                            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                Browse Apps
                            </button>
                        </Link>
                    </div>
                ) : downloads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {downloads.map((download, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500/50 transition-colors">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                        <FaDownload className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">
                                            {download.app?.name || 'Unknown App'}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            {download.app?.developer || 'Unknown Developer'}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span className="flex items-center space-x-1">
                                                <FaCalendar />
                                                <span>{new Date(download.downloadedAt).toLocaleDateString()}</span>
                                            </span>
                                            {download.app?.rating && (
                                                <span className="flex items-center space-x-1">
                                                    <FaStar className="text-yellow-500" />
                                                    <span>{download.app.rating}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <FaDownload className="text-6xl text-gray-600 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Downloads Yet</h3>
                        <p className="text-gray-400 mb-6">
                            Start downloading apps to see your history here.
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