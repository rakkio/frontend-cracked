const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class APIError extends Error {
    constructor(message, status, data) {
        super(message)
        this.name = 'APIError'
        this.status = status
        this.data = data
    }
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
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        try {
            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                throw new APIError(
                    data.message || 'Request failed',
                    response.status,
                    data
                )
            }

            return data
        } catch (error) {
            if (error instanceof APIError) {
                throw error
            }
            throw new APIError('Network error occurred', 0, null)
        }
    }

    // Authentication methods
    async login(email, password) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    }

    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    }

    async getProfile() {
        return this.request('/users/profile')
    }

    async updateProfile(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        })
    }

    async changePassword(currentPassword, newPassword, confirmPassword) {
        return this.request('/users/change-password', {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword,
            }),
        })
    }

    // Apps methods
    async getApps(params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/apps?${queryString}`)
    }

    async getAppBySlug(slug) {
        return this.request(`/apps/${slug}`)
    }

    async getApp(id) {
        return this.request(`/apps/id/${id}`)
    }

    async getFeaturedApps(limit = 8) {
        return this.request(`/apps/featured?limit=${limit}`)
    }

    async getAppStats() {
        return this.request('/apps/stats')
    }

    async getAppsStats() {
        return this.request('/apps/stats')
    }

    async getCategoriesStats() {
        return this.request('/categories/admin/stats')
    }

    async getUsersStats() {
        return this.request('/users/admin/stats')
    }

    async getRecentActivity() {
        return this.request('/admin/recent-activity')
    }

    async getGrowthMetrics(period = '30d') {
        return this.request(`/admin/growth-metrics?period=${period}`)
    }

    async registerDownload(appId) {
        return this.request(`/apps/${appId}/download`, {
            method: 'POST',
        })
    }

    // Categories methods
    async getCategories() {
        return this.request('/categories')
    }

    async getFeaturedCategories(limit = 6) {
        return this.request(`/categories/featured?limit=${limit}`)
    }

    async getAppsByCategory(categorySlug, params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/categories/${categorySlug}/apps?${queryString}`)
    }

    async searchAppsInCategory(categorySlug, params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/categories/${categorySlug}/apps/search?${queryString}`)
    }

    // Admin methods
    async createApp(appData) {
        const config = {
            method: 'POST',
            body: appData instanceof FormData ? appData : JSON.stringify(appData),
        }
        
        // Si es FormData, no configurar Content-Type para que el browser lo haga automáticamente
        if (!(appData instanceof FormData)) {
            config.headers = { 'Content-Type': 'application/json' }
        }
        
        return this.request('/apps', config)
    }

    async updateApp(id, appData) {
        const config = {
            method: 'PUT',
            body: appData instanceof FormData ? appData : JSON.stringify(appData),
        }
        
        // Si es FormData, no configurar Content-Type para que el browser lo haga automáticamente
        if (!(appData instanceof FormData)) {
            config.headers = { 'Content-Type': 'application/json' }
        }
        
        return this.request(`/apps/${id}`, config)
    }

    async deleteApp(id) {
        return this.request(`/apps/${id}`, {
            method: 'DELETE',
        })
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

    // User management methods (admin only)
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/users?${queryString}`)
    }

    async getUser(id) {
        return this.request(`/users/${id}`)
    }

    async updateUserRole(id, roleData) {
        return this.request(`/users/${id}/role`, {
            method: 'PUT',
            body: JSON.stringify(roleData),
        })
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        })
    }

    // ================ BANNER METHODS ================

    // Public banner methods
    async getBannersByPosition(position, params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/banners/position/${position}?${queryString}`)
    }

    async getFeaturedBanners(params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/banners/featured?${queryString}`)
    }

    async getBannerStats() {
        return this.request('/banners/stats')
    }

    async getBannerById(id) {
        return this.request(`/banners/${id}`)
    }

    async searchBanners(query, params = {}) {
        const searchParams = { query, ...params }
        const queryString = new URLSearchParams(searchParams).toString()
        return this.request(`/banners/search?${queryString}`)
    }

    async incrementBannerImpressions(id) {
        return this.request(`/banners/${id}/impressions`, {
            method: 'PATCH',
        })
    }

    async incrementBannerClicks(id) {
        return this.request(`/banners/${id}/clicks`, {
            method: 'PATCH',
        })
    }

    // Admin banner methods (require authentication)
    async getAllBanners(params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/banners?${queryString}`)
    }

    async createBanner(bannerData) {
        // Si bannerData es FormData, no necesitamos JSON.stringify
        if (bannerData instanceof FormData) {
            return this.request('/banners', {
                method: 'POST',
                body: bannerData,
            })
        }

        return this.request('/banners', {
            method: 'POST',
            body: JSON.stringify(bannerData),
        })
    }

    async updateBanner(id, bannerData) {
        // Si bannerData es FormData, no necesitamos JSON.stringify
        if (bannerData instanceof FormData) {
            return this.request(`/banners/${id}`, {
                method: 'PATCH',
                body: bannerData,
            })
        }

        return this.request(`/banners/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(bannerData),
        })
    }

    async deleteBanner(id) {
        return this.request(`/banners/${id}`, {
            method: 'DELETE',
        })
    }
}

export const api = new API()
export { APIError } 