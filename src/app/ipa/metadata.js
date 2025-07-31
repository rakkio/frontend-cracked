export function generateIpaMetadata(stats = {}) {
    const totalIpas = stats.totalIpas || 0
    const totalDownloads = stats.totalDownloads || 0
    
    return {
        title: `iOS IPA Downloads - ${totalIpas.toLocaleString()}+ Premium Apps | CrackMarket`,
        description: `Download premium iOS IPA files for free. ${totalIpas.toLocaleString()}+ cracked apps with ${totalDownloads.toLocaleString()}+ downloads. Get unlimited features, ad-free experience, and premium unlocked content for iPhone and iPad.`,
        keywords: [
            'ios ipa download',
            'cracked ipa',
            'premium ipa free',
            'ios apps cracked',
            'ipa mod',
            'iphone apps free',
            'premium ios apps unlocked',
            'cracked ios games',
            'ipa files download',
            'ios cracked apps',
            'sideload ipa',
            'jailbreak apps',
            'altstore ipa',
            'cydia impactor'
        ],
        openGraph: {
            title: `iOS IPA Downloads - ${totalIpas.toLocaleString()}+ Premium Apps`,
            description: `Download premium iOS IPA files for free. ${totalIpas.toLocaleString()}+ cracked apps with unlimited features and premium content unlocked for iPhone and iPad.`,
            type: 'website',
            url: 'https://crackmarket.xyz/ipa',
            siteName: 'CrackMarket',
            images: [
                {
                    url: 'https://crackmarket.xyz/images/ipa-og.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'iOS IPA Downloads - CrackMarket'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `iOS IPA Downloads - ${totalIpas.toLocaleString()}+ Premium Apps`,
            description: `Download premium iOS IPA files for free. ${totalIpas.toLocaleString()}+ cracked apps with unlimited features for iPhone and iPad.`,
            images: ['https://crackmarket.xyz/images/ipa-twitter.jpg']
        },
        alternates: {
            canonical: 'https://crackmarket.xyz/ipa'
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        },
        category: 'technology'
    }
}
