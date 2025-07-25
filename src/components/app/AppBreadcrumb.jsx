import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

export default function AppBreadcrumb({ app }) {
    if (!app) return null

    return (
        <nav 
            className="flex items-center space-x-3 text-gray-400 mb-8 text-sm font-mono" 
            itemProp="breadcrumb" 
            itemScope 
            itemType="https://schema.org/BreadcrumbList"
        >
            <Link 
                href="/" 
                className="flex items-center space-x-2 hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10" 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
            >
                <FaHome className="text-red-400" />
                <span itemProp="name">HOME</span>
                <meta itemProp="position" content="1" />
            </Link>
            <span className="text-red-500 font-bold">/</span>
            <Link 
                href="/apps" 
                className="hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10" 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
            >
                <span itemProp="name">APPS</span>
                <meta itemProp="position" content="2" />
            </Link>
            {app.category && (
                <>
                    <span className="text-red-500 font-bold">/</span>
                    <Link 
                        href={`/category/${app.category.slug}`} 
                        className="hover:text-red-400 transition-all duration-300 font-medium border border-transparent hover:border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10" 
                        itemProp="itemListElement" 
                        itemScope 
                        itemType="https://schema.org/ListItem"
                    >
                        <span itemProp="name">{app.category?.name?.toUpperCase() || 'UNKNOWN'}</span>
                        <meta itemProp="position" content="3" />
                    </Link>
                </>
            )}
            <span className="text-red-500 font-bold">/</span>
            <span 
                className="text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-lg" 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
            >
                <span itemProp="name">{app.name?.toUpperCase() || 'UNKNOWN APP'}</span>
                <meta itemProp="position" content={app.category ? "4" : "3"} />
            </span>
        </nav>
    )
}