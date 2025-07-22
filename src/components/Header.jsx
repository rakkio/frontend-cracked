'use client'
import React from 'react'
import { FaBars, FaSearch, FaUser, FaTimes, FaSkull, FaSignOutAlt, FaCog, FaSpinner } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Logo from './Logo'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const { user, isAuthenticated, logout, loading } = useAuth()
    const router = useRouter()
    
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

    useEffect(() => {
        if (isOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen, isSearchOpen])    

    const handleChildClick = (event) => {
        event.stopPropagation() 
    }   
    
    const handleBackdropClick = () => {
        setIsOpen(false)
        setIsSearchOpen(false)
    }

    // Search functionality
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        setSearchLoading(true)
        try {
            const response = await api.getApps({
                search: query.trim(),
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

    return (
        <>
            <header className='sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 shadow-2xl border-b border-red-500/20 backdrop-blur-xl'>
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px] opacity-30"></div>
                
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 animate-pulse"></div>
                
                <div className='container mx-auto px-6 py-4 relative'>
                    <div className='flex justify-between items-center'>
                        {/* Logo y título */}
                        <Link href="/" className='flex items-center space-x-3 group relative z-10'>
                            <Logo />
                        </Link>

                        {/* Botones de acción */}
                        <div className='flex items-center space-x-3'>
                            <button 
                                onClick={toggleSearch}
                                className='p-3 bg-gray-800/60 hover:bg-gradient-to-r hover:from-red-900/70 hover:to-red-800/70 rounded-xl transition-all duration-500 border border-gray-600/50 hover:border-red-400/60 group backdrop-blur-sm shadow-lg hover:shadow-red-500/20 hover:shadow-xl transform hover:scale-105'
                                aria-label="Search"
                            >
                                <FaSearch className='text-gray-300 group-hover:text-red-300 transition-all duration-500 group-hover:rotate-12' />
                            </button>
                            
                            <button 
                                onClick={toggleNavigation}
                                className='p-3 bg-gray-800/60 hover:bg-gradient-to-r hover:from-red-900/70 hover:to-red-800/70 rounded-xl transition-all duration-500 border border-gray-600/50 hover:border-red-400/60 group backdrop-blur-sm shadow-lg hover:shadow-red-500/20 hover:shadow-xl transform hover:scale-105'
                                aria-label="Menu"
                            >
                                {isOpen ? (
                                    <FaTimes className='text-gray-300 group-hover:text-red-300 transition-all duration-500 group-hover:rotate-90' />
                                ) : (
                                    <FaBars className='text-gray-300 group-hover:text-red-300 transition-all duration-500 group-hover:scale-110' />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay de búsqueda */}
            {isSearchOpen && (
                <div className='fixed inset-0 bg-black/30 backdrop-blur-lg z-50 transition-all duration-500' onClick={handleBackdropClick}>
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_50%)] animate-pulse"></div>
                    
                    <div className='flex justify-center items-start pt-16 px-4'>
                        <div className='w-full max-w-3xl bg-gradient-to-br from-gray-900/95 to-black/95 rounded-3xl border border-red-500/30 shadow-2xl backdrop-blur-xl transform transition-all duration-500 scale-100' onClick={handleChildClick}>
                            {/* Glowing border effect */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 blur-xl animate-pulse"></div>
                            
                            <div className='p-8 relative z-10'>
                                <div className='flex justify-between items-center mb-8'>
                                    <h2 className='text-3xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent flex items-center'>
                                        <FaSearch className='mr-4 text-red-500 animate-pulse' />
                                        Search Underground
                                    </h2>
                                    <button 
                                        onClick={() => setIsSearchOpen(false)}
                                        className='text-gray-400 hover:text-red-400 transition-all duration-300 hover:rotate-90 hover:scale-110 p-2'
                                    >
                                        <FaTimes size={24} />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSearchSubmit} className='mb-8'>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            placeholder="Search for cracked apps, games, tools..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='w-full px-6 py-4 bg-gray-800/80 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/70 focus:ring-2 focus:ring-red-500/30 transition-all duration-500 text-lg backdrop-blur-sm shadow-inner'
                                            autoFocus
                                        />
                                        <button 
                                            type="submit"
                                            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2'
                                            disabled={searchLoading}
                                        >
                                            {searchLoading ? (
                                                <FaSpinner className="animate-spin text-red-500" />
                                            ) : (
                                                <FaSearch />
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Search Results */}
                                {showResults && searchQuery && (
                                    <div className='mb-8'>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h3 className='text-white font-semibold text-xl'>Search Results</h3>
                                            {searchResults.length > 0 && (
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    className='text-red-400 hover:text-red-300 text-sm font-medium hover:underline transition-colors duration-300'
                                                >
                                                    View all results →
                                                </button>
                                            )}
                                        </div>
                                        
                                        {searchLoading ? (
                                            <div className='flex justify-center py-12'>
                                                <FaSpinner className="text-red-500 animate-spin text-3xl" />
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className='space-y-3 max-h-80 overflow-y-auto custom-scrollbar'>
                                                {searchResults.map((app) => (
                                                    <div
                                                        key={app._id}
                                                        onClick={() => handleAppClick(app)}
                                                        className='flex items-center space-x-4 p-4 bg-gray-800/40 hover:bg-gradient-to-r hover:from-gray-700/60 hover:to-red-900/30 rounded-2xl cursor-pointer transition-all duration-300 group border border-gray-700/30 hover:border-red-500/30 backdrop-blur-sm'
                                                    >
                                                        {app.images && app.images[0] ? (
                                                            <img 
                                                                src={app.images[0]} 
                                                                alt={app.name}
                                                                className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                                📱
                                                            </div>
                                                        )}
                                                        <div className='flex-1'>
                                                            <h4 className='text-white font-semibold group-hover:text-red-300 transition-colors duration-300'>
                                                                {app.name}
                                                            </h4>
                                                            <p className='text-gray-400 text-sm'>
                                                                {app.category?.name} • {app.developer}
                                                            </p>
                                                        </div>
                                                        <div className='text-yellow-400 text-sm font-medium bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20'>
                                                            ⭐ {app.rating || '4.5'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='text-center py-8 text-gray-400'>
                                                <div className='text-6xl mb-4'>🔍</div>
                                                <p className='text-lg mb-2'>No apps found for "{searchQuery}"</p>
                                                <p className='text-sm'>Try different keywords or check our popular searches below</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className='text-gray-400'>
                                    <p className='mb-3 text-sm font-medium'>🔥 Popular searches:</p>
                                    <div className='flex flex-wrap gap-3'>
                                        {['Adobe Photoshop', 'Microsoft Office', 'Spotify Premium', 'Netflix', 'Games'].map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => handleQuickSearch(term)}
                                                className='px-4 py-2 bg-gray-800/60 hover:bg-gradient-to-r hover:from-red-900/40 hover:to-red-800/40 rounded-full text-sm border border-gray-600/40 hover:border-red-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm'
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Menú de navegación */}
            {isOpen && (
                <div className='fixed inset-0 bg-black/40 backdrop-blur-lg z-50 transition-all duration-500' onClick={handleBackdropClick}>
                    <div className='fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900/98 to-black/98 border-l border-red-500/30 shadow-2xl transform transition-all duration-500 backdrop-blur-xl' onClick={handleChildClick}>
                        {/* Glowing edge effect */}
                        
                        <div className='p-8 h-full overflow-y-auto custom-scrollbar'>
                            {/* Header del menú */}
                            <div className='flex justify-between items-center mb-10'>
                                <div className='flex items-center space-x-4'>
                                    <div className='relative'>
                                        <FaSkull className='text-red-500 text-3xl animate-pulse' />
                                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping'></div>
                                    </div>
                                    <h2 className='text-2xl font-bold bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent'>Navigation</h2>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className='text-gray-400 hover:text-red-400 transition-all duration-300 hover:rotate-90 hover:scale-110 p-2'
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Navegación principal */}
                            <div className='mb-10'>
                                <h3 className='text-gray-400 text-sm font-bold mb-6 uppercase tracking-widest border-b border-gray-800/50 pb-2'>Main Menu</h3>
                                <ul className='space-y-2'>
                                    {navigationItems.map((item, index) => (
                                        <li key={index}>
                                            <Link 
                                                href={item.href} 
                                                className='flex items-center space-x-4 p-4 rounded-2xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 transition-all duration-500 group border border-transparent hover:border-red-500/30 backdrop-blur-sm'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className='text-xl group-hover:scale-125 transition-transform duration-500 w-8 text-center'>
                                                    {item.icon}
                                                </span>
                                                <span className='font-medium text-lg'>{item.name}</span>
                                                <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                                    →
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sección de usuario */}
                            <div className='border-t border-gray-800/50 pt-8'>
                                <div className='flex items-center space-x-4 mb-8 p-4 bg-gradient-to-r from-gray-800/40 to-red-900/20 rounded-2xl border border-gray-700/30'>
                                    <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg'>
                                        <FaUser className='text-white text-lg' />
                                    </div>
                                    <div className='flex-1'>
                                        {isAuthenticated && user ? (
                                            <>
                                                <p className='text-white font-semibold text-lg'>{user.name || 'User'}</p>
                                                <p className='text-gray-400 text-sm'>{user.email || 'user@blackmarket.com'}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className='text-white font-semibold text-lg'>Guest User</p>
                                                <p className='text-gray-400 text-sm'>Join the underground</p>
                                            </>
                                        )}
                                    </div>
                                    <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                                </div>

                                <div className='space-y-2'>
                                    {userItems.map((item, index) => (
                                        item.onClick ? (
                                            <button
                                                key={index}
                                                onClick={item.onClick}
                                                className='flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 transition-all duration-300 text-sm w-full text-left group border border-transparent hover:border-gray-600/30'
                                            >
                                                <span className='group-hover:scale-110 transition-transform duration-300'>{item.icon}</span>
                                                <span>{item.name}</span>
                                            </button>
                                        ) : (
                                            <Link
                                                key={index}
                                                href={item.href}
                                                className='flex items-center space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/40 transition-all duration-300 text-sm group border border-transparent hover:border-gray-600/30'
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className='group-hover:scale-110 transition-transform duration-300'>{item.icon}</span>
                                                <span>{item.name}</span>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Footer del menú */}
                            <div className='mt-auto pt-8 border-t border-gray-800/50'>
                                <div className='text-center text-xs text-gray-500 space-y-2'>
                                    <div className='bg-gray-800/30 rounded-xl p-4'>
                                        <p className='font-medium text-red-400'>© 2025 Black Market Hub</p>
                                        <p className='mt-1'>Underground Apps Network</p>
                                        <div className='flex justify-center items-center mt-2 space-x-1'>
                                            <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
                                            <span className='text-red-400'>Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}
