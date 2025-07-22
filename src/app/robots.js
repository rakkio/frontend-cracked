import { siteConfig } from './metadata'

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/auth/',
                    '/profile/',
                    '/_next/',
                    '/private/',
                    '/ad-redirect/',
                    '/*?*utm*',
                    '/*?*session*'
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/auth/',
                    '/profile/',
                    '/ad-redirect/',
                    '/*?*utm*'
                ],
            }
        ],
        sitemap: [
            `${siteConfig.url}/sitemap.xml`,
            `${siteConfig.url}/api/sitemap`
        ],
        host: siteConfig.url
    }
} 