'use client'
import { useState, useEffect } from 'react'
import { useBanners, useBannerStats } from '@/hooks/useBanners'
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaSearch, 
    FaFilter,
    FaEye,
    FaEyeSlash,
    FaStar,
    FaRegStar,
    FaChartBar,
    FaImage,
    FaVideo,
    FaExternalLinkAlt,
    FaPlay,
    FaPause
} from 'react-icons/fa'
import Link from 'next/link'

export default function AdminBannersPage() {
    const {
        banners,
        loading,
        error,
        pagination,
        fetchBanners,
        deleteBanner,
        searchBanners,
        toggleBannerStatus,
        toggleFeaturedStatus,
        clearError
    } = useBanners()

    const {
        stats,
        topPerforming,
        loading: statsLoading
    } = useBannerStats()

    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({
        position: '',
        mediaType: '',
        isActive: '',
        isFeatured: ''
    })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedBanners, setSelectedBanners] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [bannerToDelete, setBannerToDelete] = useState(null)

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            searchBanners(searchQuery, filters)
        } else {
            fetchBanners(filters)
        }
    }

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        
        if (searchQuery.trim()) {
            searchBanners(searchQuery, newFilters)
        } else {
            fetchBanners(newFilters)
        }
    }

    const handleDeleteClick = (banner) => {
        setBannerToDelete(banner)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (bannerToDelete) {
            try {
                await deleteBanner(bannerToDelete._id)
                setShowDeleteModal(false)
                setBannerToDelete(null)
            } catch (err) {
                console.error('Error deleting banner:', err)
            }
        }
    }

    const handleStatusToggle = async (banner) => {
        try {
            await toggleBannerStatus(banner._id, !banner.isActive)
        } catch (err) {
            console.error('Error toggling status:', err)
        }
    }

    const handleFeaturedToggle = async (banner) => {
        try {
            await toggleFeaturedStatus(banner._id, !banner.isFeatured)
        } catch (err) {
            console.error('Error toggling featured status:', err)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getPositionBadge = (position) => {
        const colors = {
            hero: 'bg-purple-100 text-purple-800',
            middle: 'bg-blue-100 text-blue-800',
            bottom: 'bg-green-100 text-green-800',
            sidebar: 'bg-orange-100 text-orange-800'
        }
        return colors[position] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Banner Management</h1>
                        <p className="text-gray-400">Manage promotional banners and advertisements</p>
                    </div>
                    <Link 
                        href="/admin/banners/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                        <FaPlus />
                        Create Banner
                    </Link>
                </div>

                {/* Statistics Cards */}
                {stats && !statsLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Banners</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalBanners}</p>
                                </div>
                                <FaChartBar className="text-purple-400 text-2xl" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Active Banners</p>
                                    <p className="text-2xl font-bold text-green-400">{stats.activeBanners}</p>
                                </div>
                                <FaEye className="text-green-400 text-2xl" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Impressions</p>
                                    <p className="text-2xl font-bold text-blue-400">{stats.totalImpressions?.toLocaleString()}</p>
                                </div>
                                <FaEye className="text-blue-400 text-2xl" />
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Avg CTR</p>
                                    <p className="text-2xl font-bold text-yellow-400">{stats.avgCTR?.toFixed(2)}%</p>
                                </div>
                                <FaChartBar className="text-yellow-400 text-2xl" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search banners by title, description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-10 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <FaFilter />
                            Filters
                        </button>
                    </form>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                value={filters.position}
                                onChange={(e) => handleFilterChange('position', e.target.value)}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="">All Positions</option>
                                <option value="hero">Hero</option>
                                <option value="middle">Middle</option>
                                <option value="bottom">Bottom</option>
                                <option value="sidebar">Sidebar</option>
                            </select>

                            <select
                                value={filters.mediaType}
                                onChange={(e) => handleFilterChange('mediaType', e.target.value)}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="">All Media Types</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>

                            <select
                                value={filters.isActive}
                                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>

                            <select
                                value={filters.isFeatured}
                                onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="">All Featured</option>
                                <option value="true">Featured</option>
                                <option value="false">Not Featured</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Banners Table */}
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-r-transparent rounded-full mb-4"></div>
                            <p className="text-gray-400">Loading banners...</p>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No banners found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700/50 border-b border-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Banner</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Position</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Stats</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {banners.map((banner) => (
                                        <tr key={banner._id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                                                        {banner.mediaType === 'video' ? (
                                                            <video
                                                                src={banner.mediaUrl}
                                                                className="w-full h-full object-cover"
                                                                poster={banner.thumbnailUrl}
                                                            />
                                                        ) : (
                                                            <img
                                                                src={banner.thumbnailUrl || banner.mediaUrl}
                                                                alt={banner.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white">{banner.title}</h3>
                                                        <p className="text-sm text-gray-400 line-clamp-1">
                                                            {banner.description || 'No description'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Created: {formatDate(banner.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionBadge(banner.position)}`}>
                                                    {banner.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-300">
                                                    {banner.mediaType === 'video' ? (
                                                        <><FaVideo className="mr-2" /> Video</>
                                                    ) : (
                                                        <><FaImage className="mr-2" /> Image</>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleStatusToggle(banner)}
                                                        className={`p-1 rounded-full ${banner.isActive 
                                                            ? 'text-green-400 hover:bg-green-400/20' 
                                                            : 'text-gray-400 hover:bg-gray-400/20'
                                                        }`}
                                                        title={banner.isActive ? 'Active' : 'Inactive'}
                                                    >
                                                        {banner.isActive ? <FaEye /> : <FaEyeSlash />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleFeaturedToggle(banner)}
                                                        className={`p-1 rounded-full ${banner.isFeatured 
                                                            ? 'text-yellow-400 hover:bg-yellow-400/20' 
                                                            : 'text-gray-400 hover:bg-gray-400/20'
                                                        }`}
                                                        title={banner.isFeatured ? 'Featured' : 'Not Featured'}
                                                    >
                                                        {banner.isFeatured ? <FaStar /> : <FaRegStar />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">
                                                    <div>Views: {banner.impressions?.toLocaleString() || 0}</div>
                                                    <div>Clicks: {banner.clicks?.toLocaleString() || 0}</div>
                                                    <div className="text-xs text-gray-500">
                                                        CTR: {banner.ctr || 0}%
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/admin/banners/edit/${banner._id}`}
                                                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                                                        title="Edit Banner"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(banner)}
                                                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                                        title="Delete Banner"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    {banner.actionType === 'link' && banner.actionValue && (
                                                        <a
                                                            href={banner.actionValue}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-purple-400 hover:bg-purple-400/20 rounded-lg transition-colors"
                                                            title="Open Link"
                                                        >
                                                            <FaExternalLinkAlt />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.total)} of {pagination.total} results
                            </div>
                            <div className="flex space-x-2">
                                {pagination.hasPrev && (
                                    <button
                                        onClick={() => fetchBanners({ ...filters, page: pagination.current - 1 })}
                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}
                                {pagination.hasNext && (
                                    <button
                                        onClick={() => fetchBanners({ ...filters, page: pagination.current + 1 })}
                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Delete Banner</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 