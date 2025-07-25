'use client'

import { useEffect } from 'react'
import Head from 'next/head'

const generateAppsStructuredData = (apps, searchTerm, category) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackmarket.xyz'
    
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/apps#webpage`,
                "url": `${baseUrl}/apps`,
                "name": searchTerm ? `Search Results: ${searchTerm} | AppsCracked` : "All Premium Apps - Free Downloads | AppsCracked",
                "description": searchTerm 
                    ? `Found ${apps.length} premium apps for "${searchTerm}". Download cracked applications, games, and software for free.`
                    : `Browse ${apps.length}+ premium applications. Download cracked apps, games, and software for Windows, Mac, Android, and iOS with direct links.`,
                "breadcrumb": {
                    "@id": `${baseUrl}/apps#breadcrumb`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/apps#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": baseUrl
                    },
                    {
                        "@type": "ListItem", 
                        "position": 2,
                        "name": "Apps",
                        "item": `${baseUrl}/apps`
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "name": "Premium Apps Collection",
                "description": "Complete collection of premium applications for free download",
                "url": `${baseUrl}/apps`,
                "mainEntity": {
                    "@type": "ItemList",
                    "numberOfItems": apps.length,
                    "itemListElement": apps.slice(0, 20).map((app, index) => ({
                        "@type": "SoftwareApplication",
                        "position": index + 1,
                        "name": app.name,
                        "description": app.shortDescription || app.description || `Download ${app.name} for free - Premium cracked version available`,
                        "url": `${baseUrl}/app/${app.slug}`,
                        "downloadUrl": `${baseUrl}/app/${app.slug}`,
                        "applicationCategory": app.category?.name || "UtilitiesApplication",
                        "operatingSystem": "Windows, MacOS, Android, iOS",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": app.rating || 4.5,
                            "reviewCount": app.reviewCount || 100,
                            "bestRating": 5,
                            "worstRating": 1
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0.00",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "AppsCracked"
                            }
                        }
                    }))
                }
            }
        ]
    }
}

export const AppsSEO = ({ apps, searchTerm, selectedCategory, filters }) => {
    const getPageTitle = () => {
        if (searchTerm) {
            return `${searchTerm} - Free Cracked Apps Download | AppsCracked`
        }
        if (filters.featured) {
            return 'Featured Premium Apps - Free Download 2024 | AppsCracked'
        }
        if (filters.newest) {
            return 'Latest Cracked Apps - New Releases 2024 | AppsCracked'
        }
        if (filters.topRated) {
            return 'Top Rated Apps - Best Premium Software Free | AppsCracked'
        }
        return 'All Premium Apps - Free Cracked Software Download 2024 | AppsCracked'
    }

    const getPageDescription = () => {
        if (searchTerm) {
            return `Download ${searchTerm} and related premium apps for free. ${apps.length} cracked applications with direct download links, virus-free and tested.`
        }
        if (filters.featured) {
            return `Browse our featured collection of ${apps.length}+ premium apps. Download the most popular cracked applications with direct links, 100% free and safe.`
        }
        return `Download ${apps.length}+ premium applications for free. Cracked apps, games, and software for Windows, Mac, Android, and iOS with instant direct download links.`
    }

    const getKeywords = () => {
        const baseKeywords = ['cracked apps', 'free software download', 'premium apps free', 'download cracked apps', 'free crack software']
        if (searchTerm) {
            return [...baseKeywords, searchTerm, `${searchTerm} cracked`, `download ${searchTerm} free`].join(', ')
        }
        return [...baseKeywords, 'modded apps', 'premium software free', 'apps cracked', 'full version software free'].join(', ')
    }

    useEffect(() => {
        if (apps.length > 0) {
            const structuredData = generateAppsStructuredData(apps, searchTerm, selectedCategory)
            
            // Remove existing structured data
            const existingScript = document.querySelector('script[data-apps-structured="true"]')
            if (existingScript) {
                existingScript.remove()
            }
            
            // Add new structured data
            const script = document.createElement('script')
            script.type = 'application/ld+json'
            script.setAttribute('data-apps-structured', 'true')
            script.textContent = JSON.stringify(structuredData)
            document.head.appendChild(script)
        }
    }, [apps, searchTerm, selectedCategory])

    return (
        <Head>
            <title>{getPageTitle()}</title>
            <meta name="description" content={getPageDescription()} />
            <meta name="keywords" content={getKeywords()} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="author" content="AppsCracked" />
            <link rel="canonical" href={`https://appscracked.com/apps${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`} />
            
            {/* Open Graph */}
            <meta property="og:title" content={getPageTitle()} />
            <meta property="og:description" content={getPageDescription()} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://appscracked.com/apps" />
            <meta property="og:image" content="https://appscracked.com/og-apps.jpg" />
            <meta property="og:site_name" content="AppsCracked" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={getPageTitle()} />
            <meta name="twitter:description" content={getPageDescription()} />
            <meta name="twitter:image" content="https://appscracked.com/twitter-apps.jpg" />
        </Head>
    )
}