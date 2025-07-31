'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
    FaPlus, FaEdit, FaTrash, FaEye, FaDownload, 
    FaStar, FaAndroid, FaSearch, FaFilter,
    FaSort, FaChevronLeft, FaChevronRight
} from 'react-icons/fa'
import Link from 'next/link'

export default function APKAdminPage() {
    const { user } = useAuth()
    const [apks, setApks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [filterCategory, setFilterCategory] = useState('')
    const [categories, setCategories] = useState([])

    // Fetch APKs
    const fetchApks = useCallback(async (page = 1) => {
        try {
            console.log('=== FETCH APKS START ===')
            console.log('Page:', page)
            console.log('User:', user)
            console.log('User token:', user?.token)
            console.log('Sort by:', sortBy)
            console.log('Sort order:', sortOrder)
            console.log('Search term:', searchTerm)
            console.log('Filter category:', filterCategory)
            
            setLoading(true)
            setError(null) // Clear previous errors
            
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            console.log('API Base URL:', API_BASE_URL)
            
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                sort: sortBy,
                order: sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(filterCategory && { category: filterCategory })
            })

            const fullUrl = `${API_BASE_URL}/api/v1/apk?${queryParams}`
            console.log('Full URL:', fullUrl)
            
            const headers = {
                'Content-Type': 'application/json'
            }
            
            if (user?.token) {
                headers['Authorization'] = `Bearer ${user.token}`
                console.log('Authorization header added')
            } else {
                console.log('No token available, making request without auth')
            }
            
            console.log('Request headers:', headers)

            const response = await fetch(fullUrl, { headers })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)
            console.log('Response headers:', Object.fromEntries(response.headers.entries()))

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Response error text:', errorText)
                throw new Error(`Failed to fetch APKs: ${response.status} ${response.statusText} - ${errorText}`)
            }

            const data = await response.json()
            console.log('API Response data:', data)
            console.log('Data success:', data.success)
            console.log('Data.data type:', typeof data.data)
            console.log('Data.data length:', Array.isArray(data.data) ? data.data.length : 'Not array')
            
            if (data.success) {
                const apksData = data.data || []
                console.log('APKs data:', apksData)
                console.log('APKs data length:', apksData.length)
                
                setApks(Array.isArray(apksData) ? apksData : [])
                setTotalPages(data.pagination?.totalPages || 1)
                setCurrentPage(data.pagination?.currentPage || page)
                
                console.log('State updated successfully')
            } else {
                console.error('API Error:', data.message)
                setError(data.message || 'Failed to fetch APKs')
            }
            
            console.log('=== FETCH APKS END ===')
        } catch (err) {
            console.error('=== FETCH APKS ERROR ===')
            console.error('Error details:', err)
            console.error('Error message:', err.message)
            console.error('Error stack:', err.stack)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [user?.token, sortBy, sortOrder, searchTerm, filterCategory])

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const response = await fetch(`${API_BASE_URL}/api/v1/categories`)
            if (response.ok) {
                const data = await response.json()
                setCategories(data.data || [])
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    // Delete APK
    const deleteApk = async (id) => {
        if (!confirm('Are you sure you want to delete this APK?')) return

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const response = await fetch(`${API_BASE_URL}/api/v1/apk/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                fetchApks(currentPage)
            } else {
                throw new Error('Failed to delete APK')
            }
        } catch (err) {
            alert('Error deleting APK: ' + err.message)
        }
    }

    useEffect(() => {
        console.log('User state:', user)
        console.log('User token:', user?.token)
        console.log('User role:', user?.role)
        
        // Always try to fetch APKs, even without auth (for development)
        fetchApks(currentPage)
        fetchCategories()
    }, [fetchApks, currentPage])

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            setCurrentPage(1) // Reset to first page when searching
            fetchApks(1)
        }, 500)

        return () => clearTimeout(delayedSearch)
    }, [searchTerm, fetchApks])

    // Show warning if not authenticated, but allow viewing for development
    const isAuthenticated = user && (user.role === 'admin' || user.role === 'moderator')
    
    if (!isAuthenticated) {
        console.warn('User not authenticated or insufficient permissions. Showing read-only view.')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white border-b-4 border-red-500 shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-500 p-3 rounded-xl shadow-lg">
                            <FaAndroid className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">APK Marketplace</h1>
                            <p className="text-gray-600">Manage Android applications</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/apk/create"
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <FaPlus />
                        <span className="font-semibold">Add New APK</span>
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-64">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
                        <input
                            type="text"
                            placeholder="Search APKs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-red-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-red-200 rounded-xl text-gray-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-')
                            setSortBy(field)
                            setSortOrder(order)
                        }}
                        className="px-4 py-3 bg-white border-2 border-red-200 rounded-xl text-gray-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
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

            {/* Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-semibold">Loading APKs...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md mx-auto">
                            <FaAndroid className="text-red-500 text-4xl mx-auto mb-4" />
                            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
                            <button
                                onClick={() => fetchApks(currentPage)}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : apks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-8 max-w-md mx-auto">
                            <FaAndroid className="text-red-400 text-6xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No APKs Found</h3>
                            <p className="text-gray-600 mb-6">Start by adding your first Android application to the marketplace.</p>
                            <Link
                                href="/admin/apk/create"
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl inline-flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <FaPlus />
                                <span className="font-semibold">Add First APK</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* APKs Table */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-red-500 to-red-600">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">APK</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Version</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Downloads</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Rating</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-100">
                                        {apks.map((apk) => (
                                            <tr key={apk._id} className="hover:bg-red-50 transition-all duration-300">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-lg">
                                                            {apk.icon ? (
                                                                <img
                                                                    src={apk.icon}
                                                                    alt={apk.name}
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <FaAndroid className="text-red-500 text-xl" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{apk.name}</h3>
                                                            <p className="text-sm text-gray-600 truncate max-w-xs">
                                                                {apk.shortDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                        {apk.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 font-medium">{apk.version}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2 text-gray-700">
                                                        <FaDownload className="text-red-500" />
                                                        <span className="font-semibold">{apk.downloads || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2 text-yellow-600">
                                                        <FaStar className="text-yellow-500" />
                                                        <span className="font-semibold">{apk.rating || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        apk.status === 'active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {apk.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Link
                                                            href={`/admin/apk/${apk._id}`}
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300"
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/apk/edit/${apk._id}`}
                                                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all duration-300"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteApk(apk._id)}
                                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8">
                                <p className="text-gray-600 font-medium">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => fetchApks(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-all duration-300"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold shadow-lg">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={() => fetchApks(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-white border-2 border-red-200 text-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-all duration-300"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
