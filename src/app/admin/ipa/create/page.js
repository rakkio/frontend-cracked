'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaApple, FaDownload, FaShieldAlt, FaCog, FaMobile, FaRobot } from 'react-icons/fa'
import AIGenerator from '@/components/admin/AIGenerator'

export default function CreateIPA() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        version: '',
        size: '',
        developer: '',
        bundleId: '',
        minIosVersion: '',
        targetIosVersion: '',
        jailbreakRequired: false,
        installationMethod: 'sideload'
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])
    const [deviceCompatibility, setDeviceCompatibility] = useState([])
    const [signingInfo, setSigningInfo] = useState({
        certificateType: 'enterprise',
        expiryDate: '',
        profileName: ''
    })
    const [showAIGenerator, setShowAIGenerator] = useState(false)

    const router = useRouter()

    const installationMethods = [
        { value: 'sideload', label: 'Sideload (AltStore, Sideloadly)' },
        { value: 'jailbreak', label: 'Jailbreak Required' },
        { value: 'enterprise', label: 'Enterprise Certificate' },
        { value: 'testflight', label: 'TestFlight Beta' }
    ]

    const deviceTypes = [
        'iPhone',
        'iPad',
        'iPod Touch',
        'Apple TV',
        'Apple Watch'
    ]

    const certificateTypes = [
        { value: 'enterprise', label: 'Enterprise Certificate' },
        { value: 'developer', label: 'Developer Certificate' },
        { value: 'adhoc', label: 'Ad Hoc Distribution' },
        { value: 'appstore', label: 'App Store Certificate' }
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
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

        // Validate bundle ID format
        if (name === 'bundleId' && value) {
            const bundleRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
            const isValid = bundleRegex.test(value)
            const bundleInput = e.target
            if (isValid) {
                bundleInput.classList.remove('border-red-500')
                bundleInput.classList.add('border-gray-600')
            } else {
                bundleInput.classList.remove('border-gray-600')
                bundleInput.classList.add('border-red-500')
            }
        }
    }

    const handleSigningInfoChange = (e) => {
        const { name, value } = e.target
        setSigningInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
    }

    const addDownloadLink = () => {
        setDownloadLinks(prev => [...prev, {
            platform: 'ios',
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

    const addDeviceCompatibility = () => {
        setDeviceCompatibility(prev => [...prev, ''])
    }

    const removeDeviceCompatibility = (index) => {
        setDeviceCompatibility(prev => prev.filter((_, i) => i !== index))
    }

    const updateDeviceCompatibility = (index, value) => {
        setDeviceCompatibility(prev => prev.map((device, i) => 
            i === index ? value : device
        ))
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
            bundleId: data.bundleId || data.packageName || '',
            minIosVersion: data.minIosVersion || data.minVersion || '',
            targetIosVersion: data.targetIosVersion || data.targetVersion || '',
            jailbreakRequired: data.jailbreakRequired || false,
            installationMethod: data.installationMethod || 'sideload'
        })

        // Aplicar compatibilidad de dispositivos si existe
        if (data.deviceCompatibility && Array.isArray(data.deviceCompatibility)) {
            setDeviceCompatibility(data.deviceCompatibility)
        }

        // Aplicar enlace de descarga si existe
        if (data.downloadUrl) {
            setDownloadLinks([{
                platform: 'ios',
                url: data.downloadUrl,
                fileName: `${data.name || 'app'}-${data.version || '1.0.0'}.ipa`,
                fileSize: data.size || '50 MB',
                isActive: true
            }])
        }

        // Cerrar el generador de IA
        setShowAIGenerator(false)
        
        alert('¡Datos de IA aplicados exitosamente al formulario!')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Client-side validation
        if (!formData.name || formData.name.length < 3) {
            alert('IPA name must be at least 3 characters long')
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
            alert('Please enter the IPA size')
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

        if (!formData.bundleId) {
            alert('Please enter the bundle ID')
            return
        }

        // Validate bundle ID format
        const bundleRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
        if (!bundleRegex.test(formData.bundleId)) {
            alert('Bundle ID must be in format like "com.example.app"')
            return
        }

        if (!formData.minIosVersion) {
            alert('Please enter minimum iOS version')
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

            // Append device compatibility as JSON
            formDataToSend.append('deviceCompatibility', JSON.stringify(deviceCompatibility.filter(d => d.trim())))

            // Append signing info as JSON
            formDataToSend.append('signingInfo', JSON.stringify(signingInfo))

            // Append download links as JSON
            formDataToSend.append('downloadLinks', JSON.stringify(downloadLinks))

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image)
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'}/api/v1/ipa`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            })

            if (!response.ok) {
                throw new Error('Failed to create IPA')
            }

            router.push('/admin/ipa')
        } catch (error) {
            console.error('Error creating IPA:', error)
            alert('Error creating IPA: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back to IPAs</span>
                            </button>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                                <FaApple className="text-gray-400" />
                                <span>Create New IPA</span>
                            </h1>
                            <p className="text-gray-400">Add a new iOS application to the marketplace</p>
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
                                <FaApple className="text-gray-400" />
                                <span>Basic Information</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        IPA Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter IPA name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Bundle ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="bundleId"
                                        value={formData.bundleId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    placeholder="Enter detailed description of the IPA..."
                                />
                            </div>
                        </div>

                        {/* iOS Specific Information */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                <FaCog className="text-blue-500" />
                                <span>iOS Configuration</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Min iOS Version *
                                    </label>
                                    <input
                                        type="text"
                                        name="minIosVersion"
                                        value={formData.minIosVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="12.0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Target iOS Version
                                    </label>
                                    <input
                                        type="text"
                                        name="targetIosVersion"
                                        value={formData.targetIosVersion}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="17.0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Installation Method
                                    </label>
                                    <select
                                        name="installationMethod"
                                        value={formData.installationMethod}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {installationMethods.map(method => (
                                            <option key={method.value} value={method.value}>
                                                {method.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="jailbreakRequired"
                                        checked={formData.jailbreakRequired}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-300">
                                        Jailbreak Required
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Device Compatibility */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <FaMobile className="text-blue-500" />
                                    <span>Device Compatibility</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDeviceCompatibility}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Add Device</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {deviceCompatibility.map((device, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <select
                                            value={device}
                                            onChange={(e) => updateDeviceCompatibility(index, e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Device Type</option>
                                            {deviceTypes.map(deviceType => (
                                                <option key={deviceType} value={deviceType}>
                                                    {deviceType}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeDeviceCompatibility(index)}
                                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Signing Information */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                <FaShield className="text-blue-500" />
                                <span>Signing Information</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Certificate Type
                                    </label>
                                    <select
                                        name="certificateType"
                                        value={signingInfo.certificateType}
                                        onChange={handleSigningInfoChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {certificateTypes.map(cert => (
                                            <option key={cert.value} value={cert.value}>
                                                {cert.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Profile Name
                                    </label>
                                    <input
                                        type="text"
                                        name="profileName"
                                        value={signingInfo.profileName}
                                        onChange={handleSigningInfoChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Profile name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={signingInfo.expiryDate}
                                        onChange={handleSigningInfoChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
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
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    <FaDownload className="text-blue-500" />
                                    <span>Download Links</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDownloadLink}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://example.com/download/app.ipa"
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
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaSave />
                                <span>{loading ? 'Creating...' : 'Create IPA'}</span>
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
                            <h2 className="text-xl font-bold text-white">AI IPA Generator</h2>
                            <button
                                onClick={() => setShowAIGenerator(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <AIGenerator
                            type="ipa"
                            onDataGenerated={handleAIDataGenerated}
                            onApplyData={handleApplyAIData}
                        />
                    </div>
                </div>
            )}
        </ProtectedRoute>
    )
}
