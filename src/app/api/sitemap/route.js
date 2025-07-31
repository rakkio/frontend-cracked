import { siteConfig } from '@/app/metadata'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const baseUrl = siteConfig.url.replace(/\/$/, '')
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.crackmarket.xyz'
        
        // Static pages
        const staticPages = [
            { url: baseUrl, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
            { url: `${baseUrl}/apps`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
            { url: `${baseUrl}/apk`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
            { url: `${baseUrl}/ipa`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
            { url: `${baseUrl}/games`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
            { url: `${baseUrl}/categories`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
            { url: `${baseUrl}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
            { url: `${baseUrl}/legal/terms`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
            { url: `${baseUrl}/legal/privacy`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
        ]

        let categoryPages = []
        let appPages = []

        // Direct API calls without using the api client to avoid auth issues
        const makeAPICall = async (endpoint) => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Remove cache options that cause static generation issues
                    next: { revalidate: 3600 } // Revalidate every hour
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }

                return await response.json()
            } catch (error) {
                console.error(`API call failed for ${endpoint}:`, error.message)
                return null
            }
        }

        try {
            // Fetch categories
            const categoriesResponse = await makeAPICall('/categories')
            if (categoriesResponse?.success) {
                const categories = categoriesResponse.categories || []
                
                categoryPages = categories
                    .filter(category => category.slug && category.slug.trim() && category.isActive !== false)
                    .map(category => ({
                        url: `${baseUrl}/category/${category.slug}`,
                        lastmod: new Date(category.updatedAt || category.createdAt || Date.now()).toISOString(),
                        changefreq: 'weekly',
                        priority: '0.7'
                    }))
            }

            // Fetch apps with pagination
            const fetchAllApps = async () => {
                const allApps = []
                let page = 1
                let hasMore = true
                const limit = 100
                
                while (hasMore && allApps.length < 1000) {
                    const appsResponse = await makeAPICall(`/apps?page=${page}&limit=${limit}&isActive=true`)
                    
                    if (!appsResponse?.success) {
                        break
                    }
                    
                    const apps = appsResponse?.data?.apps || []
                    allApps.push(...apps)
                    
                    const pagination = appsResponse?.data?.pagination
                    hasMore = pagination?.hasNext || false
                    page++
                    
                    if (page > 20) break // Safety limit
                }
                
                return allApps
            }

            const apps = await fetchAllApps()
            
            appPages = apps
                .filter(app => app.slug && app.slug.trim() && app.isActive !== false)
                .map(app => ({
                    url: `${baseUrl}/app/${app.slug}`,
                    lastmod: new Date(app.updatedAt || app.createdAt || Date.now()).toISOString(),
                    changefreq: 'weekly',
                    priority: '0.8'
                }))

        } catch (apiError) {
            console.warn('API error in sitemap generation:', apiError)
            // Continue with static pages only
        }

        const allPages = [...staticPages, ...categoryPages, ...appPages]
        
        // Remove duplicates
        const uniquePages = allPages.filter((page, index, self) => 
            index === self.findIndex(p => p.url === page.url)
        )

        console.log(`✅ Sitemap generated: ${uniquePages.length} URLs (${staticPages.length} static, ${categoryPages.length} categories, ${appPages.length} apps)`)

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

        return new Response(sitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                'X-Content-Type-Options': 'nosniff',
            },
        })

    } catch (error) {
        console.error('Error generating sitemap:', error)
        
        // Return minimal sitemap on error
        const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

        return new Response(minimalSitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            },
        })
    }
}