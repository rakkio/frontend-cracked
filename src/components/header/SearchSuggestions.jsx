'use client'
import React from 'react'
import { FaSearch, FaLightbulb, FaChartLine } from 'react-icons/fa'

export default function SearchSuggestions({ searchQuery, onSuggestionClick }) {
    // Generate suggestions based on search query
    const generateSuggestions = (query) => {
        if (!query || query.length < 2) return []
        
        const suggestions = []
        const lowerQuery = query.toLowerCase()
        
        // Common app patterns
        if (lowerQuery.includes('photo') || lowerQuery.includes('image')) {
            suggestions.push('Adobe Photoshop', 'GIMP', 'Canva', 'Figma')
        }
        
        if (lowerQuery.includes('video') || lowerQuery.includes('edit')) {
            suggestions.push('Adobe Premiere', 'DaVinci Resolve', 'OBS Studio', 'VLC')
        }
        
        if (lowerQuery.includes('game') || lowerQuery.includes('gaming')) {
            suggestions.push('Steam', 'Epic Games', 'Discord', 'OBS Studio')
        }
        
        if (lowerQuery.includes('code') || lowerQuery.includes('dev')) {
            suggestions.push('Visual Studio Code', 'Sublime Text', 'IntelliJ IDEA', 'Git')
        }
        
        if (lowerQuery.includes('music') || lowerQuery.includes('audio')) {
            suggestions.push('Spotify', 'Audacity', 'FL Studio', 'Ableton Live')
        }
        
        if (lowerQuery.includes('office') || lowerQuery.includes('productivity')) {
            suggestions.push('Microsoft Office', 'LibreOffice', 'Notion', 'Trello')
        }
        
        // Generic suggestions
        if (suggestions.length === 0) {
            suggestions.push(
                `${query} Pro`,
                `${query} 2024`,
                `${query} Premium`,
                `${query} Crack`
            )
        }
        
        return suggestions.slice(0, 4)
    }

    const suggestions = generateSuggestions(searchQuery)

    if (suggestions.length === 0) return null

    return (
        <div className="p-4 border-t border-red-500/20">
            <div className="flex items-center space-x-2 mb-3">
                <FaLightbulb className="text-yellow-500" />
                <h4 className="text-red-500 font-mono text-sm">SUGGESTIONS</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="flex items-center space-x-2 p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded text-left"
                    >
                        <FaSearch className="text-gray-500 text-xs" />
                        <span className="font-mono text-xs">{suggestion}</span>
                    </button>
                ))}
            </div>
        </div>
    )
} 