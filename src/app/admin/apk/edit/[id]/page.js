'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { 
    FaSave, FaArrowLeft, FaAndroid, FaPlus, FaTrash,
    FaRobot, FaDownload, FaInfoCircle
} from 'react-icons/fa'
import Link from 'next/link'

export default function EditAPKPage() {
    const { user } = useAuth()
    const router = useRouter()
    const params = useParams()
    const apkId = params.id

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        category: '',
        packageName: '',
        version: '',
        minAndroidVersion: '',
        targetAndroidVersion: '',
        architecture: [],
        permissions: [],
        modFeatures: [],
        size: '',
        developer: '',
        downloadLinks: [{ platform: 'android', url: '', fileName: '', fileSize: '' }],
        isActive: true,
        isFeatured: false,
        isHot: false,
        isPremium: false
    })

    // Architecture options
    const architectureOptions = ['x86', 'x64', 'arm64-v8a', 'armeabi-v7a', 'universal']

    // Common Android permissions
    const commonPermissions = [
        'INTERNET', 'ACCESS_NETWORK_STATE', 'WRITE_EXTERNAL_STORAGE', 'READ_EXTERNAL_STORAGE',
        'CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION',
        'READ_CONTACTS', 'WRITE_CONTACTS', 'READ_SMS', 'SEND_SMS', 'CALL_PHONE'
    ]

    // Common mod features
    const commonModFeatures = [
        'Premium Unlocked', 'Ad-Free', 'Unlimited Money', 'Unlimited Resources',
        'All Features Unlocked', 'Pro Version', 'VIP Unlocked', 'No Root Required'
    ]

    // Fetch APK data
    useEffect(() => {
        const fetchAPK = async () => {
            try {
                setLoading(true)
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                
                const response = await fetch(`${API_BASE_URL}/api/v1/apk/${apkId}`, {
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch APK')
                }

                const data = await response.json()
                if (data.success) {
                    const apk = data.data
                    setFormData({
                        name: apk.name || '',
                        shortDescription: apk.shortDescription || '',
                        description: apk.description || '',
                        category: apk.category?._id || apk.category || '',
                        packageName: apk.packageName || '',
                        version: apk.version || '',
                        minAndroidVersion: apk.minAndroidVersion || '',
                        targetAndroidVersion: apk.targetAndroidVersion || '',
                        architecture: apk.architecture || [],
                        permissions: apk.permissions || [],
                        modFeatures: apk.modFeatures || [],
                        size: apk.size || '',
                        developer: apk.developer || '',
                        downloadLinks: apk.downloadLinks?.length > 0 ? apk.downloadLinks : [{ platform: 'android', url: '', fileName: '', fileSize: '' }],
                        isActive: apk.isActive !== undefined ? apk.isActive : true,
                        isFeatured: apk.isFeatured || false,
                        isHot: apk.isHot || false,
                        isPremium: apk.isPremium || false
                    })
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchCategories = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                const response = await fetch(`${API_BASE_URL}/api/v1/categories`)
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data.data || [])
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
            }
        }

        if (apkId) {
            fetchAPK()
            fetchCategories()
        }
    }, [apkId, user?.token])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setSaving(true)
            setError(null)

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            
            const response = await fetch(`${API_BASE_URL}/api/v1/apk/${apkId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update APK')
            }

            router.push('/admin/apk')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    // Handle array changes
    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }))
    }

    // Add array item
    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }))
    }

    // Remove array item
    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    // Handle download links
    const handleDownloadLinkChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            downloadLinks: prev.downloadLinks.map((link, i) => 
                i === index ? { ...link, [field]: value } : link
            )
        }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading APK data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Link href="/admin/apk" className="text-green-500 hover:text-green-400">
                        Back to APK List
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-green-500/20 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/apk" className="text-green-500 hover:text-green-400">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <FaAndroid className="text-green-500 text-2xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Edit APK</h1>
                            <p className="text-gray-400">Update Android application details</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                    {/* Basic Information */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4 flex items-center">
                            <FaInfoCircle className="mr-2" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    APK Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
                                    placeholder="com.example.app"
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Developer
                                </label>
                                <input
                                    type="text"
                                    name="developer"
                                    value={formData.developer}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Size
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 50MB"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Short Description
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>
                        
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Android Specific */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4">Android Specific</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Min Android Version
                                </label>
                                <input
                                    type="text"
                                    name="minAndroidVersion"
                                    value={formData.minAndroidVersion}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 5.0"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
                                    placeholder="e.g., 13.0"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>

                        {/* Architecture */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Architecture Support
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {architectureOptions.map(arch => (
                                    <label key={arch} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.architecture.includes(arch)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        architecture: [...prev.architecture, arch]
                                                    }))
                                                } else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        architecture: prev.architecture.filter(a => a !== arch)
                                                    }))
                                                }
                                            }}
                                            className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-gray-300">{arch}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4">Permissions</h2>
                        <div className="space-y-2">
                            {formData.permissions.map((permission, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select
                                        value={permission}
                                        onChange={(e) => handleArrayChange('permissions', index, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                    >
                                        <option value="">Select Permission</option>
                                        {commonPermissions.map(perm => (
                                            <option key={perm} value={perm}>{perm}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('permissions', index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('permissions', '')}
                                className="text-green-500 hover:text-green-400 flex items-center space-x-1"
                            >
                                <FaPlus />
                                <span>Add Permission</span>
                            </button>
                        </div>
                    </div>

                    {/* Mod Features */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4">Mod Features</h2>
                        <div className="space-y-2">
                            {formData.modFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select
                                        value={feature}
                                        onChange={(e) => handleArrayChange('modFeatures', index, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                    >
                                        <option value="">Select Mod Feature</option>
                                        {commonModFeatures.map(feat => (
                                            <option key={feat} value={feat}>{feat}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('modFeatures', index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('modFeatures', '')}
                                className="text-green-500 hover:text-green-400 flex items-center space-x-1"
                            >
                                <FaPlus />
                                <span>Add Mod Feature</span>
                            </button>
                        </div>
                    </div>

                    {/* Download Links */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4 flex items-center">
                            <FaDownload className="mr-2" />
                            Download Links
                        </h2>
                        <div className="space-y-4">
                            {formData.downloadLinks.map((link, index) => (
                                <div key={index} className="border border-gray-700 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Platform
                                            </label>
                                            <select
                                                value={link.platform}
                                                onChange={(e) => handleDownloadLinkChange(index, 'platform', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            >
                                                <option value="android">Android</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                File Name
                                            </label>
                                            <input
                                                type="text"
                                                value={link.fileName}
                                                onChange={(e) => handleDownloadLinkChange(index, 'fileName', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Download URL
                                            </label>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleDownloadLinkChange(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-green-500 mb-4">Flags</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-300">Active</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-300">Featured</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isHot"
                                    checked={formData.isHot}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-300">Hot</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isPremium"
                                    checked={formData.isPremium}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-gray-300">Premium</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/apk"
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <FaSave />
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
