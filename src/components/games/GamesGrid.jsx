'use client'

import Link from 'next/link'
import { FaGamepad, FaDownload, FaStar, FaEye, FaTrophy, FaCalendar, FaWindows, FaApple, FaLinux } from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'

export default function GamesGrid({ games, viewMode = 'grid', loading = false }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num?.toString() || '0'
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A'
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
    }

    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'windows': return <FaWindows className="text-blue-400" />
            case 'mac': return <FaApple className="text-gray-300" />
            case 'linux': return <FaLinux className="text-yellow-400" />
            default: return <FaGamepad className="text-purple-400" />
        }
    }

    const getESRBColor = (rating) => {
        switch (rating) {
            case 'E': return 'text-green-400 border-green-500/30 bg-green-500/20'
            case 'E10+': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20'
            case 'T': return 'text-orange-400 border-orange-500/30 bg-orange-500/20'
            case 'M': return 'text-red-400 border-red-500/30 bg-red-500/20'
            case 'AO': return 'text-purple-400 border-purple-500/30 bg-purple-500/20'
            default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20'
        }
    }

    const getCrackBadge = (game) => {
        if (game.crackInfo?.crackGroup) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                    <MdVerified className="mr-1" />
                    {game.crackInfo.crackGroup}
                </span>
            )
        }
        return null
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 animate-pulse">
                        <div className="w-full h-32 bg-gray-700 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded mb-4"></div>
                        <div className="flex justify-between">
                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                            <div className="h-3 bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {games.map((game) => (
                    <Link
                        key={game._id}
                        href={`/games/${game.slug}`}
                        className="group block bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <div className="flex items-center space-x-4">
                            {/* Cover Image */}
                            <div className="flex-shrink-0">
                                {game.screenshots?.[0] ? (
                                    <img
                                        src={game.screenshots[0]}
                                        alt={game.name}
                                        className="w-24 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <FaGamepad className="text-white text-xl" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                                            {game.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-mono mb-2">
                                            {game.genre?.join(', ') || 'Game'} • {game.releaseYear} • {formatFileSize(game.fileSize)}
                                        </p>
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {game.shortDescription}
                                        </p>
                                    </div>

                                    {/* Stats and Badges */}
                                    <div className="flex flex-col items-end space-y-2 ml-4">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="flex items-center text-yellow-400">
                                                <FaStar className="mr-1" />
                                                {game.rating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="flex items-center text-green-400">
                                                <FaDownload className="mr-1" />
                                                {formatNumber(game.downloads)}
                                            </span>
                                            <span className="flex items-center text-blue-400">
                                                <FaEye className="mr-1" />
                                                {formatNumber(game.views)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {/* Platform Icons */}
                                            <div className="flex items-center gap-1">
                                                {game.platforms?.slice(0, 3).map((platform, index) => (
                                                    <div key={index} className="text-sm">
                                                        {getPlatformIcon(platform)}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* ESRB Rating */}
                                            {game.esrbRating && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono border ${getESRBColor(game.esrbRating)}`}>
                                                    {game.esrbRating}
                                                </span>
                                            )}
                                            
                                            {game.featured && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                    <FaTrophy className="mr-1" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )
    }

    // Grid view
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
                <Link
                    key={game._id}
                    href={`/games/${game.slug}`}
                    className="group block bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105"
                >
                    {/* Cover Image */}
                    <div className="relative h-40 overflow-hidden">
                        {game.screenshots?.[0] ? (
                            <img
                                src={game.screenshots[0]}
                                alt={game.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <FaGamepad className="text-white text-4xl" />
                            </div>
                        )}
                        
                        {/* Featured Badge */}
                        {game.featured && (
                            <div className="absolute top-2 right-2">
                                <span className="bg-yellow-500/90 text-black px-2 py-1 rounded-full text-xs font-mono font-bold">
                                    <FaTrophy className="inline mr-1" />
                                    Featured
                                </span>
                            </div>
                        )}

                        {/* Release Year */}
                        {game.releaseYear && (
                            <div className="absolute bottom-2 left-2">
                                <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-mono">
                                    <FaCalendar className="inline mr-1" />
                                    {game.releaseYear}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Title and Genre */}
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-1 line-clamp-1">
                            {game.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono mb-2">
                            {game.genre?.slice(0, 2).join(', ') || 'Game'}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2 min-h-[2.5rem]">
                            {game.shortDescription}
                        </p>

                        {/* Platform Icons */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {game.platforms?.slice(0, 3).map((platform, index) => (
                                    <div key={index} className="text-lg">
                                        {getPlatformIcon(platform)}
                                    </div>
                                ))}
                            </div>
                            
                            {/* ESRB Rating */}
                            {game.esrbRating && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono border ${getESRBColor(game.esrbRating)}`}>
                                    {game.esrbRating}
                                </span>
                            )}
                        </div>

                        {/* Crack Info */}
                        {getCrackBadge(game) && (
                            <div className="mb-3">
                                {getCrackBadge(game)}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                                <span className="flex items-center text-yellow-400">
                                    <FaStar className="mr-1" />
                                    {game.rating?.toFixed(1) || '0.0'}
                                </span>
                                <span className="flex items-center text-green-400">
                                    <FaDownload className="mr-1" />
                                    {formatNumber(game.downloads)}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-500 font-mono">
                                {formatFileSize(game.fileSize)}
                            </div>
                        </div>

                        {/* Game Mode */}
                        {game.gameMode && game.gameMode.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500 font-mono">
                                {game.gameMode.join(', ')}
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}
