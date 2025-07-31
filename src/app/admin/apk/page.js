'use client'

import { useState, useEffect } from 'react'
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
    const fetchApks = async (page = 1) => {
        try {
            setLoading(true)
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                sort: sortBy,
                order: sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(filterCategory && { category: filterCategory })
            })

            const response = await fetch(`${API_BASE_URL}/api/v1/apk?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error('Failed to fetch APKs')

            const data = await response.json()
            if (data.success) {
                setApks(data.data.apks || data.data)
                setTotalPages(data.pagination?.totalPages || 1)
                setCurrentPage(data.pagination?.currentPage || 1)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
        if (user?.token) {
            fetchApks()
            fetchCategories()
        }
    }, [user, sortBy, sortOrder, filterCategory])

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (user?.token) {
                fetchApks(1)
            }
        }, 500)

        return () => clearTimeout(delayedSearch)
    }, [searchTerm])

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-gray-400">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-red-500/20 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <FaAndroid className="text-green-500 text-2xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">APK Management</h1>
                            <p className="text-gray-400">Manage Android applications</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/apk/create"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <FaPlus />
                        <span>Add New APK</span>
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="p-6 bg-gray-900/50 border-b border-gray-800">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-64">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search APKs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
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
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button
                            onClick={() => fetchApks(currentPage)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : apks.length === 0 ? (
                    <div className="text-center py-12">
                        <FaAndroid className="text-gray-600 text-6xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No APKs Found</h3>
                        <p className="text-gray-500 mb-4">Start by adding your first Android application.</p>
                        <Link
                            href="/admin/apk/create"
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
                        >
                            <FaPlus />
                            <span>Add First APK</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* APKs Table */}
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">APK</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Version</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Downloads</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rating</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {apks.map((apk) => (
                                            <tr key={apk._id} className="hover:bg-gray-800/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                                            {apk.icon ? (
                                                                <img
                                                                    src={apk.icon}
                                                                    alt={apk.name}
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <FaAndroid className="text-green-500 text-xl" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-white">{apk.name}</h3>
                                                            <p className="text-sm text-gray-400 truncate max-w-xs">
                                                                {apk.shortDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                                        {apk.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{apk.version}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-gray-300">
                                                        <FaDownload className="text-sm" />
                                                        <span>{apk.downloads || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-yellow-400">
                                                        <FaStar className="text-sm" />
                                                        <span>{apk.rating || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        apk.status === 'active' 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {apk.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin/apk/${apk._id}`}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/apk/edit/${apk._id}`}
                                                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteApk(apk._id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
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
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => fetchApks(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={() => fetchApks(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
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
