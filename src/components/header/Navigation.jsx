'use client'

import Link from 'next/link'
import { 
    FaHome,
    FaMobile,
    FaFolder,
    FaStar,
    FaRocket,
    FaCode,
    FaAndroid,
    FaApple,
    FaGamepad
} from 'react-icons/fa'

export default function Navigation() {
    const navigationItems = [
        { name: 'Home', href: '/', icon: FaHome },
        { name: 'PC Apps', href: '/apps', icon: FaMobile },
        { name: 'Android', href: '/apk', icon: FaAndroid, color: 'text-green-500' },
        { name: 'iOS', href: '/ipa', icon: FaApple, color: 'text-blue-500' },
        { name: 'Games', href: '/games', icon: FaGamepad, color: 'text-purple-500' },
        { name: 'Categories', href: '/categories', icon: FaFolder },
        { name: 'Contact', href: '/contact', icon: FaCode },
    ]

    return (
        <nav className="hidden xl:flex items-center space-x-2 lg:space-x-4">
            {navigationItems.map((item, index) => (    
                <Link key={item.href} href={item.href} className="group relative">
                    <div className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 border border-transparent hover:border-red-500 transition-all duration-300 bg-black/50 hover:bg-red-500/10">
                        <item.icon className={`${item.color || 'text-red-500'} group-hover:text-red-400 text-sm lg:text-base`} />
                        <span className="text-gray-300 group-hover:text-red-400 font-mono text-xs lg:text-sm tracking-wider hidden lg:inline">
                            {item.name}
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
            ))}
        </nav>
    )
}