'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FaBars, FaSearch, FaUser, FaSignInAlt, FaSignOutAlt, FaCog, FaBell } from 'react-icons/fa'
import Link from 'next/link'
import Logo from './header/Logo'
import Navigation from './header/Navigation'
import UserMenu from './header/UserMenu'
import MobileMenu from './header/MobileMenu'
import Search from './header/Search.jsx'
import MobileSearchButton from './header/MobileSearchButton.jsx'

export default function Header() {
    const [isMounted, setIsMounted] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
            <header className="h-16 bg-black/50 border-b border-red-500/20">
                <div className="h-full flex items-center justify-center">
                    <div className="text-red-500 text-sm">Loading...</div>
                </div>
            </header>
        )
    }

    return (
        <>
            <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b-2 border-red-500/30 shadow-2xl">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent"></div>
                <div className="scan-lines absolute inset-0"></div>
                
                <div className="relative z-10 h-16 px-4 lg:px-6">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Section */}
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-red-400 transition-colors"
                            >
                                <FaBars className="text-xl" />
                            </button>

                            {/* Logo */}
                            <Logo />

                            {/* Breadcrumb / Page Title - Hidden on mobile */}
                            <div className="hidden sm:flex items-center space-x-2">
                                <div className="text-gray-400 font-mono text-sm">
                                    root@crackmarket:~#
                                </div>
                                <div className="text-red-400 font-mono text-sm animate-pulse">
                                    _
                                </div>
                            </div>
                        </div>

                        {/* Center Section - Search */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <div className="relative">
                                <button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className="w-full flex items-center space-x-3 bg-black/50 border border-red-500/20 rounded-lg px-4 py-2 text-left hover:border-red-500/40 transition-colors"
                                >
                                    <FaSearch className="text-gray-400 text-sm" />
                                    <span className="text-gray-400 font-mono text-sm flex-1">
                                        Buscar aplicaciones, juegos...
                                    </span>
                                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-400">
                                        Ctrl K
                                    </kbd>
                                </button>

                                {/* Search Modal */}
                                {searchOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 z-50">
                                        <Search onClose={() => setSearchOpen(false)} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            {/* Desktop Navigation */}
                            <div className="hidden lg:block">
                                <Navigation />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-300 hover:text-red-400 transition-colors">
                                <FaBell className="text-lg" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                                    3
                                </span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                {loading ? (
                                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                                ) : user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center space-x-2 p-2 bg-black/50 border border-red-500/20 rounded-lg hover:border-red-500/40 transition-colors"
                                        >
                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="hidden sm:inline text-gray-300 font-mono text-sm">
                                                {user.username}
                                            </span>
                                        </button>

                                        {/* User Dropdown */}
                                        {userMenuOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-xl border border-red-500/20 rounded-lg shadow-2xl z-50">
                                                <div className="p-2 space-y-1">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center space-x-2 p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <FaUser className="text-sm" />
                                                        <span className="font-mono text-sm">Perfil</span>
                                                    </Link>
                                                    <Link
                                                        href="/settings"
                                                        className="flex items-center space-x-2 p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <FaCog className="text-sm" />
                                                        <span className="font-mono text-sm">Configuración</span>
                                                    </Link>
                                                    <hr className="border-red-500/20 my-1" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center space-x-2 p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <FaSignOutAlt className="text-sm" />
                                                        <span className="font-mono text-sm">Cerrar Sesión</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center space-x-2 p-2 bg-red-500/20 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        <FaSignInAlt className="text-red-400 text-sm" />
                                        <span className="hidden sm:inline text-red-400 font-mono text-sm">
                                            Iniciar Sesión
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <MobileMenu onClose={() => setMobileMenuOpen(false)} />
                </div>
            )}

            {/* Search Overlay */}
            {searchOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setSearchOpen(false)}
                />
            )}

            {/* User Menu Overlay */}
            {userMenuOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}

            <style jsx>{`
                .matrix-rain {
                    background: linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent);
                    background-size: 50px 50px;
                    animation: matrix-fall 20s linear infinite;
                }
                
                @keyframes matrix-fall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                
                .scan-lines {
                    background: linear-gradient(90deg, transparent 98%, rgba(255, 0, 0, 0.1) 100%);
                    background-size: 3px 100%;
                    animation: scan 2s linear infinite;
                }
                
                @keyframes scan {
                    0% { background-position: 0 0; }
                    100% { background-position: 100% 0; }
                }
                
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-2deg); }
                }
                
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                }
                
                @keyframes float-4 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(-1deg); }
                }
                
                .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 4s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 3.5s ease-in-out infinite; }
                .animate-float-4 { animation: float-4 4.5s ease-in-out infinite; }
            `}</style>
        </>
    )
}
