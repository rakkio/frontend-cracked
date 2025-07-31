'use client'

import { useState } from 'react'
import { 
    FaGamepad, FaCamera, FaMusic, FaVideo, FaPaintBrush, FaCode, 
    FaShieldAlt, FaTools, FaGraduationCap, FaHeartbeat, FaPlane, 
    FaShoppingCart, FaNewspaper, FaCalculator, FaCloudDownloadAlt,
    FaMobile, FaDesktop, FaTabletAlt, FaArrowRight
} from 'react-icons/fa'

export default function CategoriesGrid() {
    const [hoveredCategory, setHoveredCategory] = useState(null)

    const categories = [
        { 
            id: 'games', 
            name: 'Games', 
            icon: FaGamepad, 
            color: 'from-red-500 to-pink-500',
            count: '12K+',
            description: 'Premium games with DLCs and mods',
            platforms: ['PC', 'Mobile', 'Console']
        },
        { 
            id: 'multimedia', 
            name: 'Multimedia', 
            icon: FaVideo, 
            color: 'from-purple-500 to-indigo-500',
            count: '8K+',
            description: 'Video, audio and photo editing tools',
            platforms: ['Windows', 'Mac', 'Mobile']
        },
        { 
            id: 'productivity', 
            name: 'Productivity', 
            icon: FaTools, 
            color: 'from-blue-500 to-cyan-500',
            count: '15K+',
            description: 'Office suites and business tools',
            platforms: ['Windows', 'Mac', 'Android']
        },
        { 
            id: 'design', 
            name: 'Design', 
            icon: FaPaintBrush, 
            color: 'from-pink-500 to-rose-500',
            count: '6K+',
            description: 'Creative and design software',
            platforms: ['Windows', 'Mac', 'iPad']
        },
        { 
            id: 'development', 
            name: 'Development', 
            icon: FaCode, 
            color: 'from-green-500 to-emerald-500',
            count: '4K+',
            description: 'IDEs, compilers and dev tools',
            platforms: ['Windows', 'Mac', 'Linux']
        },
        { 
            id: 'security', 
            name: 'Security', 
            icon: FaShieldAlt, 
            color: 'from-orange-500 to-red-500',
            count: '3K+',
            description: 'Antivirus and security software',
            platforms: ['Windows', 'Mac', 'Android']
        },
        { 
            id: 'education', 
            name: 'Education', 
            icon: FaGraduationCap, 
            color: 'from-yellow-500 to-orange-500',
            count: '5K+',
            description: 'Learning and educational apps',
            platforms: ['All Platforms']
        },
        { 
            id: 'utilities', 
            name: 'Utilities', 
            icon: FaCalculator, 
            color: 'from-gray-500 to-slate-500',
            count: '10K+',
            description: 'System tools and utilities',
            platforms: ['Windows', 'Mac', 'Mobile']
        }
    ]

    const handleCategoryClick = (categoryId) => {
        // Navigate to category page
        window.open(`/category/${categoryId}`, '_blank')
    }

    return (
        <section className="py-20 relative overflow-hidden bg-white">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CATEGORIES
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Explore our vast collection organized by categories. 
                        From productivity tools to entertainment, we have everything you need.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => handleCategoryClick(category.id)}
                            className="group relative cursor-pointer"
                        >
                            {/* Main Card */}
                            <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                {/* Icon and Count */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <category.icon className="text-white text-2xl" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-800">{category.count}</div>
                                        <div className="text-gray-600 text-sm">Apps</div>
                                    </div>
                                </div>

                                {/* Category Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Platform Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {category.platforms.map((platform, index) => (
                                        <span 
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>

                                {/* Explore Button */}
                                <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-gray-200 group-hover:to-gray-300">
                                    Explore
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                                </button>

                                {/* Hover Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500 -z-10 blur-xl`}></div>
                            </div>

                            {/* Expanded Info on Hover */}
                            {hoveredCategory === category.id && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-xl p-4 z-20 animate-fadeIn">
                                    <div className="flex items-center gap-3 mb-3">
                                        <category.icon className={`text-xl bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                                        <h4 className="font-bold text-white">{category.name} Collection</h4>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3">
                                        Discover {category.count} premium {category.name.toLowerCase()} applications 
                                        with full features unlocked and ready to download.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <FaDesktop className="text-blue-400" />
                                            <FaMobile className="text-green-400" />
                                            <FaTabletAlt className="text-purple-400" />
                                        </div>
                                        <span className="text-xs text-gray-400">Click to explore →</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Popular Categories Quick Access */}
                <div className="bg-gradient-to-b from-gray-50 to-white backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl p-8">
                    <div className="text-center mb-6">  
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Popular This Week</h3>
                        <p className="text-gray-600">Most downloaded categories in the last 7 days</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.slice(0, 4).map((category, index) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} bg-opacity-20 border backdrop-blur-xl rounded-lg hover:bg-opacity-30 transition-all duration-300 hover:scale-105`}
                            >
                                <category.icon className="text-white" />
                                <span className="text-white font-semibold">{category.name}</span>
                                <span className="text-xs bg-black/30 px-2 py-1 rounded-full text-gray-300">
                                    #{index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* View All Categories */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => window.open('/categories', '_blank')}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <FaCloudDownloadAlt />
                        View All Categories
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </section>
    )
}
