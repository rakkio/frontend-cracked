import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

export const AppBreadcrumb = ({ app }) => {
    return (
        <nav className="flex items-center space-x-2 text-gray-400 mb-8 text-sm" itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            <Link href="/" className="flex items-center space-x-1 hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <FaHome />
                <span itemProp="name">Home</span>
                <meta itemProp="position" content="1" />
            </Link>
            <span>/</span>
            <Link href="/apps" className="hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">Apps</span>
                <meta itemProp="position" content="2" />
            </Link>
            <span>/</span>
            {app.category && (
                <>
                    <Link href={`/category/${app.category.slug}`} className="hover:text-white transition-colors font-medium" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{app.category.name}</span>
                        <meta itemProp="position" content="3" />
                    </Link>
                    <span>/</span>
                </>
            )}
            <span className="text-white font-bold" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{app.name}</span>
                <meta itemProp="position" content={app.category ? "4" : "3"} />
            </span>
        </nav>
    )
}