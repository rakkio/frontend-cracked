'use client'

import { FaClock, FaSearch } from 'react-icons/fa'

export default function SearchStats({ query, totalResults, platform }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    if (!query) {
        return (
            <div className="flex items-center gap-3 text-gray-400">
                <FaSearch className="text-purple-400" />
                <span>Enter a search term to find apps, games, and software</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
                <FaSearch className="text-purple-400" />
                <span className="font-semibold">
                    {formatNumber(totalResults)} results
                </span>
                <span className="text-gray-400">
                    for "{query}"
                </span>
                {platform.id !== 'all' && (
                    <span className="text-gray-400">
                        in {platform.label}
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaClock />
                <span>Updated just now</span>
            </div>
        </div>
    )
}
