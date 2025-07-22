'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBanners } from '@/hooks/useBanners'
import { api } from '@/lib/api'
import { FaUpload, FaImage, FaVideo, FaTimes, FaPlay, FaPause } from 'react-icons/fa'
import Link from 'next/link'

export default function EditBannerPage({ params }) {
    const router = useRouter()
    const { updateBanner, loading, error } = useBanners()
    const fileInputRef = useRef()
    const thumbnailInputRef = useRef()

    const [bannerData, setBannerData] = useState(null)
    const [loadingBanner, setLoadingBanner] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mediaType: 'image',
        actionType: 'none',
        actionValue: '',
        buttonText: 'Learn More',
        position: 'hero',
        priority: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        isFeatured: false,
        targetAudience: 'all'
    })

    const [mediaFile, setMediaFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [mediaPreview, setMediaPreview] = useState('')
    const [thumbnailPreview, setThumbnailPreview] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Load existing banner data
    useEffect(() => {
        const loadBanner = async () => {
            try {
                setLoadingBanner(true)
                const response = await api.getBannerById(params.id)
                const banner = response.data
                
                setBannerData(banner)
                
                // Populate form with existing data
                setFormData({
                    title: banner.title || '',
                    description: banner.description || '',
                    mediaType: banner.mediaType || 'image',
                    actionType: banner.actionType || 'none',
                    actionValue: banner.actionValue || '',
                    buttonText: banner.buttonText || 'Learn More',
                    position: banner.position || 'hero',
                    priority: banner.priority || 0,
                    startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
                    endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
                    isActive: banner.isActive !== undefined ? banner.isActive : true,
                    isFeatured: banner.isFeatured !== undefined ? banner.isFeatured : false,
                    targetAudience: banner.targetAudience || 'all'
                })
                
                // Set existing media previews
                setMediaPreview(banner.mediaUrl || '')
                setThumbnailPreview(banner.thumbnailUrl || '')
                
            } catch (err) {
                console.error('Error loading banner:', err)
                // Redirect to banners list if banner not found
                router.push('/admin/banners')
            } finally {
                setLoadingBanner(false)
            }
        }

        if (params.id) {
            loadBanner()
        }
    }, [params.id, router])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleMediaFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setMediaFile(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setMediaPreview(e.target.result)
            reader.readAsDataURL(file)

            // Auto-detect media type
            if (file.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, mediaType: 'video' }))
            } else if (file.type.startsWith('image/')) {
                setFormData(prev => ({ ...prev, mediaType: 'image' }))
            }
        }
    }

    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbnailFile(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setThumbnailPreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const removeMediaFile = () => {
        setMediaFile(null)
        setMediaPreview(bannerData?.mediaUrl || '')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeThumbnailFile = () => {
        setThumbnailFile(null)
        setThumbnailPreview(bannerData?.thumbnailUrl || '')
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
    }

    const validateForm = () => {
        if (!formData.title.trim()) {
            alert('Banner title is required')
            return false
        }

        if (formData.actionType !== 'none' && !formData.actionValue.trim()) {
            alert('Action value is required when action type is not "none"')
            return false
        }

        if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('End date must be after start date')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return
        
        setIsSubmitting(true)
        
        try {
            const submitData = new FormData()
            
            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitData.append(key, value)
                }
            })
            
            // Add media file if changed
            if (mediaFile) {
                submitData.append('media', mediaFile)
            }
            
            // Add thumbnail file if changed
            if (thumbnailFile) {
                submitData.append('thumbnail', thumbnailFile)
            }

            await updateBanner(params.id, submitData)
            
            // Success - redirect to banners list
            router.push('/admin/banners')
            
        } catch (err) {
            console.error('Error updating banner:', err)
            // Error handling is done by the hook
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loadingBanner) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-r-transparent rounded-full mb-4"></div>
                    <p className="text-gray-400">Loading banner...</p>
                </div>
            </div>
        )
    }

    if (!bannerData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Banner not found</p>
                    <Link 
                        href="/admin/banners"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        Back to Banners
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Edit Banner</h1>
                        <p className="text-gray-400">Update banner information and settings</p>
                    </div>
                    <Link 
                        href="/admin/banners"
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Back to Banners
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Media Upload Section */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Media Content</h2>
                        
                        {/* Current Media Display */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Current Media
                            </label>
                            <div className="border border-gray-600 rounded-lg p-4">
                                {bannerData.mediaType === 'video' ? (
                                    <video
                                        src={bannerData.mediaUrl}
                                        className="max-w-full h-64 mx-auto rounded-lg"
                                        controls
                                        poster={bannerData.thumbnailUrl}
                                    />
                                ) : (
                                    <img
                                        src={bannerData.mediaUrl}
                                        alt={bannerData.title}
                                        className="max-w-full h-64 mx-auto rounded-lg object-cover"
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* Main Media Upload */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Replace Media (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                                    {mediaFile && mediaPreview !== bannerData?.mediaUrl ? (
                                        <div className="relative">
                                            {formData.mediaType === 'video' ? (
                                                <video
                                                    src={mediaPreview}
                                                    className="max-w-full h-64 mx-auto rounded-lg"
                                                    controls
                                                />
                                            ) : (
                                                <img
                                                    src={mediaPreview}
                                                    alt="Media preview"
                                                    className="max-w-full h-64 mx-auto rounded-lg object-cover"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={removeMediaFile}
                                                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white"
                                            >
                                                <FaTimes />
                                            </button>
                                            <p className="text-sm text-green-400 mt-2">New media selected</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-300 mb-2">Click to upload new media</p>
                                            <p className="text-sm text-gray-500">Images: JPG, PNG, WebP, GIF (max 10MB)</p>
                                            <p className="text-sm text-gray-500">Videos: MP4, AVI, MOV, WebM (max 50MB)</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleMediaFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Upload (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Custom Thumbnail (Optional)
                                    {formData.mediaType === 'video' && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            Auto-generated if not provided
                                        </span>
                                    )}
                                </label>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                    {thumbnailFile && thumbnailPreview !== bannerData?.thumbnailUrl ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="h-32 w-48 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeThumbnailFile}
                                                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white text-xs"
                                            >
                                                <FaTimes />
                                            </button>
                                            <p className="text-xs text-green-400 mt-1">New thumbnail selected</p>
                                        </div>
                                    ) : bannerData.thumbnailUrl ? (
                                        <div className="inline-block">
                                            <img
                                                src={bannerData.thumbnailUrl}
                                                alt="Current thumbnail"
                                                className="h-32 w-48 rounded-lg object-cover"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Current thumbnail</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-300">Upload thumbnail</p>
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rest of the form - same as create page but with populated values */}
                    {/* Basic Information */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter banner title"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter banner description (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Media Type
                                </label>
                                <select
                                    name="mediaType"
                                    value={formData.mediaType}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Position
                                </label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="hero">Hero</option>
                                    <option value="middle">Middle</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="sidebar">Sidebar</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Settings - same structure as create page */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Action Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Action Type
                                </label>
                                <select
                                    name="actionType"
                                    value={formData.actionType}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="none">No Action</option>
                                    <option value="link">External Link</option>
                                    <option value="app">App Page</option>
                                    <option value="category">Category Page</option>
                                </select>
                            </div>

                            {formData.actionType !== 'none' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Action Value
                                        </label>
                                        <input
                                            type="text"
                                            name="actionValue"
                                            value={formData.actionValue}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder={
                                                formData.actionType === 'link' ? 'https://example.com' :
                                                formData.actionType === 'app' ? 'app-slug' :
                                                formData.actionType === 'category' ? 'category-slug' : ''
                                            }
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Button Text
                                        </label>
                                        <input
                                            type="text"
                                            name="buttonText"
                                            value={formData.buttonText}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Learn More"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Display Settings - same structure as create page */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Priority (0-100)
                                </label>
                                <input
                                    type="number"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Higher priority banners are shown first</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Target Audience
                                </label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="all">All Users</option>
                                    <option value="new_users">New Users</option>
                                    <option value="registered_users">Registered Users</option>
                                    <option value="premium_users">Premium Users</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-6 md:col-span-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                                    />
                                    <span className="text-gray-300">Active</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                                    />
                                    <span className="text-gray-300">Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <Link
                            href="/admin/banners"
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-r-transparent rounded-full" />
                                    Updating...
                                </>
                            ) : (
                                'Update Banner'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 