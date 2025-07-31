'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    FaHome, FaWindows, FaApple, FaAndroid, FaGamepad, 
    FaFire, FaStar, FaCrown, FaUsers, FaComments, 
    FaNewspaper, FaQuestionCircle, FaChevronDown, 
    FaChevronRight, FaTimes, FaShieldAlt, FaLock, FaCode,
    FaPalette, FaMusic, FaVideo, FaCamera, FaBug, FaTerminal,
    FaFolder, FaTag
} from 'react-icons/fa'
import { MdVerified, MdSecurity } from 'react-icons/md'
import { api } from '@/lib/api'

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname()
    const [expandedSections, setExpandedSections] = useState({
        main: true,
        applications: true,
        categories: true,
        collections: false,
        community: false
    })
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Load categories from backend
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true)
                const response = await api.getCategories({ limit: 20, active: true })
                if (response.success && response.categories) {
                    setCategories(response.categories)
                }
            } catch (error) {
                console.error('Error loading categories:', error)
                // Keep empty array as fallback
            } finally {
                setLoadingCategories(false)
            }
        }

        loadCategories()
    }, [])

    // Map category names to appropriate icons and colors
    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase()
        if (name.includes('productivity') || name.includes('office')) return { icon: FaCode, color: 'text-blue-500' }
        if (name.includes('design') || name.includes('graphics')) return { icon: FaPalette, color: 'text-pink-500' }
        if (name.includes('development') || name.includes('programming')) return { icon: FaBug, color: 'text-green-500' }
        if (name.includes('multimedia') || name.includes('media')) return { icon: FaMusic, color: 'text-purple-500' }
        if (name.includes('photo') || name.includes('camera')) return { icon: FaCamera, color: 'text-indigo-500' }
        if (name.includes('security') || name.includes('privacy')) return { icon: FaShieldAlt, color: 'text-red-500' }
        if (name.includes('game') || name.includes('entertainment')) return { icon: FaGamepad, color: 'text-orange-500' }
        if (name.includes('music') || name.includes('audio')) return { icon: FaMusic, color: 'text-purple-500' }
        if (name.includes('video')) return { icon: FaVideo, color: 'text-blue-600' }
        if (name.includes('utility') || name.includes('tool')) return { icon: FaTerminal, color: 'text-gray-500' }
        // Default icon for unknown categories
        return { icon: FaFolder, color: 'text-gray-400' }
    }

    const navigationSections = [
        {
            id: 'main',
            title: 'Main',
            items: [
                { 
                    name: 'Home', 
                    href: '/', 
                    icon: FaHome, 
                    color: 'text-red-500',
                    description: 'Home page'
                },
                { 
                    name: 'Trending', 
                    href: '/trending', 
                    icon: FaFire, 
                    color: 'text-orange-500',
                    description: 'Trending apps and games',
                    badge: 'Hot'
                },
                { 
                    name: 'Featured', 
                    href: '/featured', 
                    icon: FaStar, 
                    color: 'text-yellow-500',
                    description: 'Featured apps and games'
                },
                { 
                    name: 'Premium', 
                    href: '/premium', 
                    icon: FaCrown, 
                    color: 'text-purple-500',
                    description: 'Premium apps and games',
                    badge: 'Pro'
                }
            ]
        },
        {
            id: 'applications',
            title: 'Applications',
            expandable: true,
            items: [
                { 
                    name: 'PC Apps', 
                    href: '/apps', 
                    icon: FaWindows, 
                    color: 'text-blue-500',
                    description: 'Software for Windows'
                },
                { 
                    name: 'Android APK', 
                    href: '/apk', 
                    icon: FaAndroid, 
                    color: 'text-green-500',
                    description: 'Apps for Android'
                },
                { 
                    name: 'iOS IPA', 
                    href: '/ipa', 
                    icon: FaApple, 
                    color: 'text-gray-300',
                    description: 'Apps for iPhone/iPad'
                },
                { 
                    name: 'Games', 
                    href: '/games', 
                    icon: FaGamepad, 
                    color: 'text-purple-500',
                    description: 'Games for PC and console',
                    badge: 'Hot'
                }
            ]
        },
        {
            id: 'categories',
            title: 'Categories',
            expandable: true,
            loading: loadingCategories,
            items: categories.map(category => {
                const { icon, color } = getCategoryIcon(category.name)
                return {
                    name: category.name,
                    href: `/category/${category.slug}`,
                    icon: icon,
                    color: color,
                    description: category.description || `Browse ${category.name.toLowerCase()} applications`,
                    count: category.appsCount || 0
                }
            })
        },
        {
            id: 'community',
            title: 'Community',
            expandable: true,
            items: [
                { 
                    name: 'Forum', 
                    href: '/community', 
                    icon: FaUsers, 
                    color: 'text-blue-500',
                    description: 'Community discussions'
                },
                { 
                    name: 'Discussions', 
                    href: '/community/discussions', 
                    icon: FaComments, 
                    color: 'text-green-500',
                    description: 'Active discussions',
                    badge: '24'
                },
                { 
                    name: 'News & Updates', 
                    href: '/news', 
                    icon: FaNewspaper, 
                    color: 'text-yellow-500',
                    description: 'Latest news and updates'
                },
                { 
                    name: 'Help & Support', 
                    href: '/help', 
                    icon: FaQuestionCircle, 
                    color: 'text-purple-500',
                    description: 'Get help and support'
                }
            ]
        }
    ]

    const isActive = (href) => pathname === href

    const getBadgeColor = (badge) => {
        switch (badge) {
            case 'Popular': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'New': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'Premium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'Pro': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'Hot': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    return (
        <>
            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                bg-black/95 backdrop-blur-xl border-r-2 border-red-500/30
                flex flex-col
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-red-500/20">
                    <div className="flex items-center space-x-2">
                    <div className="relative">
                            <FaTerminal className="text-red-500 text-sm" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="relative">
                        <Link href="/" className="text-gray-400 text-2xl font-mono">CrackMarket</Link>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-mono">v2.0.1</p>
                        </div>
                    </div>
                    
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6 sticky top-0">
                    {navigationSections.map((section) => (
                        <div key={section.id} className="space-y-2">
                            {/* Section Header */}
                            {section.expandable ? (
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="flex items-center justify-between w-full text-left text-gray-400 hover:text-red-400 transition-colors font-mono text-sm uppercase tracking-wider"
                                >
                                    <span>{section.title}</span>
                                    {expandedSections[section.id] ? 
                                        <FaChevronDown className="text-xs" /> : 
                                        <FaChevronRight className="text-xs" />
                                    }
                                </button>
                            ) : (
                                <h3 className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}

                            {/* Section Items */}
                            {(!section.expandable || expandedSections[section.id]) && (
                                <div className="space-y-1">
                                    {/* Loading state for categories */}
                                    {section.loading && (
                                        <div className="space-y-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30 animate-pulse">
                                                    <div className="w-5 h-5 bg-gray-700 rounded"></div>
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                                                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Actual items */}
                                    {!section.loading && section.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                                                group flex items-center space-x-3 p-3 rounded-lg
                                                transition-all duration-200 relative overflow-hidden
                                                ${isActive(item.href) 
                                                    ? 'bg-red-500/20 border border-red-500/40 text-red-400' 
                                                    : 'hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-gray-300 hover:text-red-400'
                                                }
                                            `}
                                        >
                                            {/* Active indicator */}
                                            {isActive(item.href) && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                            )}

                                            {/* Icon */}
                                            <item.icon className={`${item.color} text-lg flex-shrink-0`} />
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium truncate">{item.name}</span>
                                                    {item.badge && (
                                                        <span className={`
                                                            px-2 py-0.5 text-xs font-mono rounded border
                                                            ${getBadgeColor(item.badge)}
                                                        `}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {item.count !== undefined && (
                                                        <span className="px-2 py-0.5 text-xs font-mono rounded bg-gray-700/50 text-gray-400 border border-gray-600">
                                                            {item.count}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-red-500/20">
                    <div className="bg-black/50 border border-red-500/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                            <MdSecurity className="text-green-400" />
                            <span className="text-green-400 font-mono text-sm">Seguro</span>
                        </div>
                        <p className="text-gray-400 text-xs">
                            Todos los archivos son escaneados y verificados
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}
