'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Link from 'next/link'
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaEye, 
    FaEyeSlash,
    FaSearch,
    FaFilter,
    FaSpinner,
    FaChartBar,
    FaArrowLeft,
    FaBullhorn,
    FaToggleOn,
    FaToggleOff
} from 'react-icons/fa'

export default function AdvertisementsAdminPage() {
    const { user } = useAuth()
    const [advertisements, setAdvertisements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedPlacement, setSelectedPlacement] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [analytics, setAnalytics] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingAd, setEditingAd] = useState(null)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        script: '',
        type: 'download',
        placement: 'before_download',
        priority: 0,
        targetPages: [],
        settings: {
            countdown: 15,
            closable: false,
            autoClose: false,
            autoCloseDelay: 30,
            verificationRequired: true
        },
        schedule: {
            enabled: false,
            startDate: '',
            endDate: '',
            timezone: 'UTC'
        }
    })

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdvertisements()
            fetchAnalytics()
        }
    }, [user])

    const fetchAdvertisements = async () => {
        try {
            setLoading(true)
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (selectedType) params.type = selectedType
            if (selectedPlacement) params.placement = selectedPlacement
            if (selectedStatus) params.isActive = selectedStatus === 'active'

            const response = await api.getAdvertisements(params)
            setAdvertisements(response.data?.advertisements || [])
        } catch (error) {
            console.error('Error fetching advertisements:', error)
            setError('Failed to load advertisements')
        } finally {
            setLoading(false)
        }
    }

    const fetchAnalytics = async () => {
        try {
            const response = await api.getAdvertisementAnalytics()
            setAnalytics(response.data?.analytics)
        } catch (error) {
            console.error('Error fetching analytics:', error)
        }
    }

    const testAuthentication = async () => {
        try {
            console.log('=== Testing Authentication ===')
            const response = await api.testAuth()
            console.log('Auth test response:', response)
            alert(`Authentication successful!\nUser: ${response.user.name}\nRole: ${response.user.role}`)
        } catch (error) {
            console.error('Auth test failed:', error)
            alert(`Authentication failed: ${error.message}`)
        }
    }

    const handleCreateSubmit = async (e) => {
        e.preventDefault()
        
        // Check authentication status
        console.log('=== Authentication Debug ===')
        console.log('User:', user)
        console.log('User role:', user?.role)
        console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing')
        
        // Basic frontend validation
        if (!formData.name?.trim()) {
            alert('Advertisement name is required')
            return
        }
        
        if (!formData.script?.trim()) {
            alert('Advertisement script is required')
            return
        }
        
        if (formData.name.length > 100) {
            alert('Advertisement name must be less than 100 characters')
            return
        }
        
        if (formData.script.length > 100000) {
            alert('Advertisement script must be less than 100KB')
            return
        }
        
        // Clean formData - remove empty strings
        const cleanedData = {
            ...formData,
            description: formData.description?.trim() || undefined,
            schedule: {
                ...formData.schedule,
                startDate: formData.schedule.startDate?.trim() || undefined,
                endDate: formData.schedule.endDate?.trim() || undefined
            }
        }
        
        try {
            // Debug: Log formData before sending
            console.log('Creating advertisement with cleaned data:', cleanedData)
            
            const response = await api.createAdvertisement(cleanedData)
            setAdvertisements([response.data.advertisement, ...advertisements])
            setShowCreateForm(false)
            resetForm()
            fetchAnalytics()
        } catch (error) {
            console.error('Error creating advertisement:', error)
            
            // Show detailed validation errors
            let errorMessage = 'Failed to create advertisement: '
            if (error.data?.errors && Array.isArray(error.data.errors)) {
                errorMessage += error.data.errors.map(err => err.msg).join(', ')
            } else if (error.data?.message) {
                errorMessage += error.data.message
            } else {
                errorMessage += error.message
            }
            
            alert(errorMessage)
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        
        // Clean formData - remove empty strings
        const cleanedData = {
            ...formData,
            description: formData.description?.trim() || undefined,
            schedule: {
                ...formData.schedule,
                startDate: formData.schedule.startDate?.trim() || undefined,
                endDate: formData.schedule.endDate?.trim() || undefined
            }
        }
        
        try {
            console.log('Updating advertisement with cleaned data:', cleanedData)
            
            const response = await api.updateAdvertisement(editingAd._id, cleanedData)
            setAdvertisements(advertisements.map(ad => 
                ad._id === editingAd._id ? response.data.advertisement : ad
            ))
            setEditingAd(null)
            resetForm()
            fetchAnalytics()
        } catch (error) {
            console.error('Error updating advertisement:', error)
            
            // Show detailed validation errors
            let errorMessage = 'Failed to update advertisement: '
            if (error.data?.errors && Array.isArray(error.data.errors)) {
                errorMessage += error.data.errors.map(err => err.msg).join(', ')
            } else if (error.data?.message) {
                errorMessage += error.data.message
            } else {
                errorMessage += error.message
            }
            
            alert(errorMessage)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this advertisement?')) return

        try {
            await api.deleteAdvertisement(id)
            setAdvertisements(advertisements.filter(ad => ad._id !== id))
            fetchAnalytics()
        } catch (error) {
            console.error('Error deleting advertisement:', error)
            alert('Failed to delete advertisement')
        }
    }

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await api.updateAdvertisement(id, { isActive: !currentStatus })
            setAdvertisements(advertisements.map(ad => 
                ad._id === id ? response.data.advertisement : ad
            ))
            fetchAnalytics()
        } catch (error) {
            console.error('Error toggling status:', error)
            alert('Failed to update status')
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            script: '',
            type: 'download',
            placement: 'before_download',
            priority: 0,
            targetPages: [],
            settings: {
                countdown: 15,
                closable: false,
                autoClose: false,
                autoCloseDelay: 30,
                verificationRequired: true
            },
            schedule: {
                enabled: false,
                startDate: '',
                endDate: '',
                timezone: 'UTC'
            }
        })
    }

    const startEdit = (ad) => {
        setFormData({
            name: ad.name,
            description: ad.description || '',
            script: ad.script,
            type: ad.type,
            placement: ad.placement,
            priority: ad.priority,
            targetPages: ad.targetPages || [],
            settings: ad.settings,
            schedule: ad.schedule
        })
        setEditingAd(ad)
        setShowCreateForm(true)
    }

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            fetchAdvertisements()
        }, 500)
        return () => clearTimeout(delayedSearch)
    }, [searchTerm, selectedType, selectedPlacement, selectedStatus])

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p>You need admin privileges to access this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <div className="flex items-center space-x-3">
                            <FaBullhorn className="text-3xl text-red-500" />
                            <h1 className="text-3xl font-bold text-white">Advertisements</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={testAuthentication}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                            Test Auth
                        </button>
                        <button
                            onClick={() => {
                                setShowCreateForm(true)
                                setEditingAd(null)
                                resetForm()
                            }}
                            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            <FaPlus />
                            <span>New Advertisement</span>
                        </button>
                    </div>
                </div>

                {/* Analytics Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <FaChartBar className="text-blue-500 text-xl" />
                                <h3 className="text-white font-semibold">Total Ads</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics.totalAds}</p>
                            <p className="text-green-400 text-sm">{analytics.activeAds} active</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <FaEye className="text-green-500 text-xl" />
                                <h3 className="text-white font-semibold">Impressions</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics.totalImpressions?.toLocaleString()}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <FaBullhorn className="text-yellow-500 text-xl" />
                                <h3 className="text-white font-semibold">Clicks</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics.totalClicks?.toLocaleString()}</p>
                            <p className="text-blue-400 text-sm">{analytics.avgCTR?.toFixed(2)}% CTR</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <FaChartBar className="text-purple-500 text-xl" />
                                <h3 className="text-white font-semibold">Conversions</h3>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics.totalConversions?.toLocaleString()}</p>
                            <p className="text-green-400 text-sm">{analytics.avgConversionRate?.toFixed(2)}% rate</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search advertisements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="">All Types</option>
                            <option value="download">Download</option>
                            <option value="popup">Popup</option>
                            <option value="banner">Banner</option>
                            <option value="interstitial">Interstitial</option>
                        </select>

                        <select
                            value={selectedPlacement}
                            onChange={(e) => setSelectedPlacement(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="">All Placements</option>
                            <option value="before_download">Before Download</option>
                            <option value="after_download">After Download</option>
                            <option value="page_load">Page Load</option>
                            <option value="manual">Manual</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Create/Edit Form */}
                {showCreateForm && (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
                        </h2>
                        
                        <form onSubmit={editingAd ? handleUpdateSubmit : handleCreateSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                        placeholder="Advertisement name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Priority</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="download">Download</option>
                                        <option value="popup">Popup</option>
                                        <option value="banner">Banner</option>
                                        <option value="interstitial">Interstitial</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Placement</label>
                                    <select
                                        value={formData.placement}
                                        onChange={(e) => setFormData({...formData, placement: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="before_download">Before Download</option>
                                        <option value="after_download">After Download</option>
                                        <option value="page_load">Page Load</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    placeholder="Advertisement description"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Script Code *</label>
                                <textarea
                                    required
                                    value={formData.script}
                                    onChange={(e) => setFormData({...formData, script: e.target.value})}
                                    rows={6}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-red-500"
                                    placeholder="Paste your advertisement script here..."
                                />
                                <p className="text-gray-400 text-sm mt-2">
                                    Paste the complete advertisement script including &lt;script&gt; tags
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">Countdown (seconds)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="60"
                                        value={formData.settings.countdown}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            settings: {...formData.settings, countdown: parseInt(e.target.value)}
                                        })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 text-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.settings.closable}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                settings: {...formData.settings, closable: e.target.checked}
                                            })}
                                            className="rounded bg-gray-700 border-gray-600"
                                        />
                                        <span>Closable</span>
                                    </label>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 text-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.settings.verificationRequired}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                settings: {...formData.settings, verificationRequired: e.target.checked}
                                            })}
                                            className="rounded bg-gray-700 border-gray-600"
                                        />
                                        <span>Verification Required</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 pt-6 border-t border-gray-700">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    {editingAd ? 'Update Advertisement' : 'Create Advertisement'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false)
                                        setEditingAd(null)
                                        resetForm()
                                    }}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Advertisements List */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
                            <p className="text-gray-400">Loading advertisements...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">
                            <p>{error}</p>
                        </div>
                    ) : advertisements.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <FaBullhorn className="text-6xl mx-auto mb-4 opacity-50" />
                            <p>No advertisements found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-white font-semibold">Name</th>
                                        <th className="px-6 py-3 text-left text-white font-semibold">Type</th>
                                        <th className="px-6 py-3 text-left text-white font-semibold">Placement</th>
                                        <th className="px-6 py-3 text-left text-white font-semibold">Priority</th>
                                        <th className="px-6 py-3 text-center text-white font-semibold">Status</th>
                                        <th className="px-6 py-3 text-center text-white font-semibold">Stats</th>
                                        <th className="px-6 py-3 text-center text-white font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {advertisements.map((ad) => (
                                        <tr key={ad._id} className="hover:bg-gray-700/30">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{ad.name}</p>
                                                    {ad.description && (
                                                        <p className="text-gray-400 text-sm truncate max-w-xs">{ad.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full capitalize">
                                                    {ad.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                                                    {ad.placement.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white">{ad.priority}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(ad._id, ad.isActive)}
                                                    className={`text-2xl transition-colors ${
                                                        ad.isActive ? 'text-green-500 hover:text-green-400' : 'text-gray-500 hover:text-gray-400'
                                                    }`}
                                                >
                                                    {ad.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm text-gray-300">
                                                    <div>{ad.impressions?.toLocaleString() || 0} views</div>
                                                    <div>{ad.clicks?.toLocaleString() || 0} clicks</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => startEdit(ad)}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ad._id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
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
                    )}
                </div>
            </div>
        </div>
    )
} 