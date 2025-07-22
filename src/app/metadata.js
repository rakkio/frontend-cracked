export const siteConfig = {
    name: 'Apps Cracked',
    description: 'Download premium applications for free. Access thousands of cracked apps, games, and software with direct download links.',
    url: 'https://appscracked.com',
    ogImage: '/og-image.jpg',
    links: {
        twitter: 'https://twitter.com/appscracked',
        github: 'https://github.com/appscracked'
    }
}

export const generatePageMetadata = ({
    title,
    description,
    path = '',
    images = [siteConfig.ogImage],
    noIndex = false
}) => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
    const fullUrl = `${siteConfig.url}${path}`

    return {
        title: fullTitle,
        description: description || siteConfig.description,
        keywords: [
            'cracked apps',
            'free software',
            'premium apps',
            'download apps',
            'android apps',
            'ios apps',
            'windows software',
            'mac applications',
            'gaming apps',
            'productivity software'
        ],
        authors: [{ name: 'Apps Cracked Team' }],
        creator: 'Apps Cracked',
        publisher: 'Apps Cracked',
        robots: noIndex ? 'noindex,nofollow' : 'index,follow',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: fullUrl,
            title: fullTitle,
            description: description || siteConfig.description,
            siteName: siteConfig.name,
            images: images.map(image => ({
                url: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
                width: 1200,
                height: 630,
                alt: fullTitle
            }))
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: description || siteConfig.description,
            images: images,
            creator: '@appscracked'
        },
        alternates: {
            canonical: fullUrl
        }
    }
}

export const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/apps?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
    }
}

export const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
        siteConfig.links.twitter,
        siteConfig.links.github
    ]
} 