'use client'

import Link from 'next/link'
import { FaGamepad, FaDownload, FaStar, FaUsers, FaShieldAlt, FaTrophy, FaWindows, FaApple, FaLinux } from 'react-icons/fa'
import { MdVerified, MdSecurity } from 'react-icons/md'

export default function GamesHeader({ stats, featuredGames = [] }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num?.toString() || '0'
    }

    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'windows': return <FaWindows className="text-blue-400" />
            case 'mac': return <FaApple className="text-gray-300" />
            case 'linux': return <FaLinux className="text-yellow-400" />
            default: return <FaGamepad className="text-purple-400" />
        }
    }

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-purple-900 border-b border-purple-500/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M30%2030l15-15v30l-15-15zm-15%200l15%2015v-30l-15%2015z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            <div className="relative container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    {/* Main Title */}
                    <div className="flex items-center justify-center mb-4">
                        <FaGamepad className="text-4xl text-purple-400 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            PC Games
                        </h1>
                    </div>
                    
                    <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
                        Premium PC games collection with full cracks and DLCs. 
                        Windows, Mac, and Linux compatible.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 text-center">
                        <FaGamepad className="text-2xl text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.totalGames)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Total Games</div>
                    </div>
                    
                    <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 text-center">
                        <FaDownload className="text-2xl text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.totalDownloads)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Downloads</div>
                    </div>
                    
                    <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-4 text-center">
                        <FaStar className="text-2xl text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {stats?.averageRating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Avg Rating</div>
                    </div>
                    
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 text-center">
                        <FaUsers className="text-2xl text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {formatNumber(stats?.activeUsers)}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">Active Users</div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                        <MdVerified className="text-green-400 mr-2" />
                        <span className="text-sm font-mono text-green-400">Verified Cracks</span>
                    </div>
                    <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                        <MdSecurity className="text-blue-400 mr-2" />
                        <span className="text-sm font-mono text-blue-400">Virus Free</span>
                    </div>
                    <div className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
                        <FaShieldAlt className="text-purple-400 mr-2" />
                        <span className="text-sm font-mono text-purple-400">Full Version</span>
                    </div>
                    <div className="flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2">
                        <FaTrophy className="text-orange-400 mr-2" />
                        <span className="text-sm font-mono text-orange-400">DLC Included</span>
                    </div>
                </div>

                {/* Platform Support */}
                <div className="flex justify-center gap-6 mb-8">
                    <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
                        <span className="text-sm font-mono text-blue-400">Windows</span>
                    </div>
                    <div className="flex items-center bg-gray-500/10 border border-gray-500/20 rounded-lg px-4 py-2">
                        <span className="text-sm font-mono text-gray-300">macOS</span>
                    </div>
                    <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2">
                        <span className="text-sm font-mono text-yellow-400">Linux</span>
                    </div>
                </div>

                {/* Featured Games */}
                {featuredGames.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                            <FaTrophy className="mr-2" />
                            Featured Games
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featuredGames.map((game) => (
                                <Link
                                    key={game._id}
                                    href={`/games/${game.slug}`}
                                    className="group bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/50 transition-all duration-300"
                                >
                                    <div className="flex items-center mb-2">
                                        {game.icon ? (
                                            <img
                                                src={game.icon}
                                                alt={game.name}
                                                className="w-12 h-12 rounded-lg mr-3 object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                                <FaGamepad className="text-white text-lg" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                                {game.name}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-mono">
                                                {game.genre?.join(', ') || 'Game'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                        <span className="flex items-center">
                                            <FaStar className="text-yellow-400 mr-1" />
                                            {game.rating?.toFixed(1) || '0.0'}
                                        </span>
                                        <span className="flex items-center">
                                            <FaDownload className="text-green-400 mr-1" />
                                            {formatNumber(game.downloads)}
                                        </span>
                                    </div>

                                    {/* Platform Icons */}
                                    <div className="flex items-center gap-1">
                                        {game.platforms?.map((platform, index) => (
                                            <div key={index} className="text-xs">
                                                {getPlatformIcon(platform)}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Release Year */}
                                    {game.releaseYear && (
                                        <div className="text-xs text-gray-500 font-mono mt-1">
                                            {game.releaseYear}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
