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

export const metadata = {
  title: 'AppsCracked - Download Free Cracked Apps & Premium Software 2024',
  description: 'Download the latest cracked apps, premium software, and games for free. Safe, tested, and virus-free applications with direct download links. Over 10,000+ apps available.',
  keywords: [
    'cracked apps',
    'free software download',
    'premium apps free',
    'cracked software',
    'free apps download',
    'crack apps',
    'modded apps',
    'premium software free',
    'apps cracked',
    'free crack software',
    'download cracked apps',
    'full version software free'
  ].join(', '),
  authors: [{ name: 'AppsCracked' }],
  creator: 'AppsCracked',
  publisher: 'AppsCracked',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://appscracked.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    title: 'AppsCracked - Download Free Cracked Apps & Premium Software',
    description: 'Access thousands of premium applications for free. Download cracked apps, games, and software with direct links. Safe, tested, and virus-free.',
    url: '/',
    siteName: 'AppsCracked',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AppsCracked - Free Cracked Apps Download',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppsCracked - Download Free Cracked Apps & Premium Software',
    description: 'Access thousands of premium applications for free. Download cracked apps, games, and software with direct links.',
    creator: '@appscracked',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION || 'google03eb05223dd2b889',
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    bing: process.env.BING_VERIFICATION,
  },
  category: 'technology',
  classification: 'Software Download Platform',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'theme-color': '#dc2626',
    'msapplication-TileColor': '#dc2626',
  },
} 