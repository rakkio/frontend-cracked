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
    FaFolder, FaTag, FaGem, FaRocket, FaHeart
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
        if (name.includes('productivity') || name.includes('office')) return { icon: FaCode, color: 'text-blue-400', bgColor: 'bg-blue-500/10' }
        if (name.includes('design') || name.includes('graphics')) return { icon: FaPalette, color: 'text-pink-400', bgColor: 'bg-pink-500/10' }
        if (name.includes('development') || name.includes('programming')) return { icon: FaBug, color: 'text-green-400', bgColor: 'bg-green-500/10' }
        if (name.includes('multimedia') || name.includes('media')) return { icon: FaMusic, color: 'text-purple-400', bgColor: 'bg-purple-500/10' }
        if (name.includes('photo') || name.includes('camera')) return { icon: FaCamera, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' }
        if (name.includes('security') || name.includes('privacy')) return { icon: FaShieldAlt, color: 'text-red-400', bgColor: 'bg-red-500/10' }
        if (name.includes('game') || name.includes('entertainment')) return { icon: FaGamepad, color: 'text-orange-400', bgColor: 'bg-orange-500/10' }
        if (name.includes('music') || name.includes('audio')) return { icon: FaMusic, color: 'text-purple-400', bgColor: 'bg-purple-500/10' }
        if (name.includes('video')) return { icon: FaVideo, color: 'text-blue-400', bgColor: 'bg-blue-500/10' }
        if (name.includes('utility') || name.includes('tool')) return { icon: FaTerminal, color: 'text-gray-400', bgColor: 'bg-gray-500/10' }
        // Default icon for unknown categories
        return { icon: FaFolder, color: 'text-gray-400', bgColor: 'bg-gray-500/10' }
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
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                    description: 'Home page'
                },
                { 
                    name: 'Trending', 
                    href: '/trending', 
                    icon: FaFire, 
                    color: 'text-orange-400',
                    bgColor: 'bg-orange-500/10',
                    description: 'Trending apps and games',
                    badge: 'Hot'
                },
                { 
                    name: 'Featured', 
                    href: '/featured', 
                    icon: FaStar, 
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10',
                    description: 'Featured apps and games'
                },
                { 
                    name: 'Premium', 
                    href: '/premium', 
                    icon: FaCrown, 
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/10',
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
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/10',
                    description: 'Software for Windows'
                },
                { 
                    name: 'Android APK', 
                    href: '/apk', 
                    icon: FaAndroid, 
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10',
                    description: 'Apps for Android'
                },
                { 
                    name: 'iOS IPA', 
                    href: '/ipa', 
                    icon: FaApple, 
                    color: 'text-gray-300',
                    bgColor: 'bg-gray-500/10',
                    description: 'Apps for iPhone/iPad'
                },
                { 
                    name: 'Games', 
                    href: '/games', 
                    icon: FaGamepad, 
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/10',
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
                const { icon, color, bgColor } = getCategoryIcon(category.name)
                return {
                    name: category.name,
                    href: `/category/${category.slug}`,
                    icon: icon,
                    color: color,
                    bgColor: bgColor,
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
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/10',
                    description: 'Community discussions'
                },
                { 
                    name: 'Discussions', 
                    href: '/community/discussions', 
                    icon: FaComments, 
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10',
                    description: 'Active discussions',
                    badge: '24'
                },
                { 
                    name: 'News & Updates', 
                    href: '/news', 
                    icon: FaNewspaper, 
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10',
                    description: 'Latest news and updates'
                },
                { 
                    name: 'Help & Support', 
                    href: '/help', 
                    icon: FaQuestionCircle, 
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/10',
                    description: 'Get help and support'
                }
            ]
        }
    ]

    const isActive = (href) => pathname === href

    const getBadgeColor = (badge) => {
        switch (badge) {
            case 'Popular': return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
            case 'New': return 'bg-green-500/20 text-green-300 border-green-400/30'
            case 'Premium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
            case 'Pro': return 'bg-purple-500/20 text-purple-300 border-purple-400/30'
            case 'Hot': return 'bg-red-500/20 text-red-300 border-red-400/30'
            default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        }
    }

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 
                transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                bg-black/80 backdrop-blur-xl border-r border-white/10
                flex flex-col shadow-2xl
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-black/50 to-gray-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaTerminal className="text-white text-lg" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                        </div>
                        <div className="flex flex-col">
                            <Link href="/" className="text-white text-xl font-bold hover:text-red-400 transition-colors">
                                CrackMarket
                            </Link>
                            <p className="text-gray-400 text-xs font-mono">v2.0.1</p>
                        </div>
                    </div>
                    
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-6 space-y-8">
                    {navigationSections.map((section) => (
                        <div key={section.id} className="space-y-3">
                            {/* Section Header */}
                            {section.expandable ? (
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="flex items-center justify-between w-full text-left text-gray-300 hover:text-white transition-all duration-300 font-semibold text-sm uppercase tracking-wider group"
                                >
                                    <span className="group-hover:text-red-400 transition-colors">{section.title}</span>
                                    <div className="w-6 h-6 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                                        {expandedSections[section.id] ? 
                                            <FaChevronDown className="text-xs text-gray-400 group-hover:text-white transition-colors" /> : 
                                            <FaChevronRight className="text-xs text-gray-400 group-hover:text-white transition-colors" />
                                        }
                                    </div>
                                </button>
                            ) : (
                                <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}

                            {/* Section Items */}
                            {(!section.expandable || expandedSections[section.id]) && (
                                <div className="space-y-2">
                                    {/* Loading state for categories */}
                                    {section.loading && (
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 animate-pulse">
                                                    <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                                                    <div className="flex-1">
                                                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
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
                                                group flex items-center space-x-4 p-4 rounded-xl
                                                transition-all duration-300 relative overflow-hidden
                                                ${isActive(item.href) 
                                                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-white shadow-lg' 
                                                    : 'hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-300 hover:text-white'
                                                }
                                            `}
                                        >
                                            {/* Active indicator */}
                                            {isActive(item.href) && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-pink-500 rounded-r"></div>
                                            )}

                                            {/* Icon */}
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center
                                                ${isActive(item.href) ? 'bg-white/20' : item.bgColor}
                                                group-hover:scale-110 transition-all duration-300
                                            `}>
                                                <item.icon className={`${item.color} text-lg`} />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold truncate">{item.name}</span>
                                                    {item.badge && (
                                                        <span className={`
                                                            px-2 py-1 text-xs font-medium rounded-full border
                                                            ${getBadgeColor(item.badge)}
                                                        `}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {item.count !== undefined && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300 border border-white/20">
                                                            {item.count}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                                                )}
                                            </div>

                                            {/* Hover effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <MdSecurity className="text-green-400 text-lg" />
                            </div>
                            <div>
                                <div className="text-green-400 font-semibold text-sm">Secure & Verified</div>
                                <div className="text-gray-400 text-xs">All files scanned</div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            All software is scanned for malware and tested for functionality. Download with confidence from our secure servers.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}
