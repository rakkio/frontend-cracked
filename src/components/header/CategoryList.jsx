'use client'
import React from 'react'
import { FaGamepad, FaLaptop, FaShieldAlt, FaVideo, FaTools, FaMusic, FaBook, FaMobile, FaDesktop, FaCode } from 'react-icons/fa'
import { MdBusiness, MdSchool, MdSportsEsports, MdSecurity } from 'react-icons/md'

export default function CategoryList({ categories = [], onCategoryClick }) {
    // Icon mapping for categories
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'gaming': FaGamepad,
            'productivity': FaLaptop,
            'security': FaShieldAlt,
            'entertainment': FaVideo,
            'development': FaTools,
            'music': FaMusic,
            'business': MdBusiness,
            'education': MdSchool,
            'sports': MdSportsEsports,
            'mobile': FaMobile,
            'desktop': FaDesktop,
            'programming': FaCode,
            'books': FaBook,
            'cybersecurity': MdSecurity
        }
        
        const normalizedName = categoryName.toLowerCase()
        return iconMap[normalizedName] || FaGamepad
    }

    // Color mapping for categories
    const getCategoryColor = (categoryName) => {
        const colorMap = {
            'gaming': 'text-purple-400',
            'productivity': 'text-blue-400',
            'security': 'text-green-400',
            'entertainment': 'text-pink-400',
            'development': 'text-orange-400',
            'music': 'text-yellow-400',
            'business': 'text-cyan-400',
            'education': 'text-indigo-400',
            'sports': 'text-red-400',
            'mobile': 'text-emerald-400',
            'desktop': 'text-gray-400',
            'programming': 'text-violet-400',
            'books': 'text-amber-400',
            'cybersecurity': 'text-red-500'
        }
        
        const normalizedName = categoryName.toLowerCase()
        return colorMap[normalizedName] || 'text-gray-400'
    }

    // If no categories provided, show default ones
    const displayCategories = categories.length > 0 ? categories : [
        { name: 'Gaming', count: 150 },
        { name: 'Productivity', count: 89 },
        { name: 'Security', count: 67 },
        { name: 'Entertainment', count: 124 },
        { name: 'Development', count: 45 },
        { name: 'Business', count: 78 }
    ]

    return (
        <div className="space-y-2">
            {displayCategories.map((category, index) => {
                const IconComponent = getCategoryIcon(category.name)
                const colorClass = getCategoryColor(category.name)
                
                return (
                    <button
                        key={category._id || index}
                        onClick={() => onCategoryClick(category.name)}
                        className="w-full flex items-center justify-between p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded"
                    >
                        <div className="flex items-center space-x-3">
                            <IconComponent className={colorClass} />
                            <span className="font-mono text-sm">{category.name}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{category.count || 0}</span>
                    </button>
                )
            })}
        </div>
    )
} 