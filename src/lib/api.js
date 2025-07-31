const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class APIError extends Error {
    constructor(message, status, data) {
        super(message)
        this.name = 'APIError'
        this.status = status
        this.data = data
    }
}

// Helper function to clean undefined parameters
const cleanParams = (params) => {
    const cleaned = {}
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== 'undefined') {
            cleaned[key] = value
        }
    }
    return cleaned
}

class API {
    constructor() {
        this.baseURL = `${API_BASE_URL}/api/v1`
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        
        const config = {
            headers: {
                // Solo configurar Content-Type si no es FormData
                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
            ...options,
        }

        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        try {
            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                throw new APIError(
                    data.message || `HTTP error! status: ${response.status}`,
                    response.status,
                    data
                )
            }

            return data
        } catch (error) {
            if (error instanceof APIError) {
                throw error
            }
            throw new APIError(error.message, 0, null)
        }
    }

    // Helper method to build query string with cleaned parameters
    buildQueryString(params) {
        const cleanedParams = cleanParams(params)
        const searchParams = new URLSearchParams()
        
        Object.entries(cleanedParams).forEach(([key, value]) => {
            // Skip empty strings completely
            if (value === '' || value === null || value === undefined) {
                return
            }
            
            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item !== '' && item !== null && item !== undefined) {
                        searchParams.append(key, item)
                    }
                })
            } else {
                searchParams.append(key, value)
            }
        })
        
        return searchParams.toString()
    }

    // Auth methods
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    }

    async login(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    }

    // User profile and preferences
    async getUserProfile() {
        return this.request('/users/profile')
    }

    async getUserDownloads(params = {}) {
        const query = this.buildQueryString(params)
        return this.request(`/users/downloads${query ? `?${query}` : ''}`)
    }

    async getUserFavorites(params = {}) {
        const query = this.buildQueryString(params)
        return this.request(`/users/favorites${query ? `?${query}` : ''}`)
    }

    async addToFavorites(appId) {
        return this.request(`/users/favorites/${appId}`, {
            method: 'POST'
        })
    }

    async removeFromFavorites(appId) {
        return this.request(`/users/favorites/${appId}`, {
            method: 'DELETE'
        })
    }

    async forgotPassword(email) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        })
    }

    async resetPassword(token, password) {
        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        })
    }

    async updateUserProfile(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        })
    }

    // Apps methods
    async getApps(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/apps${queryString ? '?' + queryString : ''}`)
    }

    async getAppBySlug(slug) {
        return this.request(`/apps/${slug}`)
    }

    async getAppById(id) {
        return this.request(`/apps/id/${id}`)
    }

    async searchApps(query, params = {}) {
        const searchParams = { ...params, search: query }
        const queryString = this.buildQueryString(searchParams)
        return this.request(`/apps/search?${queryString}`)
    }

    async quickSearch(query, limit = 8) {
        const queryString = this.buildQueryString({ q: query, limit })
        return this.request(`/apps/quick-search?${queryString}`)
    }

    async getFeaturedApps(limit = 10) {
        const queryString = this.buildQueryString({ featured: true, limit })
        return this.request(`/apps?${queryString}`)
    }

    async getPopularApps(limit = 10) {
        const queryString = this.buildQueryString({ popular: true, limit })
        return this.request(`/apps?${queryString}`)
    }

    async getNewApps(limit = 10) {
        const queryString = this.buildQueryString({ newest: true, limit })
        return this.request(`/apps?${queryString}`)
    }

    async getAppsByCategory(categorySlug, params = {}) {
        try {
            // First get the category by slug to get the ID
            const categoryResponse = await this.getCategoryBySlug(categorySlug)
            const categoryId = categoryResponse.data?.category?._id || categoryResponse.category?._id
            
            if (!categoryId) {
                throw new Error(`Category not found: ${categorySlug}`)
            }
            
            // Then get apps by category ID
            const cleanedParams = cleanParams(params)
            const queryString = this.buildQueryString({ category: categoryId, ...cleanedParams })
            return this.request(`/apps?${queryString}`)
        } catch (error) {
            throw new APIError(`Failed to get apps by category: ${error.message}`, 0, null)
        }
    }

    async searchAppsInCategory(categorySlug, params = {}) {
        try {
            // First get the category by slug to get the ID
            const categoryResponse = await this.getCategoryBySlug(categorySlug)
            const categoryId = categoryResponse.data?.category?._id || categoryResponse.category?._id
            
            if (!categoryId) {
                throw new Error(`Category not found: ${categorySlug}`)
            }
            
            // Then search apps by category ID
            const cleanedParams = cleanParams(params)
            const queryString = this.buildQueryString({ category: categoryId, ...cleanedParams })
            return this.request(`/apps/search?${queryString}`)
        } catch (error) {
            throw new APIError(`Failed to search apps in category: ${error.message}`, 0, null)
        }
    }

    // Categories methods
    async getCategories(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/categories${queryString ? '?' + queryString : ''}`)
    }

    async getCategoryBySlug(slug) {
        return this.request(`/categories/${slug}`)
    }

    async getCategoryById(id) {
        return this.request(`/categories/id/${id}`)
    }

    // Admin methods - Fixed routes
    async getAppsStats() {
        return this.request('/apps/stats')
    }

    async getCategoriesStats() {
        return this.request('/categories/admin/stats')
    }

    async getUsersStats() {
        return this.request('/users/stats')
    }

    // Note: These methods don't exist in the backend yet
    // Uncomment when backend implementation is ready
    /*
    async getRecentActivity() {
        return this.request('/users/activity')
    }

    async getGrowthMetrics() {
        return this.request('/users/growth')
    }
    */

    // Public banner methods
    async getBannersByPosition(position, params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/banners/position/${position}${queryString ? '?' + queryString : ''}`)
    }

    async getFeaturedBanners(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/banners/featured${queryString ? '?' + queryString : ''}`)
    }

    async getBannerStats() {
        return this.request('/banners/stats')
    }

    async getBannerById(id) {
        return this.request(`/banners/${id}`)
    }

    async searchBanners(query, params = {}) {
        const searchParams = { ...params, q: query }
        const queryString = this.buildQueryString(searchParams)
        return this.request(`/banners/search?${queryString}`)
    }

    async incrementBannerImpressions(id) {
        return this.request(`/banners/${id}/impressions`, {
            method: 'PATCH'
        })
    }

    async incrementBannerClicks(id) {
        return this.request(`/banners/${id}/clicks`, {
            method: 'PATCH'
        })
    }

    // Admin banner methods
    async getAllBanners(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/banners${queryString ? '?' + queryString : ''}`)
    }

    async createBanner(bannerData) {
        return this.request('/banners', {
            method: 'POST',
            body: bannerData, // FormData
        })
    }

    async updateBanner(id, bannerData) {
        return this.request(`/banners/${id}`, {
            method: 'PATCH',
            body: bannerData, // FormData
        })
    }

    async deleteBanner(id) {
        return this.request(`/banners/${id}`, {
            method: 'DELETE',
        })
    }

    // Admin apps methods
    async getAllAppsAdmin(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/apps/admin${queryString ? '?' + queryString : ''}`)
    }

    async createApp(appData) {
        return this.request('/apps', {
            method: 'POST',
            body: appData,
        })
    }

    async updateApp(id, appData) {
        return this.request(`/apps/${id}`, {
            method: 'PUT',
            body: appData,
        })
    }

    async deleteApp(id) {
        return this.request(`/apps/${id}`, {
            method: 'DELETE',
        })
    }

    // Admin categories methods
    async getAllCategoriesAdmin(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/categories/admin${queryString ? '?' + queryString : ''}`)
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        })
    }

    async updateCategory(id, categoryData) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        })
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE',
        })
    }

    // Admin users methods
    async getAllUsersAdmin(params = {}) {
        const queryString = this.buildQueryString(params)
        return this.request(`/users/admin${queryString ? '?' + queryString : ''}`)
    }

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        })
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        })
    }

    // Advertisement methods
    async getAdvertisements(params = {}) {
        const cleanedParams = cleanParams(params)
        const queryString = this.buildQueryString(cleanedParams)
        return this.request(`/advertisements${queryString ? '?' + queryString : ''}`)
    }

    async getAdvertisement(id) {
        return this.request(`/advertisements/${id}`)
    }

    async getActiveAdvertisement(params = {}) {
        const cleanedParams = cleanParams(params)
        const queryString = this.buildQueryString(cleanedParams)
        return this.request(`/advertisements/active${queryString ? '?' + queryString : ''}`)
    }

    async getRandomAdvertisement(params = {}) {
        const cleanedParams = cleanParams(params)
        const queryString = this.buildQueryString(cleanedParams)
        return this.request(`/advertisements/random${queryString ? '?' + queryString : ''}`)
    }

    async createAdvertisement(advertisementData) {
        return this.request('/advertisements', {
            method: 'POST',
            body: JSON.stringify(advertisementData),
        })
    }

    async updateAdvertisement(id, advertisementData) {
        return this.request(`/advertisements/${id}`, {
            method: 'PUT',
            body: JSON.stringify(advertisementData),
        })
    }

    async deleteAdvertisement(id) {
        return this.request(`/advertisements/${id}`, {
            method: 'DELETE',
        })
    }

    async trackAdvertisementImpression(id) {
        return this.request(`/advertisements/${id}/impression`, {
            method: 'POST',
        })
    }

    async trackAdvertisementClick(id) {
        return this.request(`/advertisements/${id}/click`, {
            method: 'POST',
        })
    }

    async trackAdvertisementConversion(id) {
        return this.request(`/advertisements/${id}/conversion`, {
            method: 'POST',
        })
    }

    async getAdvertisementAnalytics(params = {}) {
        const cleanedParams = cleanParams(params)
        const queryString = this.buildQueryString(cleanedParams)
        return this.request(`/advertisements/analytics${queryString ? '?' + queryString : ''}`)
    }

    // Test authentication
    async testAuth() {
        return this.request('/advertisements/test-auth')
    }

    // Debug advertisements
    async debugAdvertisements() {
        return this.request('/advertisements/debug')
    }

    // Create test advertisement
    async createTestAdvertisement() {
        return this.request('/advertisements/create-test', {
            method: 'POST',
        })
    }

    // Generic POST method for custom endpoints
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
}

export const api = new API()
export { APIError } 