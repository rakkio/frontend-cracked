import { siteConfig } from './metadata'

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/api/',
                '/auth/',
                '/profile/',
                '/_next/',
                '/private/'
            ],
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
        host: siteConfig.url
    }
} 