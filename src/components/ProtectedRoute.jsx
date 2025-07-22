'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FaSpinner, FaLock } from 'react-icons/fa'

export default function ProtectedRoute({ 
    children, 
    requireAdmin = false, 
    requireModerator = false,
    fallback = null 
}) {
    const { isAuthenticated, user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, loading, router])

    // Show loading spinner while checking authentication
    if (loading) {
        return fallback || (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <FaSpinner className="text-4xl text-red-500 animate-spin mb-4" />
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return null // Router will handle redirect
    }

    // Check for admin role if required
    if (requireAdmin && user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center">
                    <FaLock className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // Check for moderator role if required
    if (requireModerator && !['admin', 'moderator'].includes(user?.role)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center">
                    <FaLock className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">You need moderator privileges to access this page.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // Render children if all checks pass
    return children
} 