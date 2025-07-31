'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import AIGenerator from '@/components/admin/AIGenerator'
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaWindows, FaApple, FaLinux, FaAndroid, FaDownload, FaRobot } from 'react-icons/fa'

export default function CreateApp() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        category: '',
        version: '',
        size: '',
        developer: '',
        publisher: '',
        platforms: ['Windows'],
        packageName: '',
        minVersion: '',
        targetVersion: '',
        architecture: [],
        permissions: [],
        modFeatures: [],
        originalPrice: 0,
        tags: [],
        rating: 0,
        downloads: 0,
        reviewsCount: 0,
        instructions: '',
        isPremium: false,
        isHot: false,
        isFeatured: false,
        crackInfo: {
            crackGroup: '',
            crackDate: '',
            crackNotes: ''
        },
        systemRequirements: {
            minimum: {
                os: '',
                processor: '',
                memory: '',
                graphics: '',
                storage: ''
            }
        }
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])
    const [showAIGenerator, setShowAIGenerator] = useState(false)

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
            // Primero intentar crear las categorías básicas si no existen
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'}/api/v1/apps/create-categories`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            } catch (error) {
                console.log('Categories may already exist:', error)
            }
            
            // Luego obtener todas las categorías
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'}/api/v1/categories`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setCategories(data.categories || data.data || [])
            } else {
                console.error('Failed to fetch categories')
                // Fallback: usar categorías predefinidas
                setCategories([
                    { _id: 'productivity', name: 'Productivity' },
                    { _id: 'entertainment', name: 'Entertainment' },
                    { _id: 'games', name: 'Games' },
                    { _id: 'social', name: 'Social' },
                    { _id: 'photography', name: 'Photography' },
                    { _id: 'music', name: 'Music' },
                    { _id: 'utilities', name: 'Utilities' },
                    { _id: 'education', name: 'Education' }
                ])
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
            // Fallback: usar categorías predefinidas
            setCategories([
                { _id: 'productivity', name: 'Productivity' },
                { _id: 'entertainment', name: 'Entertainment' },
                { _id: 'games', name: 'Games' },
                { _id: 'social', name: 'Social' },
                { _id: 'photography', name: 'Photography' },
                { _id: 'music', name: 'Music' },
                { _id: 'utilities', name: 'Utilities' },
                { _id: 'education', name: 'Education' }
            ])
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

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    // Handle array fields (tags, platforms, architecture, permissions, modFeatures)
    const handleArrayChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle nested object changes (crackInfo, systemRequirements)
    const handleNestedChange = (parentField, childField, value) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: value
            }
        }))
    }

    // Handle system requirements nested changes
    const handleSystemReqChange = (level, field, value) => {
        setFormData(prev => ({
            ...prev,
            systemRequirements: {
                ...prev.systemRequirements,
                [level]: {
                    ...prev.systemRequirements[level],
                    [field]: value
                }
            }
        }))
    }

    // Apply AI generated data to form
    const applyAIData = (aiData) => {
        setFormData({
            name: aiData.name || '',
            description: aiData.description || '',
            shortDescription: aiData.shortDescription || '',
            category: aiData.category || '',
            version: aiData.version || '',
            size: aiData.size || '',
            developer: aiData.developer || '',
            publisher: aiData.publisher || '',
            platforms: aiData.platforms || ['Windows'],
            packageName: aiData.packageName || '',
            minVersion: aiData.minVersion || '',
            targetVersion: aiData.targetVersion || '',
            architecture: aiData.architecture || [],
            permissions: aiData.permissions || [],
            modFeatures: aiData.modFeatures || [],
            originalPrice: aiData.originalPrice || 0,
            tags: aiData.tags || [],
            rating: aiData.rating || 0,
            downloads: aiData.downloads || 0,
            reviewsCount: aiData.reviewsCount || 0,
            instructions: aiData.instructions || '',
            isPremium: aiData.isPremium || false,
            isHot: aiData.isHot || false,
            isFeatured: aiData.featured || aiData.isFeatured || false,
            crackInfo: aiData.crackInfo || {
                crackGroup: '',
                crackDate: '',
                crackNotes: ''
            },
            systemRequirements: aiData.systemRequirements || {
                minimum: {
                    os: '',
                    processor: '',
                    memory: '',
                    graphics: '',
                    storage: ''
                }
            }
        })

        // Also update download links if provided
        if (aiData.downloadLinks && Array.isArray(aiData.downloadLinks)) {
            setDownloadLinks(aiData.downloadLinks)
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

    const handleAIDataApply = (aiData) => {
        if (aiData) {
            applyAIData(aiData)
            setShowAIGenerator(false)
            alert('AI data has been applied to the form!')
        }
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
            
            // Append basic string fields
            const basicFields = ['name', 'description', 'shortDescription', 'category', 'version', 'size', 'developer', 'publisher', 'packageName', 'minVersion', 'targetVersion', 'instructions']
            basicFields.forEach(field => {
                if (formData[field]) {
                    formDataToSend.append(field, formData[field])
                }
            })

            // Append numeric fields
            formDataToSend.append('originalPrice', formData.originalPrice || 0)
            formDataToSend.append('rating', formData.rating || 0)
            formDataToSend.append('downloads', formData.downloads || 0)
            formDataToSend.append('reviewsCount', formData.reviewsCount || 0)

            // Append boolean fields
            formDataToSend.append('isPremium', formData.isPremium || false)
            formDataToSend.append('isHot', formData.isHot || false)
            formDataToSend.append('isFeatured', formData.isFeatured || false)
            formDataToSend.append('isActive', true)

            // Append array fields as JSON
            formDataToSend.append('platforms', JSON.stringify(formData.platforms || ['Windows']))
            formDataToSend.append('architecture', JSON.stringify(formData.architecture || []))
            formDataToSend.append('permissions', JSON.stringify(formData.permissions.filter(p => p.trim() !== '') || []))
            formDataToSend.append('modFeatures', JSON.stringify(formData.modFeatures.filter(f => f.trim() !== '') || []))
            formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim() !== '') || []))

            // Append nested objects as JSON
            formDataToSend.append('crackInfo', JSON.stringify(formData.crackInfo || {}))
            formDataToSend.append('systemRequirements', JSON.stringify(formData.systemRequirements || {}))

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
                        <button
                            type="button"
                            onClick={() => setShowAIGenerator(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <FaRobot className="text-lg" />
                            <span>Generate with AI</span>
                        </button>
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

                            {/* Additional Basic Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Publisher
                                    </label>
                                    <input
                                        type="text"
                                        name="publisher"
                                        value={formData.publisher}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Enter publisher name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Package Name
                                    </label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., com.example.app"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Min Version
                                    </label>
                                    <input
                                        type="text"
                                        name="minVersion"
                                        value={formData.minVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., Windows 10, Android 8.0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target Version
                                    </label>
                                    <input
                                        type="text"
                                        name="targetVersion"
                                        value={formData.targetVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., Windows 11, Android 14"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Original Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rating (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="4.5"
                                    />
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Short Description
                                </label>
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Brief description for app cards and previews"
                                />
                            </div>

                            {/* Instructions */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Installation Instructions
                                </label>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Step-by-step installation instructions"
                                />
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

                        {/* Platforms and Configuration */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Platforms & Configuration</h3>
                            
                            {/* Platforms */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Supported Platforms
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {platformOptions.map(platform => (
                                        <label key={platform.value} className="flex items-center space-x-2 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.platforms.includes(platform.value)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleArrayChange('platforms', [...formData.platforms, platform.value])
                                                    } else {
                                                        handleArrayChange('platforms', formData.platforms.filter(p => p !== platform.value))
                                                    }
                                                }}
                                                className="text-red-500"
                                            />
                                            <platform.icon className="text-lg" />
                                            <span className="text-sm text-gray-300">{platform.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Architecture */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Architecture Support
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['x86', 'x64', 'arm64', 'arm64-v8a', 'armeabi-v7a'].map(arch => (
                                        <label key={arch} className="flex items-center space-x-2 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.architecture.includes(arch)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        handleArrayChange('architecture', [...formData.architecture, arch])
                                                    } else {
                                                        handleArrayChange('architecture', formData.architecture.filter(a => a !== arch))
                                                    }
                                                }}
                                                className="text-red-500"
                                            />
                                            <span className="text-sm text-gray-300">{arch}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* App Flags */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <label className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPremium"
                                        checked={formData.isPremium}
                                        onChange={handleCheckboxChange}
                                        className="text-red-500 scale-125"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Premium App</span>
                                        <p className="text-gray-400 text-xs">Mark as premium/paid app</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isHot"
                                        checked={formData.isHot}
                                        onChange={handleCheckboxChange}
                                        className="text-red-500 scale-125"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Hot/Trending</span>
                                        <p className="text-gray-400 text-xs">Mark as hot or trending</p>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleCheckboxChange}
                                        className="text-red-500 scale-125"
                                    />
                                    <div>
                                        <span className="text-white font-medium">Featured</span>
                                        <p className="text-gray-400 text-xs">Show in featured section</p>
                                    </div>
                                </label>
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

                        {/* Permissions and Features */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Permissions & Features</h3>
                            
                            {/* Permissions */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Required Permissions
                                </label>
                                <div className="space-y-2">
                                    {formData.permissions.map((permission, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={permission}
                                                onChange={(e) => {
                                                    const newPermissions = [...formData.permissions]
                                                    newPermissions[index] = e.target.value
                                                    handleArrayChange('permissions', newPermissions)
                                                }}
                                                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="e.g., INTERNET, CAMERA, STORAGE"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPermissions = formData.permissions.filter((_, i) => i !== index)
                                                    handleArrayChange('permissions', newPermissions)
                                                }}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleArrayChange('permissions', [...formData.permissions, ''])}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                    >
                                        <FaPlus />
                                        <span>Add Permission</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mod Features */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Mod Features (for cracked apps)
                                </label>
                                <div className="space-y-2">
                                    {formData.modFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...formData.modFeatures]
                                                    newFeatures[index] = e.target.value
                                                    handleArrayChange('modFeatures', newFeatures)
                                                }}
                                                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="e.g., Premium Unlocked, Ad-Free, All Features Unlocked"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFeatures = formData.modFeatures.filter((_, i) => i !== index)
                                                    handleArrayChange('modFeatures', newFeatures)
                                                }}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleArrayChange('modFeatures', [...formData.modFeatures, ''])}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                    >
                                        <FaPlus />
                                        <span>Add Mod Feature</span>
                                    </button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Tags
                                </label>
                                <div className="space-y-2">
                                    {formData.tags.map((tag, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={tag}
                                                onChange={(e) => {
                                                    const newTags = [...formData.tags]
                                                    newTags[index] = e.target.value
                                                    handleArrayChange('tags', newTags)
                                                }}
                                                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                placeholder="e.g., productivity, photo-editor, gaming"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTags = formData.tags.filter((_, i) => i !== index)
                                                    handleArrayChange('tags', newTags)
                                                }}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleArrayChange('tags', [...formData.tags, ''])}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                    >
                                        <FaPlus />
                                        <span>Add Tag</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Crack Information */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Crack Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crack Group
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.crackInfo.crackGroup}
                                        onChange={(e) => handleNestedChange('crackInfo', 'crackGroup', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="e.g., CODEX, PLAZA, FitGirl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crack Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.crackInfo.crackDate}
                                        onChange={(e) => handleNestedChange('crackInfo', 'crackDate', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Crack Notes
                                </label>
                                <textarea
                                    value={formData.crackInfo.crackNotes}
                                    onChange={(e) => handleNestedChange('crackInfo', 'crackNotes', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Additional notes about the crack, installation, or compatibility"
                                />
                            </div>
                        </div>

                        {/* System Requirements */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">System Requirements</h3>
                            
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-300">Minimum Requirements</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Operating System
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.systemRequirements.minimum.os}
                                            onChange={(e) => handleSystemReqChange('minimum', 'os', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="e.g., Windows 10 64-bit"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Processor
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.systemRequirements.minimum.processor}
                                            onChange={(e) => handleSystemReqChange('minimum', 'processor', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="e.g., Intel Core i3-2100 / AMD FX-6300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Memory (RAM)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.systemRequirements.minimum.memory}
                                            onChange={(e) => handleSystemReqChange('minimum', 'memory', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="e.g., 4 GB RAM"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Graphics
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.systemRequirements.minimum.graphics}
                                            onChange={(e) => handleSystemReqChange('minimum', 'graphics', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="e.g., DirectX 11 compatible"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Storage
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.systemRequirements.minimum.storage}
                                            onChange={(e) => handleSystemReqChange('minimum', 'storage', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="e.g., 25 GB available space"
                                        />
                                    </div>
                                </div>
                            </div>
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

            {/* AI Generator Modal */}
            {showAIGenerator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">AI App Generator</h2>
                            <button
                                onClick={() => setShowAIGenerator(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <AIGenerator
                            type="app"
                            onDataGenerated={(data) => console.log('Generated:', data)}
                            onApplyData={handleAIDataApply}
                        />
                    </div>
                </div>
            )}
        </ProtectedRoute>
    )
} 