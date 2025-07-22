'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash, FaWindows, FaApple, FaLinux, FaAndroid, FaDownload } from 'react-icons/fa'

export default function EditApp() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        version: '',
        size: '',
        developer: ''
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [images, setImages] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])

    const router = useRouter()
    const { id } = useParams()

    const platformOptions = [
        { value: 'windows', label: 'Windows', icon: FaWindows },
        { value: 'mac', label: 'macOS', icon: FaApple },
        { value: 'linux', label: 'Linux', icon: FaLinux },
        { value: 'android', label: 'Android', icon: FaAndroid },
        { value: 'ios', label: 'iOS', icon: FaApple }
    ]

    useEffect(() => {
        if (id) {
            fetchApp()
            fetchCategories()
        }
    }, [id])

    const fetchApp = async () => {
        try {
            const response = await api.getApp(id)
            const app = response.app
            setFormData({
                name: app.name || '',
                description: (app.description || '').toString(),
                category: app.category?._id || '',
                version: app.version || '',
                size: app.size || '',
                developer: app.developer || ''
            })
            setExistingImages(app.images || [])
            setDownloadLinks(app.downloadLinks || [])
        } catch (error) {
            console.error('Error fetching app:', error)
            alert('Error loading app data')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories()
            setCategories(response.categories)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
    }

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const addDownloadLink = () => {
        setDownloadLinks(prev => [...prev, {
            platform: '',
            url: '',
            isActive: true
        }])
    }

    const removeDownloadLink = (index) => {
        setDownloadLinks(prev => prev.filter((_, i) => i !== index))
    }

    const updateDownloadLink = (index, field, value) => {
        setDownloadLinks(prev => prev.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
        ))
    }

    const getPlatformIcon = (platform) => {
        const platformData = platformOptions.find(p => p.value === platform)
        return platformData ? platformData.icon : FaDownload
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const formDataToSend = new FormData()
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key])
            })

            // Append download links as JSON
            formDataToSend.append('downloadLinks', JSON.stringify(downloadLinks))

            // Append existing images that weren't removed
            formDataToSend.append('existingImages', JSON.stringify(existingImages))

            // Append new images
            images.forEach(image => {
                formDataToSend.append('images', image)
            })

            await api.updateApp(id, formDataToSend)
            router.push('/admin/apps')
        } catch (error) {
            console.error('Error updating app:', error)
            alert('Error updating app: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <ProtectedRoute requireAdmin={true}>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                    <FaSpinner className="text-4xl text-red-500 animate-spin" />
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back to Apps</span>
                            </button>
                            <h1 className="text-3xl font-bold text-white mb-2">Edit App</h1>
                            <p className="text-gray-400">Update application information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        App Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Enter app name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Developer *
                                    </label>
                                    <input
                                        type="text"
                                        name="developer"
                                        value={formData.developer}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Enter developer name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Version *
                                    </label>
                                    <input
                                        type="text"
                                        name="version"
                                        value={formData.version}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., 1.0.0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Size *
                                    </label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., 2.5GB, 150MB"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <RichTextEditor
                                    value={formData.description || ''}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                                    placeholder="Write a detailed app description. You can use Markdown for formatting."
                                    rows={8}
                                />
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Current Images
                                </label>
                                {existingImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`App image ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Add New Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
                                />
                                <p className="text-gray-400 text-sm mt-2">
                                    Select multiple images (PNG, JPG, JPEG) to add to existing ones.
                                </p>
                                {images.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-green-400 text-sm">{images.length} new image(s) selected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download Links Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Download Links</h3>
                                <button
                                    type="button"
                                    onClick={addDownloadLink}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                                >
                                    <FaPlus />
                                    <span>Add Link</span>
                                </button>
                            </div>

                            {downloadLinks.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                                    <FaDownload className="text-4xl text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 mb-4">No download links added yet</p>
                                    <button
                                        type="button"
                                        onClick={addDownloadLink}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                                    >
                                        <FaPlus />
                                        <span>Add First Link</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {downloadLinks.map((link, index) => {
                                        const IconComponent = getPlatformIcon(link.platform)
                                        return (
                                            <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Platform *
                                                        </label>
                                                        <select
                                                            value={link.platform}
                                                            onChange={(e) => updateDownloadLink(index, 'platform', e.target.value)}
                                                            required
                                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        >
                                                            <option value="">Select Platform</option>
                                                            {platformOptions.map(platform => (
                                                                <option key={platform.value} value={platform.value}>
                                                                    {platform.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Download URL *
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={link.url}
                                                            onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                                                            required
                                                            placeholder="https://example.com/download/app.exe"
                                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-lg">
                                                            <IconComponent className="text-gray-300" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDownloadLink(index)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                                            title="Remove link"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={link.isActive}
                                                        onChange={(e) => updateDownloadLink(index, 'isActive', e.target.checked)}
                                                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-300">
                                                        Active (users can see and use this link)
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <FaSave />
                                <span>{saving ? 'Updating...' : 'Update App'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    )
} 