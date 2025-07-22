import { api } from '@/lib/api'
import { siteConfig } from '@/app/metadata'

export async function GET() {
    try {
        const baseUrl = siteConfig.url.replace(/\/$/, '')
        
        // Static pages
        const staticPages = [
            { url: baseUrl, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
            { url: `${baseUrl}/apps`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' },
            { url: `${baseUrl}/categories`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
            { url: `${baseUrl}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.5' },
            { url: `${baseUrl}/legal/terms`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
            { url: `${baseUrl}/legal/privacy`, lastmod: new Date().toISOString(), changefreq: 'yearly', priority: '0.3' },
        ]

        let categoryPages = []
        let appPages = []

        try {
            // Fetch categories
            const categoriesResponse = await api.getCategories()
            const categories = categoriesResponse.categories || []
            
            categoryPages = categories
                .filter(category => category.slug && category.slug.trim())
                .map(category => ({
                    url: `${baseUrl}/category/${category.slug}`,
                    lastmod: new Date(category.updatedAt || category.createdAt || Date.now()).toISOString(),
                    changefreq: 'weekly',
                    priority: '0.7'
                }))

            // Fetch apps
            const appsResponse = await api.getApps({ limit: 200, isActive: true })
            const apps = appsResponse.data?.apps || []
            
            appPages = apps
                .filter(app => app.slug && app.slug.trim() && app.isActive !== false)
                .map(app => ({
                    url: `${baseUrl}/app/${app.slug}`,
                    lastmod: new Date(app.updatedAt || app.createdAt || Date.now()).toISOString(),
                    changefreq: 'weekly',
                    priority: '0.6'
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