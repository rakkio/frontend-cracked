'use client'

import React, { useState, useEffect } from 'react'
import { FaRobot, FaMagic, FaSpinner, FaCopy, FaDownload, FaRenren, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import AIGeneratorService from '@/services/AIGeneratorService'

const AIGenerator = ({ type, onDataGenerated, onApplyData }) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedData, setGeneratedData] = useState(null)
    const [prompt, setPrompt] = useState('')
    const [bulkCount, setBulkCount] = useState(1)
    const [showBulkMode, setShowBulkMode] = useState(false)
    const [generationMode, setGenerationMode] = useState('single') // single, bulk, prompt, file
    const [error, setError] = useState(null)
    const [serviceStatus, setServiceStatus] = useState(null)
    const [checkingService, setCheckingService] = useState(true)
    const [fileContent, setFileContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [saveResults, setSaveResults] = useState(null)
    const [autoSave, setAutoSave] = useState(false)

    const typeLabels = {
        apk: 'APK Android',
        ipa: 'IPA iOS',
        game: 'Juego PC',
        app: 'App PC'
    }

    const typeColors = {
        apk: 'from-green-500 to-green-600',
        ipa: 'from-gray-500 to-gray-600',
        game: 'from-purple-500 to-purple-600',
        app: 'from-blue-500 to-blue-600'
    }

    // Verificar estado del servicio al montar el componente
    useEffect(() => {
        const checkService = async () => {
            try {
                setCheckingService(true)
                
                // Primero verificar si el servicio existe
                const isAvailable = await AIGeneratorService.checkServiceAvailability()
                if (!isAvailable) {
                    setServiceStatus({
                        available: false,
                        error: 'Servicio de IA no disponible. Verifica que el backend esté ejecutándose.'
                    })
                    return
                }
                
                // Luego verificar autenticación
                const isAuth = AIGeneratorService.isAuthenticated()
                if (!isAuth) {
                    setServiceStatus({
                        available: false,
                        error: 'No estás autenticado. Inicia sesión para usar la generación con IA.'
                    })
                    return
                }
                
                // Finalmente intentar obtener el estado del servicio
                const status = await AIGeneratorService.getStatus()
                setServiceStatus({
                    available: status.data.available,
                    service: status.data.service,
                    supportedTypes: status.data.supportedTypes
                })
                
            } catch (error) {
                console.error('Error verificando servicio:', error)
                setServiceStatus({
                    available: false,
                    error: error.message
                })
            } finally {
                setCheckingService(false)
            }
        }
        
        checkService()
    }, [])

    const generateSingleData = async () => {
        setIsGenerating(true)
        setError(null)
        setGeneratedData(null)
        
        try {
            console.log('Starting generation for type:', type, 'mode:', generationMode)
            
            let data
            if (generationMode === 'prompt' && prompt.trim()) {
                console.log('Using custom prompt:', prompt.substring(0, 100) + '...')
                data = await AIGeneratorService.generateFromPrompt(type, prompt)
            } else {
                console.log('Using default generation for type:', type)
                switch (type) {
                    case 'apk':
                        data = await AIGeneratorService.generateAPKData()
                        break
                    case 'ipa':
                        data = await AIGeneratorService.generateIPAData()
                        break
                    case 'game':
                        data = await AIGeneratorService.generateGameData()
                        break
                    case 'app':
                        data = await AIGeneratorService.generateAppData()
                        break
                    default:
                        throw new Error(`Tipo no soportado: ${type}`)
                }
            }
            
            console.log('Generation successful:', data)
            setGeneratedData(data)
            if (onDataGenerated) {
                onDataGenerated(data)
            }
        } catch (error) {
            console.error('Error generando datos:', error)
            const errorMessage = error.message || 'Error desconocido al generar datos'
            setError(errorMessage)
        } finally {
            setIsGenerating(false)
        }
    }

    const generateBulkData = async () => {
        setIsGenerating(true)
        setError(null)
        setGeneratedData(null)
        
        try {
            console.log('Starting bulk generation for type:', type, 'count:', bulkCount)
            const data = await AIGeneratorService.generateBulkData(type, bulkCount)
            console.log('Bulk generation successful:', data)
            setGeneratedData(data)
            if (onDataGenerated) {
                onDataGenerated(data)
            }
        } catch (error) {
            console.error('Error generando datos en lote:', error)
            const errorMessage = error.message || 'Error desconocido al generar datos en lote'
            setError(errorMessage)
        } finally {
            setIsGenerating(false)
        }
    }

    const generateFromFile = async () => {
        setIsGenerating(true)
        setError(null)
        setGeneratedData(null)
        
        try {
            if (!fileContent.trim()) {
                throw new Error('Por favor, pega el contenido del archivo')
            }
            
            // Parsear el contenido del archivo
            const lines = fileContent.trim().split('\n').filter(line => line.trim())
            const apps = []
            
            for (let i = 0; i < lines.length; i += 2) {
                const filename = lines[i]?.trim()
                const downloadUrl = lines[i + 1]?.trim()
                
                if (filename && downloadUrl) {
                    // Extraer información del nombre del archivo
                    const appInfo = parseFilename(filename)
                    
                    // Generar datos usando IA con la información extraída
                    const prompt = `Genera datos para una aplicación llamada "${appInfo.name}" versión "${appInfo.version}" desarrollada por "${appInfo.developer}". Es una aplicación ${appInfo.category} crackeada. Usa el enlace de descarga: ${downloadUrl}`
                    
                    const data = await AIGeneratorService.generateFromPrompt(type, prompt)
                    
                    // Sobrescribir con la información específica del archivo
                    const enhancedData = {
                        ...data,
                        name: appInfo.name,
                        version: appInfo.version,
                        developer: appInfo.developer,
                        downloadLinks: [{
                            platform: 'windows',
                            url: downloadUrl,
                            size: appInfo.size || '100 MB',
                            isActive: true
                        }]
                    }
                    
                    apps.push(enhancedData)
                }
            }
            
            if (apps.length === 0) {
                throw new Error('No se pudieron extraer aplicaciones del contenido')
            }
            
            console.log('Generated from file:', apps)
            setGeneratedData(apps)
            if (onDataGenerated) {
                onDataGenerated(apps)
            }
            
            // Guardado automático si está habilitado
            if (autoSave && apps.length > 0) {
                await handleAutoSave(apps)
            }
        } catch (error) {
            console.error('Error generando desde archivo:', error)
            const errorMessage = error.message || 'Error desconocido al procesar el archivo'
            setError(errorMessage)
        } finally {
            setIsGenerating(false)
        }
    }
    
    const parseFilename = (filename) => {
        // Función para extraer información del nombre del archivo
        const info = {
            name: '',
            version: '',
            developer: '',
            category: 'Productivity',
            size: ''
        }
        
        // Remover extensión
        const nameWithoutExt = filename.replace(/\.(rar|zip|exe|msi|dmg)$/i, '')
        
        // Extraer versión (patrones como v1.0.0, 2024, etc.)
        const versionMatch = nameWithoutExt.match(/(v?\d+\.\d+\.\d+|\d{4}|v\d+)/i)
        if (versionMatch) {
            info.version = versionMatch[0]
            info.name = nameWithoutExt.replace(versionMatch[0], '').trim()
        } else {
            info.name = nameWithoutExt
            info.version = '1.0.0'
        }
        
        // Limpiar el nombre
        info.name = info.name
            .replace(/\(x64\)|\(x86\)|\(32-bit\)|\(64-bit\)/gi, '')
            .replace(/\s+/g, ' ')
            .trim()
        
        // Detectar desarrollador común
        const developers = {
            'Adobe': ['Photoshop', 'Acrobat', 'Premiere', 'After Effects'],
            'Microsoft': ['Office', 'Windows', 'Visual Studio'],
            'Autodesk': ['AutoCAD', 'Maya', '3ds Max'],
            'Avast': ['Avast'],
            'Norton': ['Norton'],
            'Bitdefender': ['Bitdefender'],
            'IObit': ['Driver Booster'],
            'TechSmith': ['Camtasia'],
            'CyberLink': ['PowerDirector']
        }
        
        for (const [dev, apps] of Object.entries(developers)) {
            if (apps.some(app => info.name.toLowerCase().includes(app.toLowerCase()))) {
                info.developer = dev
                break
            }
        }
        
        if (!info.developer) {
            info.developer = 'Unknown Developer'
        }
        
        // Detectar categoría
        const categories = {
            'Design': ['Photoshop', 'Illustrator', 'AutoCAD', 'Maya', '3ds Max'],
            'Productivity': ['Office', 'Acrobat'],
            'Multimedia': ['Premiere', 'After Effects', 'Camtasia', 'PowerDirector'],
            'Audio': ['FL Studio', 'Ableton'],
            'Security': ['Avast', 'Norton', 'Bitdefender'],
            'System': ['Driver Booster', 'CCleaner', 'WinRAR']
        }
        
        for (const [cat, apps] of Object.entries(categories)) {
            if (apps.some(app => info.name.toLowerCase().includes(app.toLowerCase()))) {
                info.category = cat
                break
            }
        }
        
        return info
    }

    const handleAutoSave = async (apps) => {
        setIsSaving(true)
        setSaveResults(null)
        
        try {
            console.log('Iniciando guardado automático de', apps.length, 'aplicaciones')
            const results = await AIGeneratorService.saveBulkGeneratedApps(apps)
            
            setSaveResults(results)
            console.log('Guardado completado:', results)
            
            if (results.success > 0) {
                alert(`¡Éxito! Se guardaron ${results.success} aplicaciones.${results.errors > 0 ? ` ${results.errors} fallaron.` : ''}`)
            }
        } catch (error) {
            console.error('Error en guardado automático:', error)
            setError(`Error guardando: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleManualSave = async () => {
        if (!generatedData) {
            setError('No hay datos generados para guardar')
            return
        }
        
        const appsToSave = Array.isArray(generatedData) ? generatedData : [generatedData]
        await handleAutoSave(appsToSave)
    }

    const handleGenerate = () => {
        if (generationMode === 'bulk') {
            generateBulkData()
        } else if (generationMode === 'file') {
            generateFromFile()
        } else {
            generateSingleData()
        }
    }

    const applyToForm = () => {
        if (generatedData && onApplyData) {
            onApplyData(generatedData)
        }
    }

    const copyToClipboard = () => {
        if (generatedData) {
            navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2))
            alert('Datos copiados al portapapeles')
        }
    }

    const downloadJSON = () => {
        if (generatedData) {
            const dataStr = JSON.stringify(generatedData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${type}-generated-${Date.now()}.json`
            link.click()
            URL.revokeObjectURL(url)
        }
    }

    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return value.join(', ')
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value, null, 2)
        }
        if (typeof value === 'boolean') {
            return value ? 'Sí' : 'No'
        }
        return String(value)
    }

    const getFieldLabel = (key) => {
        const labels = {
            name: 'Nombre',
            description: 'Descripción',
            shortDescription: 'Descripción corta',
            category: 'Categoría',
            version: 'Versión',
            size: 'Tamaño',
            downloadUrl: 'URL de descarga',
            packageName: 'Nombre del paquete',
            bundleId: 'Bundle ID',
            minAndroidVersion: 'Android mínimo',
            targetAndroidVersion: 'Android objetivo',
            minIosVersion: 'iOS mínimo',
            targetIosVersion: 'iOS objetivo',
            architecture: 'Arquitectura',
            permissions: 'Permisos',
            modFeatures: 'Características mod',
            deviceCompatibility: 'Compatibilidad',
            installationMethod: 'Método instalación',
            jailbreakRequired: 'Requiere jailbreak',
            genre: 'Género',
            gameMode: 'Modo de juego',
            esrbRating: 'Clasificación ESRB',
            pegiRating: 'Clasificación PEGI',
            releaseYear: 'Año de lanzamiento',
            platforms: 'Plataformas',
            crackInfo: 'Info del crack',
            systemRequirements: 'Requisitos del sistema',
            developer: 'Desarrollador',
            publisher: 'Editor',
            downloads: 'Descargas',
            rating: 'Calificación',
            reviewsCount: 'Número de reseñas',
            featured: 'Destacado',
            status: 'Estado',
            tags: 'Etiquetas'
        }
        return labels[key] || key
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${typeColors[type]} text-white`}>
                    <FaRobot className="text-xl" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">
                        Generador IA - {typeLabels[type]}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Genera datos realistas automáticamente con inteligencia artificial
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-red-400 mt-0.5">
                            ⚠️
                        </div>
                        <div>
                            <h4 className="text-red-300 font-medium mb-1">Error de generación</h4>
                            <p className="text-red-200 text-sm">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="mt-2 text-xs text-red-300 hover:text-red-100 underline"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Status */}
            {checkingService ? (
                <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaSpinner className="text-blue-400 animate-spin" />
                        <span className="text-blue-300">Verificando estado del servicio de IA...</span>
                    </div>
                </div>
            ) : serviceStatus && (
                <div className={`mb-6 p-4 rounded-lg border ${
                    serviceStatus.available 
                        ? 'bg-green-900/30 border-green-500' 
                        : 'bg-red-900/30 border-red-500'
                }`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${
                            serviceStatus.available ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {serviceStatus.available ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        </div>
                        <div>
                            <h4 className={`font-medium mb-1 ${
                                serviceStatus.available ? 'text-green-300' : 'text-red-300'
                            }`}>
                                {serviceStatus.available ? 'Servicio disponible' : 'Servicio no disponible'}
                            </h4>
                            {serviceStatus.available ? (
                                <div className="text-green-200 text-sm">
                                    <p>Servicio: {serviceStatus.service}</p>
                                    <p>Tipos soportados: {serviceStatus.supportedTypes?.join(', ')}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-red-200 text-sm mb-2">{serviceStatus.error}</p>
                                    <button
                                        onClick={() => {
                                            setCheckingService(true)
                                            setServiceStatus(null)
                                            // Reejecutar la verificación
                                            const checkService = async () => {
                                                try {
                                                    const isAvailable = await AIGeneratorService.checkServiceAvailability()
                                                    if (!isAvailable) {
                                                        setServiceStatus({
                                                            available: false,
                                                            error: 'Servicio de IA no disponible. Verifica que el backend esté ejecutándose.'
                                                        })
                                                        return
                                                    }
                                                    
                                                    const isAuth = AIGeneratorService.isAuthenticated()
                                                    if (!isAuth) {
                                                        setServiceStatus({
                                                            available: false,
                                                            error: 'No estás autenticado. Inicia sesión para usar la generación con IA.'
                                                        })
                                                        return
                                                    }
                                                    
                                                    const status = await AIGeneratorService.getStatus()
                                                    setServiceStatus({
                                                        available: status.data.available,
                                                        service: status.data.service,
                                                        supportedTypes: status.data.supportedTypes
                                                    })
                                                } catch (error) {
                                                    setServiceStatus({
                                                        available: false,
                                                        error: error.message
                                                    })
                                                } finally {
                                                    setCheckingService(false)
                                                }
                                            }
                                            checkService()
                                        }}
                                        className="text-xs text-red-300 hover:text-red-100 underline"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mode Selection */}
            <div className="mb-6">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setGenerationMode('single')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            generationMode === 'single'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Individual
                    </button>
                    <button
                        onClick={() => setGenerationMode('bulk')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            generationMode === 'bulk'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        En lote
                    </button>
                    <button
                        onClick={() => setGenerationMode('prompt')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            generationMode === 'prompt'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Con prompt
                    </button>
                    <button
                        onClick={() => setGenerationMode('file')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            generationMode === 'file'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        Desde archivo
                    </button>
                </div>

                {/* Prompt Mode */}
                {generationMode === 'prompt' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Describe lo que quieres generar:
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej: Una aplicación llamada 'WhatsApp Plus' de la categoría Social desarrollada por Meta..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                    </div>
                )}

                {/* Bulk Mode */}
                {generationMode === 'bulk' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cantidad de elementos a generar:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={bulkCount}
                            onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                            className="w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Máximo 50 elementos</p>
                    </div>
                )}

                {/* File Mode */}
                {generationMode === 'file' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Pega el contenido del archivo (nombre y enlace por líneas):
                        </label>
                        <textarea
                            value={fileContent}
                            onChange={(e) => setFileContent(e.target.value)}
                            placeholder={`Ejemplo:\nAdobe Photoshop 2025 v26.6.1 (x64).rar\nhttps://mega.nz/file/example\nFL Studio Producer Edition 2024.rar\nhttps://mega.nz/file/example2`}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                            rows={8}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Formato: Líneas alternadas con nombre de archivo y enlace de descarga
                        </p>
                    </div>
                )}
                
                {/* Auto Save Option */}
                {(generationMode === 'bulk' || generationMode === 'file') && (
                    <div className="mb-4">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={autoSave}
                                onChange={(e) => setAutoSave(e.target.checked)}
                                className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            Guardar automáticamente en la base de datos
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            Las aplicaciones se guardarán automáticamente después de generarse
                        </p>
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !serviceStatus?.available}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                        isGenerating || !serviceStatus?.available
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r ${typeColors[type]} text-white hover:shadow-lg transform hover:scale-105`
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Generando...
                        </>
                    ) : (
                        <>
                            <FaMagic />
                            Generar con IA
                        </>
                    )}
                </button>
                
                {/* Manual Save Button */}
                {generatedData && (
                    <button
                        onClick={handleManualSave}
                        disabled={isSaving || !serviceStatus?.available}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                            isSaving || !serviceStatus?.available
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle />
                                Guardar en BD
                            </>
                        )}
                    </button>
                )}
                
                {/* Clear Button */}
                {generatedData && (
                    <button
                        onClick={() => {
                            setGeneratedData(null)
                            setPrompt('')
                            setSaveResults(null)
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        <FaRenren />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Generated Data Display */}
            {generatedData && (
                <div className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">
                            {Array.isArray(generatedData) 
                                ? `Datos Generados (${generatedData.length} elementos)`
                                : 'Datos Generados'
                            }
                        </h4>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                title="Copiar JSON"
                            >
                                <FaCopy />
                            </button>
                            <button
                                onClick={downloadJSON}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                                title="Descargar JSON"
                            >
                                <FaDownload />
                            </button>
                            {!Array.isArray(generatedData) && onApplyData && (
                                <button
                                    onClick={applyToForm}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm font-medium"
                                >
                                    Aplicar al formulario
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Data Preview */}
                    <div className="max-h-96 overflow-y-auto">
                        {Array.isArray(generatedData) ? (
                            // Bulk data display
                            <div className="space-y-4">
                                {generatedData.map((item, index) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                                        <h5 className="font-medium text-white mb-2">
                                            Elemento {index + 1}: {item.name}
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-gray-400">Categoría:</span> <span className="text-white">{item.category}</span></div>
                                            <div><span className="text-gray-400">Versión:</span> <span className="text-white">{item.version}</span></div>
                                            <div><span className="text-gray-400">Tamaño:</span> <span className="text-white">{item.size}</span></div>
                                            <div><span className="text-gray-400">Desarrollador:</span> <span className="text-white">{item.developer}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Single data display
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(generatedData).map(([key, value]) => {
                                    if (key === 'images' || key === 'screenshots' || key === 'icon' || key === 'coverImage') {
                                        return null // Skip image fields for display
                                    }
                                    
                                    return (
                                        <div key={key} className="bg-gray-800 rounded-lg p-3">
                                            <div className="text-sm font-medium text-gray-300 mb-1">
                                                {getFieldLabel(key)}
                                            </div>
                                            <div className="text-white text-sm break-words">
                                                {formatValue(value)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h5 className="text-blue-300 font-medium mb-2">💡 Consejos de uso:</h5>
                <ul className="text-blue-200 text-sm space-y-1">
                    <li>• <strong>Individual:</strong> Genera un elemento con datos realistas aleatorios</li>
                    <li>• <strong>En lote:</strong> Genera múltiples elementos para pruebas masivas</li>
                    <li>• <strong>Con prompt:</strong> Describe específicamente lo que necesitas</li>
                    <li>• Los datos generados incluyen URLs, fechas y estadísticas realistas</li>
                    <li>• Puedes copiar el JSON o aplicar directamente al formulario</li>
                </ul>
            </div>
        </div>
    )
}

export default AIGenerator
