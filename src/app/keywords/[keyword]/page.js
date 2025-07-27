'use client'

import { notFound } from 'next/navigation'
import { generateKeywordMetadata } from '@/utils/seoUtils'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { useApps } from '@/hooks/useApps'
import AppsGrid from '@/components/apps/AppsGrid'

const keywordPages = {
  'cracked-apps-download': {
    hero: 'Download Premium Cracked Apps for Free',
    subtitle: 'Access thousands of premium applications without paying. All apps are tested, safe, and virus-free.',
    features: [
      'Over 50,000+ Premium Apps',
      'Daily Updates',
      'Virus-Free Guarantee',
      'Direct Download Links',
      'No Registration Required'
    ],
    searchQuery: 'premium apps'
  },
  'free-premium-software': {
    hero: 'Premium Software - Completely Free',
    subtitle: 'Professional software tools without the premium price tag. Full versions with all features unlocked.',
    features: [
      'Professional Design Tools',
      'Productivity Software',
      'Development Programs',
      'Multimedia Applications',
      'Security Software'
    ],
    searchQuery: 'premium software'
  },
  'app-craccate-gratis': {
    hero: 'App Craccate Gratis - Software Premium',
    subtitle: 'Scarica applicazioni premium gratuitamente. Tutti i programmi sono testati, sicuri e senza virus.',
    features: [
      'Oltre 50.000+ App Premium',
      'Aggiornamenti Giornalieri',
      'Garanzia Senza Virus',
      'Link Download Diretto',
      'Nessuna Registrazione'
    ],
    searchQuery: 'premium'
  }
}

export async function generateMetadata({ params }) {
  const keyword = params.keyword
  const metadata = generateKeywordMetadata(keyword)
  
  if (!keywordPages[keyword]) {
    return {
      title: 'Page Not Found | CrackMarket',
      robots: 'noindex,nofollow'
    }
  }
  
  return metadata
}

export default function KeywordPage({ params }) {
  const keyword = params.keyword
  const pageData = keywordPages[keyword]
  
  if (!pageData) {
    notFound()
  }
  
  const { apps, loading } = useApps({ 
    search: pageData.searchQuery,
    limit: 20,
    isActive: true 
  })
  
  const breadcrumbItems = [
    { name: 'Keywords', href: '/keywords' },
    { name: keyword.replace(/-/g, ' ').toUpperCase(), href: `/keywords/${keyword}` }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {pageData.hero}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {pageData.subtitle}
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            {pageData.features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-red-500/20 rounded-lg p-6">
                <h3 className="text-white font-semibold">{feature}</h3>
              </div>
            ))}
          </div>
        </section>
        
        {/* Apps Grid */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Featured {keyword.replace(/-/g, ' ').toUpperCase()}
          </h2>
          {loading ? (
            <div className="text-center text-white">Loading apps...</div>
          ) : (
            <AppsGrid apps={apps} />
          )}
        </section>
      </div>
    </div>
  )
}