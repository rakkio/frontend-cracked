import { siteConfig } from './metadata'

export default async function sitemap() {
    const baseUrl = siteConfig.url.replace(/\/$/, '') // Remove trailing slash
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

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

    // Direct API call without authentication for server-side rendering
    const makeAPICall = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // No authentication headers for public endpoints
                },
                cache: 'no-store' // Ensure fresh data for sitemap
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error(`❌ API call failed for ${endpoint}:`, error.message)
            return null
        }
    }

    try {
        
        // Function to fetch all apps with pagination (respecting 100 limit)
        const fetchAllApps = async () => {
            const allApps = []
            let page = 1
            let hasMore = true
            const limit = 100 // Respect backend validation limit
            
            while (hasMore && allApps.length < 1000) { // Limit total to 1000 for performance
                try {
                    const response = await makeAPICall(`/apps?page=${page}&limit=${limit}&isActive=true`)
                    
                    if (!response || !response.success) {
                        console.error(`❌ API response error for page ${page}:`, response?.message || 'Unknown error')
                        break
                    }
                    
                    const apps = response?.data?.apps || []
                    allApps.push(...apps)
                    
                    // Check if there are more pages
                    const pagination = response?.data?.pagination
                    hasMore = pagination?.hasNext || false
                    page++
                    
                    
                    // Safety break to avoid infinite loops
                    if (page > 20) {
                        console.log('⚠️ Reached maximum page limit (20), stopping pagination')
                        break
                    }
                } catch (error) {
                    console.error(`❌ Error fetching apps page ${page}:`, error.message)
                    break
                }
            }
            
            return allApps
        }

        // Fetch categories and apps with better error handling
        const [categoriesResult, appsResult] = await Promise.allSettled([
            makeAPICall('/categories').then(response => {
                console.log('📂 Categories API response:', {
                    success: !!response?.success,
                    categoriesCount: response?.categories?.length || 0
                })
                return response
            }),
            
            fetchAllApps().then(apps => {
                console.log('📱 All apps fetched:', {
                    totalApps: apps.length
                })
                return { data: { apps } }
            })
        ])

        // Extract data with multiple fallback paths
        const categories = categoriesResult.status === 'fulfilled' && categoriesResult.value?.success
            ? (categoriesResult.value?.categories || [])
            : []
        
        const apps = appsResult.status === 'fulfilled' 
            ? (appsResult.value?.data?.apps || [])
            : []

   
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
            .map((app) => ({
                url: `${baseUrl}/app/${encodeURIComponent(app.slug)}`,
                lastModified: new Date(app.updatedAt || app.createdAt || Date.now()),
                changeFrequency: 'weekly',
                priority: 0.8,
            }))

        // Combine all pages
        const allPages = [...staticPages, ...categoryPages, ...appPages]

        // Validate URLs and remove invalid ones
        const validPages = allPages
            .filter(page => {
                try {
                    new URL(page.url)
                    return true
                } catch {
                    return false
                }
            })
            .slice(0, 50000) // Google sitemap limit


        return validPages

    } catch (error) {
        
        // Return minimal sitemap with just static pages on error
        return staticPages.filter(page => {
            try {
                new URL(page.url)
                return true
            } catch {
                return false
            }
        })
    }
}