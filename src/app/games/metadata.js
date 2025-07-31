export function generateGamesMetadata(stats = {}) {
    const totalGames = stats.totalGames || 0
    const totalDownloads = stats.totalDownloads || 0
    
    return {
        title: `PC Games Download - ${totalGames.toLocaleString()}+ Cracked Games | CrackMarket`,
        description: `Download premium PC games for free. ${totalGames.toLocaleString()}+ cracked games with ${totalDownloads.toLocaleString()}+ downloads. Get full version games with DLC included, virus-free and working cracks for Windows, Mac, and Linux.`,
        keywords: [
            'pc games download',
            'cracked games',
            'free pc games',
            'games crack download',
            'full version games',
            'pc games free download',
            'cracked games pc',
            'games with crack',
            'pc gaming free',
            'download games crack',
            'steam games crack',
            'epic games crack',
            'origin games crack',
            'uplay games crack'
        ],
        openGraph: {
            title: `PC Games Download - ${totalGames.toLocaleString()}+ Cracked Games`,
            description: `Download premium PC games for free. ${totalGames.toLocaleString()}+ cracked games with full version and DLC included. Virus-free and working cracks.`,
            type: 'website',
            url: 'https://crackmarket.xyz/games',
            siteName: 'CrackMarket',
            images: [
                {
                    url: 'https://crackmarket.xyz/images/games-og.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'PC Games Download - CrackMarket'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `PC Games Download - ${totalGames.toLocaleString()}+ Cracked Games`,
            description: `Download premium PC games for free. ${totalGames.toLocaleString()}+ cracked games with full version and DLC included.`,
            images: ['https://crackmarket.xyz/images/games-twitter.jpg']
        },
        alternates: {
            canonical: 'https://crackmarket.xyz/games'
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
