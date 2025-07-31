'use client'

import Link from 'next/link'
import { FaApple, FaDownload, FaStar, FaEye, FaShieldAlt, FaMobile } from 'react-icons/fa'
import { MdVerified, MdWarning } from 'react-icons/md'

export default function IpaGrid({ ipas, viewMode = 'grid', loading = false }) {
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

    const getInstallationBadge = (ipa) => {
        if (ipa.jailbreakRequired) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <MdWarning className="mr-1" />
                    Jailbreak
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                <FaShieldAlt className="mr-1" />
                Sideload
            </span>
        )
    }

    const getCompatibilityInfo = (ipa) => {
        const devices = ipa.deviceCompatibility || []
        if (devices.length === 0) return 'Universal'
        if (devices.includes('iPhone') && devices.includes('iPad')) return 'iPhone & iPad'
        if (devices.includes('iPhone')) return 'iPhone Only'
        if (devices.includes('iPad')) return 'iPad Only'
        return devices.join(', ')
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 animate-pulse">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg mb-3"></div>
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
                {ipas.map((ipa) => (
                    <Link
                        key={ipa._id}
                        href={`/ipa/${ipa.slug}`}
                        className="group block bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {ipa.icon ? (
                                    <img
                                        src={ipa.icon}
                                        alt={ipa.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <FaApple className="text-white text-2xl" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                            {ipa.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 font-mono mb-2">
                                            {ipa.category} • {ipa.version} • {formatFileSize(ipa.fileSize)}
                                        </p>
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {ipa.shortDescription}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-col items-end space-y-2 ml-4">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="flex items-center text-yellow-400">
                                                <FaStar className="mr-1" />
                                                {ipa.rating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="flex items-center text-green-400">
                                                <FaDownload className="mr-1" />
                                                {formatNumber(ipa.downloads)}
                                            </span>
                                            <span className="flex items-center text-blue-400">
                                                <FaEye className="mr-1" />
                                                {formatNumber(ipa.views)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {getInstallationBadge(ipa)}
                                            {ipa.featured && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                    <FaStar className="mr-1" />
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
            {ipas.map((ipa) => (
                <Link
                    key={ipa._id}
                    href={`/ipa/${ipa.slug}`}
                    className="group block bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105"
                >
                    {/* Header with Icon and Featured Badge */}
                    <div className="flex items-start justify-between mb-3">
                        {ipa.icon ? (
                            <img
                                src={ipa.icon}
                                alt={ipa.name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <FaApple className="text-white text-2xl" />
                            </div>
                        )}
                        
                        {ipa.featured && (
                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full text-xs font-mono">
                                <FaStar className="inline mr-1" />
                                Featured
                            </span>
                        )}
                    </div>

                    {/* Title and Category */}
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
                        {ipa.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono mb-2">
                        {ipa.category}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2 min-h-[2.5rem]">
                        {ipa.shortDescription}
                    </p>

                    {/* Version and Compatibility */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span className="font-mono">v{ipa.version}</span>
                        <span className="flex items-center">
                            <FaMobile className="mr-1" />
                            {getCompatibilityInfo(ipa)}
                        </span>
                    </div>

                    {/* Installation Method */}
                    <div className="mb-3">
                        {getInstallationBadge(ipa)}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                            <span className="flex items-center text-yellow-400">
                                <FaStar className="mr-1" />
                                {ipa.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="flex items-center text-green-400">
                                <FaDownload className="mr-1" />
                                {formatNumber(ipa.downloads)}
                            </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 font-mono">
                            {formatFileSize(ipa.fileSize)}
                        </div>
                    </div>

                    {/* iOS Version Requirement */}
                    {ipa.minIosVersion && (
                        <div className="mt-2 text-xs text-gray-500 font-mono">
                            iOS {ipa.minIosVersion}+
                        </div>
                    )}
                </Link>
            ))}
        </div>
    )
}
