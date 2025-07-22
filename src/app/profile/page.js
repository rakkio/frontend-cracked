'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { FaUser, FaEnvelope, FaCalendar, FaCrown } from 'react-icons/fa'

export default function ProfilePage() {
    const { user } = useAuth()

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>
                    
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                <FaUser className="text-white text-2xl" />
                            </div>
                            
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{user?.name || 'User'}</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-gray-400" />
                                        <span className="text-gray-300">{user?.email || 'user@example.com'}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <FaCrown className="text-yellow-500" />
                                        <span className="text-gray-300 capitalize">{user?.role || 'user'}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <FaCalendar className="text-gray-400" />
                                        <span className="text-gray-300">
                                            Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-700/30 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm">Downloads</p>
                                    <p className="text-xl font-bold text-white">{user?.downloads || 0}</p>
                                </div>
                                
                                <div className="bg-gray-700/30 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm">Favorites</p>
                                    <p className="text-xl font-bold text-white">{user?.favorites?.length || 0}</p>
                                </div>
                                
                                <div className="bg-gray-700/30 rounded-lg p-4">
                                    <p className="text-gray-400 text-sm">Reviews</p>
                                    <p className="text-xl font-bold text-white">0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
} 