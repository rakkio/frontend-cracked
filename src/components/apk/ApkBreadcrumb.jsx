import Link from 'next/link'
import { FaHome, FaAndroid } from 'react-icons/fa'

export default function ApkBreadcrumb({ apk }) {
    if (!apk) return null

    // Generate breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'APK', href: '/apk' }
    ]

    if (apk.category) {
        breadcrumbItems.push({
            name: apk.category.name,
            href: `/category/${apk.category.slug}`
        })
    }

    breadcrumbItems.push({
        name: apk.name,
        href: `/apk/${apk.slug}`
    })

    // Generate JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://crackmarket.xyz${item.href}`
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav 
                className="flex items-center space-x-3 text-gray-400 mb-8 text-sm font-mono"
                aria-label="Breadcrumb"
            >
                <Link 
                    href="/" 
                    className="flex items-center space-x-2 hover:text-green-400 transition-all duration-300 font-medium border border-transparent hover:border-green-500/30 px-3 py-1 rounded-lg hover:bg-green-500/10"
                >
                    <FaHome className="text-green-400" />
                    <span>HOME</span>
                </Link>
                <span className="text-green-500 font-bold">/</span>
                <Link 
                    href="/apk" 
                    className="flex items-center space-x-2 hover:text-green-400 transition-all duration-300 font-medium border border-transparent hover:border-green-500/30 px-3 py-1 rounded-lg hover:bg-green-500/10"
                >
                    <FaAndroid className="text-green-400" />
                    <span>APK</span>
                </Link>
                {apk.category && (
                    <>
                        <span className="text-green-500 font-bold">/</span>
                        <Link 
                            href={`/category/${apk.category.slug}`} 
                            className="hover:text-green-400 transition-all duration-300 font-medium border border-transparent hover:border-green-500/30 px-3 py-1 rounded-lg hover:bg-green-500/10"
                        >
                            <span>{apk.category?.name?.toUpperCase() || 'UNKNOWN'}</span>
                        </Link>
                    </>
                )}
                <span className="text-green-500 font-bold">/</span>
                <span 
                    className="text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-lg"
                >
                    <span>{apk.name?.toUpperCase() || 'UNKNOWN APK'}</span>
                </span>
            </nav>
        </>
    )
}
