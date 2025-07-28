import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaHome, FaArrowLeft, FaTerminal } from 'react-icons/fa'

export const CategoryBreadcrumb = ({ category }) => {
    const router = useRouter()

    // Generate JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://crackmarket.xyz/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Categories",
                "item": "https://crackmarket.xyz/categories"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": category?.name || "Category",
                "item": `https://crackmarket.xyz/category/${category?.slug}`
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                    
                    <nav className="flex items-center space-x-2 text-sm font-mono" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors group">
                            <FaHome className="group-hover:scale-110 transition-transform" />
                            <span className="group-hover:text-green-400 transition-colors">HOME</span>
                        </Link>
                        <span className="text-red-500 font-bold">/</span>
                        <Link href="/categories" className="text-gray-400 hover:text-red-400 transition-colors group">
                            <span className="group-hover:text-green-400 transition-colors">CATEGORIES</span>
                        </Link>
                        <span className="text-red-500 font-bold">/</span>
                        <span className="text-red-400 font-bold">
                            <span>{category?.name?.toUpperCase()}</span>
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
        </>
    )
}