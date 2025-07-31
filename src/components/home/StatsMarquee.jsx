'use client'

import { useEffect, useState } from 'react'
import { FaAndroid, FaApple, FaWindows, FaGamepad, FaDownload, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa'

export default function StatsMarquee({ stats }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const statsItems = [
        { icon: FaAndroid, label: 'Android APKs', value: formatNumber(stats.totalApks), color: 'text-green-600' },
        { icon: FaApple, label: 'iOS IPAs', value: formatNumber(stats.totalIpas), color: 'text-gray-600' },
        { icon: FaWindows, label: 'PC Apps', value: formatNumber(stats.totalApps), color: 'text-blue-600' },
        { icon: FaGamepad, label: 'Games', value: formatNumber(stats.totalGames), color: 'text-red-600' },
        { icon: FaDownload, label: 'Downloads', value: formatNumber(stats.totalDownloads), color: 'text-purple-600' },
        { icon: FaUsers, label: 'Active Users', value: formatNumber(stats.activeUsers), color: 'text-yellow-600' },
        { icon: FaShieldAlt, label: 'Verified Safe', value: '100%', color: 'text-emerald-600' },
        { icon: FaRocket, label: 'Daily Updates', value: '24/7', color: 'text-pink-600' }
    ]

    // Auto-rotate through stats
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % statsItems.length)
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    // Get visible stats (current + next 3)
    const getVisibleStats = () => {
        const visible = []
        for (let i = 0; i < 4; i++) {
            const index = (currentIndex + i) % statsItems.length
            visible.push({ ...statsItems[index], key: `${index}-${currentIndex}` })
        }
        return visible
    }

    const visibleStats = getVisibleStats()

    return (
        <section className="py-6 bg-gray-50 border-y border-gray-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {visibleStats.map((stat, index) => (
                        <div 
                            key={stat.key}
                            className="flex items-center gap-3 bg-white backdrop-blur-sm border border-gray-200 rounded-lg p-4 transition-all duration-500 hover:scale-105 hover:border-gray-300 hover:shadow-md"
                            style={{
                                animation: `fadeInSlide 0.5s ease-out ${index * 0.1}s both`
                            }}
                        >
                            <stat.icon className={`text-xl ${stat.color} flex-shrink-0`} />
                            <div className="min-w-0">
                                <div className="text-gray-800 font-bold text-lg truncate">{stat.value}</div>
                                <div className="text-gray-600 text-xs truncate">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    )
}
