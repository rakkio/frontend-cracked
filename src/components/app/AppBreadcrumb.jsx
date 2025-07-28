import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

export default function AppBreadcrumb({ app }) {
    if (!app) return null

    // Generate breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Apps', href: '/apps' }
    ]

    if (app.category) {
        breadcrumbItems.push({
            name: app.category.name,
            href: `/category/${app.category.slug}`
        })
    }

    breadcrumbItems.push({
        name: app.name,
        href: `/app/${app.slug}`
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
                    className="flex items-center space-x-2 hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10"
                >
                    <FaHome className="text-red-400" />
                    <span>HOME</span>
                </Link>
                <span className="text-red-500 font-bold">/</span>
                <Link 
                    href="/apps" 
                    className="hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10"
                >
                    <span>APPS</span>
                </Link>
                {app.category && (
                    <>
                        <span className="text-red-500 font-bold">/</span>
                        <Link 
                            href={`/category/${app.category.slug}`} 
                            className="hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10"
                        >
                            <span>{app.category?.name?.toUpperCase() || 'UNKNOWN'}</span>
                        </Link>
                    </>
                )}
                <span className="text-red-500 font-bold">/</span>
                <span 
                    className="text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-lg"
                >
                    <span>{app.name?.toUpperCase() || 'UNKNOWN APP'}</span>
                </span>
            </nav>
        </>
    )
}