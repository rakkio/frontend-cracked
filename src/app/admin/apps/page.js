'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaMobileAlt } from 'react-icons/fa'

export default function AppsManagement() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    const router = useRouter()

    useEffect(() => {
        fetchApps()
    }, [])

    const fetchApps = async () => {
        try {
            setLoading(true)
            const response = await api.getApps({ limit: 20 })
            setApps(response.data.apps)
        } catch (error) {
            console.error('Error fetching apps:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteApp = async (appId) => {
        if (!confirm('Are you sure you want to delete this app?')) return

        try {
            await api.deleteApp(appId)
            fetchApps()
        } catch (error) {
            console.error('Error deleting app:', error)
            alert('Error deleting app: ' + error.message)
        }
    }

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Apps Management</h1>
                            <p className="text-gray-400">Manage your application catalog</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/apps/create')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
                        >
                            <FaPlus />
                            <span>Add New App</span>
                        </button>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search apps..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FaSpinner className="text-4xl text-red-500 animate-spin" />
                        </div>
                    ) : filteredApps.length > 0 ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">App</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Developer</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Downloads</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredApps.map(app => (
                                            <tr key={app._id} className="hover:bg-gray-700/30">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        {app.images && app.images[0] ? (
                                                            <img
                                                                src={app.images[0]}
                                                                alt={app.name}
                                                                className="w-10 h-10 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                                                <FaMobileAlt className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-white font-medium">{app.name}</p>
                                                            <p className="text-gray-400 text-sm">v{app.version}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{app.developer}</td>
                                                <td className="px-6 py-4 text-gray-300">{app.category?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-300">{app.downloads || 0}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        app.isActive 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {app.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/apps/${app.slug}`)}
                                                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                                            title="View"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/admin/apps/edit/${app._id}`)}
                                                            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteApp(app._id)}
                                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
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
                    ) : (
                        <div className="text-center py-20">
                            <FaMobileAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Apps Found</h3>
                            <p className="text-gray-400 mb-6">Get started by adding your first app</p>
                            <button
                                onClick={() => router.push('/admin/apps/create')}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
                            >
                                <FaPlus />
                                <span>Add First App</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 