'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaFolder, FaTimes } from 'react-icons/fa'

export default function CategoriesManagement() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '📂',
        color: '#6B7280',
        isFeatured: false
    })

    const router = useRouter()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await api.getCategories()
            setCategories(response.categories)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: '📂',
            color: '#6B7280',
            isFeatured: false
        })
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleCreateCategory = async (e) => {
        e.preventDefault()
        try {
            await api.createCategory(formData)
            setShowCreateModal(false)
            resetForm()
            fetchCategories()
        } catch (error) {
            console.error('Error creating category:', error)
            alert('Error creating category: ' + error.message)
        }
    }

    const handleEditCategory = async (e) => {
        e.preventDefault()
        try {
            await api.updateCategory(selectedCategory._id, formData)
            setShowEditModal(false)
            setSelectedCategory(null)
            resetForm()
            fetchCategories()
        } catch (error) {
            console.error('Error updating category:', error)
            alert('Error updating category: ' + error.message)
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            await api.deleteCategory(categoryId)
            fetchCategories()
        } catch (error) {
            console.error('Error deleting category:', error)
            alert('Error deleting category: ' + error.message)
        }
    }

    const openCreateModal = () => {
        resetForm()
        setShowCreateModal(true)
    }

    const openEditModal = (category) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name || '',
            description: category.description || '',
            icon: category.icon || '📂',
            color: category.color || '#6B7280',
            isFeatured: category.isFeatured || false
        })
        setShowEditModal(true)
    }

    const closeModals = () => {
        setShowCreateModal(false)
        setShowEditModal(false)
        setSelectedCategory(null)
        resetForm()
    }

    const filteredCategories = categories.filter(category =>
        category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Categories Management</h1>
                            <p className="text-gray-400">Organize your applications by categories</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <FaPlus />
                            <span>Add New Category</span>
                        </button>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
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
                    ) : filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map(category => (
                                <div key={category._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div 
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: (category.color || '#6B7280') + '20' }}
                                            >
                                                {category.icon || '📂'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                                <p className="text-gray-400 text-sm">{category.appsCount || 0} apps</p>
                                            </div>
                                        </div>
                                        {category.isFeatured && (
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {category.description && (
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            category.isActive !== false
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {category.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => router.push(`/categories/${category.slug}`)}
                                                className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <FaFolder className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Categories Found</h3>
                            <p className="text-gray-400 mb-6">Get started by creating your first category</p>
                            <button
                                onClick={openCreateModal}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
                            >
                                <FaPlus />
                                <span>Create First Category</span>
                            </button>
                        </div>
                    )}

                    {/* Create Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-white">Create New Category</h3>
                                    <button
                                        onClick={closeModals}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleCreateCategory}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Enter category name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Category description"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Icon
                                                </label>
                                                <input
                                                    type="text"
                                                    name="icon"
                                                    value={formData.icon}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    placeholder="📂"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Color
                                                </label>
                                                <input
                                                    type="color"
                                                    name="color"
                                                    value={formData.color}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                                                />
                                                <span className="text-gray-300">Featured Category</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeModals}
                                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            Create Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-white">Edit Category</h3>
                                    <button
                                        onClick={closeModals}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleEditCategory}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Enter category name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="Category description"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Icon
                                                </label>
                                                <input
                                                    type="text"
                                                    name="icon"
                                                    value={formData.icon}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    placeholder="📂"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Color
                                                </label>
                                                <input
                                                    type="color"
                                                    name="color"
                                                    value={formData.color}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                                                />
                                                <span className="text-gray-300">Featured Category</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeModals}
                                            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            Update Category
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 