'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
    FaPlus, FaEdit, FaTrash, FaEye, FaDownload, 
    FaStar, FaApple, FaSearch, FaFilter,
    FaSort, FaChevronLeft, FaChevronRight, FaLock
} from 'react-icons/fa'
import Link from 'next/link'

export default function IPAAdminPage() {
    const { user } = useAuth()
    const [ipas, setIpas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterJailbreak, setFilterJailbreak] = useState('')
    const [categories, setCategories] = useState([])

    // Fetch IPAs
    const fetchIpas = async (page = 1) => {
        try {
            setLoading(true)
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                sort: sortBy,
                order: sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(filterCategory && { category: filterCategory }),
                ...(filterJailbreak && { jailbreakRequired: filterJailbreak })
            })

            const response = await fetch(`${API_BASE_URL}/api/v1/ipa?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) throw new Error('Failed to fetch IPAs')

            const data = await response.json()
            if (data.success) {
                setIpas(data.data.ipas || data.data)
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

    // Delete IPA
    const deleteIpa = async (id) => {
        if (!confirm('Are you sure you want to delete this IPA?')) return

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
            const response = await fetch(`${API_BASE_URL}/api/v1/ipa/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                fetchIpas(currentPage)
            } else {
                throw new Error('Failed to delete IPA')
            }
        } catch (err) {
            alert('Error deleting IPA: ' + err.message)
        }
    }

    useEffect(() => {
        if (user?.token) {
            fetchIpas()
            fetchCategories()
        }
    }, [user, sortBy, sortOrder, filterCategory, filterJailbreak])

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (user?.token) {
                fetchIpas(1)
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
                        <FaApple className="text-gray-300 text-2xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">IPA Management</h1>
                            <p className="text-gray-400">Manage iOS applications</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/ipa/create"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <FaPlus />
                        <span>Add New IPA</span>
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
                            placeholder="Search IPAs..."
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

                    {/* Jailbreak Filter */}
                    <select
                        value={filterJailbreak}
                        onChange={(e) => setFilterJailbreak(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                    >
                        <option value="">All Types</option>
                        <option value="true">Jailbreak Required</option>
                        <option value="false">No Jailbreak</option>
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
                            onClick={() => fetchIpas(currentPage)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : ipas.length === 0 ? (
                    <div className="text-center py-12">
                        <FaApple className="text-gray-600 text-6xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No IPAs Found</h3>
                        <p className="text-gray-500 mb-4">Start by adding your first iOS application.</p>
                        <Link
                            href="/admin/ipa/create"
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
                        >
                            <FaPlus />
                            <span>Add First IPA</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* IPAs Table */}
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">IPA</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Version</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Jailbreak</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Downloads</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rating</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {ipas.map((ipa) => (
                                            <tr key={ipa._id} className="hover:bg-gray-800/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                                            {ipa.icon ? (
                                                                <img
                                                                    src={ipa.icon}
                                                                    alt={ipa.name}
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <FaApple className="text-gray-300 text-xl" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-white">{ipa.name}</h3>
                                                            <p className="text-sm text-gray-400 truncate max-w-xs">
                                                                {ipa.shortDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                                        {ipa.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{ipa.version}</td>
                                                <td className="px-6 py-4">
                                                    {ipa.jailbreakRequired ? (
                                                        <div className="flex items-center space-x-1 text-red-400">
                                                            <FaLock className="text-sm" />
                                                            <span>Required</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-green-400">Not Required</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-gray-300">
                                                        <FaDownload className="text-sm" />
                                                        <span>{ipa.downloads || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-yellow-400">
                                                        <FaStar className="text-sm" />
                                                        <span>{ipa.rating || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        ipa.status === 'active' 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {ipa.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin/ipa/${ipa._id}`}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/ipa/edit/${ipa._id}`}
                                                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteIpa(ipa._id)}
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
                                        onClick={() => fetchIpas(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={() => fetchIpas(currentPage + 1)}
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
