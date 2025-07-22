'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { 
    FaSpinner,
    FaSearch,
    FaGem,
    FaArrowRight
} from 'react-icons/fa'

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories()
            setCategories(response.categories || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryClick = (category) => {
        router.push(`/category/${category.slug}`)
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-red-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <FaGem className="text-6xl text-purple-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        All Categories
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Explore our complete collection of application categories. Find exactly what you&apos;re looking for.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-12">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="container mx-auto px-4 mb-12">
                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map((category) => (
                            <div
                                key={category._id}
                                className="card p-8 text-center group cursor-pointer relative overflow-hidden hover:scale-105 transition-all duration-300"
                                onClick={() => handleCategoryClick(category)}
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Featured Badge */}
                                {category.isFeatured && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                        Featured
                                    </div>
                                )}
                                
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div 
                                        className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
                                        style={{ color: category.color || '#ef4444' }}
                                    >
                                        {category.icon || '📱'}
                                    </div>
                                    
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                        {category.name}
                                    </h3>
                                    
                                    {/* Description */}
                                    {category.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}
                                    
                                    {/* App Count */}
                                    <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm mb-4">
                                        <span>{category.appCount || 0} apps</span>
                                    </div>
                                    
                                    {/* Explore Button */}
                                    <div className="flex items-center justify-center space-x-2 text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span>Explore</span>
                                        <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No categories found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm 
                                ? `No categories found for "${searchTerm}"`
                                : 'No categories available at the moment'
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Featured Categories Section */}
            {!searchTerm && categories.some(c => c.isFeatured) && (
                <section className="container mx-auto px-4 mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Featured Categories</h2>
                        <p className="text-gray-400">Our most popular and recommended categories</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories
                            .filter(category => category.isFeatured)
                            .slice(0, 6)
                            .map((category) => (
                            <div
                                key={`featured-${category._id}`}
                                className="card p-6 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div 
                                        className="text-3xl group-hover:scale-110 transition-transform duration-300"
                                        style={{ color: category.color || '#ef4444' }}
                                    >
                                        {category.icon || '📱'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {category.appCount || 0} applications
                                        </p>
                                    </div>
                                    <FaArrowRight className="text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Statistics */}
            {!searchTerm && categories.length > 0 && (
                <section className="container mx-auto px-4 mb-12">
                    <div className="card p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">Collection Overview</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-3xl font-bold text-purple-500 mb-2">
                                    {categories.length}
                                </div>
                                <div className="text-gray-400">Total Categories</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-500 mb-2">
                                    {categories.filter(c => c.isFeatured).length}
                                </div>
                                <div className="text-gray-400">Featured</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-500 mb-2">
                                    {categories.reduce((sum, c) => sum + (c.appCount || 0), 0)}
                                </div>
                                <div className="text-gray-400">Total Apps</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-500 mb-2">
                                    {Math.round(categories.reduce((sum, c) => sum + (c.appCount || 0), 0) / categories.length) || 0}
                                </div>
                                <div className="text-gray-400">Avg per Category</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Browse all our applications or use our advanced search to find the perfect app for your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apps">
                            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300">
                                Browse All Apps
                            </button>
                        </Link>
                        <Link href="/apps?featured=true">
                            <button className="px-8 py-4 bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold rounded-lg transition-all duration-300">
                                Featured Apps
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
} 