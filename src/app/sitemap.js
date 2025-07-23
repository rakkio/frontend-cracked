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
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/downloads`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
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
        {
            url: `${baseUrl}/legal/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/popular`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/new-releases`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/top-rated`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }
    ]

    try {
        // Use Promise.allSettled for better error handling
        const [categoriesResult, appsResult] = await Promise.allSettled([
            api.getCategories().catch(err => {
                console.warn('Failed to fetch categories for sitemap:', err.message)
                return { categories: [] }
            }),
            api.getApps({ limit: 500, isActive: true }).catch(err => {
                console.warn('Failed to fetch apps for sitemap:', err.message)
                return { data: { apps: [] } }
            })
        ])

        const categories = categoriesResult.status === 'fulfilled' 
            ? (categoriesResult.value?.categories || [])
            : []
        
        const apps = appsResult.status === 'fulfilled' 
            ? (appsResult.value?.data?.apps || [])
            : []

        console.log(`Generating sitemap with ${categories.length} categories and ${apps.length} apps`)

        // Dynamic category pages with proper validation
        const categoryPages = categories
            .filter(category => {
                return category && 
                       category.slug && 
                       typeof category.slug === 'string' && 
                       category.slug.trim().length > 0 &&
                       category.isActive !== false
            })
            .map((category) => ({
                url: `${baseUrl}/category/${encodeURIComponent(category.slug)}`,
                lastModified: new Date(category.updatedAt || category.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.7,
            }))

        // Dynamic app pages with proper validation
        const appPages = apps
            .filter(app => {
                return app && 
                       app.slug && 
                       typeof app.slug === 'string' && 
                       app.slug.trim().length > 0 &&
                       app.isActive !== false &&
                       app.status !== 'draft'
            })
            .slice(0, 1000) // Limit to 1000 apps for performance
            .map((app) => ({
                url: `${baseUrl}/app/${encodeURIComponent(app.slug)}`,
                lastModified: new Date(app.updatedAt || app.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.6,
            }))

        const allPages = [...staticPages, ...categoryPages, ...appPages]
        
        // Remove duplicates and validate URLs
        const uniquePages = allPages
            .filter((page, index, self) => {
                // Remove duplicates based on URL
                const isDuplicate = index !== self.findIndex(p => p.url === page.url)
                if (isDuplicate) return false
                
                // Validate URL format
                try {
                    new URL(page.url)
                    return true
                } catch {
                    console.warn(`Invalid URL in sitemap: ${page.url}`)
                    return false
                }
            })
            .slice(0, 50000) // Google sitemap limit

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

// Ensure proper content-type headers for Google
export const contentType = 'application/xml'
export const dynamic = 'force-dynamic' 