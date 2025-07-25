'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'
import { 
    FaSearch, 
    FaFilter, 
    FaTh, // Changed from FaGrid3X3 to FaTh (grid icon)
    FaList, 
    FaStar, 
    FaDownload, 
    FaEye,
    FaTerminal,
    FaCode,
    FaShieldAlt,
    FaRocket,
    FaFire
} from 'react-icons/fa'
import { MdApps, MdCategory, MdTrendingUp } from 'react-icons/md'

// Generate structured data for categories
const generateCategoriesStructuredData = (categories, filteredCategories) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://appscracked.com'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/categories`,
                "url": `${baseUrl}/categories`,
                "name": "Software Categories - Browse Premium Apps by Type",
                "description": "Explore comprehensive software categories including Games, Productivity, Utilities, Entertainment, Graphics, and more. Find premium cracked applications organized by type.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${baseUrl}/#website`,
                    "url": baseUrl,
                    "name": "AppsCracked",
                    "description": "Premium Cracked Software & Applications"
                },
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": baseUrl
                        },
                        {
                            "@type": "ListItem", 
                            "position": 2,
                            "name": "Categories",
                            "item": `${baseUrl}/categories`
                        }
                    ]
                }
            },
            {
                "@type": "CollectionPage",
                "name": "Software Categories Collection",
                "description": "Comprehensive collection of software categories for premium applications",
                "url": `${baseUrl}/categories`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": filteredCategories?.length || 0,
                    "itemListElement": (filteredCategories || []).slice(0, 20).map((category, index) => ({
                        "@type": "Thing",
                        "position": index + 1,
                        "name": category.name,
                        "description": category.description || `${category.name} applications and software`,
                        "url": `${baseUrl}/category/${category.slug}`,
                        "identifier": category.slug
                    }))
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How many app categories are available?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `We have ${categories?.length || 0} different categories of premium applications including Games, Productivity, Utilities, Entertainment, and more.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are all categories free to browse?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all categories and applications are completely free to browse and download. No registration or payment required."
                        }
                    }
                ]
            }
        ]
    }
}

function CategoriesContent() {
    const [categories, setCategories] = useState([])
    const [categoryApps, setCategoryApps] = useState({})
    const [loading, setLoading] = useState(true)
    const [appsLoading, setAppsLoading] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid')
    const [sortBy, setSortBy] = useState('name')
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Filtered and sorted categories - moved before useEffect
    const filteredCategories = useMemo(() => {
        let filtered = categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
            const matchesFeatured = !showFeaturedOnly || category.isFeatured
            return matchesSearch && matchesFeatured
        })

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'apps':
                    return (b.appCount || 0) - (a.appCount || 0)
                case 'featured':
                    if (a.isFeatured && !b.isFeatured) return -1
                    if (!a.isFeatured && b.isFeatured) return 1
                    return a.name.localeCompare(b.name)
                default:
                    return a.name.localeCompare(b.name)
            }
        })

        return filtered
    }, [categories, searchTerm, sortBy, showFeaturedOnly])

    useEffect(() => {
        fetchCategories()
        const view = searchParams.get('view')
        const sort = searchParams.get('sort')
        const featured = searchParams.get('featured')
        
        if (view) setViewMode(view)
        if (sort) setSortBy(sort)
        if (featured === 'true') setShowFeaturedOnly(true)
    }, [searchParams])

    // Insert structured data - now filteredCategories is available
    useEffect(() => {
        if (!loading && filteredCategories.length > 0) {
            const structuredData = generateCategoriesStructuredData(categories, filteredCategories)
            
            const existingScript = document.querySelector('script[data-categories-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-categories-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [loading, categories, filteredCategories])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await api.getCategories({ limit: 50 })
            const categoriesData = response.categories || []
            setCategories(categoriesData)
            
            await fetchCategoryApps(categoriesData.slice(0, 10))
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategoryApps = async (categoriesToFetch) => {
        const appsData = {}
        const loadingState = {}

        for (const category of categoriesToFetch) {
            try {
                loadingState[category._id] = true
                setAppsLoading(prev => ({ ...prev, [category._id]: true }))
                
                const response = await api.getAppsByCategory(category.slug, {
                    limit: 6,
                    sort: 'popularity'
                })
                
                appsData[category._id] = response.data?.apps || response.apps || []
            } catch (error) {
                console.error(`Error fetching apps for ${category.name}:`, error)
                appsData[category._id] = []
            } finally {
                loadingState[category._id] = false
            }
        }
        
        setCategoryApps(prev => ({ ...prev, ...appsData }))
        setAppsLoading(prev => ({ ...prev, ...loadingState }))
    }

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug || app._id}`)
    }

    const handleCategoryClick = (category) => {
        router.push(`/category/${category.slug}`)
    }

    const updateURL = (params) => {
        const current = new URLSearchParams(searchParams)
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                current.set(key, value)
            } else {
                current.delete(key)
            }
        })
        router.push(`/categories?${current.toString()}`, { scroll: false })
    }

    const getPageTitle = () => {
        if (searchTerm) {
            return `${searchTerm} Categories - Software Types | AppsCracked`
        }
        if (showFeaturedOnly) {
            return 'Featured Categories - Popular Software Types | AppsCracked'
        }
        return 'Software Categories - Browse Premium Apps by Type 2024 | AppsCracked'
    }

    const getPageDescription = () => {
        if (searchTerm) {
            return `Find ${searchTerm} software categories. Browse ${filteredCategories.length} app categories with premium cracked applications and games.`
        }
        if (showFeaturedOnly) {
            return `Explore our most popular software categories. ${filteredCategories.length} featured categories with thousands of premium cracked applications.`
        }
        return `Browse ${filteredCategories.length} software categories. Find premium cracked apps organized by type: Games, Productivity, Utilities, Entertainment, Graphics, and more.`
    }

    const getKeywords = () => {
        const baseKeywords = ['software categories', 'app categories', 'cracked software types', 'premium app categories', 'free software categories']
        const categoryNames = filteredCategories.slice(0, 10).map(cat => cat.name.toLowerCase()).join(', ')
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} software`, `${searchTerm} categories`].join(', ')
        }
        return [...baseKeywords, categoryNames, 'games', 'productivity', 'utilities', 'entertainment'].join(', ')
    }

    return (
        <>
            {/* Matrix Rain Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
                <div className="matrix-rain opacity-10"></div>
            </div>

            {/* Scan Lines Effect */}
            <div className="fixed inset-0 pointer-events-none z-[2]">
                <div className="scan-lines"></div>
            </div>

            {/* Floating Code Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[3]">
                <div className="floating-code text-red-500/10 text-xs font-mono">
                    {['categories.exe', 'browse.dll', 'filter.sys', 'search.bat'].map((code, i) => (
                        <span key={i} className={`absolute animate-float-${i + 1}`} style={{
                            left: `${10 + i * 20}%`,
                            top: `${15 + i * 20}%`,
                            animationDelay: `${i * 0.7}s`
                        }}>
                            {code}
                        </span>
                    ))}
                </div>
            </div>

            <div className="min-h-screen bg-black relative z-[4]">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-black via-gray-900 to-red-900/20 border-b-2 border-red-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse"></div>
                    
                    <div className="container mx-auto px-4 py-16 relative">
                        <div className="text-center mb-12">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30"></div>
                                <h1 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent">
                                    <span className="text-red-500">[</span>
                                    CATEGORIES
                                    <span className="text-red-500">]</span>
                                </h1>
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                            </div>
                            
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono">
                                <span className="text-green-400">root@system:~#</span> browse_categories --type=premium --status=cracked
                            </p>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                                Explore {categories.length} software categories with thousands of premium applications
                            </p>
                        </div>

                        {/* Search and Filters */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-gray-900/90 border border-red-500/50 rounded-none backdrop-blur-sm p-6">
                                {/* Corner Brackets */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Search */}
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-sm group-focus-within:blur-none transition-all"></div>
                                        <div className="relative bg-black/80 border border-red-500/30 rounded-none">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                                            <input
                                                type="text"
                                                placeholder="> search_categories"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-transparent text-green-400 placeholder-gray-500 font-mono focus:outline-none focus:text-red-400 transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Sort */}
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value)
                                                updateURL({ sort: e.target.value })
                                            }}
                                            className="w-full px-4 py-3 bg-black/80 border border-red-500/30 text-green-400 font-mono focus:outline-none focus:border-red-500 transition-colors text-sm"
                                        >
                                            <option value="name">Sort: Name</option>
                                            <option value="apps">Sort: App Count</option>
                                            <option value="featured">Sort: Featured</option>
                                        </select>
                                    </div>

                                    {/* Featured Filter */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => {
                                                setShowFeaturedOnly(!showFeaturedOnly)
                                                updateURL({ featured: !showFeaturedOnly ? 'true' : null })
                                            }}
                                            className={`flex items-center space-x-2 px-4 py-3 border transition-all font-mono text-sm ${
                                                showFeaturedOnly
                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                    : 'bg-black/80 border-red-500/30 text-gray-400 hover:border-red-500 hover:text-red-400'
                                            }`}
                                        >
                                            <FaStar />
                                            <span>Featured Only</span>
                                        </button>
                                    </div>

                                    {/* View Mode */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setViewMode('grid')
                                                updateURL({ view: 'grid' })
                                            }}
                                            className={`p-3 border transition-all ${
                                                viewMode === 'grid'
                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                    : 'bg-black/80 border-red-500/30 text-gray-400 hover:border-red-500 hover:text-red-400'
                                            }`}
                                        >
                                            <FaTh /> {/* Changed from FaGrid3X3 to FaTh */}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setViewMode('list')
                                                updateURL({ view: 'list' })
                                            }}
                                            className={`p-3 border transition-all ${
                                                viewMode === 'list'
                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                    : 'bg-black/80 border-red-500/30 text-gray-400 hover:border-red-500 hover:text-red-400'
                                            }`}
                                        >
                                            <FaList />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="container mx-auto px-4 py-12" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
                    <meta itemProp="numberOfItems" content={filteredCategories.length} />
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                                <div className="relative bg-black border-2 border-red-500 p-8">
                                    <FaTerminal className="text-red-500 text-4xl animate-pulse" />
                                    <p className="text-green-400 font-mono mt-4">Loading categories...</p>
                                </div>
                            </div>
                        </div>
                    ) : filteredCategories.length > 0 ? (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                            {filteredCategories.map((category, index) => {
                                const apps = categoryApps[category._id] || []
                                const isLoading = appsLoading[category._id]
                                
                                return (
                                    <div key={category._id} className="group relative" itemProp="itemListElement" itemScope itemType="https://schema.org/Thing">
                                        <meta itemProp="position" content={index + 1} />
                                        <meta itemProp="name" content={category.name} />
                                        <meta itemProp="url" content={`/category/${category.slug}`} />
                                        
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <div className="relative bg-gray-900/90 border border-red-500/30 backdrop-blur-sm hover:border-red-500 transition-all duration-300 group-hover:bg-gray-900/95">
                                            {/* Corner Brackets */}
                                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            <div className="p-6">
                                                {/* Category Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                                            <div className="relative bg-black border border-red-500 p-2 text-xl">
                                                                {category.icon || '📂'}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors font-mono">
                                                                {category.name}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm">
                                                                {category.appCount || 0} apps
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {category.isFeatured && (
                                                        <div className="bg-red-500/20 border border-red-500 px-2 py-1">
                                                            <FaStar className="text-red-500 text-xs" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Category Description */}
                                                {category.description && (
                                                    <p className="text-gray-300 text-sm mb-4 font-mono">
                                                        {category.description}
                                                    </p>
                                                )}

                                                {/* Apps Preview */}
                                                <div className="mb-4">
                                                    <h4 className="text-green-400 font-mono text-sm mb-3 flex items-center">
                                                        <FaCode className="mr-2" />
                                                        Featured Apps
                                                    </h4>
                                                    
                                                    {isLoading ? (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[...Array(3)].map((_, i) => (
                                                                <div key={i} className="bg-gray-800/50 border border-gray-700 p-2 animate-pulse">
                                                                    <div className="w-full h-12 bg-gray-700 mb-2"></div>
                                                                    <div className="h-3 bg-gray-700"></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : apps.length > 0 ? (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {apps.slice(0, 3).map((app) => (
                                                                <button
                                                                    key={app._id}
                                                                    onClick={() => handleAppClick(app)}
                                                                    className="bg-gray-800/50 border border-gray-700 hover:border-red-500 p-2 transition-all group/app"
                                                                >
                                                                    {app.images && app.images.length > 0 ? (
                                                                        <Image
                                                                            src={app.images[0]}
                                                                            alt={app.name}
                                                                            width={48}
                                                                            height={48}
                                                                            className='w-50 h-10 object-contain mb-2'
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none'
                                                                                e.target.nextSibling.style.display = 'flex'
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    {(!app.images || app.images.length === 0) && (
                                                                        <div className="w-full h-12 bg-gray-700 flex items-center justify-center mb-2 rounded">
                                                                            <MdApps className="text-gray-500" />
                                                                        </div>
                                                                    )}
                                                                    <p className="text-xs text-gray-300 group-hover/app:text-red-400 transition-colors truncate">
                                                                        {app.name}
                                                                    </p>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <p className="text-gray-500 text-sm font-mono">No apps available</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => handleCategoryClick(category)}
                                                    className="w-full bg-black/80 border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 text-red-400 py-3 transition-all font-mono text-sm group-hover:bg-red-500/20"
                                                >
                                                    <span className="flex items-center justify-center space-x-2">
                                                        <FaRocket />
                                                        <span>EXPLORE CATEGORY</span>
                                                        <span className="text-green-400">→</span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-30"></div>
                                <div className="relative bg-gray-900/90 border border-red-500/50 p-8">
                                    <FaSearch className="text-red-500 text-4xl mb-4 mx-auto" />
                                    <h3 className="text-xl font-bold text-white mb-2 font-mono">No Categories Found</h3>
                                    <p className="text-gray-400 font-mono">Try adjusting your search or filters</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <style jsx>{`
                .matrix-rain {
                    background: linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent);
                    background-size: 50px 50px;
                    animation: matrix-rain 20s linear infinite;
                }
                
                @keyframes matrix-rain {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                
                .scan-lines {
                    background: linear-gradient(90deg, transparent 98%, rgba(255, 0, 0, 0.03) 100%);
                    background-size: 3px 100%;
                    animation: scan-lines 0.1s linear infinite;
                }
                
                @keyframes scan-lines {
                    0% { background-position: 0 0; }
                    100% { background-position: 3px 0; }
                }
                
                .floating-code {
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                }
                
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(-1deg); }
                }
                
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(0.5deg); }
                }
                
                @keyframes float-4 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-18px) rotate(-0.5deg); }
                }
                
                .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
                .animate-float-4 { animation: float-4 4.5s ease-in-out infinite; }
            `}</style>
        </>
    )
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-black border-2 border-red-500 p-8">
                        <FaTerminal className="text-red-500 text-4xl animate-pulse" />
                        <p className="text-green-400 font-mono mt-4">Initializing categories...</p>
                    </div>
                </div>
            </div>
        }>
            <CategoriesContent />
        </Suspense>
    )
}