'use client'

import { FaClock, FaSearch, FaDesktop, FaAndroid, FaApple, FaGamepad } from 'react-icons/fa'

export default function SearchStats({ stats }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    if (!stats || stats.total === 0) {
        return (
            <div className="flex items-center gap-3 text-gray-500">
                <FaSearch className="text-blue-500" />
                <span>Enter a search term to find apps, games, and software</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-700">
                <FaSearch className="text-blue-500" />
                <span className="font-semibold">
                    {formatNumber(stats.total)} results
                </span>
            </div>
            
            {/* Platform Breakdown */}
            <div className="flex items-center gap-4">
                {stats.apps > 0 && (
                    <div className="flex items-center gap-1 text-blue-600">
                        <FaDesktop className="text-sm" />
                        <span className="text-xs font-medium">{stats.apps} PC Apps</span>
                    </div>
                )}
                {stats.apks > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                        <FaAndroid className="text-sm" />
                        <span className="text-xs font-medium">{stats.apks} Android APKs</span>
                    </div>
                )}
                {stats.ipas > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                        <FaApple className="text-sm" />
                        <span className="text-xs font-medium">{stats.ipas} iOS IPAs</span>
                    </div>
                )}
                {stats.games > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                        <FaGamepad className="text-sm" />
                        <span className="text-xs font-medium">{stats.games} PC Games</span>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaClock />
                <span>Updated just now</span>
            </div>
        </div>
    )
}
