'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Search from './Search.jsx'
import { 
    FaBars, 
    FaTimes,
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaMobile,
    FaCrown
} from 'react-icons/fa'
import { MdSettings, MdFavorite, MdAdminPanelSettings } from 'react-icons/md'

export default function MobileMenu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()
    const mobileMenuRef = useRef(null)

    // Check if user is admin
    const isAdmin = user?.role === 'admin' || user?.isAdmin === true

    const navigationItems = [
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'Apps', href: '/apps', icon: '📱' },
        { name: 'Categories', href: '/categories', icon: '📂' },
        { name: 'Top Rated', href: '/top-rated', icon: '⭐' },
        { name: 'New Releases', href: '/new-releases', icon: '🆕' },
        { name: 'Contact', href: '/contact', icon: '📞' },
    ]

    const handleLogout = async () => {
        try {
            await logout()
            setIsMobileMenuOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSearchClick = () => {
        // This will be handled by the Search component
    }

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false)
            }
        }

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMobileMenuOpen])

    // Handle body overflow when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isMobileMenuOpen])

    const handleChildClick = (event) => {
        event.stopPropagation() 
    }   
    
    const handleBackdropClick = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-500 transition-all duration-300 z-[10]"
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Mobile Menu Portal - Rendered outside header */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[1001] w-screen h-screen" 
                    onClick={handleBackdropClick}
                >
                    <div 
                        className="p-4 h-full overflow-y-auto" 
                        onClick={handleChildClick} 
                        ref={mobileMenuRef}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-red-500 font-mono text-lg">MENU</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-red-500 hover:text-red-400 p-2"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        {/* Mobile Search */}
                        <div className="mb-6">
                            <Search onSearchClick={handleSearchClick} />
                        </div>
                        
                        <div className="space-y-4">
                            {/* Navigation Links */}
                            {navigationItems.map((item) => (
                                <Link 
                                    key={item.href} 
                                    href={item.href} 
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="text-red-500">{item.icon}</span>
                                    <span className="font-mono text-sm">{item.name}</span>
                                </Link>
                            ))}
                            
                            {/* User Menu for Mobile */}
                            {user && (
                                <div className="border-t border-red-500/20 pt-4 space-y-2">
                                    <div className="px-4 py-3 border border-red-500/20 rounded">
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
                                    
                                    {isAdmin && (
                                        <Link 
                                            href="/admin" 
                                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <MdAdminPanelSettings className="text-yellow-400" />
                                            <span className="font-mono text-sm">Admin Panel</span>
                                        </Link>
                                    )}
                                    
                                    <Link 
                                        href="/profile" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaUser className="text-red-500" />
                                        <span className="font-mono text-sm">Profile</span>
                                    </Link>
                                    
                                    <Link 
                                        href="/downloads" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaMobile className="text-red-500" />
                                        <span className="font-mono text-sm">Downloads</span>
                                    </Link>
                                    
                                    <Link 
                                        href="/favorites" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <MdFavorite className="text-red-500" />
                                        <span className="font-mono text-sm">Favorites</span>
                                    </Link>
                                    
                                    <Link 
                                        href="/settings" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <MdSettings className="text-red-500" />
                                        <span className="font-mono text-sm">Settings</span>
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                    >
                                        <FaSignOutAlt className="text-red-500" />
                                        <span className="font-mono text-sm">Logout</span>
                                    </button>
                                </div>
                            )}
                            
                            {/* Auth Links for non-logged users */}
                            {!user && (
                                <div className="border-t border-red-500/20 pt-4 space-y-2">
                                    <Link 
                                        href="/auth/login" 
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaSignInAlt className="text-red-500" />
                                        <span className="font-mono text-sm">LOGIN</span>
                                    </Link>
                                    <Link 
                                        href="/auth/register" 
                                        className="flex items-center space-x-3 px-4 py-3 bg-red-500 hover:bg-red-600 transition-all duration-300 rounded"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaUserPlus className="text-black" />
                                        <span className="text-black font-mono text-sm font-bold">REGISTER</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}