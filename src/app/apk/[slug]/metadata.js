// Generate metadata for APK pages
export async function generateApkDetailMetadata(apk) {
    if (!apk) {
        return {
            title: 'APK Not Found - CrackMarket',
            description: 'The requested APK could not be found.'
        }
    }

    const baseTitle = `${apk.name} APK - Download Free Android App | CrackMarket`
    const baseDescription = apk.description || `Download ${apk.name} APK for free. ${apk.shortDescription || 'Premium Android app available for free download.'} Latest version with all features unlocked.`

    return {
        title: baseTitle,
        description: baseDescription,
        keywords: [
            apk.name,
            'APK',
            'download',
            'free',
            'android',
            'cracked',
            'mod',
            apk.category?.name,
            apk.packageName,
            ...(apk.tags || [])
        ].filter(Boolean).join(', '),
        openGraph: {
            title: `${apk.name} APK - Free Download`,
            description: baseDescription,
            images: apk.icon ? [{
                url: apk.icon,
                width: 512,
                height: 512,
                alt: `${apk.name} APK icon`
            }] : [],
            type: 'website',
            siteName: 'CrackMarket',
            locale: 'en_US'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${apk.name} APK - Free Download`,
            description: baseDescription,
            images: apk.icon ? [apk.icon] : [],
            site: '@crackmarket'
        },
        alternates: {
            canonical: `https://crackmarket.xyz/apk/${apk.slug}`
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: 'your-google-verification-code'
        }
    }
}
