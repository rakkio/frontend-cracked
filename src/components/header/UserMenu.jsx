'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
    FaUser, 
    FaSignOutAlt, 
    FaSignInAlt, 
    FaUserPlus,
    FaMobile,
    FaCrown
} from 'react-icons/fa'
import { MdSettings, MdFavorite, MdAdminPanelSettings } from 'react-icons/md'

export default function UserMenu() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()
    const userMenuRef = useRef(null)

    // Check if user is admin
    const isAdmin = user?.role === 'admin' || user?.isAdmin === true

    const handleLogout = async () => {
        try {
            await logout()
            setIsUserMenuOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    if (user) {
        return (
            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-2 md:px-4 py-2 bg-gray-900/90 border border-red-500/50 hover:border-red-500 transition-all duration-300 group z-[10]"
                >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-none flex items-center justify-center relative">
                        <FaUser className="text-black text-xs md:text-sm" />
                        {isAdmin && (
                            <FaCrown className="absolute -top-1 -right-1 text-yellow-400 text-xs" />
                        )}
                    </div>
                    <span className="hidden md:inline text-green-400 font-mono text-sm group-hover:text-red-400 transition-colors">
                        {user.username}
                    </span>
                </button>

                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 md:w-64 bg-black/95 border-2 border-red-500 backdrop-blur-md z-[1001] rounded-lg">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/10 to-transparent rounded-lg"></div>
                        <div className="relative p-2">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-red-500/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-none flex items-center justify-center relative">
                                        <FaUser className="text-black text-sm" />
                                        {isAdmin && (
                                            <FaCrown className="absolute -top-1 -right-1 text-yellow-400 text-xs" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-white font-mono text-sm font-bold">{user.username}</div>
                                        <div className="text-gray-400 font-mono text-xs">
                                            {isAdmin ? 'Administrator' : 'User'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                {isAdmin && (
                                    <Link 
                                        href="/admin" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <MdAdminPanelSettings className="text-yellow-400" />
                                        <span className="font-mono text-sm">Admin Panel</span>
                                    </Link>
                                )}
                                
                                <Link 
                                    href="/profile" 
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <FaUser className="text-red-500" />
                                    <span className="font-mono text-sm">Profile</span>
                                </Link>
                                
                                <Link 
                                    href="/downloads" 
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <FaMobile className="text-red-500" />
                                    <span className="font-mono text-sm">Downloads</span>
                                </Link>
                                
                                <Link 
                                    href="/favorites" 
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <MdFavorite className="text-red-500" />
                                    <span className="font-mono text-sm">Favorites</span>
                                </Link>
                                
                                <Link 
                                    href="/settings" 
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <MdSettings className="text-red-500" />
                                    <span className="font-mono text-sm">Settings</span>
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                                >
                                    <FaSignOutAlt className="text-red-500" />
                                    <span className="font-mono text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Link href="/auth/login" className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-gray-900/90 border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300">
                <FaSignInAlt className="text-red-500 text-sm" />
                <span className="text-gray-300 hover:text-red-400 font-mono text-xs lg:text-sm">LOGIN</span>
            </Link>
            <Link href="/auth/register" className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-red-500 hover:bg-red-600 transition-all duration-300">
                <FaUserPlus className="text-black text-sm" />
                <span className="text-black font-mono text-xs lg:text-sm font-bold">REGISTER</span>
            </Link>
        </div>
    )
}