'use client'

import { memo } from 'react'
import { FaDownload, FaStar, FaFire, FaEye, FaShieldAlt } from 'react-icons/fa'
import Link from 'next/link'

/**
 * CategoryAppsGrid component - Single Responsibility: Display apps in a grid layout
 * Follows SOLID principles with clean separation of concerns
 */
export const CategoryAppsGrid = memo(({ 
    apps = [], 
    onAppClick,
    loading = false,
    className = ''
}) => {
    const handleAppClick = (app) => {
        if (onAppClick) {
            onAppClick(app)
        } else {
            // Default navigation to app page
            window.location.href = `/app/${app.slug || app._id}`
        }
    }

    if (loading) {
        return (
            <section className={`py-16 px-4 relative ${className}`}>
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/40 h-64">
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg mb-4 mx-auto"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!apps || apps.length === 0) {
        return (
            <section className={`py-8 px-4 relative ${className}`}>
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center py-12">
                        <div className="relative">
                            {/* Terminal Style No Results */}
                            <div className="bg-black/90 border-2 border-red-500 p-8 max-w-md mx-auto">
                                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400"></div>
                                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400"></div>
                                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400"></div>
                                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400"></div>
                                
                                <FaShieldAlt className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
                                <h3 className="text-2xl font-bold text-red-400 mb-2 font-mono">
                                    [NO_APPS_FOUND]
                                </h3>
                                <p className="text-gray-400 font-mono text-sm">
                                    
                                    search_query_returned_empty_results
                                </p>
                                <div className="mt-4 text-green-400 font-mono text-xs">
                                    TRY_DIFFERENT_FILTERS...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className={`py-8 px-4 relative ${className}`}>
            <div className="container mx-auto max-w-7xl">
                {/* Apps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {apps.map((app, index) => (
                        <AppCard 
                            key={app._id || app.id || index}
                            app={app}
                            onClick={handleAppClick}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
})

/**
 * AppCard component - Single Responsibility: Display individual app information
 */
const AppCard = memo(({ app, onClick, index }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(app)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <article
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            tabIndex={0}
            role="button"
            aria-label={`Download ${app.name}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/40 hover:border-red-500/40 transition-all duration-300 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-red-500/10 h-full relative overflow-hidden">
                {/* Terminal corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-400/40 group-hover:border-red-400 transition-colors"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-400/40 group-hover:border-red-400 transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-400/40 group-hover:border-red-400 transition-colors"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-400/40 group-hover:border-red-400 transition-colors"></div>
                
                {/* Scan lines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* App Icon */}
                <div className="relative mb-4">
                    {app.images && app.images.length > 0 ? (
                        <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden bg-gray-700/40 flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                            <img 
                                src={app.images[0]} 
                                alt={`${app.name} icon`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                            <div className="w-full h-full bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-2xl hidden">
                                📱
                            </div>
                        </div>
                    ) : (
                        <div className="w-16 h-16 mx-auto rounded-lg bg-gray-700/40 flex items-center justify-center text-gray-400 text-2xl border border-red-500/20 group-hover:border-red-500/40 transition-colors">
                            📱
                        </div>
                    )}

                    {/* Status Badges */}
                    {(app.isHot || app.isFeatured || app.isNewApp || app.isPopular || app.isTopRated) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-black">
                            {app.isHot && <FaFire className="text-white text-xs" />}
                            {app.isNewApp && !app.isHot && <span className="text-white text-xs font-bold">N</span>}
                            {app.isTopRated && !app.isHot && !app.isNewApp && <FaStar className="text-white text-xs" />}
                            {(app.isFeatured || app.isPopular) && !app.isHot && !app.isNewApp && !app.isTopRated && <FaFire className="text-white text-xs" />}
                        </div>
                    )}
                </div>

                {/* App Name */}
                <h3 className="font-bold text-white text-sm mb-2 text-center line-clamp-2 group-hover:text-red-300 transition-colors duration-300 font-mono">
                    <span className="text-red-500">[</span>{app.name}<span className="text-red-500">]</span>
                </h3>

                {/* App Developer */}
                {app.developer && (
                    <div className="text-center mb-2">
                        <span className="text-xs text-gray-400 font-mono">
                            by {app.developer}
                        </span>
                    </div>
                )}

                {/* App Stats */}
                <div className="flex items-center justify-center space-x-3 text-xs text-gray-400 mb-3">
                    {app.rating > 0 && (
                        <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded">
                            <FaStar className="text-yellow-400" />
                            <span className="text-white font-mono">{app.rating}</span>
                        </div>
                    )}
                    {app.downloadCount && (
                        <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded">
                            <FaDownload className="text-green-400" />
                            <span className="text-white font-mono">{app.downloadCount}</span>
                        </div>
                    )}
                </div>

                {/* App Category */}
                {app.category && (
                    <div className="text-center mb-3">
                        <span className="text-xs text-red-400 px-2 py-1 bg-red-900/20 rounded border border-red-600/30 font-mono">
                            {app.category.name || app.category}
                        </span>
                    </div>
                )}

                {/* Premium Badge */}
                {app.isPremium && (
                    <div className="text-center">
                        <span className="text-xs text-yellow-400 px-2 py-1 bg-yellow-900/20 rounded border border-yellow-600/30 font-mono">
                            PREMIUM
                        </span>
                    </div>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-xl border border-red-500/20"></div>
                </div>
            </div>
        </article>
    )
})

CategoryAppsGrid.displayName = 'CategoryAppsGrid'
AppCard.displayName = 'AppCard'