import { NextResponse } from 'next/server'

export function middleware(request) {
    const { pathname } = request.nextUrl

    // Handle sitemap.xml requests with proper headers
    if (pathname === '/sitemap.xml') {
        const response = NextResponse.next()
        
        // Set proper headers for sitemap
        response.headers.set('Content-Type', 'application/xml; charset=utf-8')
        response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
        response.headers.set('X-Content-Type-Options', 'nosniff')
        
        return response
    }

    // Handle robots.txt with proper headers
    if (pathname === '/robots.txt') {
        const response = NextResponse.next()
        
        response.headers.set('Content-Type', 'text/plain; charset=utf-8')
        response.headers.set('Cache-Control', 'public, max-age=86400')
        
        return response
    }

    // Add security headers to all responses
    const response = NextResponse.next()
    
    // Basic security headers (but allow ads/iframes for our ad-redirect page)
    if (!pathname.startsWith('/ad-redirect')) {
        response.headers.set('X-Content-Type-Options', 'nosniff')
        response.headers.set('X-Frame-Options', 'SAMEORIGIN')
        response.headers.set('X-XSS-Protection', '1; mode=block')
    }

    return response
}

export const config = {
    matcher: [
        '/sitemap.xml',
        '/robots.txt',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
} 