'use client'
import React from 'react'
import { FaSearch, FaClock, FaFire, FaStar, FaDownload } from 'react-icons/fa'

export default function SearchStats({ searchQuery, searchResults, searchLoading }) {
    if (!searchQuery || searchLoading) return null

    const totalResults = searchResults.length
    const hotApps = searchResults.filter(app => app.isHot).length
    const featuredApps = searchResults.filter(app => app.isFeatured).length
    const avgRating = searchResults.length > 0 
        ? (searchResults.reduce((sum, app) => sum + (app.rating || 0), 0) / searchResults.length).toFixed(1)
        : 0

    return (
        <div className="flex items-center justify-between p-3 bg-gray-800/50 border-t border-red-500/20">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                    <FaSearch className="text-red-500" />
                    <span>{totalResults} results</span>
                </div>
                
                {hotApps > 0 && (
                    <div className="flex items-center space-x-1">
                        <FaFire className="text-red-500" />
                        <span>{hotApps} hot</span>
                    </div>
                )}
                
                {featuredApps > 0 && (
                    <div className="flex items-center space-x-1">
                        <FaStar className="text-yellow-500" />
                        <span>{featuredApps} featured</span>
                    </div>
                )}
            </div>
            
            <div className="text-xs text-gray-500">
                <span>Avg rating: {avgRating}</span>
            </div>
        </div>
    )
} 