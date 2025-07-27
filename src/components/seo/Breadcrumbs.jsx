'use client'

import Link from 'next/link'
import { FaChevronRight, FaHome } from 'react-icons/fa'

const Breadcrumbs = ({ items }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
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
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white transition-colors flex items-center">
          <FaHome className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FaChevronRight className="w-3 h-3" />
            {index === items.length - 1 ? (
              <span className="text-white font-medium">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

export default Breadcrumbs