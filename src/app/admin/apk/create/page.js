'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaAndroid, FaDownload, FaShieldAlt, FaCog, FaRobot } from 'react-icons/fa'
import AIGenerator from '@/components/admin/AIGenerator'

export default function CreateAPK() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        version: '',
        size: '',
        developer: '',
        packageName: '',
        minAndroidVersion: '',
        targetAndroidVersion: '',
        architecture: 'arm64-v8a'
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])
    const [permissions, setPermissions] = useState([])
    const [modFeatures, setModFeatures] = useState([])
    const [showAIGenerator, setShowAIGenerator] = useState(false)

    const router = useRouter()

    const architectureOptions = [
        { value: 'arm64-v8a', label: 'ARM64 (64-bit)' },
        { value: 'armeabi-v7a', label: 'ARM (32-bit)' },
        { value: 'x86_64', label: 'x86_64 (64-bit Intel)' },
        { value: 'x86', label: 'x86 (32-bit Intel)' },
        { value: 'universal', label: 'Universal (All architectures)' }
    ]

    const commonPermissions = [
        'INTERNET',
        'ACCESS_NETWORK_STATE',
        'WRITE_EXTERNAL_STORAGE',
        'READ_EXTERNAL_STORAGE',
        'CAMERA',
        'RECORD_AUDIO',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'READ_CONTACTS',
        'WRITE_CONTACTS',
        'READ_SMS',
        'SEND_SMS',
        'CALL_PHONE',
        'READ_PHONE_STATE'
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

        // Validate package name format
        if (name === 'packageName' && value) {
            const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
            const isValid = packageRegex.test(value)
            const packageInput = e.target
            if (isValid) {
                packageInput.classList.remove('border-red-500')
                packageInput.classList.add('border-gray-600')
            } else {
                packageInput.classList.remove('border-gray-600')
                packageInput.classList.add('border-red-500')
            }
        }
    }

    // Funciones para el generador de IA
    const handleAIDataGenerated = (data) => {
        console.log('Datos generados por IA:', data)
    }

    const handleApplyAIData = (data) => {
        // Aplicar datos básicos del formulario
        setFormData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || '',
            version: data.version || '',
            size: data.size || '',
            developer: data.developer || '',
            packageName: data.packageName || '',
            minAndroidVersion: data.minAndroidVersion || '',
            targetAndroidVersion: data.targetAndroidVersion || '',
            architecture: data.architecture?.[0] || 'arm64-v8a'
        })

        // Aplicar permisos si existen
        if (data.permissions && Array.isArray(data.permissions)) {
            setPermissions(data.permissions)
        }

        // Aplicar características mod si existen
        if (data.modFeatures && Array.isArray(data.modFeatures)) {
            setModFeatures(data.modFeatures)
        }

        // Aplicar enlace de descarga si existe
        if (data.downloadUrl) {
            setDownloadLinks([{
                platform: 'android',
                url: data.downloadUrl,
                fileName: `${data.name || 'app'}-${data.version || '1.0.0'}.apk`,
                fileSize: data.size || '50 MB'
            }])
        }

        // Cerrar el generador de IA
        setShowAIGenerator(false)
        
        alert('¡Datos de IA aplicados exitosamente al formulario!')
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
    }

    const addDownloadLink = () => {
        setDownloadLinks(prev => [...prev, {
            platform: 'android',
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

    const addPermission = () => {
        setPermissions(prev => [...prev, ''])
    }

    const removePermission = (index) => {
        setPermissions(prev => prev.filter((_, i) => i !== index))
    }

    const updatePermission = (index, value) => {
        setPermissions(prev => prev.map((perm, i) => 
            i === index ? value : perm
        ))
    }

    const addModFeature = () => {
        setModFeatures(prev => [...prev, ''])
    }

    const removeModFeature = (index) => {
        setModFeatures(prev => prev.filter((_, i) => i !== index))
    }

    const updateModFeature = (index, value) => {
        setModFeatures(prev => prev.map((feature, i) => 
            i === index ? value : feature
        ))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Client-side validation
        if (!formData.name || formData.name.length < 3) {
            alert('APK name must be at least 3 characters long')
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
            alert('Please enter the APK size')
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

        if (!formData.packageName) {
            alert('Please enter the package name')
            return
        }

        // Validate package name format
        const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
        if (!packageRegex.test(formData.packageName)) {
            alert('Package name must be in format like "com.example.app"')
            return
        }

        if (!formData.minAndroidVersion) {
            alert('Please enter minimum Android version')
            return
        }
        
        // Validate download links
        if (downloadLinks.length === 0) {
            alert('Please add at least one download link')
            return
        }
        
        for (let i = 0; i < downloadLinks.length; i++) {
            const link = downloadLinks[i]
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

            // Append permissions as JSON
            formDataToSend.append('permissions', JSON.stringify(permissions.filter(p => p.trim())))

            // Append mod features as JSON
            formDataToSend.append('modFeatures', JSON.stringify(modFeatures.filter(f => f.trim())))

            // Append download links as JSON
            formDataToSend.append('downloadLinks', JSON.stringify(downloadLinks))

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image)
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'}/api/v1/apk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            })

            if (!response.ok) {
                throw new Error('Failed to create APK')
            }

            router.push('/admin/apk')
        } catch (error) {
            console.error('Error creating APK:', error)
            alert('Error creating APK: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back to APKs</span>
                            </button>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                                <FaAndroid className="text-green-500" />
                                <span>Create New APK</span>
                            </h1>
                            <p className="text-gray-400">Add a new Android application to the marketplace</p>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAIGenerator(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FaRobot className="text-lg" />
                                <span>Generate with AI</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                <FaAndroid className="text-green-500" />
                                <span>Basic Information</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        APK Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter APK name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Package Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="com.example.app"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: com.example.app</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category.name}>
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter developer name"
                                        required
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="1.0.0"
                                        required
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="150 MB"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: "150 MB" or "2.5 GB"</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                    placeholder="Enter detailed description of the APK..."
                                />
                            </div>
                        </div>

                        {/* Android Specific Information */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                <FaCog className="text-green-500" />
                                <span>Android Configuration</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Min Android Version *
                                    </label>
                                    <input
                                        type="text"
                                        name="minAndroidVersion"
                                        value={formData.minAndroidVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="5.0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target Android Version
                                    </label>
                                    <input
                                        type="text"
                                        name="targetAndroidVersion"
                                        value={formData.targetAndroidVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="14.0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Architecture
                                    </label>
                                    <select
                                        name="architecture"
                                        value={formData.architecture}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {architectureOptions.map(arch => (
                                            <option key={arch.value} value={arch.value}>
                                                {arch.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaShieldAlt className="text-green-500" />
                                    <span>Permissions</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addPermission}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Add Permission</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {permissions.map((permission, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <select
                                            value={permission}
                                            onChange={(e) => updatePermission(index, e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Select Permission</option>
                                            {commonPermissions.map(perm => (
                                                <option key={perm} value={perm}>
                                                    {perm}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removePermission(index)}
                                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mod Features */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Mod Features (Optional)
                                </h2>
                                <button
                                    type="button"
                                    onClick={addModFeature}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Add Feature</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {modFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateModFeature(index, e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="e.g., Premium Unlocked, Ad-Free, Unlimited Money"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeModFeature(index)}
                                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Screenshots & Images
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Upload Images (Screenshots, Icons, etc.)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Select multiple images. First image will be used as the main icon.
                                </p>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-300 mb-2">
                                        Selected: {images.length} image(s)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(images).map((image, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-700 text-xs rounded">
                                                {image.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Download Links */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaDownload className="text-green-500" />
                                    <span>Download Links</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDownloadLink}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Add Link</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {downloadLinks.map((link, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="https://example.com/download/app.apk"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDownloadLink(index)}
                                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}

                                {downloadLinks.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <FaDownload className="mx-auto text-4xl mb-2 opacity-50" />
                                        <p>No download links added yet</p>
                                        <p className="text-sm">Click "Add Link" to add download URLs</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaSave />
                                <span>{loading ? 'Creating...' : 'Create APK'}</span>
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
                            <h2 className="text-xl font-bold text-white">AI APK Generator</h2>
                            <button
                                onClick={() => setShowAIGenerator(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <AIGenerator
                            type="apk"
                            onDataGenerated={handleAIDataGenerated}
                            onApplyData={handleApplyAIData}
                        />
                    </div>
                </div>
            )}
        </ProtectedRoute>
    )
}
