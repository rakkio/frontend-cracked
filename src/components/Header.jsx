'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Logo from './Logo'
import { 
    FaTerminal, 
    FaSearch, 
    FaUser, 
    FaSignOutAlt, 
    FaSignInAlt, 
    FaUserPlus, 
    FaBars, 
    FaTimes, 
    FaCode, 
    FaShieldAlt 
} from 'react-icons/fa'
import { MdDashboard, MdSettings, MdFavorite } from 'react-icons/md'

export default function Header() {
    // Add client-side mounting state
    const [isMounted, setIsMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    
    const { user, isAuthenticated, logout, loading } = useAuth()
    const router = useRouter()
    const userMenuRef = useRef(null)
    
    // Client-side mounting effect
    useEffect(() => {
        setIsMounted(true)
    }, [])

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
            logout()
            setIsOpen(false)
            setIsUserMenuOpen(false)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const userItems = isAuthenticated ? [
        { name: 'Profile', href: '/profile', icon: '👤' },
        { name: 'Downloads', href: '/downloads', icon: '⬇️' },
        { name: 'Favorites', href: '/favorites', icon: '❤️' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
        { name: 'Logout', href: '#', icon: '🚪', onClick: handleLogout },
    ] : [
        { name: 'Login', href: '/auth/login', icon: '🔑' },
        { name: 'Register', href: '/auth/register', icon: '📝' },
    ]

    const toggleNavigation = (e) => {
        e.preventDefault()
        setIsOpen(!isOpen)
    }
    
    const toggleSearch = (e) => {
        e.preventDefault()
        setIsSearchOpen(!isSearchOpen)
    }

    // Fixed useEffect with consistent dependency array
    useEffect(() => {
        if (isOpen || isSearchOpen || isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen, isSearchOpen, isMobileMenuOpen])

    const handleChildClick = (event) => {
        event.stopPropagation() 
    }   
    
    const handleBackdropClick = () => {
        setIsOpen(false)
        setIsSearchOpen(false)
        setIsMobileMenuOpen(false)
    }

    // Search functionality
    const handleSearch = async (query) => {
        if (!query && !searchQuery.trim()) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        const searchTerm = query || searchQuery
        setSearchLoading(true)
        try {
            const response = await api.getApps({
                search: searchTerm.trim(),
                limit: 8
            })
            setSearchResults(response.data.apps || [])
            setShowResults(true)
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setSearchLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearchOpen(false)
            router.push(`/apps?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e)
        }
    }

    const handleQuickSearch = (term) => {
        setSearchQuery(term)
        handleSearch(term)
    }

    const handleAppClick = (app) => {
        setIsSearchOpen(false)
        router.push(`/app/${app.slug}`)
    }

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch(searchQuery)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

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

    // Prevent hydration mismatch by not rendering responsive elements until mounted
    if (!isMounted) {
        return (
            <>
                <div className="fixed top-0 left-0 w-full h-32 pointer-events-none z-0 overflow-hidden">
                    <div className="matrix-rain opacity-20"></div>
                </div>

                <header className="relative bg-black/95 backdrop-blur-md border-b-2 border-red-500 shadow-2xl z-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Simple logo for SSR */}
                            <Link href="/" className="flex items-center space-x-3 group relative">
                                <div className="relative">
                                    <div className="relative bg-black border-2 border-red-500 p-2">
                                        <FaTerminal className="text-red-500 text-xl" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent">
                                        CRACK<span className="text-red-500">[</span>MARKET<span className="text-red-500">]</span>
                                    </h1>
                                </div>
                            </Link>
                            
                            {/* Placeholder for other elements */}
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8"></div>
                            </div>
                        </div>
                    </div>
                </header>
            </>
        )
    }

    return (
        <>
            {/* Matrix Rain Background */}
            <div className="fixed z-[-1] top-0 left-0 w-full h-32 pointer-events-none z-0 overflow-hidden">
                <div className="matrix-rain opacity-20"></div>
            </div>

            <header className="sticky top-0 bg-black/45 backdrop-blur-md border-b-2 border-red-500 shadow-2xl z-50">
                {/* Scan Lines Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse"></div>
                <div className="scan-lines"></div>
                
                {/* Floating Code Elements - Hidden on mobile */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="floating-code text-red-500/20 text-xs font-mono hidden md:block">
                        {['sudo access granted', 'root@system:~#', 'exploit.exe', 'bypass.dll'].map((code, i) => (
                            <span key={i} className={`absolute animate-float-${i + 1}`} style={{
                                left: `${20 + i * 25}%`,
                                top: `${10 + i * 15}%`,
                                animationDelay: `${i * 0.5}s`
                            }}>
                                {code}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section - Fixed responsive classes */}
                        <Link href="/" className="flex items-center group relative flex-shrink-0" style={{ gap: isMounted ? (window.innerWidth >= 768 ? '0.75rem' : '0.5rem') : '0.75rem' }}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-black border-2 border-red-500 transform group-hover:scale-110 transition-transform" style={{ padding: isMounted ? (window.innerWidth >= 768 ? '0.5rem' : '0.375rem') : '0.5rem' }}>
                                    <FaTerminal className="text-red-500" style={{ fontSize: isMounted ? (window.innerWidth >= 768 ? '1.25rem' : '1.125rem') : '1.25rem' }} />
                                </div>
                            </div>
                            <div className="relative">
                                <h1 className="font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent" style={{ fontSize: isMounted ? (window.innerWidth >= 768 ? '1.5rem' : '1.125rem') : '1.5rem' }}>
                                    {isMounted && window.innerWidth < 640 ? (
                                        <>AC<span className="text-red-500">[</span>C<span className="text-red-500">]</span></>
                                    ) : (
                                        <>CRACK<span className="text-red-500">[</span>MARKET<span className="text-red-500">]</span></>
                                    )}
                                </h1>
                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
                            </div>
                        </Link>

                        {/* Search Bar - Hidden on mobile, shown in mobile menu */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8 relative">
                            <div className="relative group w-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm group-focus-within:blur-none transition-all"></div>
                                <div className="relative bg-gray-900/90 border border-red-500/50 rounded-none backdrop-blur-sm">
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></div>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></div>
                                    
                                    <input
                                        type="text"
                                        placeholder="> search_apps --query"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-4 py-2 md:py-3 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors text-sm"
                                    />
                                    <button
                                        onClick={() => handleSearch()}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded z-[10]"
                                    >
                                        <FaSearch />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Hidden on mobile */}
                        <nav className="hidden xl:flex items-center space-x-4">
                            {navigationItems.map((item, index) => (    
                                <Link key={item.href} href={item.href} className="group relative">
                                    <div className="flex items-center space-x-2 px-3 py-2 border border-transparent hover:border-red-500 transition-all duration-300 bg-black/50 hover:bg-red-500/10">
                                        <span className="text-red-500 group-hover:text-red-400">{item.icon}</span>
                                        <span className="text-gray-300 group-hover:text-red-400 font-mono text-xs tracking-wider">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu & Mobile Controls */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Search Button for Mobile */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-500 transition-all duration-300 z-[10]"
                            >
                                <FaSearch />
                            </button>

                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 px-2 md:px-4 py-2 bg-gray-900/90 border border-red-500/50 hover:border-red-500 transition-all duration-300 group z-[10]"
                                    >
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-none flex items-center justify-center">
                                            <FaUser className="text-black text-xs md:text-sm" />
                                        </div>
                                        <span className="hidden md:inline text-green-400 font-mono text-sm group-hover:text-red-400 transition-colors">
                                            {user.username}
                                        </span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 md:w-64 bg-black/95 border-2 border-red-500 backdrop-blur-md z-[1001]">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/10 to-transparent"></div>
                                            <div className="relative">
                                                {[
                                                    { href: '/dashboard', label: 'Dashboard', icon: MdDashboard },
                                                    { href: '/favorites', label: 'Favorites', icon: MdFavorite },
                                                    { href: '/settings', label: 'Settings', icon: MdSettings }
                                                ].map((item) => (
                                                    <Link key={item.href} href={item.href} className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border-b border-red-500/20">
                                                        <item.icon className="text-red-500" />
                                                        <span className="font-mono text-sm">{item.label}</span>
                                                    </Link>
                                                ))}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                                >
                                                    <FaSignOutAlt className="text-red-500" />
                                                    <span className="font-mono text-sm">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center space-x-3">
                                    <Link href="/auth/login" className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-900/90 border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300">
                                        <FaSignInAlt className="text-red-500" />
                                        <span className="text-gray-300 hover:text-red-400 font-mono text-xs md:text-sm">LOGIN</span>
                                    </Link>
                                    <Link href="/auth/register" className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 transition-all duration-300">
                                        <FaUserPlus className="text-black" />
                                        <span className="text-black font-mono text-xs md:text-sm font-bold">REGISTER</span>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-500 transition-all duration-300 z-[10]"
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Overlay */}
                    {isSearchOpen && (
                        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[1002]" onClick={handleBackdropClick}>
                            <div className="p-4" onClick={handleChildClick}>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm group-focus-within:blur-none transition-all"></div>
                                    <div className="relative bg-gray-900/90 border border-red-500/50 rounded-none backdrop-blur-sm">
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></div>
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500"></div>
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500"></div>
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></div>
                                        
                                        <input
                                            type="text"
                                            placeholder="> search_apps --query"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 py-4 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSearch()}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded"
                                        >
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="mt-4 text-red-500 hover:text-red-400 font-mono text-sm"
                                >
                                    Cerrar búsqueda
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[1001]" onClick={handleBackdropClick}>
                            <div className="p-4" onClick={handleChildClick}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-red-500 font-mono text-lg">MENU</h2>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-red-500 hover:text-red-400 p-2"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Navigation Links */}
                                    {[
                                        { href: '/', label: 'HOME', icon: FaTerminal },
                                        { href: '/categories', label: 'CATEGORIES', icon: FaCode },
                                        { href: '/latest', label: 'LATEST', icon: FaShieldAlt }
                                    ].map((item) => (
                                        <Link 
                                            key={item.href} 
                                            href={item.href} 
                                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon className="text-red-500" />
                                            <span className="font-mono text-sm">{item.label}</span>
                                        </Link>
                                    ))}
                                    
                                    {/* Auth Links for non-logged users */}
                                    {!user && (
                                        <div className="border-t border-red-500/20 pt-4 space-y-2">
                                            <Link 
                                                href="/auth/login" 
                                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-red-500/20"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <FaSignInAlt className="text-red-500" />
                                                <span className="font-mono text-sm">LOGIN</span>
                                            </Link>
                                            <Link 
                                                href="/auth/register" 
                                                className="flex items-center space-x-3 px-4 py-3 bg-red-500 hover:bg-red-600 transition-all duration-300"
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
                </div>
            </header>

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
