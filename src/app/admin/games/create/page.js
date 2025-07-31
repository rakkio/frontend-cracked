'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import RichTextEditor from '@/components/RichTextEditor'
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaGamepad, FaDownload, FaWindows, FaApple, FaLinux, FaPlaystation, FaXbox, FaCog, FaUsers, FaRobot } from 'react-icons/fa'
import AIGenerator from '@/components/admin/AIGenerator'

export default function CreateGame() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        genre: '',
        version: '',
        size: '',
        developer: '',
        publisher: '',
        releaseYear: new Date().getFullYear(),
        gameEngine: '',
        gameMode: 'singleplayer',
        esrbRating: 'E',
        pegiRating: '3'
    })
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [downloadLinks, setDownloadLinks] = useState([])
    const [systemRequirements, setSystemRequirements] = useState({
        windows: { minimum: '', recommended: '' },
        mac: { minimum: '', recommended: '' },
        linux: { minimum: '', recommended: '' }
    })
    const [crackInfo, setCrackInfo] = useState({
        crackGroup: '',
        crackDate: '',
        includesDLC: false,
        crackNotes: ''
    })
    const [showAIGenerator, setShowAIGenerator] = useState(false)

    const router = useRouter()

    const platformOptions = [
        { value: 'windows', label: 'Windows', icon: FaWindows },
        { value: 'mac', label: 'macOS', icon: FaApple },
        { value: 'linux', label: 'Linux', icon: FaLinux },
        { value: 'playstation', label: 'PlayStation', icon: FaPlaystation },
        { value: 'xbox', label: 'Xbox', icon: FaXbox }
    ]

    const gameModes = [
        { value: 'singleplayer', label: 'Single Player' },
        { value: 'multiplayer', label: 'Multiplayer' },
        { value: 'coop', label: 'Co-op' },
        { value: 'both', label: 'Single & Multiplayer' }
    ]

    const esrbRatings = [
        { value: 'E', label: 'E - Everyone' },
        { value: 'E10+', label: 'E10+ - Everyone 10+' },
        { value: 'T', label: 'T - Teen' },
        { value: 'M', label: 'M - Mature 17+' },
        { value: 'AO', label: 'AO - Adults Only' },
        { value: 'RP', label: 'RP - Rating Pending' }
    ]

    const pegiRatings = [
        { value: '3', label: 'PEGI 3' },
        { value: '7', label: 'PEGI 7' },
        { value: '12', label: 'PEGI 12' },
        { value: '16', label: 'PEGI 16' },
        { value: '18', label: 'PEGI 18' }
    ]

    const gameGenres = [
        'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing',
        'Shooter', 'Fighting', 'Puzzle', 'Platform', 'Horror', 'Survival', 'MMO',
        'Indie', 'Casual', 'Educational', 'Music', 'Party', 'Board Game'
    ]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleCrackInfoChange = (e) => {
        const { name, value, type, checked } = e.target
        setCrackInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSystemRequirementsChange = (platform, type, value) => {
        setSystemRequirements(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [type]: value
            }
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
    }

    const addDownloadLink = () => {
        setDownloadLinks(prev => [...prev, {
            platform: 'windows',
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

    // Funciones para el generador de IA
    const handleAIDataGenerated = (data) => {
        console.log('Datos generados por IA:', data)
    }

    const handleApplyAIData = (data) => {
        // Aplicar datos básicos del formulario
        setFormData({
            name: data.name || '',
            description: data.description || '',
            genre: data.genre || '',
            version: data.version || '',
            size: data.size || '',
            developer: data.developer || '',
            publisher: data.publisher || '',
            releaseYear: data.releaseYear || new Date().getFullYear(),
            gameEngine: data.gameEngine || '',
            gameMode: data.gameMode || 'singleplayer',
            esrbRating: data.esrbRating || 'E',
            pegiRating: data.pegiRating || '3'
        })

        // Aplicar información de crack si existe
        if (data.crackInfo) {
            setCrackInfo({
                crackGroup: data.crackInfo.crackGroup || data.crackGroup || '',
                crackDate: data.crackInfo.crackDate || data.crackDate || '',
                includesDLC: data.crackInfo.includesDLC || data.includesDLC || false,
                crackNotes: data.crackInfo.crackNotes || data.crackNotes || ''
            })
        }

        // Aplicar requisitos del sistema si existe
        if (data.systemRequirements) {
            setSystemRequirements(data.systemRequirements)
        }

        // Aplicar enlace de descarga si existe
        if (data.downloadUrl) {
            setDownloadLinks([{
                platform: 'windows',
                url: data.downloadUrl,
                fileName: `${data.name || 'game'}-${data.version || '1.0.0'}.zip`,
                fileSize: data.size || '5 GB',
                isActive: true
            }])
        }

        // Cerrar el generador de IA
        setShowAIGenerator(false)
        
        alert('¡Datos de IA aplicados exitosamente al formulario!')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!formData.name || formData.name.length < 3) {
            alert('Game name must be at least 3 characters long')
            return
        }
        
        if (!formData.description || formData.description.length < 50) {
            alert('Description must be at least 50 characters long')
            return
        }
        
        if (!formData.genre) {
            alert('Please select a genre')
            return
        }
        
        if (!formData.developer) {
            alert('Please enter the developer name')
            return
        }

        if (downloadLinks.length === 0) {
            alert('Please add at least one download link')
            return
        }
        
        setLoading(true)

        try {
            const formDataToSend = new FormData()
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key])
            })

            // Append default values
            formDataToSend.append('isPremium', 'false')
            formDataToSend.append('isHot', 'false')
            formDataToSend.append('isFeatured', 'false')
            formDataToSend.append('isActive', 'true')
            formDataToSend.append('tags', '[]')

            // Append complex data as JSON
            formDataToSend.append('systemRequirements', JSON.stringify(systemRequirements))
            formDataToSend.append('crackInfo', JSON.stringify(crackInfo))
            formDataToSend.append('downloadLinks', JSON.stringify(downloadLinks))

            // Append images
            images.forEach(image => {
                formDataToSend.append('images', image)
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'}/api/v1/games`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            })

            if (!response.ok) {
                throw new Error('Failed to create game')
            }

            router.push('/admin/games')
        } catch (error) {
            console.error('Error creating game:', error)
            alert('Error creating game: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back to Games</span>
                            </button>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                                <FaGamepad className="text-purple-500" />
                                <span>Create New Game</span>
                            </h1>
                            <p className="text-gray-400">Add a new PC game to the marketplace</p>
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
                                <FaGamepad className="text-purple-500" />
                                <span>Basic Information</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Game Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter game name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Genre *
                                    </label>
                                    <select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Genre</option>
                                        {gameGenres.map(genre => (
                                            <option key={genre} value={genre}>
                                                {genre}
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter developer name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Publisher
                                    </label>
                                    <input
                                        type="text"
                                        name="publisher"
                                        value={formData.publisher}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter publisher name"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="15 GB"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Release Year *
                                    </label>
                                    <input
                                        type="number"
                                        name="releaseYear"
                                        value={formData.releaseYear}
                                        onChange={handleInputChange}
                                        min="1970"
                                        max={new Date().getFullYear() + 5}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Game Mode
                                    </label>
                                    <select
                                        name="gameMode"
                                        value={formData.gameMode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        {gameModes.map(mode => (
                                            <option key={mode.value} value={mode.value}>
                                                {mode.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                    placeholder="Enter detailed description of the game..."
                                />
                            </div>
                        </div>

                        {/* Crack Information */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                                <FaUsers className="text-purple-500" />
                                <span>Crack Information</span>
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crack Group
                                    </label>
                                    <input
                                        type="text"
                                        name="crackGroup"
                                        value={crackInfo.crackGroup}
                                        onChange={handleCrackInfoChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="e.g., CODEX, SKIDROW, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crack Date
                                    </label>
                                    <input
                                        type="date"
                                        name="crackDate"
                                        value={crackInfo.crackDate}
                                        onChange={handleCrackInfoChange}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="includesDLC"
                                        checked={crackInfo.includesDLC}
                                        onChange={handleCrackInfoChange}
                                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-300">
                                        Includes DLC
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Crack Notes
                                    </label>
                                    <textarea
                                        name="crackNotes"
                                        value={crackInfo.crackNotes}
                                        onChange={handleCrackInfoChange}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Additional notes about the crack..."
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
                                    Upload Images (Screenshots, Cover Art, etc.)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Select multiple images. First image will be used as the main cover art.
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
                                    <FaDownload className="text-purple-500" />
                                    <span>Download Links</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDownloadLink}
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Add Link</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {downloadLinks.map((link, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                                        <div className="w-32">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => updateDownloadLink(index, 'platform', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            >
                                                {platformOptions.map(platform => (
                                                    <option key={platform.value} value={platform.value}>
                                                        {platform.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => updateDownloadLink(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="https://example.com/download/game.zip"
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
                                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaSave />
                                <span>{loading ? 'Creating...' : 'Create Game'}</span>
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
                            <h2 className="text-xl font-bold text-white">AI Game Generator</h2>
                            <button
                                onClick={() => setShowAIGenerator(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <AIGenerator
                            type="game"
                            onDataGenerated={handleAIDataGenerated}
                            onApplyData={handleApplyAIData}
                        />
                    </div>
                </div>
            )}
        </ProtectedRoute>
    )
}
