'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash, FaWindows, FaApple, FaLinux, FaAndroid, FaDownload } from 'react-icons/fa'

// Platform options for the platform selector
const platformOptions = [
    { value: 'windows', label: 'Windows', icon: FaWindows },
    { value: 'mac', label: 'macOS', icon: FaApple },
    { value: 'linux', label: 'Linux', icon: FaLinux },
    { value: 'android', label: 'Android', icon: FaAndroid },
    { value: 'ios', label: 'iOS', icon: FaApple }
]

export default function EditApp() {
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
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [images, setImages] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])
    const [showAIGenerator, setShowAIGenerator] = useState(false)
    const [aiGenerating, setAiGenerating] = useState(false)
    const [aiAppName, setAiAppName] = useState('')

    const router = useRouter()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            fetchApp()
            fetchCategories()
        }
    }, [id])

    const fetchApp = async () => {
        try {
            const response = await api.getAppById(id)
            const app = response.app
            setFormData({
                name: app.name || '',
                description: (app.description || '').toString(),
                shortDescription: app.shortDescription || '',
                category: app.category?._id || '',
                version: app.version || '',
                size: app.size || '',
                developer: app.developer || '',
                publisher: app.publisher || '',
                platforms: app.platforms || ['Windows'],
                packageName: app.packageName || '',
                minVersion: app.minVersion || '',
                targetVersion: app.targetVersion || '',
                architecture: app.architecture || [],
                permissions: app.permissions || [],
                modFeatures: app.modFeatures || [],
                originalPrice: app.originalPrice || 0,
                tags: app.tags || [],
                rating: app.rating || 0,
                downloads: app.downloads || 0,
                reviewsCount: app.reviewsCount || 0,
                instructions: app.instructions || '',
                isPremium: app.isPremium || false,
                isHot: app.isHot || false,
                isFeatured: app.isFeatured || false,
                crackInfo: {
                    crackGroup: app.crackInfo?.crackGroup || '',
                    crackDate: app.crackInfo?.crackDate ? app.crackInfo.crackDate.split('T')[0] : '',
                    crackNotes: app.crackInfo?.crackNotes || ''
                },
                systemRequirements: {
                    minimum: {
                        os: app.systemRequirements?.minimum?.os || '',
                        processor: app.systemRequirements?.minimum?.processor || '',
                        memory: app.systemRequirements?.minimum?.memory || '',
                        graphics: app.systemRequirements?.minimum?.graphics || '',
                        storage: app.systemRequirements?.minimum?.storage || ''
                    }
                }
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

    // AI Generator functions
    const applyAIData = (aiData) => {
        setFormData(prev => ({
            ...prev,
            name: aiData.name || prev.name,
            description: aiData.description || prev.description,
            shortDescription: aiData.shortDescription || prev.shortDescription,
            category: aiData.category || prev.category,
            version: aiData.version || prev.version,
            size: aiData.size || prev.size,
            developer: aiData.developer || prev.developer,
            publisher: aiData.publisher || prev.publisher,
            platforms: aiData.platforms || prev.platforms,
            packageName: aiData.packageName || prev.packageName,
            minVersion: aiData.minVersion || prev.minVersion,
            targetVersion: aiData.targetVersion || prev.targetVersion,
            architecture: aiData.architecture || prev.architecture,
            permissions: aiData.permissions || prev.permissions,
            modFeatures: aiData.modFeatures || prev.modFeatures,
            originalPrice: aiData.originalPrice !== undefined ? aiData.originalPrice : prev.originalPrice,
            tags: aiData.tags || prev.tags,
            rating: aiData.rating !== undefined ? aiData.rating : prev.rating,
            downloads: aiData.downloads !== undefined ? aiData.downloads : prev.downloads,
            reviewsCount: aiData.reviewsCount !== undefined ? aiData.reviewsCount : prev.reviewsCount,
            instructions: aiData.instructions || prev.instructions,
            isPremium: aiData.isPremium !== undefined ? aiData.isPremium : prev.isPremium,
            isHot: aiData.isHot !== undefined ? aiData.isHot : prev.isHot,
            isFeatured: aiData.isFeatured !== undefined ? aiData.isFeatured : prev.isFeatured,
            crackInfo: {
                crackGroup: aiData.crackInfo?.crackGroup || prev.crackInfo.crackGroup,
                crackDate: aiData.crackInfo?.crackDate || prev.crackInfo.crackDate,
                crackNotes: aiData.crackInfo?.crackNotes || prev.crackInfo.crackNotes
            },
            systemRequirements: {
                minimum: {
                    os: aiData.systemRequirements?.minimum?.os || prev.systemRequirements.minimum.os,
                    processor: aiData.systemRequirements?.minimum?.processor || prev.systemRequirements.minimum.processor,
                    memory: aiData.systemRequirements?.minimum?.memory || prev.systemRequirements.minimum.memory,
                    graphics: aiData.systemRequirements?.minimum?.graphics || prev.systemRequirements.minimum.graphics,
                    storage: aiData.systemRequirements?.minimum?.storage || prev.systemRequirements.minimum.storage
                }
            }
        }))
    }

    const handleAIGenerate = async () => {
        if (!aiAppName.trim()) {
            alert('Please enter an app name to generate data')
            return
        }

        setAiGenerating(true)
        try {
            const response = await api.generateAppData(aiAppName)
            applyAIData(response)
            setShowAIGenerator(false)
            setAiAppName('')
        } catch (error) {
            console.error('Error generating AI data:', error)
            alert('Error generating AI data: ' + error.message)
        } finally {
            setAiGenerating(false)
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
                        <button
                            type="button"
                            onClick={() => setShowAIGenerator(true)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all"
                        >
                            <span>🤖</span>
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
                                                checked={formData.platforms.includes(platform.value === 'mac' ? 'macOS' : platform.value === 'windows' ? 'Windows' : platform.value === 'linux' ? 'Linux' : platform.value === 'android' ? 'Android' : 'iOS')}
                                                onChange={(e) => {
                                                    const platformName = platform.value === 'mac' ? 'macOS' : platform.value === 'windows' ? 'Windows' : platform.value === 'linux' ? 'Linux' : platform.value === 'android' ? 'Android' : 'iOS'
                                                    if (e.target.checked) {
                                                        handleArrayChange('platforms', [...formData.platforms, platformName])
                                                    } else {
                                                        handleArrayChange('platforms', formData.platforms.filter(p => p !== platformName))
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
                                    {['x86', 'x64', 'arm64-v8a', 'armeabi-v7a', 'universal'].map(arch => (
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

            {/* AI Generator Modal */}
            {showAIGenerator && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">Generate App Data with AI</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            Enter an app name and let AI generate comprehensive app information including description, features, requirements, and more.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                App Name
                            </label>
                            <input
                                type="text"
                                value={aiAppName}
                                onChange={(e) => setAiAppName(e.target.value)}
                                placeholder="e.g., Adobe Photoshop, WhatsApp, Spotify"
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onKeyPress={(e) => e.key === 'Enter' && !aiGenerating && handleAIGenerate()}
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAIGenerator(false)
                                    setAiAppName('')
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                disabled={aiGenerating}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={aiGenerating || !aiAppName.trim()}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                            >
                                {aiGenerating ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🤖</span>
                                        <span>Generate</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    )
} 