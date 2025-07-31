/**
 * Servicio de IA para generar automáticamente datos de modelos
 * Usa Google Gemini 2.5 Flash a través de la API del backend
 */

class AIGeneratorService {
    constructor() {
        // Forzar localhost temporalmente para debug
        this.baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || 'http://localhost:5000/api/v1'
        this.aiEndpoint = `${this.baseURL}/ai`
        
        // Debug logging
        console.log('AIGeneratorService initialized:')
        console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
        console.log('- baseURL (forced):', this.baseURL)
        console.log('- aiEndpoint:', this.aiEndpoint)
    }

    /**
     * Obtiene el token de autenticación del localStorage
     */
    getAuthToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token')
        }
        return null
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated() {
        const token = this.getAuthToken()
        if (!token) {
            return false
        }
        
        try {
            // Verificar si el token no ha expirado (simple check)
            const payload = JSON.parse(atob(token.split('.')[1]))
            const now = Date.now() / 1000
            return payload.exp > now
        } catch (error) {
            console.error('Error verificando token:', error)
            return false
        }
    }

    /**
     * Realiza una petición HTTP a la API de apps
     */
    async makeAppRequest(endpoint, options = {}) {
        // Verificar autenticación antes de hacer la petición
        if (!this.isAuthenticated()) {
            throw new Error('Debes iniciar sesión para guardar aplicaciones')
        }
        
        const token = this.getAuthToken()
        
        const defaultOptions = {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
                // No establecer Content-Type para FormData
            }
        }

        try {
            console.log('Making app request to:', `${this.baseURL}${endpoint}`)
            console.log('Request options:', { ...defaultOptions, ...options })
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            })

            console.log('Response status:', response.status)
            
            if (!response.ok) {
                const errorText = await response.text()
                console.error('App API error response:', errorText)
                throw new Error(`Error ${response.status}: ${errorText}`)
            }

            const data = await response.json()
            console.log('App API response:', data)
            return data
            
        } catch (error) {
            console.error('Error en petición a app API:', error)
            throw error
        }
    }

    /**
     * Realiza una petición HTTP a la API de IA
     */
    async makeRequest(endpoint, options = {}) {
        // Verificar autenticación antes de hacer la petición
        if (!this.isAuthenticated()) {
            throw new Error('Debes iniciar sesión para usar la generación con IA')
        }
        
        const token = this.getAuthToken()
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        }

        try {
            console.log('Making AI request to:', `${this.aiEndpoint}${endpoint}`)
            console.log('Request options:', { ...defaultOptions, ...options })
            
            const response = await fetch(`${this.aiEndpoint}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)

            if (!response.ok) {
                let errorData
                try {
                    errorData = await response.json()
                    console.log('Error response data:', errorData)
                } catch (parseError) {
                    console.log('Failed to parse error response:', parseError)
                    errorData = { 
                        message: `Error HTTP ${response.status}: ${response.statusText}`,
                        status: response.status,
                        statusText: response.statusText
                    }
                }
                
                // Manejo específico de errores de autenticación
                if (response.status === 401) {
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
                }
                if (response.status === 403) {
                    throw new Error('No tienes permisos para usar la generación con IA. Se requiere rol de administrador.')
                }
                if (response.status === 404) {
                    throw new Error('Servicio de IA no disponible. Verifica que el backend esté ejecutándose correctamente.')
                }
                if (response.status === 503) {
                    throw new Error('Servicio de IA temporalmente no disponible. Verifica la configuración de GEMINI_API_KEY.')
                }
                
                throw new Error(errorData.message || `Error HTTP: ${response.status} - ${response.statusText}`)
            }

            const data = await response.json()
            console.log('Success response data:', data)
            return data
            
        } catch (error) {
            console.error('Request failed:', error)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.')
            }
            throw error
        }
    }

    /**
     * Verifica el estado del servicio de IA
     */
    async getStatus() {
        try {
            return await this.makeRequest('/status')
        } catch (error) {
            console.error('Error verificando estado de IA:', error)
            throw error
        }
    }

    /**
     * Verifica si el servicio está disponible sin autenticación
     */
    async checkServiceAvailability() {
        try {
            const response = await fetch(`${this.aiEndpoint}/status`)
            console.log('Service availability check - Status:', response.status)
            
            // Si obtenemos 401 o 403, significa que el servicio existe pero requiere auth
            // Si obtenemos 404, significa que el servicio no existe
            // Si obtenemos 200, significa que está disponible
            return response.status !== 404
        } catch (error) {
            console.error('Error verificando disponibilidad del servicio:', error)
            // Si hay error de red, probablemente el backend no esté ejecutándose
            return false
        }
    }

    /**
     * Guarda una aplicación generada automáticamente
     */
    async saveGeneratedApp(appData) {
        try {
            // Generar slug automáticamente basado en el nombre
            const slug = this.generateSlug(appData.name)
            
            // Preparar datos para envío como FormData (para compatibilidad con middleware de upload)
            const formData = new FormData()
            
            // Campos básicos
            formData.append('name', appData.name)
            formData.append('description', appData.description || '')
            formData.append('shortDescription', appData.shortDescription || '')
            formData.append('version', appData.version || '1.0.0')
            formData.append('size', appData.size || '100 MB')
            formData.append('developer', appData.developer || 'Unknown')
            formData.append('category', appData.category || '')
            
            // Asegurar que downloadLinks tenga el formato correcto
            if (appData.downloadLinks && Array.isArray(appData.downloadLinks)) {
                // Normalizar platform a minúsculas
                const normalizedLinks = appData.downloadLinks.map(link => ({
                    ...link,
                    platform: link.platform ? link.platform.toLowerCase() : 'windows'
                }))
                const downloadLinksJson = JSON.stringify(normalizedLinks)
                formData.append('downloadLinks', downloadLinksJson)
            } else if (appData.downloadLinks) {
                // Si es un objeto único, convertirlo a array
                const normalizedLink = {
                    ...appData.downloadLinks,
                    platform: appData.downloadLinks.platform ? appData.downloadLinks.platform.toLowerCase() : 'windows'
                }
                const downloadLinksArray = [normalizedLink]
                formData.append('downloadLinks', JSON.stringify(downloadLinksArray))
            }
            
            // Campos booleanos como strings
            formData.append('isPremium', String(appData.isPremium || false))
            formData.append('isHot', String(appData.isHot || false))
            formData.append('isFeatured', String(appData.featured || appData.isFeatured || false))
            formData.append('featured', String(appData.featured || false))
            
            // Campos adicionales como JSON
            if (appData.systemRequirements) {
                formData.append('systemRequirements', JSON.stringify(appData.systemRequirements))
            }
            if (appData.tags) {
                formData.append('tags', JSON.stringify(appData.tags))
            }
            
            // Campos adicionales de la IA
            if (appData.publisher) {
                formData.append('publisher', appData.publisher)
            }
            if (appData.platforms && Array.isArray(appData.platforms)) {
                appData.platforms.forEach(platform => {
                    formData.append('platforms', platform)
                })
            }
            if (appData.crackInfo) {
                formData.append('crackInfo', JSON.stringify(appData.crackInfo))
            }
            if (appData.packageName) {
                formData.append('packageName', appData.packageName)
            }
            if (appData.minVersion || appData.minAndroidVersion) {
                formData.append('minVersion', appData.minVersion || appData.minAndroidVersion)
            }
            if (appData.targetVersion || appData.targetAndroidVersion) {
                formData.append('targetVersion', appData.targetVersion || appData.targetAndroidVersion)
            }
            if (appData.architecture && Array.isArray(appData.architecture)) {
                appData.architecture.forEach(arch => {
                    formData.append('architecture', arch)
                })
            }
            if (appData.permissions && Array.isArray(appData.permissions)) {
                appData.permissions.forEach(permission => {
                    formData.append('permissions', permission)
                })
            }
            if (appData.modFeatures && Array.isArray(appData.modFeatures)) {
                appData.modFeatures.forEach(feature => {
                    formData.append('modFeatures', feature)
                })
            }
            
            // Campos numéricos de la IA
            if (appData.rating) {
                formData.append('rating', String(appData.rating))
            }
            if (appData.downloads) {
                formData.append('downloads', String(appData.downloads))
            }
            if (appData.reviewsCount) {
                formData.append('reviewsCount', String(appData.reviewsCount))
            }
            
            // Fechas de la IA
            if (appData.releaseDate) {
                formData.append('releaseDate', appData.releaseDate instanceof Date ? appData.releaseDate.toISOString() : String(appData.releaseDate))
            }
            if (appData.lastUpdated) {
                formData.append('lastUpdated', appData.lastUpdated instanceof Date ? appData.lastUpdated.toISOString() : String(appData.lastUpdated))
            }
            
            // Campos adicionales
            if (appData.originalPrice) {
                formData.append('originalPrice', String(appData.originalPrice))
            }
            if (appData.instructions) {
                formData.append('instructions', appData.instructions)
            }
            
            const response = await this.makeAppRequest('/apps', {
                method: 'POST',
                body: formData
            })
            
            return response
        } catch (error) {
            console.error('Error guardando aplicación:', error)
            throw new Error(`Error al guardar: ${error.message}`)
        }
    }

    /**
     * Guarda múltiples aplicaciones generadas
     */
    async saveBulkGeneratedApps(appsArray) {
        const results = []
        const errors = []
        
        for (let i = 0; i < appsArray.length; i++) {
            try {
                console.log(`Guardando aplicación ${i + 1}/${appsArray.length}: ${appsArray[i].name}`)
                const result = await this.saveGeneratedApp(appsArray[i])
                results.push({
                    index: i,
                    name: appsArray[i].name,
                    success: true,
                    data: result
                })
                
                // Pequeña pausa entre guardados para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (error) {
                console.error(`Error guardando aplicación ${i + 1}:`, error)
                errors.push({
                    index: i,
                    name: appsArray[i].name,
                    error: error.message
                })
            }
        }
        
        return {
            success: results.length,
            errors: errors.length,
            results,
            errorDetails: errors
        }
    }

    /**
     * Genera un slug URL-friendly basado en el nombre
     */
    generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            // Reemplazar caracteres especiales y espacios
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            // Agregar timestamp para evitar duplicados
            + '-' + Date.now().toString().slice(-6)
    }

    /**
     * Genera datos para un APK Android
     */
    async generateAPKData(customPrompt = null) {
        try {
            const response = await this.makeRequest('/generate/apk', {
                method: 'POST',
                body: JSON.stringify({ customPrompt })
            })
            return response.data
        } catch (error) {
            console.error('Error generando datos APK:', error)
            throw error
        }
    }

    /**
     * Genera datos para una IPA iOS
     */
    async generateIPAData(customPrompt = null) {
        try {
            const response = await this.makeRequest('/generate/ipa', {
                method: 'POST',
                body: JSON.stringify({ customPrompt })
            })
            return response.data
        } catch (error) {
            console.error('Error generando datos IPA:', error)
            throw error
        }
    }

    /**
     * Genera datos para un juego
     */
    async generateGameData(customPrompt = null) {
        try {
            const response = await this.makeRequest('/generate/game', {
                method: 'POST',
                body: JSON.stringify({ customPrompt })
            })
            return response.data
        } catch (error) {
            console.error('Error generando datos de juego:', error)
            throw error
        }
    }

    /**
     * Genera datos para una App
     */
    async generateAppData(customPrompt = null) {
        try {
            const response = await this.makeRequest('/generate/app', {
                method: 'POST',
                body: JSON.stringify({ customPrompt })
            })
            return response.data
        } catch (error) {
            console.error('Error generando datos de app:', error)
            throw error
        }
    }

    /**
     * Genera datos basados en un prompt personalizado
     */
    async generateFromPrompt(type, prompt) {
        try {
            const response = await this.makeRequest('/generate/custom', {
                method: 'POST',
                body: JSON.stringify({ type, prompt })
            })
            return response.data
        } catch (error) {
            console.error('Error generando con prompt personalizado:', error)
            throw error
        }
    }

    /**
     * Genera múltiples elementos del mismo tipo
     */
    async generateBulkData(type, count = 5) {
        try {
            const response = await this.makeRequest('/generate/bulk', {
                method: 'POST',
                body: JSON.stringify({ type, count })
            })
            return response.data
        } catch (error) {
            console.error('Error generando datos en lote:', error)
            throw error
        }
    }

    /**
     * Genera y guarda directamente en la base de datos
     */
    async generateAndCreate(type, customPrompt = null, autoSave = false) {
        try {
            const endpoint = `/generate-and-create/${type}`
            const response = await this.makeRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify({ customPrompt, autoSave })
            })
            return response.data
        } catch (error) {
            console.error(`Error generando y creando ${type}:`, error)
            throw error
        }
    }

    /**
     * Verifica si el servicio está disponible
     */
    async isAvailable() {
        try {
            const status = await this.getStatus()
            return status.data.available
        } catch (error) {
            return false
        }
    }
}

export default new AIGeneratorService()
