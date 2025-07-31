'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FaBars, FaSearch, FaUser, FaSignInAlt, FaSignOutAlt, FaCog, FaBell, FaCrown, FaGem } from 'react-icons/fa'
import { MdNotifications } from 'react-icons/md'
import Link from 'next/link'
import AdvancedSearch from '../header/AdvancedSearch'

export default function Header({ onMenuClick, sidebarOpen }) {
    const [isMounted, setIsMounted] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { user, logout, loading } = useAuth()
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            setUserMenuOpen(false)
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    if (!isMounted) {
        return (
            <header className="h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-700/50">
                <div className="h-full flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Loading...</div>
                </div>
            </header>
        )
    }

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
                
                <div className="relative z-10 h-16 px-4 lg:px-8">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Section */}
                        <div className="flex items-center space-x-6">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={onMenuClick}
                                className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100"
                            >
                                <FaBars className="text-xl" />
                            </button>

                            {/* Logo */}
                            
                        </div>

                        {/* Center Section - Search */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className="w-full flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left hover:border-purple-300 hover:bg-gray-100 transition-all duration-300 group"
                                >
                                    <FaSearch className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="text-gray-500 group-hover:text-gray-700 transition-colors flex-1">
                                        Search apps, games, APKs, IPAs...
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 font-mono">
                                            ⌘K
                                        </kbd>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    </div>
                                </button>

                                {/* Search Slider */}
                                {searchOpen && (
                                    <div className="fixed top-16 left-0 right-0 z-60 px-4 py-2">
                                        <AdvancedSearch onClose={() => setSearchOpen(false)} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-3">
                            {/* Premium Badge */}
                            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                                <FaGem className="text-white text-xs" />
                                <span className="text-white text-xs font-semibold">PREMIUM</span>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100">
                                <FaBell className="text-lg" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                    3
                                </span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                {loading ? (
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                                ) : user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center space-x-3 p-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-gray-100 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                                                <span className="text-white text-sm font-bold">
                                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="hidden sm:block text-left">
                                                <div className="text-gray-900 font-semibold text-sm">
                                                    {user.username}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    Premium User
                                                </div>
                                            </div>
                                        </button>

                                        {/* User Dropdown */}
                                        {userMenuOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                <div className="p-4 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">
                                                                {user.username?.charAt(0).toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-900 font-semibold text-sm">
                                                                {user.username}
                                                            </div>
                                                            <div className="text-gray-500 text-xs">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2 space-y-1">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center space-x-3 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <FaUser className="text-sm" />
                                                        <span className="font-medium text-sm">Profile</span>
                                                    </Link>
                                                    <Link
                                                        href="/settings"
                                                        className="flex items-center space-x-3 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <FaCog className="text-sm" />
                                                        <span className="font-medium text-sm">Settings</span>
                                                    </Link>
                                                    <hr className="border-gray-100 my-2" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center space-x-3 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                                                    >
                                                        <FaSignOutAlt className="text-sm" />
                                                        <span className="font-medium text-sm">Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <FaSignInAlt className="text-sm" />
                                        <span className="font-semibold text-sm">
                                            Sign In
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Menu Overlay */}
                {userMenuOpen && (
                    <div 
                        className="fixed inset-0 z-30"
                        onClick={() => setUserMenuOpen(false)}
                    />
                )}
            </header>

            {/* Search Backdrop - Outside header */}
            {searchOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={() => setSearchOpen(false)}
                />
            )}
        </>
    )
}
