'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaWindows, FaApple, FaLinux, FaAndroid, FaDownload } from 'react-icons/fa'

export default function CreateApp() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        version: '',
        size: '',
        developer: ''
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])

    const router = useRouter()

    const platformOptions = [
        { value: 'windows', label: 'Windows', icon: FaWindows },
        { value: 'mac', label: 'macOS', icon: FaApple },
        { value: 'linux', label: 'Linux', icon: FaLinux },
        { value: 'android', label: 'Android', icon: FaAndroid },
        { value: 'ios', label: 'iOS', icon: FaApple }
    ]

    useEffect(() => {
        fetchCategories()
    }, [])

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
        
        // Real-time validation for size field
        if (name === 'size' && value) {
            const sizeRegex = /^\d+(\.\d+)?\s?(B|KB|MB|GB|TB)$/i
            const isValid = sizeRegex.test(value)
            const sizeInput = e.target
            if (isValid) {
                sizeInput.classList.remove('border-red-500')
                sizeInput.classList.add('border-gray-600')
            } else {
                sizeInput.classList.remove('border-gray-600')
                sizeInput.classList.add('border-red-500')
            }
        }
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Client-side validation
        if (!formData.name || formData.name.length < 3) {
            alert('App name must be at least 3 characters long')
            return
        }
        
        if (!formData.description || formData.description.length < 50) {
            alert('Description must be at least 50 characters long')
            return
        }
        
        if (!formData.category) {
            alert('Please select a category')
            return
        }
        
        if (!formData.version) {
            alert('Please enter a version')
            return
        }
        
        if (!formData.size) {
            alert('Please enter the app size')
            return
        }
        
        // Validate size format
        const sizeRegex = /^\d+(\.\d+)?\s?(B|KB|MB|GB|TB)$/i
        if (!sizeRegex.test(formData.size)) {
            alert('Size must be in format like "150 MB" or "2.5 GB" (with unit)')
            return
        }
        
        if (!formData.developer) {
            alert('Please enter the developer name')
            return
        }
        
        // Validate download links
        if (downloadLinks.length === 0) {
            alert('Please add at least one download link')
            return
        }
        
        for (let i = 0; i < downloadLinks.length; i++) {
            const link = downloadLinks[i]
            if (!link.platform) {
                alert(`Please select a platform for link ${i + 1}`)
                return
            }
            if (!link.url) {
                alert(`Please enter a URL for link ${i + 1}`)
                return
            }
            try {
                new URL(link.url)
            } catch {
                alert(`Please enter a valid URL for link ${i + 1}`)
                return
            }
        }
        
        setLoading(true)

        try {
            const formDataToSend = new FormData()
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key])
            })

            // Append default boolean values
            formDataToSend.append('isPremium', 'false')
            formDataToSend.append('isHot', 'false')
            formDataToSend.append('isFeatured', 'false')
            formDataToSend.append('isActive', 'true')

            // Append empty tags array
            formDataToSend.append('tags', '[]')

            // Append empty system requirements
            formDataToSend.append('systemRequirements', '{}')

            // Append download links as JSON
            formDataToSend.append('downloadLinks', JSON.stringify(downloadLinks))

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image)
            })

            await api.createApp(formDataToSend)
            router.push('/admin/apps')
        } catch (error) {
            console.error('Error creating app:', error)
            alert('Error creating app: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const getPlatformIcon = (platform) => {
        const platformData = platformOptions.find(p => p.value === platform)
        return platformData ? platformData.icon : FaDownload
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
                            <h1 className="text-3xl font-bold text-white mb-2">Create New App</h1>
                            <p className="text-gray-400">Add a new application to the marketplace</p>
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
                                        placeholder="e.g., 1.0.0, v2.1.3, 2025 v1.0.0"
                                    />
                                    <p className="text-gray-400 text-xs mt-1">
                                        Format: 1.0.0, v2.1.3, 2025 v1.0.0, 1.0.0-beta
                                    </p>
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
                                        placeholder="e.g., 1.7 GB, 150 MB"
                                    />
                                    <p className="text-gray-400 text-xs mt-1">
                                        Format: 1.7 GB, 150 MB, 2.5 TB (number + space + unit required)
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description * (minimum 50 characters)
                                </label>
                                <RichTextEditor
                                    value={formData.description || ''}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                                    placeholder="Write a detailed app description. You can use Markdown for formatting."
                                    rows={8}
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Current length: {formData.description?.length || 0} characters (minimum 50 required)
                                </p>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    App Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
                                />
                                <p className="text-gray-400 text-sm mt-2">
                                    Select multiple images (PNG, JPG, JPEG). First image will be the main image.
                                </p>
                                {images.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-green-400 text-sm">{images.length} image(s) selected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download Links Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Download Links * (at least one required)</h3>
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
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <FaSave />
                                <span>{loading ? 'Creating...' : 'Create App'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    )
} 