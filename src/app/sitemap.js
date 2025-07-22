import { api } from '@/lib/api'
import { siteConfig } from './metadata'

export default async function sitemap() {
    const baseUrl = siteConfig.url.replace(/\/$/, '') // Remove trailing slash

    // Static pages with proper URL structure
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
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
        // Add some additional important static pages
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/legal/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/legal/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    try {
        // Use Promise.allSettled for better error handling
        const [categoriesResult, appsResult] = await Promise.allSettled([
            api.getCategories().catch(err => {
                console.warn('Failed to fetch categories for sitemap:', err)
                return { categories: [] }
            }),
            api.getApps({ limit: 200, isActive: true }).catch(err => {
                console.warn('Failed to fetch apps for sitemap:', err)
                return { data: { apps: [] } }
            })
        ])

        const categories = categoriesResult.status === 'fulfilled' 
            ? categoriesResult.value.categories || [] 
            : []
        
        const apps = appsResult.status === 'fulfilled' 
            ? appsResult.value.data?.apps || [] 
            : []

        console.log(`Generating sitemap with ${categories.length} categories and ${apps.length} apps`)

        // Dynamic category pages
        const categoryPages = categories
            .filter(category => category.slug && category.slug.trim())
            .map((category) => ({
                url: `${baseUrl}/category/${category.slug}`,
                lastModified: new Date(category.updatedAt || category.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.7,
            }))

        // Dynamic app pages (filter out invalid slugs)
        const appPages = apps
            .filter(app => app.slug && app.slug.trim() && app.isActive !== false)
            .map((app) => ({
                url: `${baseUrl}/app/${app.slug}`,
                lastModified: new Date(app.updatedAt || app.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.6,
            }))

        const allPages = [...staticPages, ...categoryPages, ...appPages]
        
        // Remove duplicates based on URL
        const uniquePages = allPages.filter((page, index, self) => 
            index === self.findIndex(p => p.url === page.url)
        )

        console.log(`Sitemap generated with ${uniquePages.length} unique URLs`)

        return uniquePages.map(page => ({
            url: page.url,
            lastModified: page.lastModified,
            changeFrequency: page.changeFrequency,
            priority: page.priority
        }))

    } catch (error) {
        console.error('Critical error generating sitemap:', error)
        // Return only static pages if everything fails
        return staticPages
    }
}

// Ensure proper content-type headers
export const contentType = 'application/xml' 