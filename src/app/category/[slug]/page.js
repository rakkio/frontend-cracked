'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { api } from '@/lib/api'
import { 
    FaDownload, 
    FaStar, 
    FaEye, 
    FaFire, 
    FaCrown, 
    FaSpinner,
    FaArrowLeft,
    FaSearch,
    FaFilter,
    FaSort
} from 'react-icons/fa'

export default function CategoryPage() {
    const [category, setCategory] = useState(null)
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filters, setFilters] = useState({
        featured: false,
        popular: false,
        newest: false
    })
    
    const params = useParams()
    const router = useRouter()

    useEffect(() => {
        if (params.slug) {
            fetchCategoryAndApps()
        }
    }, [params.slug, currentPage, sortBy, sortOrder, searchTerm, filters])

    const fetchCategoryAndApps = async () => {
        try {
            setLoading(true)
            
            // First, get all categories to find the one with this slug
            const categoriesResponse = await api.getCategories()
            const foundCategory = categoriesResponse.categories?.find(c => c.slug === params.slug)
            
            if (!foundCategory) {
                router.push('/404')
                return
            }
            
            setCategory(foundCategory)
            
            // Then fetch apps for this category
            const appsResponse = await api.getApps({
                category: foundCategory._id,
                page: currentPage,
                limit: 12,
                search: searchTerm,
                sortBy,
                sortOrder,
                featured: filters.featured ? 'true' : undefined,
                popular: filters.popular ? 'true' : undefined,
                newest: filters.newest ? 'true' : undefined
            })
            
            setApps(appsResponse.data.apps || [])
            setTotalPages(appsResponse.data.pagination?.pages || 1)
        } catch (error) {
            console.error('Error fetching category data:', error)
            if (error.status === 404) {
                router.push('/404')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAppClick = (app) => {
        router.push(`/app/${app.slug}`)
    }

    const handleFilterChange = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
        setCurrentPage(1)
    }

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
        setCurrentPage(1)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="text-4xl text-red-500 animate-spin" />
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl text-white mb-4">Category not found</h1>
                    <Link href="/categories">
                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg">
                            Browse Categories
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{category.name} Apps - Download Free | Apps Cracked</title>
                <meta name="description" content={`Download free ${category.name} applications. Browse ${apps.length}+ premium ${category.name} apps with direct download links. ${category.description || `Best ${category.name} software collection.`}`} />
                <meta name="keywords" content={`${category.name}, apps, download, free, cracked, software, ${category.name} applications`} />
                <meta property="og:title" content={`${category.name} Apps - Free Downloads`} />
                <meta property="og:description" content={`Browse ${apps.length}+ premium ${category.name} applications for free download.`} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={`${category.name} Apps - Free Downloads`} />
                <meta name="twitter:description" content={`Browse premium ${category.name} applications for free download.`} />
                <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/category/${category.slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": `${category.name} Apps`,
                        "description": category.description || `Collection of ${category.name} applications`,
                        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/category/${category.slug}`,
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": apps.length,
                            "itemListElement": apps.slice(0, 10).map((app, index) => ({
                                "@type": "SoftwareApplication",
                                "position": index + 1,
                                "name": app.name,
                                "description": app.shortDescription || app.description,
                                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'}/app/${app.slug}`
                            }))
                        }
                    })}
                </script>
            </Head>
            
            <div className="min-h-screen">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 pt-8">
                    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                        <Link href="/" className="hover:text-red-400">Home</Link>
                        <span>/</span>
                        <Link href="/categories" className="hover:text-red-400">Categories</Link>
                        <span>/</span>
                        <span className="text-white">{category.name}</span>
                    </nav>

                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                {/* Category Header */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div 
                            className="text-4xl"
                            style={{ color: category.color || '#ef4444' }}
                        >
                            {category.icon || '📱'}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
                            <p className="text-gray-400">{category.description || `Explore ${category.name} applications`}</p>
                        </div>
                    </div>
                </section>

                {/* Search and Filters */}
                <section className="container mx-auto px-4 mb-8">
                    <div className="card p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search apps..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaFilter className="text-gray-400" />
                                    <span className="text-gray-400 text-sm">Filters:</span>
                                </div>
                                
                                <button
                                    onClick={() => handleFilterChange('featured')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        filters.featured 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Featured
                                </button>
                                
                                <button
                                    onClick={() => handleFilterChange('popular')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        filters.popular 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Popular
                                </button>
                                
                                <button
                                    onClick={() => handleFilterChange('newest')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        filters.newest 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Newest
                                </button>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center space-x-2">
                                <FaSort className="text-gray-400" />
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSortBy, newSortOrder] = e.target.value.split('-')
                                        setSortBy(newSortBy)
                                        setSortOrder(newSortOrder)
                                        setCurrentPage(1)
                                    }}
                                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="createdAt-asc">Oldest First</option>
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="downloads-desc">Most Downloaded</option>
                                    <option value="rating-desc">Highest Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Apps Grid */}
                <section className="container mx-auto px-4 mb-12">
                    {apps.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {apps.map((app) => (
                                <div 
                                    key={app._id} 
                                    className="card p-6 group cursor-pointer relative overflow-hidden"
                                    onClick={() => handleAppClick(app)}
                                >
                                    {app.isHot && (
                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                            <FaFire className="mr-1" />
                                            HOT
                                        </div>
                                    )}
                                    {app.isPremium && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                                            <FaCrown className="mr-1" />
                                            PRO
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-4">
                                        {app.images && app.images[0] ? (
                                            <img 
                                                src={app.images[0]} 
                                                alt={app.name}
                                                className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                                                📱
                                            </div>
                                        )}
                                        <h3 className="text-lg font-semibold text-white mb-1">{app.name}</h3>
                                        <p className="text-gray-400 text-sm">{app.developer}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4 text-sm">
                                        <div className="flex items-center text-yellow-400">
                                            <FaStar className="mr-1" />
                                            {app.rating || '4.5'}
                                        </div>
                                        <div className="text-gray-400">
                                            <FaDownload className="inline mr-1" />
                                            {app.downloads || 0}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">{app.size}</span>
                                        <button 
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAppClick(app)
                                            }}
                                        >
                                            <FaEye className="inline mr-1" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">😔</div>
                            <h3 className="text-2xl font-semibold text-white mb-2">No apps found</h3>
                            <p className="text-gray-400 mb-6">
                                {searchTerm 
                                    ? `No apps found for "${searchTerm}" in ${category.name}`
                                    : `No apps available in ${category.name} category yet`
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('')
                                        setFilters({ featured: false, popular: false, newest: false })
                                    }}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <section className="container mx-auto px-4 mb-12">
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                            
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                            >
                                Next
                            </button>
                        </div>
                        
                        <div className="text-center mt-4 text-gray-400 text-sm">
                            Page {currentPage} of {totalPages}
                        </div>
                    </section>
                )}
            </div>
        </>
    )
} 