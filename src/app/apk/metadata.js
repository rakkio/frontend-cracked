export function generateApkMetadata(stats = {}) {
    const totalApks = stats.totalApks || 0
    const totalDownloads = stats.totalDownloads || 0
    
    return {
        title: `Android APK Downloads - ${totalApks.toLocaleString()}+ Modded Apps | CrackMarket`,
        description: `Download premium Android APK files for free. ${totalApks.toLocaleString()}+ modded apps with ${totalDownloads.toLocaleString()}+ downloads. Get unlimited features, ad-free experience, and premium unlocked content.`,
        keywords: [
            'android apk download',
            'modded apk',
            'premium apk free',
            'cracked android apps',
            'apk mod',
            'android apps free',
            'premium apps unlocked',
            'modded games android',
            'apk files download',
            'android cracked apps'
        ],
        openGraph: {
            title: `Android APK Downloads - ${totalApks.toLocaleString()}+ Modded Apps`,
            description: `Download premium Android APK files for free. ${totalApks.toLocaleString()}+ modded apps with unlimited features and premium content unlocked.`,
            type: 'website',
            url: 'https://crackmarket.xyz/apk',
            siteName: 'CrackMarket',
            images: [
                {
                    url: 'https://crackmarket.xyz/images/apk-og.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Android APK Downloads - CrackMarket'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `Android APK Downloads - ${totalApks.toLocaleString()}+ Modded Apps`,
            description: `Download premium Android APK files for free. ${totalApks.toLocaleString()}+ modded apps with unlimited features.`,
            images: ['https://crackmarket.xyz/images/apk-twitter.jpg']
        },
        alternates: {
            canonical: 'https://crackmarket.xyz/apk'
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
        }
    }
}
