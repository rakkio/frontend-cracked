import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaHome, FaArrowLeft, FaTerminal } from 'react-icons/fa'

export const CategoryBreadcrumb = ({ category }) => {
    const router = useRouter()

    return (
        <section className="bg-black/90 backdrop-blur-md border-b-2 border-red-500/50 relative">
            {/* Terminal-style corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
            
            <div className="container mx-auto px-4 py-3 relative">
                {/* Terminal Header */}
                <div className="flex items-center space-x-2 mb-4">
                    <FaTerminal className="text-red-500" />
                    <span className="text-green-400 font-mono text-sm">root@appscracked:~#</span>
                    <span className="text-gray-400 font-mono text-sm">cd /categories/{category?.slug}</span>
                </div>
                
                <nav className="flex items-center space-x-2 text-sm font-mono" itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
                    <Link href="/" className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors group" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <FaHome className="group-hover:scale-110 transition-transform" />
                        <span itemProp="name" className="group-hover:text-green-400 transition-colors">HOME</span>
                        <meta itemProp="position" content="1" />
                    </Link>
                    <span className="text-red-500 font-bold">/</span>
                    <Link href="/categories" className="text-gray-400 hover:text-red-400 transition-colors group" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name" className="group-hover:text-green-400 transition-colors">CATEGORIES</span>
                        <meta itemProp="position" content="2" />
                    </Link>
                    <span className="text-red-500 font-bold">/</span>
                    <span className="text-red-400 font-bold" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name">{category?.name?.toUpperCase()}</span>
                        <meta itemProp="position" content="3" />
                    </span>
                </nav>

                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-400 mt-4 transition-colors font-mono text-sm group"
                >
                    <FaArrowLeft className="group-hover:translate-x-[-2px] transition-transform" />
                    <span className="group-hover:text-green-400 transition-colors">← BACK_TO_CATEGORIES</span>
                </button>
            </div>
        </section>
    )
}