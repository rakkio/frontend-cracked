'use client'
import React from 'react'
import { FaClock, FaTimes } from 'react-icons/fa'

export default function RecentSearches({ recentSearches = [], onQuickSearch, onRemoveSearch }) {
    if (recentSearches.length === 0) {
        return (
            <div>
                <h4 className="text-red-500 font-mono text-sm mb-3">RECENT SEARCHES</h4>
                <div className="text-gray-500 text-xs italic">No recent searches</div>
            </div>
        )
    }

    return (
        <div>
            <h4 className="text-red-500 font-mono text-sm mb-3">RECENT SEARCHES</h4>
            <div className="space-y-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded group"
                    >
                        <button
                            onClick={() => onQuickSearch(search)}
                            className="flex items-center space-x-3 flex-1"
                        >
                            <FaClock className="text-gray-500" />
                            <span className="font-mono text-sm">{search}</span>
                        </button>
                        <button
                            onClick={() => onRemoveSearch(search)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 p-1"
                        >
                            <FaTimes className="text-xs" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
} 