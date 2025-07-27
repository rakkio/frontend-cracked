'use client'

import { useApps } from '@/hooks/useApps'
import { AppsGrid } from '@/components/apps/AppsGrid'

export default function KeywordPageClient({ keyword, searchQuery }) {
  const { apps, loading } = useApps({ 
    search: searchQuery,
    limit: 20,
    isActive: true 
  })
  
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Featured {keyword.replace(/-/g, ' ').toUpperCase()}
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <div className="text-white">Loading apps...</div>
          </div>
        </div>
      ) : (
        <AppsGrid apps={apps} viewMode="grid" handleAppClick={(app) => {
          window.location.href = `/app/${app.slug}`
        }} />
      )}
    </section>
  )
}
