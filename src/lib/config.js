/**
 * Configuration file for API endpoints and environment variables
 */

// Get the API base URL from environment variables
export const getApiBaseUrl = () => {
    // In production, use the environment variable
    if (process.env.NODE_ENV === 'production') {
        return process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://api.crackmarket.xyz'
    }
    
    // In development, use localhost
    return process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
}

// API endpoints configuration
export const API_ENDPOINTS = {
    BASE_URL: getApiBaseUrl(),
    API_V1: `${getApiBaseUrl()}/api/v1`,
    
    // Apps endpoints
    APPS: `${getApiBaseUrl()}/api/v1/apps`,
    APK: `${getApiBaseUrl()}/api/v1/apk`,
    IPA: `${getApiBaseUrl()}/api/v1/ipa`,
    GAMES: `${getApiBaseUrl()}/api/v1/games`,
    
    // AI endpoints
    AI: `${getApiBaseUrl()}/api/v1/ai`,
    AI_STATUS: `${getApiBaseUrl()}/api/v1/ai/status`,
}

// Default fetch options for API calls
export const DEFAULT_FETCH_OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
    },
    next: {
        revalidate: 3600, // Cache for 1 hour
    }
}

// Helper function to safely extract array from API response
export const extractArrayFromResponse = (response) => {
    if (!response) return []
    if (Array.isArray(response)) return response
    if (response.data && Array.isArray(response.data)) return response.data
    if (response.apps && Array.isArray(response.apps)) return response.apps
    if (response.apks && Array.isArray(response.apks)) return response.apks
    if (response.ipas && Array.isArray(response.ipas)) return response.ipas
    if (response.games && Array.isArray(response.games)) return response.games
    if (response.results && Array.isArray(response.results)) return response.results
    return []
}

// Safe fetch function with error handling
export const safeFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...DEFAULT_FETCH_OPTIONS,
            ...options
        })
        
        if (!response.ok) {
            console.warn(`API request failed: ${response.status} ${response.statusText} for ${url}`)
            return null
        }
        
        return await response.json()
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error)
        return null
    }
}

export default {
    API_ENDPOINTS,
    DEFAULT_FETCH_OPTIONS,
    extractArrayFromResponse,
    safeFetch,
    getApiBaseUrl
}
