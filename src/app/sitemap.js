import { api } from '@/lib/api'
import { siteConfig } from './metadata'

export default async function sitemap() {
    const baseUrl = siteConfig.url

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/apps`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/auth/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/auth/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    try {
        // Fetch categories
        const categoriesResponse = await api.getCategories()
        const categories = categoriesResponse.categories || []

        // Fetch all apps for sitemap (not just featured)
        const appsResponse = await api.getApps({ limit: 100 })
        const apps = appsResponse.data?.apps || []

        // Dynamic category pages
        const categoryPages = categories.map((category) => ({
            url: `${baseUrl}/category/${category.slug}`,
            lastModified: new Date(category.updatedAt || category.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
        }))

        // Dynamic app pages
        const appPages = apps.map((app) => ({
            url: `${baseUrl}/app/${app.slug}`,
            lastModified: new Date(app.updatedAt || app.createdAt),
            changeFrequency: 'weekly',
            priority: 0.6,
        }))

        return [...staticPages, ...categoryPages, ...appPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return only static pages if API fails
        return staticPages
    }
} 